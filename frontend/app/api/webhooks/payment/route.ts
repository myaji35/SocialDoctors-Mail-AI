export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyWebhookSignature } from '@/lib/webhook';

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get('x-webhook-signature') || '';
    const secret = process.env.WEBHOOK_SECRET || '';

    if (secret && !verifyWebhookSignature(rawBody, signature, secret)) {
      return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const { event, serviceId, serviceName, userId, amount } = body;

    if (event !== 'payment.completed') {
      return NextResponse.json({ success: true, skipped: true });
    }

    if (!serviceId || !userId || !amount) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 귀속 유저 조회
    const referredUser = await prisma.referredUser.findUnique({
      where: { userId: userId },
      include: { partner: { include: { wallet: true } } },
    });

    if (!referredUser || !referredUser.partner.wallet) {
      return NextResponse.json({ success: true, attributed: false });
    }

    const commissionRate = 0.20;
    const commissionAmount = Math.floor(amount * commissionRate);

    await prisma.$transaction(async (tx) => {
      await tx.commissionTransaction.create({
        data: {
          walletId: referredUser.partner.wallet!.id,
          referredUserId: referredUser.id,
          serviceId,
          serviceName: serviceName || serviceId,
          paymentAmount: amount,
          commissionRate,
          commissionAmount,
          status: 'CONFIRMED',
          webhookPayload: body,
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

    return NextResponse.json({ success: true, commissionAmount });
  } catch (error) {
    console.error('[webhooks/payment]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
