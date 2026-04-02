export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { reverseCommission } from '@/lib/commission';

/**
 * POST /api/payments/[id]/cancel
 * 결제 취소 API
 * - 관리자 또는 결제 소유자만 취소 가능
 * - Toss Payments 취소 API 호출 후 DB 업데이트
 * - 커미션 역전 처리
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // 세션 인증 확인
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id: paymentId } = await params;

    // 결제 레코드 조회
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ success: false, error: 'Payment not found' }, { status: 404 });
    }

    // 권한 확인: 관리자이거나 결제 소유자만 가능
    const isAdmin = session.user.role === 'ADMIN';
    const isOwner = payment.userId === session.user.id;

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 });
    }

    // DONE 상태만 취소 가능
    if (payment.status !== 'DONE') {
      return NextResponse.json(
        { success: false, error: `Cannot cancel payment with status: ${payment.status}` },
        { status: 400 }
      );
    }

    // paymentKey 필요
    if (!payment.paymentKey) {
      return NextResponse.json(
        { success: false, error: 'Payment has no paymentKey (not Toss payment)' },
        { status: 400 }
      );
    }

    // 요청 바디 파싱
    const body = await request.json().catch(() => ({}));
    const cancelReason = body.cancelReason || '고객 요청에 의한 취소';

    // Toss Payments 취소 API 호출
    const tossSecretKey = process.env.TOSS_SECRET_KEY;
    if (!tossSecretKey) {
      return NextResponse.json(
        { success: false, error: 'Toss secret key not configured' },
        { status: 500 }
      );
    }

    const authHeader = Buffer.from(`${tossSecretKey}:`).toString('base64');

    const tossResponse = await fetch(
      `https://api.tosspayments.com/v1/payments/${payment.paymentKey}/cancel`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancelReason }),
      }
    );

    const tossResult = await tossResponse.json();

    if (!tossResponse.ok) {
      console.error('[payments/cancel] Toss API 오류:', tossResult);
      return NextResponse.json(
        {
          success: false,
          error: 'Toss cancel failed',
          tossError: {
            code: tossResult.code,
            message: tossResult.message,
          },
        },
        { status: tossResponse.status }
      );
    }

    // DB 업데이트
    await prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'CANCELED',
        cancelAmount: payment.amount,
        cancelReason,
        canceledAt: new Date(),
        tossPayload: tossResult,
      },
    });

    // 커미션 역전 처리
    const reversal = await reverseCommission(
      payment.userId,
      payment.serviceId || undefined
    );

    console.log(`[payments/cancel] 취소 완료: paymentId=${paymentId}, reversed=${reversal.reversedAmount || 0}`);

    return NextResponse.json({
      success: true,
      cancelAmount: payment.amount,
      commissionReversed: reversal.reversed,
      reversedAmount: reversal.reversedAmount,
    });
  } catch (error) {
    console.error('[payments/cancel]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
