/**
 * Card News API - 목록 조회 / 생성
 *
 * GET  /api/card-news          — 카드뉴스 목록 조회
 * POST /api/card-news          — 카드뉴스 생성 (AI 콘텐츠 포함)
 *
 * 인증: 세션(Admin UI) + API Key(외부 서비스) 이중 지원
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';
import { generateSlideContents } from '@/lib/card-news/ai-generator';
import { getTemplate, type TemplateType } from '@/lib/card-news/templates';

export async function GET(request: NextRequest) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const callerApp = searchParams.get('callerApp');
  const limit = parseInt(searchParams.get('limit') ?? '20', 10);
  const offset = parseInt(searchParams.get('offset') ?? '0', 10);

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (callerApp) where.callerApp = callerApp;

  const [items, total, draft, rendered, published] = await Promise.all([
    prisma.cardNews.findMany({
      where,
      include: { slides: { orderBy: { slideOrder: 'asc' } }, channel: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.cardNews.count({ where }),
    prisma.cardNews.count({ where: { ...where, status: 'DRAFT' } }),
    prisma.cardNews.count({ where: { ...where, status: 'RENDERED' } }),
    prisma.cardNews.count({ where: { ...where, status: 'PUBLISHED' } }),
  ]);

  return NextResponse.json({
    items,
    total,
    stats: { draft, rendered, published },
  });
}

export async function POST(request: NextRequest) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const {
    topic,
    templateType = 'SERVICE_INTRO',
    brandColor,
    subColor,
    logoUrl,
    clientSlug,
    slides: preDefinedSlides,
    autoPublish,
    publishTo,
  } = body as {
    topic: string;
    templateType?: TemplateType;
    brandColor?: string;
    subColor?: string;
    logoUrl?: string;
    clientSlug?: string;
    slides?: { headline: string; bodyText?: string; keyPoints?: string[]; role?: string }[];
    autoPublish?: boolean;
    publishTo?: { channelId?: string; clientSlug?: string; platform?: string };
  };

  if (!topic?.trim()) {
    return NextResponse.json({ error: 'topic은 필수입니다.' }, { status: 400 });
  }

  const template = getTemplate(templateType);

  // 사전 정의 콘텐츠가 있으면 AI 생략, 없으면 AI 생성
  let slideContents;
  if (preDefinedSlides && preDefinedSlides.length > 0) {
    slideContents = preDefinedSlides.map((s, i) => ({
      slideOrder: i + 1,
      role: (s.role as string) ?? template.roles[i] ?? 'INFO',
      headline: s.headline,
      bodyText: s.bodyText ?? '',
      keyPoints: s.keyPoints ?? [],
    }));
  } else {
    slideContents = await generateSlideContents(topic, templateType);
  }

  // 클라이언트 슬러그로 채널 자동 연결
  let channelId: string | undefined;
  if (clientSlug) {
    const channel = await prisma.snsChannel.findFirst({
      where: { clientSlug, status: 'ACTIVE' },
      orderBy: { createdAt: 'asc' },
    });
    if (channel) channelId = channel.id;
  }

  // DB 저장
  const cardNews = await prisma.cardNews.create({
    data: {
      title: slideContents[0]?.headline ?? topic,
      topic: topic.trim(),
      templateType,
      slideCount: slideContents.length,
      status: 'DRAFT',
      brandColor,
      subColor,
      logoUrl,
      channelId,
      createdBy: auth.userId,
      callerApp: auth.callerApp,
      slides: {
        create: slideContents.map((s) => ({
          slideOrder: s.slideOrder,
          role: s.role as never,
          headline: s.headline,
          bodyText: s.bodyText,
          keyPoints: s.keyPoints,
        })),
      },
    },
    include: { slides: { orderBy: { slideOrder: 'asc' } } },
  });

  // autoPublish: 생성 → 렌더링 → 발행 자동 처리 (외부 프로젝트 전자동 워크플로우)
  if (autoPublish) {
    const baseUrl = request.nextUrl.origin;
    const renderAndPublishBody: Record<string, unknown> = {};
    if (publishTo?.channelId) renderAndPublishBody.channelId = publishTo.channelId;
    if (publishTo?.clientSlug) renderAndPublishBody.clientSlug = publishTo.clientSlug;
    if (publishTo?.platform) renderAndPublishBody.platform = publishTo.platform;
    if (!publishTo && clientSlug) renderAndPublishBody.clientSlug = clientSlug;

    try {
      const rapRes = await fetch(`${baseUrl}/api/card-news/${cardNews.id}/render-and-publish`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(request.headers.get('X-Api-Key') ? { 'X-Api-Key': request.headers.get('X-Api-Key')! } : {}),
          ...(request.headers.get('X-Caller-App') ? { 'X-Caller-App': request.headers.get('X-Caller-App')! } : {}),
          ...(request.headers.get('cookie') ? { 'cookie': request.headers.get('cookie')! } : {}),
        },
        body: JSON.stringify(renderAndPublishBody),
      });
      const rapData = await rapRes.json();
      return NextResponse.json({ ...rapData, cardNews }, { status: 201 });
    } catch {
      return NextResponse.json({ ...cardNews, autoPublishError: 'render-and-publish failed' }, { status: 201 });
    }
  }

  return NextResponse.json(cardNews, { status: 201 });
}
