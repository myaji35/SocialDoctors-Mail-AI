export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { verifyWebhookSignature } from '@/lib/webhook';
import { processCommission } from '@/lib/commission';

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

    // 커미션 파이프라인 실행 (공통 유틸리티 사용)
    const result = await processCommission(userId, serviceId, serviceName, amount, body);

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    console.error('[webhooks/payment]', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
