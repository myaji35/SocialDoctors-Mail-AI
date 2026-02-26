const META_API_VERSION = 'v21.0';
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`;

export class MetaApiError extends Error {
  constructor(
    message: string,
    public code: number,
    public subcode?: number
  ) {
    super(message);
    this.name = 'MetaApiError';
  }
}

export interface PublishResult {
  id: string; // "pageId_postId" format from Facebook
}

// Facebook 페이지 텍스트/이미지 포스팅
export async function publishToFacebookPage(
  pageId: string,
  accessToken: string,
  content: string,
  imageUrl?: string
): Promise<PublishResult> {
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
    throw new MetaApiError(
      data.error?.message ?? 'Meta API request failed',
      data.error?.code ?? res.status,
      data.error?.error_subcode
    );
  }

  return { id: data.id };
}

// Instagram 이미지 포스팅 (2단계: container 생성 → publish)
export async function publishToInstagram(
  igAccountId: string,
  accessToken: string,
  imageUrl: string,
  caption: string
): Promise<PublishResult> {
  // Step 1: Create media container
  const containerRes = await fetch(`${META_API_BASE}/${igAccountId}/media`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image_url: imageUrl, caption, access_token: accessToken }),
  });
  const containerData = await containerRes.json();
  if (!containerRes.ok || containerData.error) {
    throw new MetaApiError(
      containerData.error?.message ?? 'Failed to create Instagram media container',
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
    throw new MetaApiError(
      publishData.error?.message ?? 'Failed to publish Instagram media',
      publishData.error?.code ?? publishRes.status
    );
  }

  return { id: publishData.id };
}

// Mock 발행 (개발/테스트용 - 실제 API 호출 없음)
export async function mockPublish(
  platform: string,
  content: string
): Promise<PublishResult> {
  // 실제 API 호출처럼 지연 시뮬레이션
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
  const mockId = `mock_${platform.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return { id: mockId };
}
