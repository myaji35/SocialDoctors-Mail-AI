'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

const mockCustomers = [
  { id: 1, name: '김지수', email: 'jisu@example.com', status: 'VIP', lastOrder: '2026-02-15', total: '₩2,340,000' },
  { id: 2, name: '박민준', email: 'minjun@example.com', status: '일반', lastOrder: '2026-02-10', total: '₩450,000' },
  { id: 3, name: '이서연', email: 'seoyeon@example.com', status: '신규', lastOrder: '2026-02-18', total: '₩89,000' },
  { id: 4, name: '최현우', email: 'hyunwoo@example.com', status: '휴면', lastOrder: '2025-11-03', total: '₩1,200,000' },
];

const navItems = [
  { label: '대시보드', href: '/saas/apps/crm-pro/dashboard', active: true },
  { label: '고객 목록', href: '#' },
  { label: '자동화', href: '#' },
  { label: '분석', href: '#' },
];

export default function CRMProDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/crm-pro/dashboard');
  }, [status, router]);

  const filtered = mockCustomers.filter(c => c.name.includes(search) || c.email.includes(search));

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="CRM Pro" appSlug="crm-pro" themeColor="cyan" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '전체 고객', value: '1,247', change: '+23 이번달' },
          { label: 'VIP 고객', value: '89', change: '재구매율 78%' },
          { label: '이번달 매출', value: '₩34.2M', change: '+15%' },
          { label: '평균 LTV', value: '₩1.8M', change: '+₩200K' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-cyan-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">고객 목록</h2>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="이름 또는 이메일 검색"
            className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-cyan-400 w-52"
          />
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['이름', '이메일', '등급', '최근 주문', '누적 구매액'].map(h => (
                <th key={h} className="text-left py-2 px-3 text-xs text-gray-500 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-3 font-medium text-gray-800">{c.name}</td>
                <td className="py-3 px-3 text-gray-500">{c.email}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                    c.status === 'VIP' ? 'bg-yellow-100 text-yellow-700' :
                    c.status === '신규' ? 'bg-green-100 text-green-700' :
                    c.status === '휴면' ? 'bg-gray-100 text-gray-500' :
                    'bg-blue-100 text-blue-700'
                  }`}>{c.status}</span>
                </td>
                <td className="py-3 px-3 text-gray-500">{c.lastOrder}</td>
                <td className="py-3 px-3 font-semibold text-cyan-700">{c.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">자동화 캠페인</h2>
          <div className="space-y-3">
            {[
              { name: '신규 고객 환영 이메일', status: '활성', trigger: '가입 즉시' },
              { name: '30일 미구매 리마인드', status: '활성', trigger: '비활동 30일' },
              { name: 'VIP 전환 축하', status: '대기', trigger: '누적 ₩1M 달성' },
            ].map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{c.name}</p>
                  <p className="text-xs text-gray-500">{c.trigger}</p>
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${c.status === '활성' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {c.status}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">고객 세그먼트</h2>
          <div className="space-y-3">
            {[
              { name: 'VIP (₩1M+)', count: 89, pct: 7 },
              { name: '활성 (최근 30일)', count: 632, pct: 51 },
              { name: '휴면 (30일+)', count: 401, pct: 32 },
              { name: '신규 (7일 이내)', count: 125, pct: 10 },
            ].map((seg) => (
              <div key={seg.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{seg.name}</span>
                  <span className="text-gray-500">{seg.count}명</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${seg.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
