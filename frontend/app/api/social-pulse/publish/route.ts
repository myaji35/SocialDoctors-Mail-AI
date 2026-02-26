/**
 * SNS Publish API
 *
 * 인증 방식 (둘 다 지원):
 *   - 세션 인증: 웹 UI (NextAuth)
 *   - API Key 인증: 외부 서비스 (X-Api-Key 헤더)
 *
 * 채널 지정 방식 (셋 중 하나):
 *   1. channelId: 채널 ID 직접 지정 (가장 명시적)
 *   2. clientSlug + platform: 클라이언트 슬러그 + 플랫폼으로 조회
 *   3. clientSlug만: 해당 클라이언트의 활성 채널 중 첫 번째
 *
 * 외부 서비스 호출 예시 (0025_CEO, Townin 등):
 *   POST /api/social-pulse/publish
 *   Headers:
 *     X-Api-Key: {SOCIAL_PULSE_API_KEY}
 *     X-Caller-App: 0025_ceo          ← 호출한 서비스 식별 (선택)
 *   Body:
 *     { "clientSlug": "townin", "platform": "FACEBOOK", "content": "..." }
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { decryptToken } from '@/lib/crypto';
import { resolveAuth } from '@/lib/api-auth';
import { publishToChannel, SnsPublishError } from '@/lib/sns-publishers';

export async function POST(request: NextRequest) {
  // ── 인증 ──────────────────────────────────────────────────────
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { userId, callerApp } = auth;

  // ── 요청 파싱 ─────────────────────────────────────────────────
  const body = await request.json();
  const {
    channelId,
    clientSlug,
    platform,
    content,
    imageUrl,
    videoUrl,
    link,
    scheduledAt,
    mockMode,
  } = body as {
    channelId?: string;           // 방법 1: 채널 ID 직접 지정
    clientSlug?: string;          // 방법 2/3: 클라이언트 슬러그
    platform?: string;            // 방법 2: 플랫폼 지정
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    link?: string;
    scheduledAt?: string;
    mockMode?: boolean;
  };

  if (!content?.trim()) {
    return NextResponse.json({ error: 'content는 필수입니다.' }, { status: 400 });
  }
  if (!channelId && !clientSlug) {
    return NextResponse.json(
      { error: 'channelId 또는 clientSlug 중 하나가 필요합니다.' },
      { status: 400 }
    );
  }

  // ── 채널 조회 ─────────────────────────────────────────────────
  let channel;

  if (channelId) {
    // 방법 1: channelId 직접 지정
    channel = await prisma.snsChannel.findUnique({ where: { id: channelId } });
  } else {
    // 방법 2/3: clientSlug + (platform 선택)
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
    const detail = channelId
      ? `채널 ID '${channelId}'를 찾을 수 없습니다.`
      : platform
      ? `'${clientSlug}'의 ${platform} 채널을 찾을 수 없습니다.`
      : `'${clientSlug}'의 활성 채널을 찾을 수 없습니다.`;
    return NextResponse.json({ error: detail }, { status: 404 });
  }

  if (channel.status !== 'ACTIVE') {
    return NextResponse.json(
      { error: `채널 '${channel.channelName}'이 비활성 상태입니다.` },
      { status: 400 }
    );
  }

  // ── 예약 발행 ─────────────────────────────────────────────────
  if (scheduledAt) {
    const post = await prisma.socialPost.create({
      data: {
        userId,
        platform: channel.platform,
        content: content.trim(),
        imageUrl,
        videoUrl,
        scheduledAt: new Date(scheduledAt),
        status: 'SCHEDULED',
        channelId: channel.id,
        aiGenerated: false,
        callerApp,
      },
    });
    return NextResponse.json({
      success: true,
      scheduled: true,
      postId: post.id,
      scheduledAt: post.scheduledAt,
      platform: channel.platform,
      channelName: channel.channelName,
      clientSlug: channel.clientSlug,
    });
  }

  // ── 즉시 발행: DRAFT로 먼저 저장 ────────────────────────────
  const post = await prisma.socialPost.create({
    data: {
      userId,
      platform: channel.platform,
      content: content.trim(),
      imageUrl,
      videoUrl,
      status: 'DRAFT',
      channelId: channel.id,
      aiGenerated: false,
      callerApp,
    },
  });

  try {
    const isMockMode = !!mockMode || (process.env.NODE_ENV === 'development' && process.env.FORCE_REAL_PUBLISH !== '1');
    const accessToken = isMockMode ? '' : decryptToken(channel.accessToken);

    const result = await publishToChannel(
      channel.platform,
      { pageId: channel.pageId, accessToken },
      { content: content.trim(), imageUrl, videoUrl, link },
      isMockMode
    );

    const updatedPost = await prisma.socialPost.update({
      where: { id: post.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        externalPostId: result.id,
        publishedResult: {
          success: true,
          externalId: result.id,
          mockMode: isMockMode,
          callerApp,
        },
      },
    });

    return NextResponse.json({
      success: true,
      postId: updatedPost.id,
      externalPostId: result.id,
      publishedAt: updatedPost.publishedAt,
      platform: channel.platform,
      channelName: channel.channelName,
      clientSlug: channel.clientSlug,
      callerApp,
      mockMode: isMockMode,
    });
  } catch (error) {
    const errMsg = error instanceof SnsPublishError ? error.message : String(error);
    const errCode = error instanceof SnsPublishError ? `SNS_${error.code}` : 'PUBLISH_ERROR';

    await prisma.socialPost.update({
      where: { id: post.id },
      data: {
        status: 'FAILED',
        publishedResult: { success: false, error: errMsg, errorCode: errCode, callerApp },
      },
    });

    return NextResponse.json(
      { success: false, error: errMsg, errorCode: errCode, postId: post.id },
      { status: 500 }
    );
  }
}
