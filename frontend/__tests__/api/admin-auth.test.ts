import { describe, it, expect, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST } from '@/app/api/admin/auth/route';

function makeRequest(body: object): NextRequest {
  return new NextRequest('http://localhost:3000/api/admin/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('POST /api/admin/auth', () => {
  beforeEach(() => {
    process.env.ADMIN_PASSWORD = 'test-admin-password';
  });

  it('returns success with correct credentials', async () => {
    const req = makeRequest({
      email: 'admin@gmail.com',
      password: 'test-admin-password',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.ok).toBe(true);
  });

  it('returns 401 with wrong password', async () => {
    const req = makeRequest({
      email: 'admin@gmail.com',
      password: 'wrong-password',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 401 with wrong email', async () => {
    const req = makeRequest({
      email: 'wrong@gmail.com',
      password: 'test-admin-password',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 500 when ADMIN_PASSWORD is not set', async () => {
    delete process.env.ADMIN_PASSWORD;
    const req = makeRequest({
      email: 'admin@gmail.com',
      password: 'anything',
    });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe('Server misconfiguration');
  });

  it('returns 400 for invalid JSON body', async () => {
    const req = new NextRequest('http://localhost:3000/api/admin/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
    });
    const res = await POST(req);

    expect(res.status).toBe(400);
  });
});
