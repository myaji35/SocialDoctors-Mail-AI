/**
 * Dual Authentication Helper
 * 세션 인증(웹 UI)과 X-Api-Key 인증(외부 서비스) 모두 지원
 *
 * 우선순위: X-Api-Key 헤더 → NextAuth 세션
 *
 * 외부 서비스 사용 예:
 *   curl -X POST https://socialdoctors.com/api/social-pulse/publish \
 *     -H "X-Api-Key: your_api_key" \
 *     -d '{"clientSlug":"townin","platform":"FACEBOOK","content":"..."}'
 */
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export type AuthResult =
  | { type: 'session'; userId: string; callerApp: null }
  | { type: 'apikey'; userId: string; callerApp: string }
  | { type: 'unauthorized' };

/**
 * 요청에서 인증 정보를 추출
 * @param request NextRequest
 * @param callerAppHeader 'X-Caller-App' 헤더 값 (외부 서비스가 자신을 식별)
 */
export async function resolveAuth(request: NextRequest): Promise<AuthResult> {
  // 1. X-Api-Key 헤더 확인 (외부 서비스 연동)
  const apiKey = request.headers.get('X-Api-Key');
  if (apiKey) {
    const validKey = process.env.SOCIAL_PULSE_API_KEY;
    if (!validKey) {
      return { type: 'unauthorized' };
    }
    if (apiKey !== validKey) {
      return { type: 'unauthorized' };
    }
    // 외부 서비스는 system userId 사용
    const callerApp = request.headers.get('X-Caller-App') ?? 'external';
    return { type: 'apikey', userId: 'system', callerApp };
  }

  // 2. NextAuth 세션 확인 (웹 UI)
  const session = await getServerSession(authOptions);
  if (session?.user?.id) {
    return { type: 'session', userId: session.user.id, callerApp: null };
  }

  return { type: 'unauthorized' };
}
