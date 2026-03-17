/**
 * Card News Publish API
 * POST /api/card-news/[id]/publish — 카드뉴스를 SNS에 발행
 *
 * 기존 sns-publishers 라이브러리를 활용하여 멀티 이미지 포스팅
 * 렌더링 안 된 경우 자동 렌더링 후 발행
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';
import { decryptToken } from '@/lib/crypto';
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
    scheduledAt,
    mockMode,
  } = body as {
    channelId?: string;
    clientSlug?: string;
    platform?: string;
    caption?: string;
    scheduledAt?: string;
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

  // 렌더링 체크 — DRAFT이면 먼저 렌더링 필요
  if (cardNews.status === 'DRAFT') {
    return NextResponse.json(
      { error: '이미지 렌더링이 필요합니다. POST /api/card-news/[id]/render를 먼저 호출하세요.' },
      { status: 400 }
    );
  }

  // 채널 결정 (카드뉴스에 이미 연결된 채널 or 요청에서 지정)
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
    return NextResponse.json(
      { error: '발행할 채널을 찾을 수 없습니다. channelId 또는 clientSlug를 지정하세요.' },
      { status: 400 }
    );
  }

  // 발행 콘텐츠 준비 — 모든 슬라이드 이미지 수집 (멀티 이미지 포스팅)
  const allImageUrls = cardNews.slides
    .filter((s) => s.imageUrl)
    .sort((a, b) => a.slideOrder - b.slideOrder)
    .map((s) => s.imageUrl!);
  const firstImageUrl = allImageUrls[0] ?? undefined;
  const postContent = caption ?? `${cardNews.title}\n\n${cardNews.slides.map(s => s.headline).join(' | ')}\n\n#카드뉴스 #SocialDoctors`;

  // 예약 발행
  if (scheduledAt) {
    const post = await prisma.socialPost.create({
      data: {
        userId: auth.userId,
        platform: channel.platform,
        content: postContent,
        imageUrl: firstImageUrl,
        scheduledAt: new Date(scheduledAt),
        status: 'SCHEDULED',
        channelId: channel.id,
        aiGenerated: true,
        callerApp: auth.callerApp,
      },
    });

    await prisma.cardNews.update({
      where: { id },
      data: { postId: post.id, channelId: channel.id },
    });

    return NextResponse.json({
      success: true,
      scheduled: true,
      postId: post.id,
      cardNewsId: id,
      scheduledAt: post.scheduledAt,
    });
  }

  // 즉시 발행
  const post = await prisma.socialPost.create({
    data: {
      userId: auth.userId,
      platform: channel.platform,
      content: postContent,
      imageUrl: firstImageUrl,
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
      { content: postContent, imageUrl: firstImageUrl, imageUrls: allImageUrls.length > 1 ? allImageUrls : undefined },
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
          callerApp: auth.callerApp,
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
      postId: post.id,
      cardNewsId: id,
      externalPostId: result.id,
      publishedAt: new Date().toISOString(),
      platform: channel.platform,
      channelName: channel.channelName,
      clientSlug: channel.clientSlug,
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

    await prisma.cardNews.update({
      where: { id },
      data: { status: 'FAILED' },
    });

    return NextResponse.json(
      { success: false, error: errMsg, postId: post.id, cardNewsId: id },
      { status: 500 }
    );
  }
}
