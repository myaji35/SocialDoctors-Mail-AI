import { PublishPayload, PublishResult } from './types';

export async function mockPublish(
  platform: string,
  _payload: PublishPayload
): Promise<PublishResult> {
  // 실제 API 호출처럼 지연 시뮬레이션
  await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
  const mockId = `mock_${platform.toLowerCase()}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  return { id: mockId, platform, mockMode: true };
}
