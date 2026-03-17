import { ChannelCredentials, PublishPayload, PublishResult, SnsPublishError } from './types';

const META_API_BASE = 'https://graph.facebook.com/v21.0';

export async function publishToFacebook(
  credentials: ChannelCredentials,
  payload: PublishPayload
): Promise<PublishResult> {
  const { pageId, accessToken } = credentials;
  const { content, imageUrl, imageUrls } = payload;

  // 멀티 이미지: Facebook 미게시 사진 → 일괄 포스팅
  const allImages = imageUrls ?? (imageUrl ? [imageUrl] : []);

  if (allImages.length > 1) {
    return publishMultiPhoto(pageId, accessToken, content, allImages);
  }

  let endpoint: string;
  let body: Record<string, string>;

  if (allImages.length === 1) {
    endpoint = `${META_API_BASE}/${pageId}/photos`;
    body = { caption: content, url: allImages[0], access_token: accessToken };
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

/**
 * Facebook 멀티 이미지 포스팅 (카드뉴스용)
 * 1단계: 각 이미지를 미게시(published=false) 사진으로 업로드
 * 2단계: 모든 미게시 사진 ID를 묶어서 feed에 게시
 */
async function publishMultiPhoto(
  pageId: string,
  accessToken: string,
  content: string,
  imageUrls: string[]
): Promise<PublishResult> {
  // 1단계: 이미지별 미게시 업로드
  const photoIds: string[] = [];
  for (const url of imageUrls) {
    const res = await fetch(`${META_API_BASE}/${pageId}/photos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url,
        published: false,
        access_token: accessToken,
      }),
    });
    const data = await res.json();
    if (!res.ok || data.error) {
      throw new SnsPublishError(
        data.error?.message ?? `Multi-photo upload failed for ${url}`,
        'FACEBOOK',
        data.error?.code ?? res.status,
        data.error?.error_subcode
      );
    }
    photoIds.push(data.id);
  }

  // 2단계: 미게시 사진들을 묶어서 게시
  const feedBody: Record<string, string> = {
    message: content,
    access_token: accessToken,
  };
  photoIds.forEach((id, i) => {
    feedBody[`attached_media[${i}]`] = JSON.stringify({ media_fbid: id });
  });

  const feedRes = await fetch(`${META_API_BASE}/${pageId}/feed`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(feedBody),
  });

  const feedData = await feedRes.json();
  if (!feedRes.ok || feedData.error) {
    throw new SnsPublishError(
      feedData.error?.message ?? 'Multi-photo feed post failed',
      'FACEBOOK',
      feedData.error?.code ?? feedRes.status,
      feedData.error?.error_subcode
    );
  }

  return { id: feedData.id, platform: 'FACEBOOK' };
}
