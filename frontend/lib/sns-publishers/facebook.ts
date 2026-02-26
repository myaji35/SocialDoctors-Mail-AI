import { ChannelCredentials, PublishPayload, PublishResult, SnsPublishError } from './types';

const META_API_BASE = 'https://graph.facebook.com/v21.0';

export async function publishToFacebook(
  credentials: ChannelCredentials,
  payload: PublishPayload
): Promise<PublishResult> {
  const { pageId, accessToken } = credentials;
  const { content, imageUrl } = payload;

  let endpoint: string;
  let body: Record<string, string>;

  if (imageUrl) {
    endpoint = `${META_API_BASE}/${pageId}/photos`;
    body = { caption: content, url: imageUrl, access_token: accessToken };
  } else {
    endpoint = `${META_API_BASE}/${pageId}/feed`;
    body = { message: content, access_token: accessToken };
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok || data.error) {
    throw new SnsPublishError(
      data.error?.message ?? 'Facebook API request failed',
      'FACEBOOK',
      data.error?.code ?? res.status,
      data.error?.error_subcode
    );
  }

  return { id: data.id, platform: 'FACEBOOK' };
}
