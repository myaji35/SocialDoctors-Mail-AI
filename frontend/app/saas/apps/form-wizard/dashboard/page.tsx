'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

const navItems = [
  { label: '대시보드', href: '/saas/apps/form-wizard/dashboard', active: true },
  { label: '폼 목록', href: '#' },
  { label: '응답 분석', href: '#' },
  { label: '설정', href: '#' },
];

const forms = [
  { name: '고객 만족도 조사', responses: 234, views: 890, rate: '26.3%', status: '활성' },
  { name: '신제품 사전 예약', responses: 1204, views: 3420, rate: '35.2%', status: '활성' },
  { name: '파트너 신청 폼', responses: 89, views: 340, rate: '26.2%', status: '활성' },
];

export default function FormWizardDashboard() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/form-wizard/dashboard');
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Form Wizard" appSlug="form-wizard" themeColor="violet" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '총 폼', value: '12개', change: '+3 이번달' },
          { label: '총 응답', value: '8,420건', change: '+1,234 이번달' },
          { label: '평균 완료율', value: '67.3%', change: '+8%' },
          { label: 'AI 분석 완료', value: '5개', change: '자동 분석' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-violet-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">폼 목록</h2>
            <button className="text-xs px-3 py-1.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors">+ 새 폼 만들기</button>
          </div>
          <div className="space-y-3">
            {forms.map((f, i) => (
              <div key={i} className="p-4 border border-gray-200 rounded-xl hover:border-violet-200 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-800">{f.name}</span>
                  <span className="text-xs px-2 py-0.5 bg-green-600 text-white rounded-full font-semibold">{f.status}</span>
                </div>
                <div className="grid grid-cols-3 text-xs text-gray-500">
                  <span>응답 {f.responses}건</span>
                  <span>조회 {f.views}회</span>
                  <span className="text-violet-700 font-semibold">완료율 {f.rate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">AI 응답 분석 <span className="text-xs text-violet-500 font-normal">최신</span></h2>
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-100 mb-4">
            <p className="text-xs font-semibold text-violet-700 mb-2">고객 만족도 조사 — AI 요약</p>
            <p className="text-sm text-gray-700">전체 응답자의 78%가 제품 품질에 만족. 주요 개선 요청: 배송 속도(42%), 포장(28%). 재구매 의향 92%로 매우 높음.</p>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold text-gray-600">폼 빌더 (드래그앤드롭)</p>
            {['단답형', '장문형', '객관식', '별점', '파일 업로드', '결제 연동'].map((field) => (
              <div key={field} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">{field}</span>
                <button className="text-xs px-3 py-1 bg-violet-500 text-white rounded-lg hover:bg-violet-200 transition-colors">추가</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
