'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface DashboardData {
  partner: { id: string; referralCode: string; referralUrl: string; status: string; name: string };
  stats: { totalClicks: number; totalSignups: number; conversionRate: number; totalEarned: number; currentBalance: number; pendingAmount: number };
  recentTransactions: Array<{ id: string; serviceName: string; paymentAmount: number; commissionAmount: number; status: string; createdAt: string }>;
  clicksChart: Array<{ date: string; clicks: number; signups: number }>;
}

export default function PartnerDashboardPage() {
  const router = useRouter();
  const { status } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showSettlement, setShowSettlement] = useState(false);
  const [settlement, setSettlement] = useState({ amount: '', bankName: '', accountNumber: '', accountHolder: '' });
  const [settlementMsg, setSettlementMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/sign-in?callbackUrl=/partner/dashboard');
      return;
    }
    if (status !== 'authenticated') return;

    fetch('/api/affiliate/dashboard')
      .then((r) => r.json())
      .then((json) => {
        if (!json.success) router.push('/partner/register');
        else setData(json.data);
      })
      .catch(() => router.push('/partner'))
      .finally(() => setLoading(false));
  }, [router, status]);

  const copyLink = () => {
    if (!data) return;
    navigator.clipboard.writeText(data.partner.referralUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSettlement = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/affiliate/settlement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...settlement, amount: Number(settlement.amount) }),
    });
    const json = await res.json();
    if (json.success) {
      setSettlementMsg({ type: 'success', text: '정산 신청이 완료되었습니다. 영업일 3~5일 내에 처리됩니다.' });
      setShowSettlement(false);
      setSettlement({ amount: '', bankName: '', accountNumber: '', accountHolder: '' });
      router.refresh();
    } else {
      setSettlementMsg({ type: 'error', text: json.error || '정산 신청에 실패했습니다.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#16325C] text-base">
        로딩 중...
      </div>
    );
  }
  if (!data) return null;

  const statCards = [
    { label: '총 클릭', value: data.stats.totalClicks.toLocaleString(), unit: '회' },
    { label: '총 가입', value: data.stats.totalSignups.toLocaleString(), unit: '명' },
    { label: '전환율', value: data.stats.conversionRate.toFixed(1), unit: '%' },
    { label: '총 수익', value: data.stats.totalEarned.toLocaleString(), unit: '원' },
  ];

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      {/* Header */}
      <div className="bg-[#16325C] px-6 sm:px-8 py-4 flex items-center justify-between">
        <span className="text-[#00A1E0] font-bold text-lg">SocialDoctors</span>
        <span className="text-white text-sm">{data.partner.name} 파트너 대시보드</span>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* PENDING 상태 배너 */}
        {data.partner.status === 'PENDING' && (
          <div className="bg-yellow-50 border-2 border-yellow-300 rounded-xl px-6 py-4 mb-6 flex items-start gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="#F39C12" strokeWidth={2} className="w-5 h-5 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <div className="font-bold text-yellow-800 mb-1">파트너 심사 중입니다</div>
              <div className="text-sm text-yellow-700 leading-relaxed">
                신청이 접수되었습니다. 영업일 1~3일 내에 검토 후 이메일로 결과를 안내드립니다.
                승인 완료 전까지는 소개 링크가 비활성화됩니다.
              </div>
            </div>
          </div>
        )}

        {/* SUSPENDED 상태 배너 */}
        {data.partner.status === 'SUSPENDED' && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl px-6 py-4 mb-6 flex items-start gap-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth={2} className="w-5 h-5 shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <div>
              <div className="font-bold text-red-800 mb-1">계정이 정지되었습니다</div>
              <div className="text-sm text-red-700">자세한 사항은 support@socialdoctors.co.kr 로 문의해 주세요.</div>
            </div>
          </div>
        )}

        {/* 정산 결과 메시지 */}
        {settlementMsg && (
          <div className={`rounded-xl px-6 py-4 mb-6 text-sm flex justify-between items-center ${
            settlementMsg.type === 'success'
              ? 'bg-green-50 border-2 border-green-200 text-green-800'
              : 'bg-red-50 border-2 border-red-200 text-red-800'
          }`}>
            <span>{settlementMsg.text}</span>
            <button onClick={() => setSettlementMsg(null)} className="text-lg text-gray-500 hover:text-gray-700 ml-4">
              &times;
            </button>
          </div>
        )}

        {/* 소개 링크 */}
        <div className={`bg-white rounded-xl p-6 mb-6 shadow-sm ${data.partner.status !== 'ACTIVE' ? 'opacity-60' : ''}`}>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">내 소개 링크</div>
          <div className="flex items-center gap-3">
            <div className={`flex-1 bg-gray-100 rounded-lg px-4 py-3 text-sm text-[#16325C] font-mono ${
              data.partner.status !== 'ACTIVE' ? 'blur-sm select-none' : ''
            }`}>
              {data.partner.referralUrl}
            </div>
            <button
              onClick={copyLink}
              disabled={data.partner.status !== 'ACTIVE'}
              className={`shrink-0 rounded-lg px-6 py-3 text-sm font-semibold text-white transition-colors ${
                data.partner.status !== 'ACTIVE'
                  ? 'bg-gray-400 cursor-not-allowed'
                  : copied
                    ? 'bg-green-600'
                    : 'bg-[#00A1E0] hover:bg-[#0090C8]'
              }`}
            >
              {data.partner.status !== 'ACTIVE' ? '승인 후 활성화' : copied ? '복사됨!' : '링크 복사'}
            </button>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            상태:{' '}
            <span className={`font-semibold ${
              data.partner.status === 'ACTIVE' ? 'text-green-600' :
              data.partner.status === 'PENDING' ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {data.partner.status === 'ACTIVE' ? '활성' : data.partner.status === 'PENDING' ? '승인 대기중' : '정지됨'}
            </span>
          </div>
        </div>

        {/* KPI 카드 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl p-5 shadow-sm">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{card.label}</div>
              <div className="text-2xl sm:text-3xl font-bold text-[#16325C]">
                {card.value}
                <span className="text-sm text-gray-500 ml-1 font-normal">{card.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 차트 */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="text-sm font-bold text-[#16325C] mb-5">최근 30일 클릭 / 가입 추이</div>
          {data.clicksChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={data.clicksChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke="#00A1E0" strokeWidth={2} name="클릭" dot={false} />
                <Line type="monotone" dataKey="signups" stroke="#16325C" strokeWidth={2} name="가입" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-60 flex items-center justify-center text-gray-400 text-sm">
              아직 클릭 데이터가 없습니다.
            </div>
          )}
        </div>

        {/* 정산 */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">출금 가능 잔액</span>
              <span className="text-2xl font-bold text-[#16325C] ml-3">
                ₩{data.stats.currentBalance.toLocaleString()}
              </span>
              <span className="text-sm text-gray-500 ml-4">
                정산 대기: ₩{data.stats.pendingAmount.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setShowSettlement(!showSettlement)}
              className="bg-[#16325C] hover:bg-[#0e2445] text-white rounded-lg px-6 py-2.5 text-sm font-semibold transition-colors"
            >
              정산 신청
            </button>
          </div>

          {showSettlement && (
            <form onSubmit={handleSettlement} className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input required placeholder="신청 금액 (원)" value={settlement.amount} onChange={(e) => setSettlement({ ...settlement, amount: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#00A1E0] focus:outline-none" />
              <input required placeholder="은행명" value={settlement.bankName} onChange={(e) => setSettlement({ ...settlement, bankName: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#00A1E0] focus:outline-none" />
              <input required placeholder="계좌번호" value={settlement.accountNumber} onChange={(e) => setSettlement({ ...settlement, accountNumber: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#00A1E0] focus:outline-none" />
              <input required placeholder="예금주" value={settlement.accountHolder} onChange={(e) => setSettlement({ ...settlement, accountHolder: e.target.value })} className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm focus:border-[#00A1E0] focus:outline-none" />
              <button type="submit" className="sm:col-span-2 bg-[#00A1E0] hover:bg-[#0090C8] text-white rounded-lg py-3 text-sm font-semibold transition-colors">
                정산 신청하기
              </button>
            </form>
          )}
        </div>

        {/* 최근 수수료 내역 */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="text-sm font-bold text-[#16325C] mb-5">최근 수수료 내역</div>
          {data.recentTransactions.length === 0 ? (
            <div className="text-gray-400 text-center py-8 text-sm">아직 수수료 내역이 없습니다.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-100">
                    {['날짜', '서비스', '결제액', '수수료', '상태'].map((h) => (
                      <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.recentTransactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-600">{new Date(tx.createdAt).toLocaleDateString('ko-KR')}</td>
                      <td className="py-3 px-4 text-[#16325C] font-medium">{tx.serviceName}</td>
                      <td className="py-3 px-4">₩{tx.paymentAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-[#00A1E0] font-semibold">+₩{tx.commissionAmount.toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-semibold ${
                          tx.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {tx.status === 'CONFIRMED' ? '확정' : tx.status === 'PAID' ? '지급완료' : '대기'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
