/**
 * X (Twitter) API v2
 * Required scopes: tweet.write, users.read
 * Free tier: 1,500 posts/month write limit
 * Basic tier: ~$100/month for more volume
 * Docs: https://developer.x.com/en/docs/x-api/tweets/manage-tweets/api-reference/post-tweets
 */
import { ChannelCredentials, PublishPayload, PublishResult, SnsPublishError } from './types';

const X_API_BASE = 'https://api.twitter.com/2';

export async function publishToX(
  credentials: ChannelCredentials,
  payload: PublishPayload
): Promise<PublishResult> {
  const { accessToken } = credentials;
  const { content } = payload;

  // X: 280자 제한 (URL은 23자로 카운트됨)
  if (content.length > 280) {
    throw new SnsPublishError(
      `X(Twitter)는 최대 280자까지 지원합니다. (현재: ${content.length}자)`,
      'X',
      'CONTENT_TOO_LONG'
    );
  }

  const tweetBody: { text: string; media?: { media_ids: string[] } } = {
    text: content,
  };

  const res = await fetch(`${X_API_BASE}/tweets`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(tweetBody),
  });

  const data = await res.json();
  if (!res.ok || data.errors) {
    const errMsg = data.errors?.[0]?.message ?? data.detail ?? 'X API request failed';
    throw new SnsPublishError(errMsg, 'X', data.errors?.[0]?.code ?? res.status);
  }

  return { id: data.data.id, platform: 'X' };
}
