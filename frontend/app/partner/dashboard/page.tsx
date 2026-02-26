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

  if (loading) return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#16325C' }}>로딩 중...</div>;
  if (!data) return null;

  const statCards = [
    { label: '총 클릭', value: data.stats.totalClicks.toLocaleString(), unit: '회' },
    { label: '총 가입', value: data.stats.totalSignups.toLocaleString(), unit: '명' },
    { label: '전환율', value: data.stats.conversionRate.toFixed(1), unit: '%' },
    { label: '총 수익', value: data.stats.totalEarned.toLocaleString(), unit: '원' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F3F2F2' }}>
      {/* Header */}
      <div style={{ background: '#16325C', padding: '14px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ color: '#00A1E0', fontWeight: 700, fontSize: '18px' }}>SocialDoctors</span>
        <span style={{ color: '#fff', fontSize: '14px' }}>{data.partner.name} 파트너 대시보드</span>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* PENDING 상태 배너 */}
        {data.partner.status === 'PENDING' && (
          <div style={{ background: '#FFF8E1', border: '1.5px solid #F6C84B', borderRadius: '8px', padding: '16px 24px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#F39C12" strokeWidth={2} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <div>
              <div style={{ fontWeight: 700, color: '#856404', marginBottom: '4px' }}>파트너 심사 중입니다</div>
              <div style={{ fontSize: '13px', color: '#997404' }}>
                신청이 접수되었습니다. 영업일 1~3일 내에 검토 후 이메일로 결과를 안내드립니다.
                승인 완료 전까지는 소개 링크가 비활성화됩니다.
              </div>
            </div>
          </div>
        )}

        {/* SUSPENDED 상태 배너 */}
        {data.partner.status === 'SUSPENDED' && (
          <div style={{ background: '#FFF0F0', border: '1.5px solid #F5C6CB', borderRadius: '8px', padding: '16px 24px', marginBottom: '20px', display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#DC3545" strokeWidth={2} style={{ width: '20px', height: '20px', flexShrink: 0, marginTop: '2px' }}><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            <div>
              <div style={{ fontWeight: 700, color: '#721C24', marginBottom: '4px' }}>계정이 정지되었습니다</div>
              <div style={{ fontSize: '13px', color: '#842029' }}>자세한 사항은 support@socialdoctors.co.kr 로 문의해 주세요.</div>
            </div>
          </div>
        )}

        {/* 정산 결과 메시지 */}
        {settlementMsg && (
          <div style={{ background: settlementMsg.type === 'success' ? '#D4EDDA' : '#F8D7DA', border: `1.5px solid ${settlementMsg.type === 'success' ? '#C3E6CB' : '#F5C6CB'}`, borderRadius: '8px', padding: '14px 20px', marginBottom: '20px', fontSize: '14px', color: settlementMsg.type === 'success' ? '#155724' : '#721C24', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{settlementMsg.text}</span>
            <button onClick={() => setSettlementMsg(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', color: '#888' }}>×</button>
          </div>
        )}

        {/* 소개 링크 */}
        <div style={{ background: '#fff', borderRadius: '8px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', opacity: data.partner.status !== 'ACTIVE' ? 0.6 : 1 }}>
          <div style={{ fontSize: '13px', color: '#888', marginBottom: '8px', fontWeight: 600 }}>내 소개 링크</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flex: 1, background: '#F3F2F2', borderRadius: '6px', padding: '10px 14px', fontSize: '14px', color: '#16325C', fontFamily: 'monospace', filter: data.partner.status !== 'ACTIVE' ? 'blur(4px)' : 'none', userSelect: data.partner.status !== 'ACTIVE' ? 'none' : 'auto' }}>
              {data.partner.referralUrl}
            </div>
            <button
              onClick={copyLink}
              disabled={data.partner.status !== 'ACTIVE'}
              style={{ background: data.partner.status !== 'ACTIVE' ? '#ccc' : copied ? '#28a745' : '#00A1E0', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: data.partner.status !== 'ACTIVE' ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '14px', whiteSpace: 'nowrap' }}
            >
              {data.partner.status !== 'ACTIVE' ? '승인 후 활성화' : copied ? '복사됨!' : '링크 복사'}
            </button>
          </div>
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#aaa' }}>
            상태: <span style={{ color: data.partner.status === 'ACTIVE' ? '#28a745' : data.partner.status === 'PENDING' ? '#f39c12' : '#dc3545', fontWeight: 600 }}>{data.partner.status === 'ACTIVE' ? '활성' : data.partner.status === 'PENDING' ? '승인 대기중' : '정지됨'}</span>
          </div>
        </div>

        {/* KPI 카드 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {statCards.map((card) => (
            <div key={card.label} style={{ background: '#fff', borderRadius: '8px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
              <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px', fontWeight: 600 }}>{card.label}</div>
              <div style={{ fontSize: '28px', fontWeight: 700, color: '#16325C' }}>
                {card.value}<span style={{ fontSize: '14px', color: '#888', marginLeft: '4px' }}>{card.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* 차트 */}
        <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#16325C', marginBottom: '20px' }}>최근 30일 클릭 / 가입 추이</div>
          {data.clicksChart.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={data.clicksChart}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="clicks" stroke="#00A1E0" strokeWidth={2} name="클릭" dot={false} />
                <Line type="monotone" dataKey="signups" stroke="#16325C" strokeWidth={2} name="가입" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb' }}>
              아직 클릭 데이터가 없습니다.
            </div>
          )}
        </div>

        {/* 정산 */}
        <div style={{ background: '#fff', borderRadius: '8px', padding: '20px 24px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#888', fontWeight: 600 }}>출금 가능 잔액</span>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#16325C', marginLeft: '12px' }}>
                ₩{data.stats.currentBalance.toLocaleString()}
              </span>
              <span style={{ fontSize: '13px', color: '#aaa', marginLeft: '16px' }}>
                정산 대기: ₩{data.stats.pendingAmount.toLocaleString()}
              </span>
            </div>
            <button
              onClick={() => setShowSettlement(!showSettlement)}
              style={{ background: '#16325C', color: '#fff', border: 'none', borderRadius: '6px', padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}
            >
              정산 신청
            </button>
          </div>

          {showSettlement && (
            <form onSubmit={handleSettlement} style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input required placeholder="신청 금액 (원)" value={settlement.amount} onChange={(e) => setSettlement({ ...settlement, amount: e.target.value })} style={{ padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
              <input required placeholder="은행명" value={settlement.bankName} onChange={(e) => setSettlement({ ...settlement, bankName: e.target.value })} style={{ padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
              <input required placeholder="계좌번호" value={settlement.accountNumber} onChange={(e) => setSettlement({ ...settlement, accountNumber: e.target.value })} style={{ padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
              <input required placeholder="예금주" value={settlement.accountHolder} onChange={(e) => setSettlement({ ...settlement, accountHolder: e.target.value })} style={{ padding: '10px 14px', border: '1.5px solid #ddd', borderRadius: '6px', fontSize: '14px' }} />
              <button type="submit" style={{ gridColumn: '1 / -1', background: '#00A1E0', color: '#fff', border: 'none', borderRadius: '6px', padding: '12px', fontWeight: 600, cursor: 'pointer' }}>
                정산 신청하기
              </button>
            </form>
          )}
        </div>

        {/* 최근 수수료 내역 */}
        <div style={{ background: '#fff', borderRadius: '8px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#16325C', marginBottom: '16px' }}>최근 수수료 내역</div>
          {data.recentTransactions.length === 0 ? (
            <div style={{ color: '#bbb', textAlign: 'center', padding: '24px' }}>아직 수수료 내역이 없습니다.</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #F3F2F2' }}>
                  {['날짜', '서비스', '결제액', '수수료', '상태'].map((h) => (
                    <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: '#888', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.recentTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #F3F2F2' }}>
                    <td style={{ padding: '10px 12px', color: '#555' }}>{new Date(tx.createdAt).toLocaleDateString('ko-KR')}</td>
                    <td style={{ padding: '10px 12px', color: '#16325C', fontWeight: 500 }}>{tx.serviceName}</td>
                    <td style={{ padding: '10px 12px' }}>₩{tx.paymentAmount.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px', color: '#00A1E0', fontWeight: 600 }}>+₩{tx.commissionAmount.toLocaleString()}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ background: tx.status === 'CONFIRMED' ? '#e8f5e9' : '#fff8e1', color: tx.status === 'CONFIRMED' ? '#2e7d32' : '#f57f17', borderRadius: '4px', padding: '3px 8px', fontSize: '12px', fontWeight: 600 }}>
                        {tx.status === 'CONFIRMED' ? '확정' : tx.status === 'PAID' ? '지급완료' : '대기'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
