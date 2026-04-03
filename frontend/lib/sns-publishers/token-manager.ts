/**
 * OAuth Token Manager — 자동 갱신 유틸리티
 *
 * YouTube (Google OAuth 2.0): access_token 1시간 유효 → refresh_token으로 갱신
 * TikTok: access_token 24시간 유효 → refresh_token으로 갱신
 * Meta (FB/IG/Threads): Long-Lived Token 60일 → 갱신 API 호출
 * X (Twitter): Bearer Token 만료 없음 → 갱신 불필요
 */

import { prisma } from '@/lib/prisma';

// ─── Google (YouTube) ──────────────────────────────────────────

const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';

export async function refreshGoogleToken(channelId: string): Promise<string> {
  const channel = await prisma.snsChannel.findUnique({ where: { id: channelId } });
  if (!channel) throw new Error(`채널을 찾을 수 없습니다: ${channelId}`);

  const metadata = channel.metadata as { refreshToken?: string } | null;
  const refreshToken = metadata?.refreshToken;
  if (!refreshToken) throw new Error('Refresh Token이 없습니다. YouTube OAuth 재인증 필요.');

  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID ?? '',
      client_secret: process.env.GOOGLE_CLIENT_SECRET ?? '',
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(`Google Token 갱신 실패: ${data.error_description ?? data.error}`);

  // DB에 새 토큰 저장
  await prisma.snsChannel.update({
    where: { id: channelId },
    data: {
      accessToken: data.access_token,
      tokenExpiresAt: new Date(Date.now() + (data.expires_in ?? 3600) * 1000),
    },
  });

  return data.access_token;
}

// ─── TikTok ────────────────────────────────────────────────────

const TIKTOK_TOKEN_URL = 'https://open.tiktokapis.com/v2/oauth/token/';

export async function refreshTikTokToken(channelId: string): Promise<string> {
  const channel = await prisma.snsChannel.findUnique({ where: { id: channelId } });
  if (!channel) throw new Error(`채널을 찾을 수 없습니다: ${channelId}`);

  const metadata = channel.metadata as { refreshToken?: string; clientKey?: string; clientSecret?: string } | null;
  const refreshToken = metadata?.refreshToken;
  if (!refreshToken) throw new Error('Refresh Token이 없습니다. TikTok OAuth 재인증 필요.');

  const res = await fetch(TIKTOK_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: metadata?.clientKey ?? process.env.TIKTOK_CLIENT_KEY ?? '',
      client_secret: metadata?.clientSecret ?? process.env.TIKTOK_CLIENT_SECRET ?? '',
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }),
  });

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`TikTok Token 갱신 실패: ${data.error_description ?? data.error}`);

  await prisma.snsChannel.update({
    where: { id: channelId },
    data: {
      accessToken: data.access_token,
      tokenExpiresAt: new Date(Date.now() + (data.expires_in ?? 86400) * 1000),
      metadata: {
        ...(channel.metadata as Record<string, unknown> ?? {}),
        refreshToken: data.refresh_token ?? refreshToken,
      },
    },
  });

  return data.access_token;
}

// ─── Meta (Facebook / Instagram / Threads) ─────────────────────

const META_TOKEN_URL = 'https://graph.facebook.com/v21.0/oauth/access_token';

export async function refreshMetaToken(channelId: string): Promise<string> {
  const channel = await prisma.snsChannel.findUnique({ where: { id: channelId } });
  if (!channel) throw new Error(`채널을 찾을 수 없습니다: ${channelId}`);

  // Meta Long-Lived Token 갱신 (60일 → 60일 연장)
  const res = await fetch(
    `${META_TOKEN_URL}?grant_type=fb_exchange_token&client_id=${process.env.META_APP_ID ?? ''}&client_secret=${process.env.META_APP_SECRET ?? ''}&fb_exchange_token=${channel.accessToken}`
  );

  const data = await res.json();
  if (!res.ok || data.error) throw new Error(`Meta Token 갱신 실패: ${data.error?.message ?? 'Unknown error'}`);

  await prisma.snsChannel.update({
    where: { id: channelId },
    data: {
      accessToken: data.access_token,
      tokenExpiresAt: new Date(Date.now() + (data.expires_in ?? 5184000) * 1000),
    },
  });

  return data.access_token;
}

// ─── 통합 토큰 검증 + 자동 갱신 ────────────────────────────────

/**
 * 발행 전 토큰 유효성 확인 + 만료 임박 시 자동 갱신
 * @returns 유효한 accessToken
 */
export async function ensureValidToken(channelId: string): Promise<string> {
  const channel = await prisma.snsChannel.findUnique({ where: { id: channelId } });
  if (!channel) throw new Error(`채널을 찾을 수 없습니다: ${channelId}`);

  // 토큰 만료 1시간 전에 미리 갱신
  const bufferMs = 60 * 60 * 1000;
  const isExpiringSoon = channel.tokenExpiresAt && channel.tokenExpiresAt.getTime() < Date.now() + bufferMs;

  if (!isExpiringSoon) {
    return channel.accessToken;
  }

  console.log(`[TokenManager] 토큰 갱신 중: ${channel.platform} / ${channel.channelName}`);

  switch (channel.platform) {
    case 'FACEBOOK':
    case 'INSTAGRAM':
    case 'THREADS':
      return refreshMetaToken(channelId);
    case 'YOUTUBE':
      return refreshGoogleToken(channelId);
    case 'TIKTOK':
      return refreshTikTokToken(channelId);
    case 'X':
      // X Bearer Token은 만료 없음
      return channel.accessToken;
    default:
      return channel.accessToken;
  }
}
