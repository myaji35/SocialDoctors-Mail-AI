import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prismaMock, resetPrismaMock } from '../helpers/prisma-mock';

// Mock next-auth
vi.mock('next-auth', () => ({ getServerSession: vi.fn() }));
vi.mock('@/lib/auth', () => ({ authOptions: {} }));
vi.mock('@/lib/toss', () => ({
  TOSS_CONFIRM_URL: 'https://api.tosspayments.com/v1/payments/confirm',
  getTossAuthHeader: () => 'Basic dGVzdF9zZWNyZXQ6',
}));

import { getServerSession } from 'next-auth';

// Mock global fetch for Toss API
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('POST /api/payments/confirm', () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  it('미인증 시 401 반환', async () => {
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const { POST } = await import('@/app/api/payments/confirm/route');
    const req = new Request('http://localhost/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'test', paymentKey: 'pk', amount: 10000 }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(401);
  });

  it('필수 파라미터 누락 시 400 반환', async () => {
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'user1', email: 'test@test.com' },
    });

    const { POST } = await import('@/app/api/payments/confirm/route');
    const req = new Request('http://localhost/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'test' }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('Toss 승인 실패 시 400 반환', async () => {
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'user1', email: 'test@test.com' },
    });

    mockFetch.mockResolvedValue({
      ok: false,
      json: async () => ({ code: 'INVALID', message: '결제 실패' }),
    });

    const { POST } = await import('@/app/api/payments/confirm/route');
    const req = new Request('http://localhost/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'ord-1', paymentKey: 'pk-1', amount: 49000 }),
    });

    const res = await POST(req as never);
    expect(res.status).toBe(400);
  });

  it('Toss 승인 성공 시 Payment 저장 + 200 반환', async () => {
    (getServerSession as ReturnType<typeof vi.fn>).mockResolvedValue({
      user: { id: 'user1', email: 'test@test.com' },
    });

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        orderName: 'SocialDoctors Professional',
        method: '카드',
        approvedAt: '2026-04-03T08:00:00',
      }),
    });

    const mockPayment = {
      id: 'pay1',
      orderId: 'ord-1',
      orderName: 'SocialDoctors Professional',
      amount: 49000,
      method: 'CARD',
      approvedAt: new Date(),
      status: 'DONE',
    };
    prismaMock.payment.upsert.mockResolvedValue(mockPayment);
    prismaMock.referredUser.findUnique.mockResolvedValue(null);

    const { POST } = await import('@/app/api/payments/confirm/route');
    const req = new Request('http://localhost/api/payments/confirm', {
      method: 'POST',
      body: JSON.stringify({ orderId: 'ord-1', paymentKey: 'pk-1', amount: 49000, serviceId: 'sd-pro', serviceName: 'Professional' }),
    });

    const res = await POST(req as never);
    const data = await res.json();
    expect(res.status).toBe(200);
    expect(data.success).toBe(true);
    expect(prismaMock.payment.upsert).toHaveBeenCalled();
  });
});
