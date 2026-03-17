/**
 * Card News Duplicate API
 * POST /api/card-news/[id]/duplicate — 카드뉴스 복제
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const original = await prisma.cardNews.findUnique({
    where: { id },
    include: { slides: { orderBy: { slideOrder: 'asc' } } },
  });

  if (!original) {
    return NextResponse.json({ error: '카드뉴스를 찾을 수 없습니다.' }, { status: 404 });
  }

  const duplicate = await prisma.cardNews.create({
    data: {
      title: `${original.title} (복제)`,
      topic: original.topic,
      templateType: original.templateType,
      slideCount: original.slideCount,
      status: 'DRAFT',
      brandColor: original.brandColor,
      subColor: original.subColor,
      logoUrl: original.logoUrl,
      fontFamily: original.fontFamily,
      createdBy: auth.userId,
      callerApp: auth.callerApp,
      slides: {
        create: original.slides.map((s) => ({
          slideOrder: s.slideOrder,
          role: s.role,
          headline: s.headline,
          bodyText: s.bodyText,
          keyPoints: s.keyPoints,
          bgColor: s.bgColor,
        })),
      },
    },
    include: { slides: { orderBy: { slideOrder: 'asc' } } },
  });

  return NextResponse.json(duplicate, { status: 201 });
}
