/**
 * SocialDoctors 홍보대행 범용 SDK
 *
 * 어떤 프로젝트든 이 파일 하나만 복사하면 SocialDoctors 홍보대행 API에 연동됩니다.
 *
 * 사용법:
 *   import { SocialDoctorsSDK } from './socialdoctors-sdk';
 *   const sdk = new SocialDoctorsSDK({
 *     apiKey: process.env.SOCIAL_PULSE_API_KEY!,
 *     callerApp: '0008_choi-pd',        // 프로젝트 식별자
 *     clientName: '최PD',                // 표시 이름
 *     clientSlug: 'choi-pd',             // URL-safe 슬러그
 *     baseUrl: 'https://app.socialdoctors.kr', // 프로덕션
 *   });
 */

// ─── 설정 ────────────────────────────────────────────────────────

export interface SDKConfig {
  apiKey: string;
  callerApp: string;
  clientName: string;
  clientSlug: string;
  baseUrl?: string;
}

// ─── 타입 정의 ───────────────────────────────────────────────────

export type CampaignType = 'SNS_POST' | 'CARD_NEWS' | 'AI_COPY' | 'FULL_PACKAGE';
export type CampaignStatus = 'REQUESTED' | 'APPROVED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
export type Platform = 'FACEBOOK' | 'INSTAGRAM' | 'X' | 'THREADS' | 'TIKTOK' | 'YOUTUBE';
export type CardTemplate = 'SERVICE_INTRO' | 'EDUCATION' | 'EVENT' | 'CUSTOM';

export interface Campaign {
  id: string;
  callerApp: string;
  clientName: string;
  clientSlug: string;
  type: CampaignType;
  status: CampaignStatus;
  title: string;
  description?: string;
  budget: number;
  platforms: string[];
  postsCount: number;
  cardNewsCount: number;
  requestedAt: string;
  approvedAt?: string;
  completedAt?: string;
  items?: CampaignItem[];
}

export interface CampaignItem {
  id: string;
  type: string;
  postId?: string;
  cardNewsId?: string;
  platform?: string;
  status: string;
  result?: unknown;
}

export interface PublishResult {
  success: boolean;
  postId?: string;
  externalPostId?: string;
  publishedAt?: string;
  platform?: string;
  channelName?: string;
  mockMode?: boolean;
  error?: string;
}

export interface CardNewsResult {
  success?: boolean;
  cardNews?: {
    id: string;
    title: string;
    status: string;
    slideCount: number;
    slides: Array<{ slideOrder: number; headline: string; role: string }>;
  };
  error?: string;
}

export interface Channel {
  id: string;
  clientName: string;
  clientSlug: string;
  platform: string;
  channelName: string;
  status: string;
}

// ─── SDK 클래스 ──────────────────────────────────────────────────

export class SocialDoctorsSDK {
  private config: Required<SDKConfig>;

