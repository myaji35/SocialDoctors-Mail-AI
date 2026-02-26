export interface PublishPayload {
  content: string;
  imageUrl?: string;
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
