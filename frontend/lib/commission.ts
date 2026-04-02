import { prisma } from '@/lib/prisma';

// 커미션 처리 결과 타입
export interface CommissionResult {
  attributed: boolean;
  commissionAmount?: number;
  referredUserId?: string;
  walletId?: string;
}

// 커미션 역전(환불) 결과 타입
export interface CommissionReversalResult {
  reversed: boolean;
  reversedAmount?: number;
  transactionIds?: string[];
}

const DEFAULT_COMMISSION_RATE = 0.20; // 20% 커미션

/**
 * 결제 완료 시 파트너 커미션 자동 계산 및 적립
 * - ReferredUser 테이블에서 userId로 귀속 파트너 조회
 * - 귀속 파트너가 있으면 커미션 트랜잭션 생성 + 지갑 잔액 업데이트
 * - Prisma 트랜잭션으로 원자성 보장
 */
export async function processCommission(
  userId: string,
  serviceId: string,
  serviceName: string,
  amount: number,
  webhookPayload: unknown,
  commissionRate: number = DEFAULT_COMMISSION_RATE
): Promise<CommissionResult> {
  // 귀속 유저 조회 (파트너 + 지갑 포함)
  const referredUser = await prisma.referredUser.findUnique({
    where: { userId },
    include: { partner: { include: { wallet: true } } },
  });

  // 귀속 파트너가 없거나 지갑이 없으면 커미션 미발생
  if (!referredUser || !referredUser.partner.wallet) {
    return { attributed: false };
  }

  const commissionAmount = Math.floor(amount * commissionRate);
  const walletId = referredUser.partner.wallet.id;

  // 트랜잭션: 커미션 생성 + 지갑 업데이트 (원자성 보장)
  await prisma.$transaction(async (tx) => {
    await tx.commissionTransaction.create({
      data: {
        walletId,
        referredUserId: referredUser.id,
        serviceId,
        serviceName: serviceName || serviceId,
        paymentAmount: amount,
        commissionRate,
        commissionAmount,
        status: 'CONFIRMED',
        webhookPayload: webhookPayload as Parameters<typeof tx.commissionTransaction.create>[0]['data']['webhookPayload'],
      },
    });

    await tx.partnerWallet.update({
      where: { id: walletId },
      data: {
        currentBalance: { increment: commissionAmount },
        totalEarned: { increment: commissionAmount },
      },
    });
  });

  return {
    attributed: true,
    commissionAmount,
    referredUserId: referredUser.id,
    walletId,
  };
}

/**
 * 결제 취소/환불 시 커미션 역전 처리
 * - 해당 userId의 CONFIRMED 커미션 트랜잭션 조회
 * - 커미션 상태를 PENDING으로 변경 (또는 별도 REVERSED 상태 필요 시 확장)
 * - 파트너 지갑에서 커미션 차감
 */
export async function reverseCommission(
  userId: string,
  serviceId?: string,
  cancelAmount?: number
): Promise<CommissionReversalResult> {
  const referredUser = await prisma.referredUser.findUnique({
    where: { userId },
    include: { partner: { include: { wallet: true } } },
  });

  if (!referredUser || !referredUser.partner.wallet) {
    return { reversed: false };
  }

  // 해당 유저의 확정된 커미션 트랜잭션 조회
  const transactions = await prisma.commissionTransaction.findMany({
    where: {
      referredUserId: referredUser.id,
      status: 'CONFIRMED',
      ...(serviceId ? { serviceId } : {}),
    },
  });

  if (transactions.length === 0) {
    return { reversed: false };
  }

  // 전체 취소: 모든 커미션 역전 / 부분 취소: cancelAmount 비율에 맞게 역전
  let totalReversed = 0;
  const reversedIds: string[] = [];

  await prisma.$transaction(async (tx) => {
    for (const txn of transactions) {
      let reverseAmount = txn.commissionAmount;

      // 부분 취소인 경우: 취소 금액 비율만큼만 역전
      if (cancelAmount && cancelAmount < txn.paymentAmount) {
        const ratio = cancelAmount / txn.paymentAmount;
        reverseAmount = Math.floor(txn.commissionAmount * ratio);
      }

      // 커미션 트랜잭션 상태 변경 (CONFIRMED → PENDING으로 역전 표시)
      await tx.commissionTransaction.update({
        where: { id: txn.id },
        data: { status: 'PENDING' },
      });

      totalReversed += reverseAmount;
      reversedIds.push(txn.id);
    }

    // 파트너 지갑에서 커미션 차감
    if (totalReversed > 0) {
      await tx.partnerWallet.update({
        where: { id: referredUser.partner.wallet!.id },
        data: {
          currentBalance: { decrement: totalReversed },
          totalEarned: { decrement: totalReversed },
        },
      });
    }
  });

  return {
    reversed: true,
    reversedAmount: totalReversed,
    transactionIds: reversedIds,
  };
}
