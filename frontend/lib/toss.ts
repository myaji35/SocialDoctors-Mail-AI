/**
 * Toss Payments 설정 및 유틸리티
 */

// 클라이언트 키 (브라우저에서 사용)
export const TOSS_CLIENT_KEY = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY ?? '';

// 시크릿 키 (서버에서만 사용)
export const TOSS_SECRET_KEY = process.env.TOSS_SECRET_KEY ?? '';

/**
 * 주문 ID 생성
 * 형식: sd-{timestamp}-{random}
 */
export function generateOrderId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);
  return `sd-${timestamp}-${random}`;
}

/**
 * Toss Payments Confirm API 엔드포인트
 */
export const TOSS_CONFIRM_URL = 'https://api.tosspayments.com/v1/payments/confirm';

/**
 * Toss Secret Key를 Base64 인코딩한 Authorization 헤더 값
 */
export function getTossAuthHeader(): string {
  const encoded = Buffer.from(`${TOSS_SECRET_KEY}:`).toString('base64');
  return `Basic ${encoded}`;
}
