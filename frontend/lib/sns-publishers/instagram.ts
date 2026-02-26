import { ChannelCredentials, PublishPayload, PublishResult, SnsPublishError } from './types';

const META_API_BASE = 'https://graph.facebook.com/v21.0';

export async function publishToInstagram(
  credentials: ChannelCredentials,
  payload: PublishPayload
): Promise<PublishResult> {
  const { pageId: igAccountId, accessToken } = credentials;
  const { content, imageUrl } = payload;

  if (!imageUrl) {
    throw new SnsPublishError(
      'Instagram 발행에는 imageUrl이 필요합니다.',
      'INSTAGRAM',
      'MISSING_IMAGE'
    );
  }

  // Step 1: Create media container
  const containerRes = await fetch(`${META_API_BASE}/${igAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption: content, access_token: accessToken }),
  });
  const containerData = await containerRes.json();
  if (!containerRes.ok || containerData.error) {
    throw new SnsPublishError(
      containerData.error?.message ?? 'Failed to create Instagram media container',
      'INSTAGRAM',
      containerData.error?.code ?? containerRes.status
    );
  }

  // Step 2: Publish media container
  const publishRes = await fetch(`${META_API_BASE}/${igAccountId}/media_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: containerData.id, access_token: accessToken }),
  });
  const publishData = await publishRes.json();
  if (!publishRes.ok || publishData.error) {
    throw new SnsPublishError(
      publishData.error?.message ?? 'Failed to publish Instagram media',
      'INSTAGRAM',
      publishData.error?.code ?? publishRes.status
    );
  }

  return { id: publishData.id, platform: 'INSTAGRAM' };
}
