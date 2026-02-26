'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function PartnerRegisterPage() {
  const router = useRouter();
  const { status, data: session } = useSession();
  const [form, setForm] = useState({ name: '', phone: '', bio: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in?callbackUrl=/partner/register');
    }
    // 세션에서 이름 자동 채우기
    if (status === 'authenticated' && session?.user?.name && !form.name) {
      setForm((f) => ({ ...f, name: session.user.name ?? '' }));
    }
  }, [status, session, router, form.name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || '신청 중 오류가 발생했습니다.');
        return;
      }

      router.push('/partner/dashboard');
    } catch {
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F3F2F2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '480px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#16325C', marginBottom: '8px' }}>파트너 신청</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>
          신청 후 검토를 거쳐 승인되면 소개 링크가 활성화됩니다.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#16325C', marginBottom: '6px' }}>
              이름 *
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="홍길동"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#16325C', marginBottom: '6px' }}>
              연락처
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="010-0000-0000"
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#16325C', marginBottom: '6px' }}>
              소개 (활동 방식, 채널 등)
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="어떤 방식으로 홍보할 계획인지 알려주세요..."
              rows={4}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>

          {error && (
            <div style={{ background: '#fff0f0', border: '1px solid #ffcccc', borderRadius: '6px', padding: '10px 14px', color: '#cc0000', fontSize: '14px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? '#aaa' : '#00A1E0',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              padding: '13px',
              fontSize: '15px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '8px',
            }}
          >
            {loading ? '신청 중...' : '파트너 신청하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
