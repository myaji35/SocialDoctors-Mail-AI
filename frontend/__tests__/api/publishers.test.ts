import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock fetch globally
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('SNS Publishers', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const credentials = { pageId: 'test-page-id', accessToken: 'test-token' };

  describe('Instagram', () => {
    it('이미지 없으면 에러', async () => {
      const { publishToInstagram } = await import('@/lib/sns-publishers/instagram');
      await expect(publishToInstagram(credentials, { content: 'test' })).rejects.toThrow('imageUrl');
    });

    it('2단계 발행 성공', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'container-123' }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'ig-post-456' }) });

      const { publishToInstagram } = await import('@/lib/sns-publishers/instagram');
      const result = await publishToInstagram(credentials, { content: 'test', imageUrl: 'https://img.jpg' });
      expect(result.id).toBe('ig-post-456');
      expect(result.platform).toBe('INSTAGRAM');
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Threads', () => {
    it('500자 초과 시 에러', async () => {
      const { publishToThreads } = await import('@/lib/sns-publishers/threads');
      await expect(publishToThreads(credentials, { content: 'a'.repeat(501) })).rejects.toThrow('500자');
    });

    it('텍스트 전용 발행 성공', async () => {
      mockFetch
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'thread-container' }) })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ id: 'thread-post-789' }) });

      const { publishToThreads } = await import('@/lib/sns-publishers/threads');
      const result = await publishToThreads(credentials, { content: '테스트 쓰레드' });
      expect(result.id).toBe('thread-post-789');
      expect(result.platform).toBe('THREADS');
    });
  });

  describe('X (Twitter)', () => {
    it('280자 초과 시 에러', async () => {
      const { publishToX } = await import('@/lib/sns-publishers/twitter');
      await expect(publishToX(credentials, { content: 'a'.repeat(281) })).rejects.toThrow('280자');
    });

    it('트윗 발행 성공', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true, json: async () => ({ data: { id: 'tweet-999' } }),
      });

      const { publishToX } = await import('@/lib/sns-publishers/twitter');
      const result = await publishToX(credentials, { content: '테스트 트윗' });
      expect(result.id).toBe('tweet-999');
      expect(result.platform).toBe('X');
    });
  });

  describe('TikTok', () => {
    it('미디어 없으면 에러', async () => {
      const { publishToTikTok } = await import('@/lib/sns-publishers/tiktok');
      await expect(publishToTikTok(credentials, { content: 'test' })).rejects.toThrow('필수');
    });
  });

  describe('YouTube', () => {
    it('videoUrl 없으면 에러', async () => {
      const { publishToYouTube } = await import('@/lib/sns-publishers/youtube');
      await expect(publishToYouTube(credentials, { content: 'test' })).rejects.toThrow('videoUrl');
    });
  });

  describe('publishToChannel (Router)', () => {
    it('mockMode에서 모든 플랫폼 성공', { timeout: 15000 }, async () => {
      const { publishToChannel } = await import('@/lib/sns-publishers/index');

      for (const platform of ['FACEBOOK', 'INSTAGRAM', 'X', 'THREADS', 'TIKTOK', 'YOUTUBE']) {
        const result = await publishToChannel(platform, credentials, { content: 'test', imageUrl: 'https://img.jpg', videoUrl: 'https://vid.mp4' }, true);
        expect(result.platform).toBe(platform);
        expect(result.mockMode).toBe(true);
      }
    });

    it('지원하지 않는 플랫폼은 에러', async () => {
      const { publishToChannel } = await import('@/lib/sns-publishers/index');
      await expect(publishToChannel('NAVER', credentials, { content: 'test' })).rejects.toThrow('지원하지 않는');
    });
  });
});
