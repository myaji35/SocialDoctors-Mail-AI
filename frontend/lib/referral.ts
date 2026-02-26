import { customAlphabet } from 'nanoid';

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 6);

export function generateReferralCode(): string {
  return 'SD-' + nanoid();
}

export function getReferralCodeFromCookieString(cookieHeader: string): string | null {
  const match = cookieHeader.match(/(?:^|;\s*)ref=([^;]+)/);
  return match ? match[1] : null;
}

export function buildReferralUrl(baseUrl: string, referralCode: string): string {
  return baseUrl.replace(/\/$/, '') + '/r/' + referralCode;
}
