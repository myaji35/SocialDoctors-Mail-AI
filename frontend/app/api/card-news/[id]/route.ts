/**
 * Card News Detail API
 * GET    /api/card-news/[id] — 상세 조회
 * PUT    /api/card-news/[id] — 수정
 * DELETE /api/card-news/[id] — 삭제
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
  const cardNews = await prisma.cardNews.findUnique({
    where: { id },
    include: {
      slides: { orderBy: { slideOrder: 'asc' } },
      channel: true,
    },
  });

  if (!cardNews) {
    return NextResponse.json({ error: '카드뉴스를 찾을 수 없습니다.' }, { status: 404 });
  }

  return NextResponse.json(cardNews);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { title, brandColor, subColor, logoUrl, channelId, slides } = body as {
    title?: string;
    brandColor?: string;
    subColor?: string;
    logoUrl?: string;
    channelId?: string;
    slides?: { id: string; headline?: string; bodyText?: string; keyPoints?: string[]; bgColor?: string }[];
  };

  // 카드뉴스 기본 정보 업데이트
  const updateData: Record<string, unknown> = {};
  if (title !== undefined) updateData.title = title;
  if (brandColor !== undefined) updateData.brandColor = brandColor;
  if (subColor !== undefined) updateData.subColor = subColor;
  if (logoUrl !== undefined) updateData.logoUrl = logoUrl;
  if (channelId !== undefined) updateData.channelId = channelId;

  const cardNews = await prisma.cardNews.update({
    where: { id },
    data: updateData,
  });

  // 슬라이드 개별 업데이트
  if (slides && slides.length > 0) {
    await Promise.all(
      slides.map((slide) => {
        const slideData: Record<string, unknown> = {};
        if (slide.headline !== undefined) slideData.headline = slide.headline;
        if (slide.bodyText !== undefined) slideData.bodyText = slide.bodyText;
        if (slide.keyPoints !== undefined) slideData.keyPoints = slide.keyPoints;
        if (slide.bgColor !== undefined) slideData.bgColor = slide.bgColor;
        return prisma.cardSlide.update({ where: { id: slide.id }, data: slideData });
      })
    );
  }

  // 업데이트된 전체 반환
  const updated = await prisma.cardNews.findUnique({
    where: { id: cardNews.id },
    include: { slides: { orderBy: { slideOrder: 'asc' } }, channel: true },
  });

  return NextResponse.json(updated);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Cascade delete (CardSlide도 함께 삭제됨)
  await prisma.cardNews.delete({ where: { id } });

  return new NextResponse(null, { status: 204 });
}
