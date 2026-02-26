/**
 * Threads Publishing
 * API: https://graph.threads.net/v1.0/{threads-user-id}/threads
 * Required scopes: threads_basic, threads_content_publish
 * Flow: 2-step (media_container → publish), similar to Instagram
 * Note: Threads user ID is separate from Instagram user ID
 */
import { ChannelCredentials, PublishPayload, PublishResult, SnsPublishError } from './types';

const THREADS_API_BASE = 'https://graph.threads.net/v1.0';

export async function publishToThreads(
  credentials: ChannelCredentials,
  payload: PublishPayload
): Promise<PublishResult> {
  const { pageId: threadsUserId, accessToken } = credentials;
  const { content, imageUrl } = payload;

  // Threads: 500자 제한
  if (content.length > 500) {
    throw new SnsPublishError(
      `Threads는 최대 500자까지 지원합니다. (현재: ${content.length}자)`,
      'THREADS',
      'CONTENT_TOO_LONG'
    );
  }

  // Step 1: Create media container
  const containerBody: Record<string, string> = {
    text: content,
    media_type: imageUrl ? 'IMAGE' : 'TEXT',
    access_token: accessToken,
  };
  if (imageUrl) {
    containerBody.image_url = imageUrl;
  }

  const containerRes = await fetch(`${THREADS_API_BASE}/${threadsUserId}/threads`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(containerBody),
  });
  const containerData = await containerRes.json();
  if (!containerRes.ok || containerData.error) {
    throw new SnsPublishError(
      containerData.error?.message ?? 'Failed to create Threads media container',
      'THREADS',
      containerData.error?.code ?? containerRes.status
    );
  }

  // Step 2: Publish container
  const publishRes = await fetch(`${THREADS_API_BASE}/${threadsUserId}/threads_publish`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ creation_id: containerData.id, access_token: accessToken }),
  });
  const publishData = await publishRes.json();
  if (!publishRes.ok || publishData.error) {
    throw new SnsPublishError(
      publishData.error?.message ?? 'Failed to publish to Threads',
      'THREADS',
      publishData.error?.code ?? publishRes.status
    );
  }

  return { id: publishData.id, platform: 'THREADS' };
}
