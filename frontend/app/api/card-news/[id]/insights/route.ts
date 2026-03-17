/**
 * Card News Insights API
 * GET /api/card-news/[id]/insights — 발행된 카드뉴스의 SNS 성과 조회
 *
 * Facebook Insights API 연동:
 *   - post_impressions, post_impressions_unique (도달)
 *   - post_reactions_like_total, post_shares (참여)
 *   - post_clicks (클릭)
 *
 * GEMINI_API_KEY 없거나 Mock 모드면 시뮬레이션 데이터 반환
 */
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { resolveAuth } from '@/lib/api-auth';
import { decryptToken } from '@/lib/crypto';

interface InsightsResponse {
  reach: number;
  impressions: number;
  likes: number;
  shares: number;
  comments: number;
  clicks: number;
  engagement_rate: number;
  fetched_at: string;
  source: 'facebook_api' | 'mock';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await resolveAuth(request);
  if (auth.type === 'unauthorized') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // 카드뉴스 조회
  const cardNews = await prisma.cardNews.findUnique({
    where: { id },
    include: { channel: true },
  });

  if (!cardNews) {
    return NextResponse.json({ error: '카드뉴스를 찾을 수 없습니다.' }, { status: 404 });
  }

  if (cardNews.status !== 'PUBLISHED' || !cardNews.postId) {
    return NextResponse.json({ error: '아직 발행되지 않은 카드뉴스입니다.' }, { status: 400 });
  }

  // SocialPost에서 externalPostId 가져오기
  const socialPost = await prisma.socialPost.findUnique({
    where: { id: cardNews.postId },
  });

  if (!socialPost?.externalPostId) {
    return NextResponse.json(generateMockInsights());
  }

  // Facebook Insights API 호출 시도
  if (cardNews.channel && socialPost.platform === 'FACEBOOK') {
    try {
      const accessToken = decryptToken(cardNews.channel.accessToken);
      const insights = await fetchFacebookInsights(socialPost.externalPostId, accessToken);
      if (insights) {
        return NextResponse.json(insights);
      }
    } catch (error) {
      console.error('Facebook Insights API error:', error);
    }
  }

  // Fallback: Mock 데이터
  return NextResponse.json(generateMockInsights());
}

async function fetchFacebookInsights(
  postId: string,
  accessToken: string
): Promise<InsightsResponse | null> {
  const metrics = [
    'post_impressions',
    'post_impressions_unique',
    'post_reactions_like_total',
    'post_clicks',
  ].join(',');

  const url = `https://graph.facebook.com/v21.0/${postId}/insights?metric=${metrics}&access_token=${accessToken}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;

    const data = await res.json();
    const metricsData = data.data ?? [];

    const getValue = (name: string): number => {
      const metric = metricsData.find((m: { name: string }) => m.name === name);
      return metric?.values?.[0]?.value ?? 0;
    };

    const impressions = getValue('post_impressions');
    const reach = getValue('post_impressions_unique');
    const likes = getValue('post_reactions_like_total');
    const clicks = getValue('post_clicks');

    // shares와 comments는 post object에서 가져옴
    const postRes = await fetch(
      `https://graph.facebook.com/v21.0/${postId}?fields=shares,comments.summary(true)&access_token=${accessToken}`
    );
    let shares = 0;
    let comments = 0;
    if (postRes.ok) {
      const postData = await postRes.json();
      shares = postData.shares?.count ?? 0;
      comments = postData.comments?.summary?.total_count ?? 0;
    }

    const totalEngagement = likes + shares + comments + clicks;
    const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

    return {
      reach,
      impressions,
      likes,
      shares,
      comments,
      clicks,
      engagement_rate: Math.round(engagementRate * 10) / 10,
      fetched_at: new Date().toISOString(),
      source: 'facebook_api',
    };
  } catch {
    return null;
  }
}

function generateMockInsights(): InsightsResponse {
  const reach = Math.floor(Math.random() * 5000) + 500;
  const impressions = Math.floor(reach * (1.5 + Math.random()));
  const likes = Math.floor(reach * (0.02 + Math.random() * 0.08));
  const shares = Math.floor(likes * (0.1 + Math.random() * 0.3));
  const comments = Math.floor(likes * (0.05 + Math.random() * 0.15));
  const clicks = Math.floor(reach * (0.01 + Math.random() * 0.05));
  const totalEngagement = likes + shares + comments + clicks;
  const engagementRate = reach > 0 ? (totalEngagement / reach) * 100 : 0;

  return {
    reach,
    impressions,
    likes,
    shares,
    comments,
    clicks,
    engagement_rate: Math.round(engagementRate * 10) / 10,
    fetched_at: new Date().toISOString(),
    source: 'mock',
  };
}
