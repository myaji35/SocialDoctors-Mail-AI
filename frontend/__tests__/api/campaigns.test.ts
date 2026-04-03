import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prismaMock, resetPrismaMock } from '../helpers/prisma-mock';

// Mock api-auth
vi.mock('@/lib/api-auth', () => ({
  resolveAuth: vi.fn(),
}));

import { resolveAuth } from '@/lib/api-auth';

describe('Campaign API', () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  describe('POST /api/campaigns', () => {
    it('API 키 인증 성공 시 캠페인 생성', async () => {
      (resolveAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
        type: 'apikey', userId: 'system', callerApp: '0008_choi-pd',
      });

      const mockCampaign = {
        id: 'camp-1', callerApp: '0008_choi-pd', clientName: '최PD',
        clientSlug: 'choi-pd', type: 'SNS_POST', status: 'REQUESTED',
        title: '테스트 캠페인', platforms: ['FACEBOOK'],
      };
      prismaMock.campaign = { ...prismaMock.campaign, create: vi.fn().mockResolvedValue(mockCampaign) };

      const { POST } = await import('@/app/api/campaigns/route');
      const req = new Request('http://localhost/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '테스트 캠페인', type: 'SNS_POST', clientName: '최PD',
          clientSlug: 'choi-pd', platforms: ['FACEBOOK'],
        }),
      });

      const res = await POST(req as never);
      expect(res.status).toBe(201);
    });

    it('미인증 시 401 반환', async () => {
      (resolveAuth as ReturnType<typeof vi.fn>).mockResolvedValue({ type: 'unauthorized' });

      const { POST } = await import('@/app/api/campaigns/route');
      const req = new Request('http://localhost/api/campaigns', {
        method: 'POST',
        body: JSON.stringify({ title: 'test' }),
      });

      const res = await POST(req as never);
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/campaigns', () => {
    it('API 키 인증 시 callerApp 기준 필터링', async () => {
      (resolveAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
        type: 'apikey', userId: 'system', callerApp: '0008_choi-pd',
      });

      prismaMock.campaign = {
        ...prismaMock.campaign,
        findMany: vi.fn().mockResolvedValue([]),
        count: vi.fn().mockResolvedValue(0),
      };

      const { GET } = await import('@/app/api/campaigns/route');
      const req = new Request('http://localhost/api/campaigns');
      const res = await GET(req as never);
      const data = await res.json();
      expect(data.campaigns).toEqual([]);
    });
  });
});

describe('Campaign Stats API', () => {
  beforeEach(() => {
    resetPrismaMock();
    vi.clearAllMocks();
  });

  it('인증된 요청에 통계 반환', async () => {
    (resolveAuth as ReturnType<typeof vi.fn>).mockResolvedValue({
      type: 'apikey', userId: 'system', callerApp: '0008_choi-pd',
    });

    prismaMock.campaign = {
      ...prismaMock.campaign,
      count: vi.fn().mockResolvedValue(5),
      groupBy: vi.fn().mockResolvedValue([]),
      aggregate: vi.fn().mockResolvedValue({ _count: { id: 5 }, _sum: { budget: 500000, postsCount: 10, cardNewsCount: 3 } }),
    };

    const { GET } = await import('@/app/api/campaigns/stats/route');
    const req = new Request('http://localhost/api/campaigns/stats');
    const res = await GET(req as never);
    expect(res.status).toBe(200);
  });
});
