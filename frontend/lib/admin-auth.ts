import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || 'admin@gmail.com').split(',').map(e => e.trim());
const JWT_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || process.env.NEXTAUTH_SECRET || 'fallback-secret-change-me');
const COOKIE_NAME = 'admin_token';
const TOKEN_EXPIRY = '8h';

export async function createAdminToken(email: string): Promise<string> {
  return new SignJWT({ email, role: 'admin' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(TOKEN_EXPIRY)
    .sign(JWT_SECRET);
}

export async function verifyAdminToken(request: NextRequest): Promise<{ email: string; role: string } | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { email: string; role: string };
  } catch {
    return null;
  }
}

export function setAdminCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8시간
  });
  return response;
}

export function clearAdminCookie(response: NextResponse): NextResponse {
  response.cookies.set(COOKIE_NAME, '', { maxAge: 0, path: '/' });
  return response;
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(email);
}
