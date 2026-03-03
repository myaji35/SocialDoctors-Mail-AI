import { NextRequest, NextResponse } from 'next/server';

const ADMIN_EMAIL = 'admin@gmail.com';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 });
    }

    if (email !== ADMIN_EMAIL || password !== adminPassword) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
}
