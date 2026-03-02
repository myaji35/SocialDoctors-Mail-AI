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
    <div className="min-h-screen bg-[#F3F2F2] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 sm:p-10 w-full max-w-lg shadow-lg">
        <h1 className="text-2xl font-bold text-[#16325C] mb-2">파트너 신청</h1>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          신청 후 검토를 거쳐 승인되면 소개 링크가 활성화됩니다.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-[#16325C] mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="홍길동"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#00A1E0] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#16325C] mb-2">
              연락처
            </label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              placeholder="010-0000-0000"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#00A1E0] focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#16325C] mb-2">
              소개 (활동 방식, 채널 등)
            </label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="어떤 방식으로 홍보할 계획인지 알려주세요..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg text-sm resize-vertical focus:border-[#00A1E0] focus:outline-none transition-colors"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#00A1E0] hover:bg-[#0090C8] disabled:bg-gray-400 text-white rounded-lg py-3.5 text-base font-semibold transition-colors disabled:cursor-not-allowed mt-2"
          >
            {loading ? '신청 중...' : '파트너 신청하기'}
          </button>
        </form>
      </div>
    </div>
  );
}
