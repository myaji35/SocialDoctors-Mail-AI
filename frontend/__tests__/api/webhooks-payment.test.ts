import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';
import { prismaMock, resetPrismaMock } from '../helpers/prisma-mock';

// Mock webhook module to use real implementation
vi.mock('@/lib/webhook', () => ({
  verifyWebhookSignature: (payload: string, signature: string, secret: string): boolean => {
    try {
      const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
      return crypto.timingSafeEqual(
        Buffer.from(signature, 'hex'),
        Buffer.from(expected, 'hex')
      );
    } catch {
      return false;
    }
  },
}));

import { NextRequest } from 'next/server';
import { POST } from '@/app/api/webhooks/payment/route';

const WEBHOOK_SECRET = 'test-webhook-secret';

function signPayload(payload: string): string {
  return crypto.createHmac('sha256', WEBHOOK_SECRET).update(payload).digest('hex');
}

function makeRequest(body: object, signature?: string): NextRequest {
  const rawBody = JSON.stringify(body);
  const sig = signature ?? signPayload(rawBody);
  return new NextRequest('http://localhost:3000/api/webhooks/payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-webhook-signature': sig,
    },
    body: rawBody,
  });
}

describe('POST /api/webhooks/payment', () => {
  beforeEach(() => {
    resetPrismaMock();
    process.env.WEBHOOK_SECRET = WEBHOOK_SECRET;
  });

  it('creates CommissionTransaction and updates wallet for valid payment', async () => {
    const paymentBody = {
      event: 'payment.completed',
      serviceId: 'svc-1',
      serviceName: 'InsureGraph',
      userId: 'user-1',
      amount: 50000,
    };

    prismaMock.referredUser.findUnique.mockResolvedValue({
      id: 'ref-1',
      userId: 'user-1',
      partnerId: 'partner-1',
      partner: {
        id: 'partner-1',
        wallet: { id: 'wallet-1', currentBalance: 0, totalEarned: 0 },
      },
    });

    prismaMock.$transaction.mockImplementation(async (fn: (tx: typeof prismaMock) => Promise<void>) => {
      const txProxy = {
        commissionTransaction: { create: vi.fn().mockResolvedValue({}) },
        partnerWallet: { update: vi.fn().mockResolvedValue({}) },
      };
      await fn(txProxy as unknown as typeof prismaMock);
    });

    const req = makeRequest(paymentBody);
    const res = await POST(req);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.commissionAmount).toBe(10000); // 50000 * 0.20
  });

  it('returns 401 for invalid HMAC signature', async () => {
    const paymentBody = {
      event: 'payment.completed',
      serviceId: 'svc-1',
      userId: 'user-1',
      amount: 50000,
    };

    const req = makeRequest(paymentBody, 'invalid-hex-signature-that-is-wrong');
    const res = await POST(req);

    expect(res.status).toBe(401);
    const data = await res.json();
    expect(data.error).toBe('Invalid signature');
  });

  it('returns attributed=false when user has no partner', async () => {
    const paymentBody = {
      event: 'payment.completed',
      serviceId: 'svc-1',
      serviceName: 'InsureGraph',
      userId: 'user-no-partner',
      amount: 30000,
    };

    prismaMock.referredUser.findUnique.mockResolvedValue(null);

    const req = makeRequest(paymentBody);
    const res = await POST(req);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.attributed).toBe(false);
  });

  it('skips non-payment.completed events', async () => {
    const body = {
      event: 'payment.pending',
      serviceId: 'svc-1',
      userId: 'user-1',
      amount: 10000,
    };

    const req = makeRequest(body);
    const res = await POST(req);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.skipped).toBe(true);
  });

  it('returns 400 when required fields are missing', async () => {
    const body = {
      event: 'payment.completed',
      // missing serviceId, userId, amount
    };

    const req = makeRequest(body);
    const res = await POST(req);

    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toContain('Missing required fields');
  });
});
