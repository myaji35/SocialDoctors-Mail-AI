/**
 * 발행 상태 조회 API
 *
 * 외부 서비스가 비동기 발행 후 상태를 확인할 때 사용
 *
 * GET /api/social-pulse/publish/status?postId=xxx
 * GET /api/social-pulse/publish/status?callerApp=0025_ceo&limit=10
 * GET /api/social-pulse/publish/status?clientSlug=townin&platform=FACEBOOK&limit=5
 *
 * 인증: X-Api-Key 또는 세션
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';

export async function GET(request: NextRequest) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const postId = searchParams.get('postId');
  const callerApp = searchParams.get('callerApp');
  const clientSlug = searchParams.get('clientSlug');
  const platform = searchParams.get('platform');
  const limit = Math.min(Number(searchParams.get('limit') ?? '10'), 100);

  // 단일 포스트 조회
  if (postId) {
    const post = await prisma.socialPost.findUnique({
      where: { id: postId },
      select: {
        id: true,
        status: true,
        platform: true,
        publishedAt: true,
        scheduledAt: true,
        externalPostId: true,
        publishedResult: true,
        callerApp: true,
        createdAt: true,
        channel: {
          select: { channelName: true, clientName: true, clientSlug: true },
        },
      },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ post });
  }

  // 목록 조회
  const where: Record<string, unknown> = {};
  if (callerApp) where.callerApp = callerApp;
  if (clientSlug) {
    where.channel = { clientSlug };
  }
  if (platform) where.platform = platform;

  const posts = await prisma.socialPost.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: limit,
    select: {
      id: true,
      status: true,
      platform: true,
      content: true,
      publishedAt: true,
      scheduledAt: true,
      externalPostId: true,
      callerApp: true,
      createdAt: true,
      channel: {
        select: { channelName: true, clientName: true, clientSlug: true },
      },
    },
  });

  return NextResponse.json({ posts, count: posts.length });
}
