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

vi.mock('@/lib/referral', () => ({
  generateReferralCode: vi.fn(() => 'SD-TEST01'),
}));

import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { POST } from '@/app/api/affiliate/register/route';

const mockGetServerSession = vi.mocked(getServerSession);

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost:3000/api/affiliate/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/affiliate/register', () => {
  beforeEach(() => {
    resetPrismaMock();
    mockGetServerSession.mockReset();
  });

  it('creates Partner + PartnerWallet on successful registration', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: '',
    });

    prismaMock.partner.findUnique.mockResolvedValue(null);
    prismaMock.partner.create.mockResolvedValue({
      id: 'partner-1',
      referralCode: 'SD-TEST01',
      status: 'ACTIVE',
      name: 'Test Partner',
    });

    const req = makeRequest({ name: 'Test Partner', phone: '010-1234-5678' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(data.success).toBe(true);
    expect(data.data.referralCode).toBe('SD-TEST01');
    expect(data.data.referralUrl).toBe('http://localhost:3000/r/SD-TEST01');

    // Verify prisma.partner.create was called with wallet: { create: {} }
    expect(prismaMock.partner.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: 'user-1',
          referralCode: 'SD-TEST01',
          name: 'Test Partner',
          wallet: { create: {} },
        }),
      })
    );
  });

  it('returns 409 for duplicate partner registration', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: '',
    });

    prismaMock.partner.findUnique.mockResolvedValue({
      id: 'partner-1',
      userId: 'user-1',
    });

    const req = makeRequest({ name: 'Test Partner' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(409);
    expect(data.success).toBe(false);
    expect(data.error).toContain('이미 파트너');
  });

  it('returns 400 when name is missing', async () => {
    mockGetServerSession.mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: '',
    });

    const req = makeRequest({ phone: '010-1234-5678' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.success).toBe(false);
    expect(data.error).toContain('name is required');
  });

  it('returns 401 when not authenticated', async () => {
    mockGetServerSession.mockResolvedValue(null);

    const req = makeRequest({ name: 'Test' });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.success).toBe(false);
  });
});
