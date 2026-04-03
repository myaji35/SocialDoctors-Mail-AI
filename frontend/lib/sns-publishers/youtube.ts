/**
 * YouTube Data API v3 — Videos: insert
 * Shorts: 60초 이하 세로(9:16) + #Shorts 태그 → 자동 인식
 * Required scopes: youtube.upload, youtube.readonly
 * Auth: OAuth 2.0 (access_token)
 * Quota: 10,000 유닛/일, 업로드 1회 = 1,600 유닛 (약 6회/일)
 * Docs: https://developers.google.com/youtube/v3/docs/videos/insert
 */
import { ChannelCredentials, PublishPayload, PublishResult, SnsPublishError } from './types';

const YOUTUBE_UPLOAD_URL = 'https://www.googleapis.com/upload/youtube/v3/videos';

export async function publishToYouTube(
  credentials: ChannelCredentials,
  payload: PublishPayload
): Promise<PublishResult> {
  const { accessToken } = credentials;
  const { content, videoUrl } = payload;

  if (!videoUrl) {
    throw new SnsPublishError(
      'YouTube 발행에는 videoUrl이 필요합니다.',
      'YOUTUBE',
      'MISSING_VIDEO'
    );
  }

  // 동영상 다운로드
  const videoRes = await fetch(videoUrl);
  if (!videoRes.ok) {
    throw new SnsPublishError(
      `동영상 다운로드 실패: ${videoUrl}`,
      'YOUTUBE',
      'VIDEO_DOWNLOAD_FAILED'
    );
  }
  const videoBuffer = await videoRes.arrayBuffer();

  // 제목/설명 파싱 (content 첫 줄 = 제목, 나머지 = 설명)
  const lines = content.split('\n');
  const title = lines[0].slice(0, 100);
  const description = lines.slice(1).join('\n') || content;

  // YouTube Videos: insert (resumable upload)
  // Step 1: 메타데이터로 업로드 세션 시작
  const metadata = {
    snippet: {
      title,
      description,
      tags: extractHashtags(content),
      categoryId: '22', // People & Blogs
    },
    status: {
      privacyStatus: 'public',
      selfDeclaredMadeForKids: false,
    },
  };

  const initRes = await fetch(
    `${YOUTUBE_UPLOAD_URL}?uploadType=resumable&part=snippet,status`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json; charset=UTF-8',
        'X-Upload-Content-Length': videoBuffer.byteLength.toString(),
        'X-Upload-Content-Type': 'video/mp4',
      },
      body: JSON.stringify(metadata),
    }
  );

  if (!initRes.ok) {
    const errData = await initRes.json().catch(() => ({}));
    throw new SnsPublishError(
      (errData as { error?: { message?: string } }).error?.message ?? `YouTube 업로드 초기화 실패 (${initRes.status})`,
      'YOUTUBE',
      initRes.status
    );
  }

  const uploadUrl = initRes.headers.get('Location');
  if (!uploadUrl) {
    throw new SnsPublishError('YouTube 업로드 URL을 받지 못했습니다.', 'YOUTUBE', 'NO_UPLOAD_URL');
  }

  // Step 2: 동영상 바이너리 업로드
  const uploadRes = await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': videoBuffer.byteLength.toString(),
    },
    body: videoBuffer,
  });

  const uploadData = await uploadRes.json();
  if (!uploadRes.ok || uploadData.error) {
    throw new SnsPublishError(
      uploadData.error?.message ?? 'YouTube 동영상 업로드 실패',
      'YOUTUBE',
      uploadData.error?.code ?? uploadRes.status
    );
  }

  return { id: uploadData.id, platform: 'YOUTUBE' };
}

/** 콘텐츠에서 해시태그 추출 */
function extractHashtags(content: string): string[] {
  const matches = content.match(/#[\w가-힣]+/g);
  return matches ? matches.map(tag => tag.replace('#', '')) : [];
}
