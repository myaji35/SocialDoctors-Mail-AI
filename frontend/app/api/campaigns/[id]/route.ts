/**
 * Campaign Detail API
 *
 * GET   — 캠페인 상세 조회 (items 포함)
 * PATCH — 캠페인 상태 변경 (관리자 또는 API Key)
 *
 * 허용 상태 전환:
 *   REQUESTED → APPROVED
 *   APPROVED  → IN_PROGRESS
 *   IN_PROGRESS → COMPLETED
 *   any → CANCELED
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';

// 허용되는 상태 전환 맵
const ALLOWED_TRANSITIONS: Record<string, string[]> = {
  REQUESTED: ['APPROVED', 'CANCELED'],
  APPROVED: ['IN_PROGRESS', 'CANCELED'],
  IN_PROGRESS: ['COMPLETED', 'CANCELED'],
  COMPLETED: ['CANCELED'],
  CANCELED: [],
};

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

  return NextResponse.json({ campaign });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '유효한 JSON 요청이 필요합니다.' }, { status: 400 });
  }

  const { status: newStatus } = body as { status?: string };
  if (!newStatus) {
    return NextResponse.json({ error: 'status 필드가 필요합니다.' }, { status: 400 });
  }

  // ── 캠페인 조회 ───────────────────────────────────────────────
  const campaign = await prisma.campaign.findUnique({ where: { id } });
  if (!campaign) {
    return NextResponse.json({ error: '캠페인을 찾을 수 없습니다.' }, { status: 404 });
  }

  // API Key 인증: 해당 callerApp의 캠페인만 수정 가능
  if (auth.type === 'apikey' && campaign.callerApp !== auth.callerApp) {
    return NextResponse.json({ error: '접근 권한이 없습니다.' }, { status: 403 });
  }

  // ── 상태 전환 검증 ────────────────────────────────────────────
  const allowed = ALLOWED_TRANSITIONS[campaign.status] ?? [];
  if (!allowed.includes(newStatus)) {
    return NextResponse.json(
      {
        error: `상태 전환 불가: ${campaign.status} → ${newStatus}`,
        allowedTransitions: allowed,
      },
      { status: 400 }
    );
  }

  // ── 상태별 타임스탬프 업데이트 ────────────────────────────────
  const updateData: Record<string, unknown> = {
    status: newStatus as 'REQUESTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED',
  };
  if (newStatus === 'APPROVED') {
    updateData.approvedAt = new Date();
  }
  if (newStatus === 'COMPLETED') {
    updateData.completedAt = new Date();
  }

  const updated = await prisma.campaign.update({
    where: { id },
    data: updateData,
    include: { items: true },
  });

  return NextResponse.json({
    success: true,
    campaign: updated,
    message: `캠페인 상태가 ${campaign.status} → ${newStatus}로 변경되었습니다.`,
  });
}
