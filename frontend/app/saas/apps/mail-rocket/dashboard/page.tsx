'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

const navItems = [
  { label: '대시보드', href: '/saas/apps/mail-rocket/dashboard', active: true },
  { label: '캠페인', href: '#' },
  { label: '수신자 목록', href: '#' },
  { label: '자동화', href: '#' },
];

const campaigns = [
  { name: '2월 뉴스레터', sent: 4820, openRate: '38.2%', clickRate: '12.4%', status: '완료' },
  { name: '신상품 출시 알림', sent: 2340, openRate: '45.1%', clickRate: '18.7%', status: '완료' },
  { name: '3월 프로모션', sent: 0, openRate: '-', clickRate: '-', status: '초안' },
];

export default function MailRocketDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/mail-rocket/dashboard');
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Mail Rocket" appSlug="mail-rocket" themeColor="rose" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '총 발송', value: '124,800', change: '이번달' },
          { label: '평균 오픈율', value: '38.2%', change: '업계 평균 21%' },
          { label: '평균 클릭율', value: '12.4%', change: '+3.1%' },
          { label: '수신자 수', value: '8,342명', change: '+234 이번달' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-rose-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">캠페인 목록</h2>
            <button className="text-xs px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors">+ 새 캠페인</button>
          </div>
          <div className="space-y-3">
            {campaigns.map((c, i) => (
              <div key={i} className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-gray-800">{c.name}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status === '완료' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-500'}`}>{c.status}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-gray-500">
                  <span>발송 {c.sent.toLocaleString()}명</span>
                  <span>오픈 {c.openRate}</span>
                  <span>클릭 {c.clickRate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">빠른 이메일 작성</h2>
          <div className="space-y-3">
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="제목을 입력하세요"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rose-400"
            />
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="본문을 작성하세요..."
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-rose-400 resize-none"
            />
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-lg text-sm hover:bg-gray-200 transition-colors">임시저장</button>
              <button className="flex-1 py-2.5 bg-rose-600 text-white rounded-lg text-sm font-semibold hover:bg-rose-700 transition-colors">발송 예약</button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
