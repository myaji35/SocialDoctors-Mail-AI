/**
 * Campaign Stats API (Admin Dashboard)
 *
 * GET — 캠페인 통합 통계
 *
 * 포함 항목:
 *   - 상태별 캠페인 수
 *   - callerApp별 캠페인 수 (Top)
 *   - 월별 매출(budget) 집계
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  // ── 인증 (관리자 세션 또는 API Key) ────────────────────────────
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // API Key 인증: 해당 callerApp의 통계만 반환
  const callerAppFilter = auth.type === 'apikey' ? auth.callerApp : undefined;
  const where = callerAppFilter ? { callerApp: callerAppFilter } : {};

  // ── 상태별 캠페인 수 ──────────────────────────────────────────
  const byStatus = await prisma.campaign.groupBy({
    by: ['status'],
    where,
    _count: { id: true },
  });

  const statusCounts: Record<string, number> = {};
  for (const row of byStatus) {
    statusCounts[row.status] = row._count.id;
  }

  // ── callerApp별 캠페인 수 (Top) ───────────────────────────────
  const byCallerApp = await prisma.campaign.groupBy({
    by: ['callerApp'],
    where,
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  const topCallerApps = byCallerApp.map((row) => ({
    callerApp: row.callerApp,
    count: row._count.id,
  }));

  // ── 타입별 캠페인 수 ──────────────────────────────────────────
  const byType = await prisma.campaign.groupBy({
    by: ['type'],
    where,
    _count: { id: true },
  });

  const typeCounts: Record<string, number> = {};
  for (const row of byType) {
    typeCounts[row.type] = row._count.id;
  }

  // ── 전체 집계 ─────────────────────────────────────────────────
  const totals = await prisma.campaign.aggregate({
    where,
    _count: { id: true },
    _sum: { budget: true, postsCount: true, cardNewsCount: true },
  });

  // ── 월별 매출(budget) 집계 ────────────────────────────────────
  // Prisma groupBy에서 날짜 트렁케이션이 제한적이므로 최근 12개월 수동 집계
  const now = new Date();
  const monthlyRevenue: Array<{ month: string; count: number; totalBudget: number }> = [];

  for (let i = 11; i >= 0; i--) {
    const startDate = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const endDate = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const monthKey = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}`;

    const monthData = await prisma.campaign.aggregate({
      where: {
        ...where,
        createdAt: { gte: startDate, lt: endDate },
      },
      _count: { id: true },
      _sum: { budget: true },
    });

    monthlyRevenue.push({
      month: monthKey,
      count: monthData._count.id,
      totalBudget: monthData._sum.budget ?? 0,
    });
  }

  return NextResponse.json({
    stats: {
      total: totals._count.id,
      totalBudget: totals._sum.budget ?? 0,
      totalPosts: totals._sum.postsCount ?? 0,
      totalCardNews: totals._sum.cardNewsCount ?? 0,

      byStatus: statusCounts,
      byType: typeCounts,
      topCallerApps,
      monthlyRevenue,
    },
  });
}
