export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { processCommission, reverseCommission } from '@/lib/commission';

/**
 * Toss Payments 웹훅 시그니처 검증
 * - Toss는 `TossPayments-Signature` 헤더로 HMAC-SHA256 서명 전송
 * - TOSS_WEBHOOK_SECRET 환경변수로 검증
 */
function verifyTossSignature(rawBody: string, signature: string, secret: string): boolean {
  try {
    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest('base64');
    return crypto.timingSafeEqual(
      Buffer.from(signature, 'base64'),
      Buffer.from(expected, 'base64')
    );
  } catch {
    return false;
  }
}

// Toss 웹훅 페이로드 타입 (주요 필드)
interface TossWebhookPayload {
  eventType: string; // "PAYMENT_STATUS_CHANGED" 등
  data: {
    paymentKey: string;
    orderId: string;
    status: 'DONE' | 'CANCELED' | 'PARTIAL_CANCELED' | 'ABORTED' | 'EXPIRED';
    method?: string;
    totalAmount?: number;
    cancelAmount?: number;
    cancels?: Array<{
      cancelAmount: number;
      cancelReason: string;
      canceledAt: string;
    }>;
    approvedAt?: string;
    [key: string]: unknown;
  };
}

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const secret = process.env.TOSS_WEBHOOK_SECRET || '';

    // 시그니처 검증 (secret이 설정된 경우)
    if (secret) {
      const signature = request.headers.get('TossPayments-Signature') || '';
      if (!verifyTossSignature(rawBody, signature, secret)) {
        console.error('[webhooks/toss] 시그니처 검증 실패');
        return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload: TossWebhookPayload = JSON.parse(rawBody);
    const { data } = payload;

    if (!data?.paymentKey) {
      return NextResponse.json({ success: false, error: 'Missing paymentKey' }, { status: 400 });
    }

    // paymentKey로 Payment 레코드 조회
    const payment = await prisma.payment.findUnique({
      where: { paymentKey: data.paymentKey },
    });

    if (!payment) {
      console.warn(`[webhooks/toss] Payment not found: paymentKey=${data.paymentKey}`);
      // Toss에 200 반환 (재시도 방지) - 나중에 재처리 가능하도록 로깅
      return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 200 });
    }

    // 이벤트별 처리
    switch (data.status) {
      case 'DONE':
        return await handlePaymentDone(payment, data, payload);
      case 'CANCELED':
      case 'PARTIAL_CANCELED':
        return await handlePaymentCanceled(payment, data, payload);
      case 'ABORTED':
      case 'EXPIRED':
        return await handlePaymentTerminated(payment, data);
      default:
        console.warn(`[webhooks/toss] Unknown status: ${data.status}`);
        return NextResponse.json({ success: true, skipped: true });
    }
  } catch (error) {
    console.error('[webhooks/toss]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * 결제 승인 완료 (DONE)
 * 1. Payment 상태 업데이트
 * 2. 커미션 파이프라인 실행
 */
async function handlePaymentDone(
  payment: { id: string; userId: string; serviceId: string | null; serviceName: string | null; amount: number; status: string },
  data: TossWebhookPayload['data'],
  payload: TossWebhookPayload
) {
  // 이미 DONE 처리된 경우 중복 방지
  if (payment.status === 'DONE') {
    return NextResponse.json({ success: true, duplicate: true });
  }

  // Payment 레코드 업데이트
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: 'DONE',
      method: mapTossMethod(data.method),
      approvedAt: data.approvedAt ? new Date(data.approvedAt) : new Date(),
      tossPayload: JSON.parse(JSON.stringify(payload)),
    },
  });

  // 커미션 파이프라인 실행
  const result = await processCommission(
    payment.userId,
    payment.serviceId || 'unknown',
    payment.serviceName || '결제',
    payment.amount,
    payload
  );

  console.log(`[webhooks/toss] DONE: paymentKey=${data.paymentKey}, commission=${result.attributed ? result.commissionAmount : 'N/A'}`);

  return NextResponse.json({ success: true, ...result });
}

/**
 * 결제 취소/부분취소 (CANCELED / PARTIAL_CANCELED)
 * 1. Payment 상태 업데이트
 * 2. 커미션 역전 처리
 */
async function handlePaymentCanceled(
  payment: { id: string; userId: string; serviceId: string | null; amount: number; status: string },
  data: TossWebhookPayload['data'],
  payload: TossWebhookPayload
) {
  const latestCancel = data.cancels?.[data.cancels.length - 1];
  const cancelAmount = data.cancelAmount || latestCancel?.cancelAmount || payment.amount;

  // Payment 레코드 업데이트
  await prisma.payment.update({
    where: { id: payment.id },
    data: {
      status: data.status,
      cancelAmount,
      cancelReason: latestCancel?.cancelReason || '사유 미입력',
      canceledAt: latestCancel?.canceledAt ? new Date(latestCancel.canceledAt) : new Date(),
      tossPayload: JSON.parse(JSON.stringify(payload)),
    },
  });

  // 커미션 역전 처리
  const reversal = await reverseCommission(
    payment.userId,
    payment.serviceId || undefined,
    data.status === 'PARTIAL_CANCELED' ? cancelAmount : undefined
  );

  console.log(`[webhooks/toss] ${data.status}: paymentKey=${data.paymentKey}, reversed=${reversal.reversedAmount || 0}`);

  return NextResponse.json({ success: true, ...reversal });
}

/**
 * 결제 중단/만료 (ABORTED / EXPIRED)
 * - 상태만 업데이트 (커미션 영향 없음)
 */
async function handlePaymentTerminated(
  payment: { id: string; status: string },
  data: TossWebhookPayload['data']
) {
  await prisma.payment.update({
    where: { id: payment.id },
    data: { status: data.status },
  });

  console.log(`[webhooks/toss] ${data.status}: paymentKey=${data.paymentKey}`);

  return NextResponse.json({ success: true, status: data.status });
}

/**
 * Toss 결제 수단 문자열 → PaymentMethod enum 매핑
 */
function mapTossMethod(method?: string): 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE_PHONE' | 'CULTURE_GIFT_CERTIFICATE' | 'TOSS_PAY' | undefined {
  if (!method) return undefined;
  const map: Record<string, 'CARD' | 'VIRTUAL_ACCOUNT' | 'TRANSFER' | 'MOBILE_PHONE' | 'CULTURE_GIFT_CERTIFICATE' | 'TOSS_PAY'> = {
    '카드': 'CARD',
    '가상계좌': 'VIRTUAL_ACCOUNT',
    '계좌이체': 'TRANSFER',
    '휴대폰': 'MOBILE_PHONE',
    '문화상품권': 'CULTURE_GIFT_CERTIFICATE',
    '토스페이': 'TOSS_PAY',
  };
  return map[method] || undefined;
}
