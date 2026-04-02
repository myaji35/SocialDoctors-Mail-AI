import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prismaMock, resetPrismaMock } from '../helpers/prisma-mock';

// Mock commission module
vi.mock('@/lib/commission', () => ({
  processCommission: vi.fn().mockResolvedValue({ attributed: false }),
  reverseCommission: vi.fn().mockResolvedValue({ reversed: false }),
}));

import { processCommission, reverseCommission } from '@/lib/commission';

describe('POST /api/webhooks/toss', () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
    process.env.TOSS_WEBHOOK_SECRET = '';
  });

  it('paymentKey 누락 시 400 반환', async () => {
    const { POST } = await import('@/app/api/webhooks/toss/route');
    const req = new Request('http://localhost/api/webhooks/toss', {
      method: 'POST',
      body: JSON.stringify({ eventType: 'PAYMENT_STATUS_CHANGED', data: {} }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('Payment 미존재 시 200 반환 (재시도 방지)', async () => {
    prismaMock.payment.findUnique.mockResolvedValue(null);

    const { POST } = await import('@/app/api/webhooks/toss/route');
    const req = new Request('http://localhost/api/webhooks/toss', {
      method: 'POST',
      body: JSON.stringify({
        eventType: 'PAYMENT_STATUS_CHANGED',
        data: { paymentKey: 'pk-999', status: 'DONE' },
      }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(200);
  });

  it('DONE ���벤트 → Payment 업데이트 + 커미션 실행', async () => {
    const mockPayment = { id: 'p1', userId: 'u1', serviceId: 'svc', serviceName: '서비스', amount: 50000, status: 'IN_PROGRESS' };
    prismaMock.payment.findUnique.mockResolvedValue(mockPayment);
    prismaMock.payment.update.mockResolvedValue({ ...mockPayment, status: 'DONE' });

    const { POST } = await import('@/app/api/webhooks/toss/route');
    const req = new Request('http://localhost/api/webhooks/toss', {
      method: 'POST',
      body: JSON.stringify({
        eventType: 'PAYMENT_STATUS_CHANGED',
        data: { paymentKey: 'pk-1', status: 'DONE', method: '카드', approvedAt: '2026-04-03T08:00:00' },
      }),
    });

    const res = await POST(req as never);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(prismaMock.payment.update).toHaveBeenCalled();
    expect(processCommission).toHaveBeenCalledWith('u1', 'svc', '서비스', 50000, expect.anything());
  });

  it('CANCELED 이벤트 → 커미션 역전 처리', async () => {
    const mockPayment = { id: 'p2', userId: 'u2', serviceId: 'svc2', serviceName: '서비스2', amount: 30000, status: 'DONE' };
    prismaMock.payment.findUnique.mockResolvedValue(mockPayment);
    prismaMock.payment.update.mockResolvedValue({ ...mockPayment, status: 'CANCELED' });

    const { POST } = await import('@/app/api/webhooks/toss/route');
    const req = new Request('http://localhost/api/webhooks/toss', {
      method: 'POST',
      body: JSON.stringify({
        eventType: 'PAYMENT_STATUS_CHANGED',
        data: {
          paymentKey: 'pk-2', status: 'CANCELED',
          cancelAmount: 30000,
          cancels: [{ cancelAmount: 30000, cancelReason: '고객 요청', canceledAt: '2026-04-03T09:00:00' }],
        },
      }),
    });

    const res = await POST(req as never);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(reverseCommission).toHaveBeenCalledWith('u2', 'svc2', undefined);
  });

  it('EXPIRED 이벤트 → 상태만 업데이트', async () => {
    const mockPayment = { id: 'p3', userId: 'u3', serviceId: null, serviceName: null, amount: 10000, status: 'READY' };
    prismaMock.payment.findUnique.mockResolvedValue(mockPayment);
    prismaMock.payment.update.mockResolvedValue({ ...mockPayment, status: 'EXPIRED' });

    const { POST } = await import('@/app/api/webhooks/toss/route');
    const req = new Request('http://localhost/api/webhooks/toss', {
      method: 'POST',
      body: JSON.stringify({
        eventType: 'PAYMENT_STATUS_CHANGED',
        data: { paymentKey: 'pk-3', status: 'EXPIRED' },
      }),
    });

    const res = await POST(req as never);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(prismaMock.payment.update).toHaveBeenCalled();
  });
});
