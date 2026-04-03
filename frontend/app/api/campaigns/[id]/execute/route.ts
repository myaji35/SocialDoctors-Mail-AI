/**
 * Campaign Execute API
 *
 * POST — 캠페인 실행 (실제 발행 트리거)
 *
 * 캠페인 타입별 실행:
 *   SNS_POST:     /api/social-pulse/publish 호출 (플랫폼별)
 *   CARD_NEWS:    /api/card-news 호출
 *   AI_COPY:      /api/social-pulse/generate-copy 호출
 *   FULL_PACKAGE: 위 전부 실행
 *
 * 각 액션마다 CampaignItem을 생성하여 결과 추적
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';

// 내부 API 호출용 베이스 URL
function getBaseUrl(request: NextRequest): string {
  const proto = request.headers.get('x-forwarded-proto') ?? 'http';
  const host = request.headers.get('host') ?? 'localhost:3000';
  return `${proto}://${host}`;
}

// 내부 API 호출 헬퍼 (인증 헤더 전달)
async function internalFetch(
  baseUrl: string,
  path: string,
  method: string,
  headers: Record<string, string>,
  body?: unknown
): Promise<{ ok: boolean; status: number; data: Record<string, unknown> }> {
  try {
    const res = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const data = await res.json();
    return { ok: res.ok, status: res.status, data };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      data: { error: String(error) },
    };
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  // ── 인증 ──────────────────────────────────────────────────────
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // ── 캠페인 조회 ───────────────────────────────────────────────
  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: { items: true },
  });

  if (!campaign) {
    return NextResponse.json({ error: '캠페인을 찾을 수 없습니다.' }, { status: 404 });
  }

  // API Key 인증: 해당 callerApp의 캠페인만 실행 가능
  if (auth.type === 'apikey' && campaign.callerApp !== auth.callerApp) {
    return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
  }

  // 캠페인 상태 검증: APPROVED 또는 IN_PROGRESS만 실행 가능
  if (!['APPROVED', 'IN_PROGRESS'].includes(campaign.status)) {
    return NextResponse.json(
      {
        error: `캠페인 상태가 ${campaign.status}입니다. APPROVED 또는 IN_PROGRESS 상태에서만 실행 가능합니다.`,
      },
      { status: 400 }
    );
  }

  // ── 실행 준비 ─────────────────────────────────────────────────
  const baseUrl = getBaseUrl(request);
  const authHeaders: Record<string, string> = {};

  // 인증 헤더 전달 (API Key 방식)
  const apiKey = request.headers.get('X-Api-Key');
  if (apiKey) {
    authHeaders['X-Api-Key'] = apiKey;
    authHeaders['X-Caller-App'] = campaign.callerApp;
  }

  // 캠페인을 IN_PROGRESS로 전환
  if (campaign.status === 'APPROVED') {
    await prisma.campaign.update({
      where: { id },
      data: { status: 'IN_PROGRESS' },
    });
  }

  const results: Array<{
    type: string;
    platform?: string;
    status: string;
    itemId: string;
    result: Record<string, unknown>;
  }> = [];

  let postsCount = campaign.postsCount;
  let cardNewsCount = campaign.cardNewsCount;

  // ── 타입별 실행 로직 ──────────────────────────────────────────

  // SNS_POST 또는 FULL_PACKAGE: 각 플랫폼에 SNS 포스트 발행
  if (campaign.type === 'SNS_POST' || campaign.type === 'FULL_PACKAGE') {
    for (const platform of campaign.platforms) {
      const res = await internalFetch(baseUrl, '/api/social-pulse/publish', 'POST', authHeaders, {
        clientSlug: campaign.clientSlug,
        platform,
        content: `[${campaign.title}] ${campaign.description ?? ''}`.trim(),
      });

      const item = await prisma.campaignItem.create({
        data: {
          campaignId: id,
          type: 'SNS_POST',
          platform,
          postId: res.ok ? (res.data.postId as string) ?? null : null,
          status: res.ok ? 'COMPLETED' : 'FAILED',
          result: JSON.parse(JSON.stringify(res.data)),
        },
      });

      if (res.ok) postsCount++;

      results.push({
        type: 'SNS_POST',
        platform,
        status: res.ok ? 'COMPLETED' : 'FAILED',
        itemId: item.id,
        result: JSON.parse(JSON.stringify(res.data)),
      });
    }
  }

  // CARD_NEWS 또는 FULL_PACKAGE: 카드뉴스 생성
  if (campaign.type === 'CARD_NEWS' || campaign.type === 'FULL_PACKAGE') {
    const res = await internalFetch(baseUrl, '/api/card-news', 'POST', authHeaders, {
      title: campaign.title,
      topic: campaign.description ?? campaign.title,
      clientSlug: campaign.clientSlug,
      templateType: 'SERVICE_INTRO',
    });

    const item = await prisma.campaignItem.create({
      data: {
        campaignId: id,
        type: 'CARD_NEWS',
        cardNewsId: res.ok ? (res.data.id as string) ?? null : null,
        status: res.ok ? 'COMPLETED' : 'FAILED',
        result: JSON.parse(JSON.stringify(res.data)),
      },
    });

    if (res.ok) cardNewsCount++;

    results.push({
      type: 'CARD_NEWS',
      status: res.ok ? 'COMPLETED' : 'FAILED',
      itemId: item.id,
      result: JSON.parse(JSON.stringify(res.data)),
    });
  }

  // AI_COPY 또는 FULL_PACKAGE: AI 카피 생성
  if (campaign.type === 'AI_COPY' || campaign.type === 'FULL_PACKAGE') {
    for (const platform of campaign.platforms) {
      const res = await internalFetch(
        baseUrl,
        '/api/social-pulse/generate-copy',
        'POST',
        authHeaders,
        {
          clientSlug: campaign.clientSlug,
          platform,
          topic: campaign.title,
          description: campaign.description,
        }
      );

      const item = await prisma.campaignItem.create({
        data: {
          campaignId: id,
          type: 'AI_COPY',
          platform,
          status: res.ok ? 'COMPLETED' : 'FAILED',
          result: JSON.parse(JSON.stringify(res.data)),
        },
      });

      results.push({
        type: 'AI_COPY',
        platform,
        status: res.ok ? 'COMPLETED' : 'FAILED',
        itemId: item.id,
        result: JSON.parse(JSON.stringify(res.data)),
      });
    }
  }

  // ── 캠페인 결과 업데이트 ──────────────────────────────────────
  const allCompleted = results.every((r) => r.status === 'COMPLETED');
  const anyFailed = results.some((r) => r.status === 'FAILED');

  const updatedCampaign = await prisma.campaign.update({
    where: { id },
    data: {
      postsCount,
      cardNewsCount,
      // 전부 성공이면 COMPLETED, 일부 실패라도 IN_PROGRESS 유지
      status: allCompleted ? 'COMPLETED' : 'IN_PROGRESS',
      ...(allCompleted ? { completedAt: new Date() } : {}),
    },
    include: { items: true },
  });

  return NextResponse.json({
    success: true,
    campaign: updatedCampaign,
    execution: {
      totalActions: results.length,
      completed: results.filter((r) => r.status === 'COMPLETED').length,
      failed: results.filter((r) => r.status === 'FAILED').length,
      hasFailures: anyFailed,
      results,
    },
  });
}
