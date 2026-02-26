/**
 * TikTok Content Posting API v2
 * Required scopes: video.publish, video.upload
 * Note: TikTok does NOT support text-only posts — image or video is required
 * Flow: Direct Post (provide video URL → TikTok downloads and publishes)
 * Credential: OAuth 2.0 PKCE access_token (stored in pageId = creator_id)
 * Docs: https://developers.tiktok.com/doc/content-posting-api-get-started
 */
import { ChannelCredentials, PublishPayload, PublishResult, SnsPublishError } from './types';

const TIKTOK_API_BASE = 'https://open.tiktokapis.com/v2';

export async function publishToTikTok(
  credentials: ChannelCredentials,
  payload: PublishPayload
): Promise<PublishResult> {
  const { accessToken } = credentials;
  const { content, videoUrl, imageUrl } = payload;

  if (!videoUrl && !imageUrl) {
    throw new SnsPublishError(
      'TikTok은 이미지 또는 영상이 필수입니다. (텍스트 전용 포스팅 불가)',
      'TIKTOK',
      'MEDIA_REQUIRED'
    );
  }

  // TikTok: 2,200자 제한
  if (content.length > 2200) {
    throw new SnsPublishError(
      `TikTok은 최대 2,200자까지 지원합니다. (현재: ${content.length}자)`,
      'TIKTOK',
      'CONTENT_TOO_LONG'
    );
  }

  // Initialize Upload (Direct Post)
  const initBody = {
    post_info: {
      title: content.slice(0, 150), // TikTok title: max 150 chars
      description: content,
      disable_comment: false,
      disable_duet: false,
      disable_stitch: false,
    },
    source_info: {
      source: 'PULL_FROM_URL',
      video_url: videoUrl ?? imageUrl,
    },
  };

  const initRes = await fetch(`${TIKTOK_API_BASE}/post/publish/video/init/`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json; charset=UTF-8',
    },
    body: JSON.stringify(initBody),
  });

  const initData = await initRes.json();
  if (!initRes.ok || initData.error?.code !== 'ok') {
    throw new SnsPublishError(
      initData.error?.message ?? 'TikTok API request failed',
      'TIKTOK',
      initData.error?.code ?? initRes.status
    );
  }

  return { id: initData.data.publish_id, platform: 'TIKTOK' };
}
