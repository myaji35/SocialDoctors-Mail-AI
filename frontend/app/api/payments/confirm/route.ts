export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { TOSS_CONFIRM_URL, getTossAuthHeader } from '@/lib/toss';

export async function POST(request: NextRequest) {
  try {
    // 세션 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { orderId, paymentKey, amount, serviceId, serviceName } = body;

    if (!orderId || !paymentKey || !amount) {
      return NextResponse.json(
        { success: false, error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 1. Toss Payments 승인 요청
    const tossRes = await fetch(TOSS_CONFIRM_URL, {
      method: 'POST',
      headers: {
        Authorization: getTossAuthHeader(),
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ paymentKey, orderId, amount }),
    });

    const tossData = await tossRes.json();

    if (!tossRes.ok) {
      console.error('[payments/confirm] Toss error:', tossData);
      return NextResponse.json(
        { success: false, error: tossData.message ?? '결제 승인에 실패했습니다.' },
        { status: 400 }
      );
    }

    // 2. 결제 방법 매핑
    const methodMap: Record<string, string> = {
      '카드': 'CARD',
      '가상계좌': 'VIRTUAL_ACCOUNT',
      '계좌이체': 'TRANSFER',
      '휴대폰': 'MOBILE_PHONE',
      '문화상품권': 'CULTURE_GIFT_CERTIFICATE',
      '토스페이': 'TOSS_PAY',
    };
    const paymentMethod = methodMap[tossData.method] ?? null;

    // 3. DB에 결제 정보 저장
    const payment = await prisma.payment.upsert({
      where: { orderId },
      create: {
        userId: session.user.id,
        orderId,
        orderName: tossData.orderName ?? serviceName ?? '서비스 결제',
        amount,
        status: 'DONE',
        method: paymentMethod as never,
        paymentKey,
        serviceId: serviceId ?? null,
        serviceName: serviceName ?? null,
        tossPayload: tossData,
        approvedAt: tossData.approvedAt ? new Date(tossData.approvedAt) : new Date(),
      },
      update: {
        status: 'DONE',
        method: paymentMethod as never,
        paymentKey,
        tossPayload: tossData,
        approvedAt: tossData.approvedAt ? new Date(tossData.approvedAt) : new Date(),
      },
    });

    // 4. 커미션 파이프라인 — referredUser 확인 후 커미션 생성
    await processCommission(session.user.id, payment.id, serviceId, serviceName, amount);

    return NextResponse.json({
      success: true,
      payment: {
        orderId: payment.orderId,
        orderName: payment.orderName,
        amount: payment.amount,
        method: payment.method,
        approvedAt: payment.approvedAt?.toISOString() ?? null,
        status: payment.status,
      },
    });
  } catch (error) {
    console.error('[payments/confirm]', error);
    return NextResponse.json(
      { success: false, error: '서버 내부 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}

/**
 * 커미션 파이프라인: 추천인이 있으면 커미션 트랜잭션 생성 + 지갑 업데이트
 */
async function processCommission(
  userId: string,
  _paymentId: string,
  serviceId: string | null,
  serviceName: string | null,
  amount: number
) {
  try {
    const referredUser = await prisma.referredUser.findUnique({
      where: { userId },
      include: { partner: { include: { wallet: true } } },
    });

    if (!referredUser || !referredUser.partner.wallet) {
      return; // 추천인 없음 — 커미션 불필요
    }

    const commissionRate = 0.20;
    const commissionAmount = Math.floor(amount * commissionRate);

    await prisma.$transaction(async (tx) => {
      await tx.commissionTransaction.create({
        data: {
          walletId: referredUser.partner.wallet!.id,
          referredUserId: referredUser.id,
          serviceId: serviceId ?? 'unknown',
          serviceName: serviceName ?? '서비스 결제',
          paymentAmount: amount,
          commissionRate,
          commissionAmount,
          status: 'CONFIRMED',
        },
      });

      await tx.partnerWallet.update({
        where: { id: referredUser.partner.wallet!.id },
        data: {
          currentBalance: { increment: commissionAmount },
          totalEarned: { increment: commissionAmount },
        },
      });
    });

    console.log(`[Commission] Created commission: ${commissionAmount}원 for partner ${referredUser.partnerId}`);
  } catch (err) {
    // 커미션 처리 실패해도 결제 자체는 성공으로 처리
    console.error('[Commission] Failed to process commission:', err);
  }
}
