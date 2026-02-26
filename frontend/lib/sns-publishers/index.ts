/**
 * SNS Publishers - Unified Platform Router
 * Supports: FACEBOOK, INSTAGRAM, THREADS, TIKTOK, X
 */
import { publishToFacebook } from './facebook';
import { publishToInstagram } from './instagram';
import { publishToThreads } from './threads';
import { publishToTikTok } from './tiktok';
import { publishToX } from './twitter';
import { mockPublish } from './mock';
import { ChannelCredentials, PublishPayload, PublishResult, SnsPublishError } from './types';

export type { ChannelCredentials, PublishPayload, PublishResult };
export { SnsPublishError };

// Platform content constraints
export const PLATFORM_LIMITS = {
  FACEBOOK:  { maxChars: 63206, requiresMedia: false, mediaTypes: ['image', 'video'] },
  INSTAGRAM: { maxChars: 2200,  requiresMedia: true,  mediaTypes: ['image', 'video'] },
  THREADS:   { maxChars: 500,   requiresMedia: false, mediaTypes: ['image'] },
  TIKTOK:    { maxChars: 2200,  requiresMedia: true,  mediaTypes: ['image', 'video'] },
  X:         { maxChars: 280,   requiresMedia: false, mediaTypes: ['image', 'video'] },
  YOUTUBE:   { maxChars: 5000,  requiresMedia: true,  mediaTypes: ['video'] },
} as const;

export async function publishToChannel(
  platform: string,
  credentials: ChannelCredentials,
  payload: PublishPayload,
  isMockMode = false
): Promise<PublishResult> {
  if (isMockMode) {
    return mockPublish(platform, payload);
  }

  switch (platform) {
    case 'FACEBOOK':
      return publishToFacebook(credentials, payload);
    case 'INSTAGRAM':
      return publishToInstagram(credentials, payload);
    case 'THREADS':
      return publishToThreads(credentials, payload);
    case 'TIKTOK':
      return publishToTikTok(credentials, payload);
    case 'X':
      return publishToX(credentials, payload);
    default:
      throw new SnsPublishError(`지원하지 않는 플랫폼: ${platform}`, platform, 'UNSUPPORTED_PLATFORM');
  }
}
