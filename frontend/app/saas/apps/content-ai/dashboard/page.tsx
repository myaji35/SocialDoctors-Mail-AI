'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

const templates = [
  { id: 'BLOG_POST', name: '블로그 포스트', icon: '📝', desc: 'SEO 최적화 블로그 글' },
  { id: 'SNS_COPY', name: 'SNS 카피', icon: '📱', desc: 'Facebook/Instagram 홍보글' },
  { id: 'AD_COPY', name: '광고 카피', icon: '🎯', desc: '클릭률 높은 광고 문구' },
  { id: 'EMAIL_NEWSLETTER', name: '이메일 뉴스레터', icon: '📧', desc: '오픈율 높은 이메일 본문' },
  { id: 'PRODUCT_DESCRIPTION', name: '제품 설명', icon: '🛍️', desc: '상세페이지 상품 설명' },
  { id: 'PRESS_RELEASE', name: '보도자료', icon: '📰', desc: '언론 배포용 보도자료' },
];

const navItems = [
  { label: '대시보드', href: '/saas/apps/content-ai/dashboard', active: true },
  { label: '새 콘텐츠', href: '#' },
  { label: '내 콘텐츠', href: '#' },
  { label: '브랜드 설정', href: '#' },
];

export default function ContentAIDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState('');
  const [generating, setGenerating] = useState(false);
  const [totalThisMonth, setTotalThisMonth] = useState(0);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/content-ai/dashboard');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/content-ai/generate')
        .then((r) => r.json())
        .then((d) => setTotalThisMonth(d.totalThisMonth ?? 0))
        .catch(() => {});
    }
  }, [status]);

  const generate = async () => {
    if (!selected || !keyword.trim()) return;
    setGenerating(true);
    setResult('');
    try {
      const res = await fetch('/api/content-ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateType: selected, keyword }),
      });
      const data = await res.json();
      if (data.content) {
        setResult(data.content);
        setTotalThisMonth((n) => n + 1);
      } else {
        setResult('콘텐츠 생성에 실패했습니다. 다시 시도해주세요.');
      }
    } catch {
      setResult('네트워크 오류가 발생했습니다.');
    } finally {
      setGenerating(false);
    }
  };

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Content AI" appSlug="content-ai" themeColor="purple" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '생성된 콘텐츠', value: String(totalThisMonth), change: '이번달' },
          { label: '절약된 시간', value: '47시간', change: '+23h 이번주' },
          { label: '평균 생성 속도', value: '2분', change: '목표 달성' },
          { label: '남은 크레딧', value: '308회', change: '무료 체험' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-purple-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">콘텐츠 템플릿 선택</h2>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelected(t.id)}
                className={`p-3 rounded-lg border-2 text-left transition-all ${selected === t.id ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-200'}`}

              >
                <div className="text-xl mb-1">{t.icon}</div>
                <div className="text-sm font-semibold text-gray-800">{t.name}</div>
                <div className="text-xs text-gray-500">{t.desc}</div>
              </button>
            ))}
          </div>
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="키워드 또는 주제를 입력하세요"
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 mb-3"
          />
          <button
            onClick={generate}
            disabled={!selected || !keyword.trim() || generating}
            className="w-full py-2.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {generating ? 'AI 생성 중...' : '콘텐츠 생성하기'}
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">생성 결과</h2>
          {result ? (
            <div className="space-y-3">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-100 text-sm text-purple-900 whitespace-pre-line">{result}</div>
              <div className="flex gap-2">
                <button onClick={() => navigator.clipboard.writeText(result)} className="flex-1 py-2 text-sm border border-purple-200 text-purple-700 rounded-lg hover:bg-purple-50 transition-colors">복사</button>
                <button onClick={() => setResult('')} className="flex-1 py-2 text-sm border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors">새로 생성</button>
              </div>
            </div>
          ) : (
            <div className="h-48 flex flex-col items-center justify-center text-gray-400">
              <div className="text-4xl mb-3">✨</div>
              <p className="text-sm">템플릿과 키워드를 선택하고<br/>콘텐츠를 생성해보세요</p>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
