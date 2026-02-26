import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  // 클릭 추적 (fire-and-forget)
  fetch(new URL('/api/referral/track', request.url).toString(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referralCode: code,
      userAgent: request.headers.get('user-agent') || '',
      ipAddress: request.headers.get('x-forwarded-for') || '',
    }),
  }).catch(() => {});

  const response = NextResponse.redirect(new URL('/', request.url));
  response.cookies.set('ref', code, {
    maxAge: 60 * 60 * 24 * 30, // 30일
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
  });
  return response;
}
