export interface PublishPayload {
  content: string;
  imageUrl?: string;
  imageUrls?: string[];  // 카드뉴스 멀티 이미지 지원
  videoUrl?: string;
  link?: string;
}

export interface PublishResult {
  id: string;
  platform: string;
  mockMode?: boolean;
}

export interface ChannelCredentials {
  pageId: string;
  accessToken: string;
}

export class SnsPublishError extends Error {
  constructor(
    message: string,
    public platform: string,
    public code?: number | string,
    public subcode?: number
  ) {
    super(message);
    this.name = 'SnsPublishError';
  }
}
