import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prismaMock, resetPrismaMock } from '../helpers/prisma-mock';

// Mock next-auth before importing the route
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/auth', () => ({
  authOptions: {},
}));

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { POST } from '@/app/api/affiliate/attribute/route';

const mockGetServerSession = vi.mocked(getServerSession);

function makeRequest(body: object = {}, cookies?: Record<string, string>): NextRequest {
  const req = new NextRequest('http://localhost:3000/api/affiliate/attribute', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(cookies?.ref ? { Cookie: `ref=${cookies.ref}` } : {}),
    },
    body: JSON.stringify(body),
  });
  return req;
}

describe('POST /api/affiliate/attribute', () => {
  beforeEach(() => {
    resetPrismaMock();
    mockGetServerSession.mockReset();
  });

  it('attributes authenticated user with valid referral code from body', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', email: 'user@example.com' },
      expires: '',
    });

    prismaMock.referredUser.findUnique.mockResolvedValue(null);
    prismaMock.partner.findUnique.mockResolvedValue({
      id: 'partner-1',
      referralCode: 'SD-ABC123',
      status: 'ACTIVE',
    });

    // Mock $transaction to execute the callback
    prismaMock.$transaction.mockImplementation(async (fn: (tx: typeof prismaMock) => Promise<void>) => {
      const txProxy = {
        referredUser: { create: vi.fn().mockResolvedValue({}) },
        referralClick: {
          findFirst: vi.fn().mockResolvedValue(null),
          update: vi.fn(),
        },
      };
      await fn(txProxy as unknown as typeof prismaMock);
    });

    const req = makeRequest({ referralCode: 'SD-ABC123' });
    const res = await POST(req);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.attributed).toBe(true);
  });

  it('returns already_attributed when user is already attributed', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', email: 'user@example.com' },
      expires: '',
    });

    prismaMock.referredUser.findUnique.mockResolvedValue({
      id: 'ref-1',
      userId: 'user-1',
      partnerId: 'partner-1',
    });

    const req = makeRequest({ referralCode: 'SD-ABC123' });
    const res = await POST(req);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.attributed).toBe(false);
    expect(data.reason).toBe('already_attributed');
  });

  it('returns 401 when unauthenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const req = makeRequest({ referralCode: 'SD-ABC123' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
  });

  it('returns attributed=false when no referralCode provided', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', email: 'user@example.com' },
      expires: '',
    });

    const req = makeRequest({});
    const res = await POST(req);
    const data = await res.json();

    expect(data.success).toBe(false);
    expect(data.attributed).toBe(false);
  });

  it('returns invalid_partner when partner not found or inactive', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', email: 'user@example.com' },
      expires: '',
    });

    prismaMock.referredUser.findUnique.mockResolvedValue(null);
    prismaMock.partner.findUnique.mockResolvedValue(null);

    const req = makeRequest({ referralCode: 'SD-INVALID' });
    const res = await POST(req);
    const data = await res.json();

    expect(data.success).toBe(true);
    expect(data.attributed).toBe(false);
    expect(data.reason).toBe('invalid_partner');
  });
});
