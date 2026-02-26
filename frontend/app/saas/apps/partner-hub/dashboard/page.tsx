'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

interface PartnerStats {
  totalPartners: number;
  activePartners: number;
  monthlyClicks: number;
  monthlyConversions: number;
  totalCommissionPaid: number;
}

interface PartnerRow {
  id: string;
  name: string;
  code: string;
  status: string;
  clicks: number;
  referrals: number;
  earned: number;
}

interface SettlementRow {
  id: string;
  partnerName: string;
  amount: number;
  bankName: string;
  accountHolder: string;
  createdAt: string;
}

const navItems = [
  { label: '대시보드', href: '/saas/apps/partner-hub/dashboard', active: true },
  { label: '파트너 목록', href: '#' },
  { label: '커미션 설정', href: '#' },
  { label: '정산 관리', href: '#' },
];

const STATUS_BADGE: Record<string, string> = {
  ACTIVE: 'bg-green-100 text-green-700',
  PENDING: 'bg-yellow-100 text-yellow-700',
  SUSPENDED: 'bg-red-100 text-red-700',
};
const STATUS_LABEL: Record<string, string> = {
  ACTIVE: '활성',
  PENDING: '대기',
  SUSPENDED: '정지',
};

export default function PartnerHubDashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState<PartnerStats | null>(null);
  const [partners, setPartners] = useState<PartnerRow[]>([]);
  const [settlements, setSettlements] = useState<SettlementRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/partner-hub/dashboard');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/partner-hub/stats')
        .then((r) => r.json())
        .then((d) => {
          setStats(d.stats);
          setPartners(d.recentPartners ?? []);
          setSettlements(d.pendingSettlements ?? []);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === 'loading' || loading) return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Partner Hub" appSlug="partner-hub" themeColor="emerald" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '활성 파트너', value: `${stats?.activePartners ?? 0}명`, change: `전체 ${stats?.totalPartners ?? 0}명` },
          { label: '이번달 클릭', value: (stats?.monthlyClicks ?? 0).toLocaleString(), change: '실시간' },
          { label: '이번달 전환', value: `${stats?.monthlyConversions ?? 0}건`, change: '실시간' },
          { label: '총 커미션 지급', value: `₩${((stats?.totalCommissionPaid ?? 0) / 1000000).toFixed(1)}M`, change: '누적' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-emerald-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900">파트너 현황</h2>
          <button className="text-xs px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">+ 파트너 초대</button>
        </div>
        {partners.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">등록된 파트너가 없습니다.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                {['파트너', '코드', '클릭', '가입', '수익', '상태'].map((h) => (
                  <th key={h} className="text-left py-2 px-3 text-xs text-gray-500 font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => (
                <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-3 px-3 font-medium text-gray-800">{p.name}</td>
                  <td className="py-3 px-3 font-mono text-xs text-gray-500 bg-gray-50 rounded">{p.code}</td>
                  <td className="py-3 px-3 text-gray-700">{p.clicks.toLocaleString()}</td>
                  <td className="py-3 px-3 text-gray-700">{p.referrals}</td>
                  <td className="py-3 px-3 font-semibold text-emerald-700">₩{p.earned.toLocaleString()}</td>
                  <td className="py-3 px-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${STATUS_BADGE[p.status] ?? 'bg-gray-100 text-gray-500'}`}>
                      {STATUS_LABEL[p.status] ?? p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">커미션 구조</h2>
          <div className="space-y-3">
            {[
              { tier: '기본', rate: '15%', condition: '모든 파트너' },
              { tier: '실버', rate: '18%', condition: '월 50건 이상' },
              { tier: '골드', rate: '22%', condition: '월 200건 이상' },
              { tier: '플래티넘', rate: '25%', condition: '월 500건 이상' },
            ].map((t) => (
              <div key={t.tier} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold text-sm text-gray-800">{t.tier}</span>
                  <span className="text-xs text-gray-400 ml-2">{t.condition}</span>
                </div>
                <span className="text-emerald-700 font-bold">{t.rate}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">정산 대기</h2>
          {settlements.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">정산 대기 건이 없습니다.</p>
          ) : (
            <div className="space-y-3">
              {settlements.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{s.partnerName}</p>
                    <p className="text-xs text-gray-400">{s.bankName} · {new Date(s.createdAt).toLocaleDateString('ko-KR')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-emerald-700">₩{s.amount.toLocaleString()}</span>
                    <button className="text-xs px-2 py-1 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors">승인</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
