/**
 * Card News Render API
 * POST /api/card-news/[id]/render — 슬라이드 이미지 렌더링
 *
 * 각 슬라이드를 SVG → PNG/JPEG로 변환하여 저장
 */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';
import { renderAllSlides, type SlideData } from '@/lib/card-news/renderer';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // 카드뉴스 + 슬라이드 조회
  const cardNews = await prisma.cardNews.findUnique({
    where: { id },
    include: { slides: { orderBy: { slideOrder: 'asc' } } },
  });

  if (!cardNews) {
    return NextResponse.json({ error: '카드뉴스를 찾을 수 없습니다.' }, { status: 404 });
  }

  // 요청 바디에서 옵션 파싱
  let options: { format?: 'png' | 'jpeg'; quality?: number; width?: number; height?: number } = {};
  try {
    const body = await request.json();
    options = body;
  } catch {
    // body 없으면 기본값 사용
  }

  const startTime = Date.now();

  // 슬라이드 데이터 변환
  const slideData: SlideData[] = cardNews.slides.map((s) => ({
    slideOrder: s.slideOrder,
    role: s.role as SlideData['role'],
    headline: s.headline,
    bodyText: s.bodyText,
    keyPoints: s.keyPoints,
    bgColor: s.bgColor,
  }));

  // 렌더링
  const rendered = await renderAllSlides(slideData, {
    brandColor: cardNews.brandColor ?? undefined,
    subColor: cardNews.subColor ?? undefined,
    logoUrl: cardNews.logoUrl,
    ...options,
  });

  // 이미지 파일 저장
  const imageDir = join(process.cwd(), 'public', 'card-news', id);
  await mkdir(imageDir, { recursive: true });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  const slideResults = await Promise.all(
    rendered.map(async (r) => {
      const filePath = join(imageDir, r.filename);
      await writeFile(filePath, r.buffer);
      const imageUrl = `${baseUrl}/card-news/${id}/${r.filename}`;

      // DB 업데이트
      await prisma.cardSlide.updateMany({
        where: { cardNewsId: id, slideOrder: r.slideOrder },
        data: { imageUrl },
      });

      return { slideOrder: r.slideOrder, imageUrl };
    })
  );

  // 카드뉴스 상태 업데이트
  await prisma.cardNews.update({
    where: { id },
    data: { status: 'RENDERED' },
  });

  const renderTime = Date.now() - startTime;

  return NextResponse.json({
    id,
    status: 'RENDERED',
    slides: slideResults,
    renderTime,
  });
}
