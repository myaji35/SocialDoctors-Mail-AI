'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

const salesData = [
  { date: '2/12', revenue: 12400000, orders: 89 },
  { date: '2/13', revenue: 15200000, orders: 112 },
  { date: '2/14', revenue: 18900000, orders: 134 },
  { date: '2/15', revenue: 14300000, orders: 98 },
  { date: '2/16', revenue: 21000000, orders: 156 },
  { date: '2/17', revenue: 19500000, orders: 142 },
  { date: '2/18', revenue: 23100000, orders: 178 },
];

const navItems = [
  { label: '대시보드', href: '/saas/apps/insight-board/dashboard', active: true },
  { label: '매출 분석', href: '#' },
  { label: '고객 분석', href: '#' },
  { label: '리포트', href: '#' },
];

export default function InsightBoardDashboard() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/insight-board/dashboard');
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Insight Board" appSlug="insight-board" themeColor="orange" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '오늘 매출', value: '₩23.1M', change: '+18%', up: true },
          { label: '이번달 주문', value: '909건', change: '+24%', up: true },
          { label: '평균 객단가', value: '₩129,700', change: '+3%', up: true },
          { label: '반품율', value: '1.2%', change: '-0.3%', up: true },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-green-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">최근 7일 매출 추이</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${(v/1000000).toFixed(0)}M`} />
              <Tooltip formatter={(v: number | undefined) => v ? `₩${v.toLocaleString()}` : ''} />
              <Line type="monotone" dataKey="revenue" stroke="#ea580c" strokeWidth={2} dot={false} name="매출" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">일별 주문 수</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="orders" fill="#fb923c" name="주문" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">AI 이상 감지</h2>
          <div className="space-y-3">
            {[
              { type: 'warning', msg: '어제 대비 반품 요청 23% 증가 — 특정 상품군 확인 필요', time: '1시간 전' },
              { type: 'info', msg: '토요일 오후 2-4시 주문 집중 — 마케팅 최적 타이밍', time: '3시간 전' },
              { type: 'success', msg: '이번주 신규 고객 유입 전주 대비 +41%', time: '오늘 오전' },
            ].map((a, i) => (
              <div key={i} className={`flex gap-3 p-3 rounded-lg ${a.type === 'warning' ? 'bg-yellow-50 border border-yellow-200' : a.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-blue-50 border border-blue-200'}`}>
                <span className="text-lg">{a.type === 'warning' ? '⚠️' : a.type === 'success' ? '✅' : 'ℹ️'}</span>
                <div>
                  <p className="text-sm text-gray-800">{a.msg}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">채널별 매출 비중</h2>
          <div className="space-y-3">
            {[
              { name: '자사몰', pct: 45, value: '₩10.4M' },
              { name: '네이버 스토어', pct: 30, value: '₩6.9M' },
              { name: '쿠팡', pct: 18, value: '₩4.2M' },
              { name: '기타', pct: 7, value: '₩1.6M' },
            ].map((ch) => (
              <div key={ch.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{ch.name}</span>
                  <span className="font-semibold text-orange-700">{ch.value}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${ch.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
