/**
 * Card News Render-and-Publish API (원스텝)
 * POST /api/card-news/[id]/render-and-publish
 *
 * 외부 프로젝트 연동용: 한 번의 API 호출로 렌더링 → 발행 완료
 */
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';
import { decryptToken } from '@/lib/crypto';
import { renderAllSlides, type SlideData } from '@/lib/card-news/renderer';
import { publishToChannel, SnsPublishError } from '@/lib/sns-publishers';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const {
    channelId,
    clientSlug,
    platform,
    caption,
    mockMode,
  } = body as {
    channelId?: string;
    clientSlug?: string;
    platform?: string;
    caption?: string;
    mockMode?: boolean;
  };

  // 카드뉴스 조회
  const cardNews = await prisma.cardNews.findUnique({
    where: { id },
    include: { slides: { orderBy: { slideOrder: 'asc' } } },
  });

  if (!cardNews) {
    return NextResponse.json({ error: '카드뉴스를 찾을 수 없습니다.' }, { status: 404 });
  }

  // ── Step 1: 렌더링 ──────────────────────────────────
  const startTime = Date.now();

  const slideData: SlideData[] = cardNews.slides.map((s) => ({
    slideOrder: s.slideOrder,
    role: s.role as SlideData['role'],
    headline: s.headline,
    bodyText: s.bodyText,
    keyPoints: s.keyPoints,
    bgColor: s.bgColor,
  }));

  const rendered = await renderAllSlides(slideData, {
    brandColor: cardNews.brandColor ?? undefined,
    subColor: cardNews.subColor ?? undefined,
    logoUrl: cardNews.logoUrl,
  });

  // 이미지 파일 저장
  const imageDir = join(process.cwd(), 'public', 'card-news', id);
  await mkdir(imageDir, { recursive: true });

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? '';
  let firstImageUrl = '';

  await Promise.all(
    rendered.map(async (r) => {
      const filePath = join(imageDir, r.filename);
      await writeFile(filePath, r.buffer);
      const imageUrl = `${baseUrl}/card-news/${id}/${r.filename}`;

      if (r.slideOrder === 1) firstImageUrl = imageUrl;

      await prisma.cardSlide.updateMany({
        where: { cardNewsId: id, slideOrder: r.slideOrder },
        data: { imageUrl },
      });
    })
  );

  await prisma.cardNews.update({
    where: { id },
    data: { status: 'RENDERED' },
  });

  const renderTime = Date.now() - startTime;

  // ── Step 2: 채널 결정 ──────────────────────────────
  const targetChannelId = channelId ?? cardNews.channelId;
  let channel;

  if (targetChannelId) {
    channel = await prisma.snsChannel.findUnique({ where: { id: targetChannelId } });
  } else if (clientSlug) {
    channel = await prisma.snsChannel.findFirst({
      where: {
        clientSlug,
        status: 'ACTIVE',
        ...(platform ? { platform: platform as never } : {}),
      },
      orderBy: { createdAt: 'asc' },
    });
  }

  if (!channel) {
    // 렌더링은 완료했지만 발행 채널이 없는 경우
    return NextResponse.json({
      success: true,
      rendered: true,
      published: false,
      cardNewsId: id,
      status: 'RENDERED',
      renderTime,
      message: '렌더링 완료. 발행할 채널을 찾을 수 없어 발행은 건너뛰었습니다.',
      slides: rendered.map(r => ({
        slideOrder: r.slideOrder,
        imageUrl: `${baseUrl}/card-news/${id}/${r.filename}`,
      })),
    });
  }

  // ── Step 3: 발행 ──────────────────────────────────
  // 모든 렌더링된 이미지 URL 수집 (멀티 이미지 포스팅)
  const allImageUrls = rendered
    .sort((a, b) => a.slideOrder - b.slideOrder)
    .map(r => `${baseUrl}/card-news/${id}/${r.filename}`);
  const postContent = caption ?? `${cardNews.title}\n\n#카드뉴스 #SocialDoctors`;

  const post = await prisma.socialPost.create({
    data: {
      userId: auth.userId,
      platform: channel.platform,
      content: postContent,
      imageUrl: firstImageUrl || undefined,
      status: 'DRAFT',
      channelId: channel.id,
      aiGenerated: true,
      callerApp: auth.callerApp,
    },
  });

  try {
    const isMockMode = !!mockMode || (process.env.NODE_ENV === 'development' && process.env.FORCE_REAL_PUBLISH !== '1');
    const accessToken = isMockMode ? '' : decryptToken(channel.accessToken);

    const result = await publishToChannel(
      channel.platform,
      { pageId: channel.pageId, accessToken },
      { content: postContent, imageUrl: firstImageUrl || undefined, imageUrls: allImageUrls.length > 1 ? allImageUrls : undefined },
      isMockMode
    );

    await prisma.socialPost.update({
      where: { id: post.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        externalPostId: result.id,
        publishedResult: {
          success: true,
          externalId: result.id,
          mockMode: isMockMode,
          cardNewsId: id,
        },
      },
    });

    await prisma.cardNews.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        postId: post.id,
        channelId: channel.id,
        publishedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      rendered: true,
      published: true,
      cardNewsId: id,
      postId: post.id,
      externalPostId: result.id,
      publishedAt: new Date().toISOString(),
      platform: channel.platform,
      channelName: channel.channelName,
      renderTime,
      mockMode: isMockMode,
    });
  } catch (error) {
    const errMsg = error instanceof SnsPublishError ? error.message : String(error);

    await prisma.socialPost.update({
      where: { id: post.id },
      data: {
        status: 'FAILED',
        publishedResult: { success: false, error: errMsg, cardNewsId: id },
      },
    });

    return NextResponse.json(
      {
        success: false,
        rendered: true,
        published: false,
        error: errMsg,
        cardNewsId: id,
        postId: post.id,
        renderTime,
      },
      { status: 500 }
    );
  }
}
