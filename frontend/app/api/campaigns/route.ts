/**
 * Campaign CRUD API
 *
 * GET  — 캠페인 목록 조회 (callerApp, status, clientSlug 필터)
 * POST — 새 캠페인 요청 생성
 *
 * 인증:
 *   - X-Api-Key: 외부 서비스 (callerApp별 필터링)
 *   - NextAuth 세션: 관리자 (전체 조회)
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  // ── 인증 ──────────────────────────────────────────────────────
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = request.nextUrl;
  const status = searchParams.get('status');
  const clientSlug = searchParams.get('clientSlug');
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  // API Key 인증: 해당 callerApp의 캠페인만 조회 가능
  const where: Record<string, unknown> = {};
  if (auth.type === 'apikey') {
    where.callerApp = auth.callerApp;
  }
  if (status) {
    where.status = status;
  }
  if (clientSlug) {
    where.clientSlug = clientSlug;
  }

  const [campaigns, total] = await Promise.all([
    prisma.campaign.findMany({
      where,
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.campaign.count({ where }),
  ]);

  return NextResponse.json({ campaigns, total, limit, offset });
}

export async function POST(request: NextRequest) {
  // ── 인증 (API Key 필수) ───────────────────────────────────────
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (auth.type !== 'apikey') {
    return NextResponse.json(
      { error: '캠페인 생성은 X-Api-Key 인증이 필요합니다.' },
      { status: 403 }
    );
  }

  // ── 요청 파싱 ─────────────────────────────────────────────────
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: '유효한 JSON 요청이 필요합니다.' }, { status: 400 });
  }

  const { title, description, type, clientName, clientSlug, platforms, budget } = body as {
    title?: string;
    description?: string;
    type?: string;
    clientName?: string;
    clientSlug?: string;
    platforms?: string[];
    budget?: number;
  };

  // ── 필수 필드 검증 ────────────────────────────────────────────
  if (!title?.trim()) {
    return NextResponse.json({ error: 'title은 필수입니다.' }, { status: 400 });
  }
  if (!type) {
    return NextResponse.json({ error: 'type은 필수입니다.' }, { status: 400 });
  }
  const validTypes = ['SNS_POST', 'CARD_NEWS', 'AI_COPY', 'FULL_PACKAGE'];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `type은 ${validTypes.join(', ')} 중 하나여야 합니다.` },
      { status: 400 }
    );
  }
  if (!clientName?.trim()) {
    return NextResponse.json({ error: 'clientName은 필수입니다.' }, { status: 400 });
  }
  if (!clientSlug?.trim()) {
    return NextResponse.json({ error: 'clientSlug은 필수입니다.' }, { status: 400 });
  }
  if (!platforms || !Array.isArray(platforms) || platforms.length === 0) {
    return NextResponse.json({ error: 'platforms 배열은 필수입니다.' }, { status: 400 });
  }

  // ── 캠페인 생성 (상태: REQUESTED) ─────────────────────────────
  const campaign = await prisma.campaign.create({
    data: {
      callerApp: auth.callerApp,
      clientName: clientName.trim(),
      clientSlug: clientSlug.trim(),
      type: type as 'SNS_POST' | 'CARD_NEWS' | 'AI_COPY' | 'FULL_PACKAGE',
      status: 'REQUESTED',
      title: title.trim(),
      description: description?.trim() ?? null,
      budget: budget ?? 0,
      platforms,
      requestedAt: new Date(),
    },
  });

  return NextResponse.json(
    {
      success: true,
      campaign,
      message: `캠페인 '${campaign.title}'이 요청되었습니다. 승인 후 실행 가능합니다.`,
    },
    { status: 201 }
  );
}
