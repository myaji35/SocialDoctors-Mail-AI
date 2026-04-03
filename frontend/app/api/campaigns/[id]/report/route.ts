/**
 * Campaign Report API
 *
 * GET — 캠페인 성과 리포트
 *
 * 포함 항목:
 *   - 총 포스트 수, 카드뉴스 생성 수
 *   - 플랫폼별 분포
 *   - 아이템별 상태 분석
 *   - 캠페인 타임라인 (요청 → 승인 → 완료)
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!campaign) {
    return NextResponse.json({ error: '캠페인을 찾을 수 없습니다.' }, { status: 404 });
  }

  // API Key 인증: 해당 callerApp의 캠페인만 조회 가능
  if (auth.type === 'apikey' && campaign.callerApp !== auth.callerApp) {
    return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
  }

  // ── 아이템 분석 ───────────────────────────────────────────────
  const items = campaign.items;

  // 상태별 카운트
  const statusBreakdown: Record<string, number> = {};
  for (const item of items) {
    statusBreakdown[item.status] = (statusBreakdown[item.status] ?? 0) + 1;
  }

  // 타입별 카운트
  const typeBreakdown: Record<string, number> = {};
  for (const item of items) {
    typeBreakdown[item.type] = (typeBreakdown[item.type] ?? 0) + 1;
  }

  // 플랫폼별 분포
  const platformDistribution: Record<string, { total: number; completed: number; failed: number }> =
    {};
  for (const item of items) {
    const platform = item.platform ?? 'N/A';
    if (!platformDistribution[platform]) {
      platformDistribution[platform] = { total: 0, completed: 0, failed: 0 };
    }
    platformDistribution[platform].total++;
    if (item.status === 'COMPLETED') {
      platformDistribution[platform].completed++;
    } else if (item.status === 'FAILED') {
      platformDistribution[platform].failed++;
    }
  }

  // ── 타임라인 ──────────────────────────────────────────────────
  const timeline: Array<{ event: string; timestamp: string | null }> = [
    { event: 'REQUESTED', timestamp: campaign.requestedAt?.toISOString() ?? null },
    { event: 'APPROVED', timestamp: campaign.approvedAt?.toISOString() ?? null },
    { event: 'COMPLETED', timestamp: campaign.completedAt?.toISOString() ?? null },
  ];

  // 소요 시간 계산 (요청 → 완료)
  let durationMs: number | null = null;
  if (campaign.requestedAt && campaign.completedAt) {
    durationMs = campaign.completedAt.getTime() - campaign.requestedAt.getTime();
  }

  return NextResponse.json({
    report: {
      campaignId: campaign.id,
      title: campaign.title,
      type: campaign.type,
      status: campaign.status,
      callerApp: campaign.callerApp,
      clientName: campaign.clientName,
      clientSlug: campaign.clientSlug,

      // 요약 통계
      summary: {
        totalItems: items.length,
        postsCount: campaign.postsCount,
        cardNewsCount: campaign.cardNewsCount,
        budget: campaign.budget,
        platforms: campaign.platforms,
      },

      // 상세 분석
      statusBreakdown,
      typeBreakdown,
      platformDistribution,

      // 타임라인
      timeline: timeline.filter((t) => t.timestamp !== null),
      durationMs,
      durationHours: durationMs ? Math.round(durationMs / 3600000 * 10) / 10 : null,

      // 아이템 상세
      items: items.map((item) => ({
        id: item.id,
        type: item.type,
        platform: item.platform,
        status: item.status,
        postId: item.postId,
        cardNewsId: item.cardNewsId,
        result: item.result,
        createdAt: item.createdAt,
      })),
    },
  });
}
