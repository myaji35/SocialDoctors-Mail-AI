'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

const navItems = [
  { label: '대시보드', href: '/saas/apps/pay-flow/dashboard', active: true },
  { label: '결제 내역', href: '#' },
  { label: '구독 관리', href: '#' },
  { label: '정산', href: '#' },
];

const txs = [
  { id: 'PAY-0023', name: '김지수', amount: '₩99,000', method: '카드', status: '완료', date: '18분 전' },
  { id: 'PAY-0022', name: '박민준', amount: '₩299,000', method: '계좌이체', status: '완료', date: '1시간 전' },
  { id: 'PAY-0021', name: '이서연', amount: '₩49,000', method: '카카오페이', status: '완료', date: '3시간 전' },
  { id: 'PAY-0020', name: '최현우', amount: '₩199,000', method: '카드', status: '환불', date: '어제' },
];

export default function PayFlowDashboard() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/pay-flow/dashboard');
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Pay Flow" appSlug="pay-flow" themeColor="indigo" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '오늘 결제액', value: '₩4.8M', change: '+22%' },
          { label: '이번달 결제', value: '₩89.3M', change: '+15%' },
          { label: '구독 중', value: '342건', change: '+12건' },
          { label: '환불율', value: '0.8%', change: '-0.2%' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-indigo-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <h2 className="font-bold text-gray-900 mb-4">최근 결제 내역</h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {['결제 ID', '고객', '금액', '결제수단', '상태', '시간'].map(h => (
                <th key={h} className="text-left py-2 px-3 text-xs text-gray-500 font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {txs.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-3 font-mono text-xs text-gray-500">{tx.id}</td>
                <td className="py-3 px-3 font-medium text-gray-800">{tx.name}</td>
                <td className="py-3 px-3 font-semibold text-indigo-700">{tx.amount}</td>
                <td className="py-3 px-3 text-gray-500">{tx.method}</td>
                <td className="py-3 px-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${tx.status === '완료' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{tx.status}</span>
                </td>
                <td className="py-3 px-3 text-gray-400 text-xs">{tx.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">결제 수단 비중</h2>
          <div className="space-y-3">
            {[{ name: '신용/체크카드', pct: 62 }, { name: '카카오페이', pct: 21 }, { name: '계좌이체', pct: 12 }, { name: '네이버페이', pct: 5 }].map((m) => (
              <div key={m.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-700">{m.name}</span>
                  <span className="text-gray-500">{m.pct}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div className="bg-indigo-500 h-2 rounded-full" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">정산 예정</h2>
          <div className="space-y-3">
            {[
              { date: '2026-02-20', amount: '₩23,400,000', status: '예정' },
              { date: '2026-02-27', amount: '₩18,900,000', status: '예정' },
              { date: '2026-02-13', amount: '₩21,200,000', status: '완료' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-800">{s.date}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${s.status === '완료' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>{s.status}</span>
                </div>
                <span className="font-bold text-indigo-700">{s.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