  constructor(config: SDKConfig) {
    this.config = {
      ...config,
      baseUrl: config.baseUrl ?? 'https://app.socialdoctors.kr',
    };
  }

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'X-Api-Key': this.config.apiKey,
      'X-Caller-App': this.config.callerApp,
    };
  }

  private async request<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${this.config.baseUrl}${path}`, {
      ...options,
      headers: { ...this.headers(), ...options?.headers },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `HTTP ${res.status}`);
    return data as T;
  }

  // ── 캠페인 (홍보대행 의뢰) ─────────────────────────────────────

  /** 홍보 캠페인 의뢰 생성 */
  async createCampaign(options: {
    title: string;
    description?: string;
    type: CampaignType;
    platforms: Platform[];
    budget?: number;
  }): Promise<{ campaign: Campaign }> {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify({
        ...options,
        clientName: this.config.clientName,
        clientSlug: this.config.clientSlug,
      }),
    });
  }

  /** 캠페인 목록 조회 */
  async listCampaigns(options?: {
    status?: CampaignStatus;
    limit?: number;
    offset?: number;
  }): Promise<{ campaigns: Campaign[]; total: number }> {
    const params = new URLSearchParams();
    if (options?.status) params.set('status', options.status);
    if (options?.limit) params.set('limit', options.limit.toString());
    if (options?.offset) params.set('offset', options.offset.toString());
    return this.request(`/api/campaigns?${params}`);
  }

  /** 캠페인 상세 조회 */
  async getCampaign(id: string): Promise<{ campaign: Campaign }> {
    return this.request(`/api/campaigns/${id}`);
  }

  /** 캠페인 실행 (발행 트리거) */
  async executeCampaign(id: string, options?: {
    mockMode?: boolean;
    content?: string;
    topic?: string;
  }): Promise<{ success: boolean; items: CampaignItem[] }> {
    return this.request(`/api/campaigns/${id}/execute`, {
      method: 'POST',
      body: JSON.stringify(options ?? {}),
    });
  }

  /** 캠페인 결과 리포트 */
  async getCampaignReport(id: string): Promise<{
    campaign: Campaign;
    summary: { totalPosts: number; totalCardNews: number; platformBreakdown: Record<string, number> };
    items: CampaignItem[];
  }> {
    return this.request(`/api/campaigns/${id}/report`);
  }

  // ── SNS 발행 ──────────────────────────────────────────────────

  /** SNS에 콘텐츠 발행 */
  async publish(options: {
    platform?: Platform;
    content: string;
    imageUrl?: string;
    videoUrl?: string;
    link?: string;
    scheduledAt?: string;
    mockMode?: boolean;
  }): Promise<PublishResult> {
    return this.request('/api/social-pulse/publish', {
      method: 'POST',
      body: JSON.stringify({
        ...options,
        clientSlug: this.config.clientSlug,
      }),
    });
  }

  /** 발행 상태 조회 */
  async getPublishStatus(options?: {
    postId?: string;
    limit?: number;
  }): Promise<{ posts: unknown[]; count: number }> {
    const params = new URLSearchParams({ callerApp: this.config.callerApp });
    if (options?.postId) params.set('postId', options.postId);
    if (options?.limit) params.set('limit', options.limit.toString());
    return this.request(`/api/social-pulse/publish/status?${params}`);
  }

  // ── AI 생성 ───────────────────────────────────────────────────

  /** AI 마케팅 카피 생성 */
  async generateCopy(prompt: string, platform?: Platform): Promise<{ copy: string }> {
    return this.request('/api/social-pulse/generate-copy', {
      method: 'POST',
      body: JSON.stringify({ prompt, platform }),
    });
  }

  /** AI 카드뉴스 생성 */
  async createCardNews(options: {
    topic: string;
    templateType?: CardTemplate;
    brandColor?: string;
    subColor?: string;
    logoUrl?: string;
    slideCount?: number;
    autoPublish?: boolean;
    publishTo?: { platform: Platform };
  }): Promise<CardNewsResult> {
    return this.request('/api/card-news', {
      method: 'POST',
      body: JSON.stringify({
        ...options,
        clientSlug: this.config.clientSlug,
      }),
    });
  }

  // ── 채널 관리 ──────────────────────────────────────────────────

  /** 등록된 SNS 채널 목록 */
  async getChannels(platform?: Platform): Promise<{ channels: Channel[] }> {
    const params = new URLSearchParams({ clientSlug: this.config.clientSlug });
    if (platform) params.set('platform', platform);
    return this.request(`/api/social-pulse/channels?${params}`);
  }

  // ── 유틸리티 ──────────────────────────────────────────────────

  /** API 연결 테스트 (헬스 체크) */
  async ping(): Promise<boolean> {
    try {
      await this.getChannels();
      return true;
    } catch {
      return false;
    }
  }
}

// ─── 팩토리 함수 (환경변수 기반 자동 설정) ──────────────────────

export function createSDKFromEnv(overrides?: Partial<SDKConfig>): SocialDoctorsSDK {
  return new SocialDoctorsSDK({
    apiKey: process.env.SOCIAL_PULSE_API_KEY ?? '',
    callerApp: process.env.CALLER_APP ?? 'unknown',
    clientName: process.env.CLIENT_NAME ?? 'Unknown',
    clientSlug: process.env.CLIENT_SLUG ?? 'unknown',
    baseUrl: process.env.SOCIAL_PULSE_API_URL ?? 'https://app.socialdoctors.kr',
    ...overrides,
  });
}
