import { NextRequest, NextResponse } from 'next/server';
import { createAdminToken, setAdminCookie, clearAdminCookie, isAdminEmail } from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (!isAdminEmail(email) || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = await createAdminToken(email);
    const response = NextResponse.json({ ok: true });
    setAdminCookie(response, token);
    return response;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  clearAdminCookie(response);
  return response;
}
