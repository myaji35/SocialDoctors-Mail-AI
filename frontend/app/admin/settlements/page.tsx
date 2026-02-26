'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Settlement {
  id: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  accountHolder: string;
  status: 'REQUESTED' | 'PROCESSING' | 'COMPLETED' | 'REJECTED';
  memo?: string;
  createdAt: string;
  processedAt?: string;
  wallet: {
    partner: { name: string; email: string; referralCode: string };
  };
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  REQUESTED:  { label: '신청', className: 'bg-yellow-100 text-yellow-800' },
  PROCESSING: { label: '처리중', className: 'bg-blue-100 text-blue-800' },
  COMPLETED:  { label: '완료', className: 'bg-green-100 text-green-800' },
  REJECTED:   { label: '거절', className: 'bg-red-100 text-red-800' },
};

export default function AdminSettlementsPage() {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('REQUESTED');
  const [isAuth, setIsAuth] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') setIsAuth(true);
    else window.location.href = '/admin';
  }, []);

  const fetchSettlements = useCallback(async () => {
    if (!isAuth) return;
    setIsLoading(true);
    const url = filter ? `/api/admin/settlements?status=${filter}` : '/api/admin/settlements';
    const res = await fetch(url, {
      headers: { 'x-admin-token': sessionStorage.getItem('adminPassword') || '' },
    });
    const data = await res.json();
    if (data.success) {
      setSettlements(data.data);
      setTotal(data.total);
    }
    setIsLoading(false);
  }, [isAuth, filter]);

  useEffect(() => { fetchSettlements(); }, [fetchSettlements]);

  const handleProcess = async (settlementId: string, status: 'COMPLETED' | 'REJECTED', memo?: string) => {
    setProcessingId(settlementId);
    await fetch('/api/admin/settlements', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': sessionStorage.getItem('adminPassword') || '',
      },
      body: JSON.stringify({ settlementId, status, memo }),
    });
    setProcessingId(null);
    fetchSettlements();
  };

  if (!isAuth) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            어드민
          </Link>
          <span className="text-gray-300">/</span>
          <span className="font-semibold text-gray-900">정산 관리</span>
        </div>
        <Link href="/admin/partners" className="text-sm text-blue-600 hover:text-blue-800">
          파트너 관리 →
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">정산 관리</h1>
            <p className="text-gray-500 text-sm mt-1">전체 {total}건</p>
          </div>
          <div className="flex gap-2">
            {['REQUESTED', 'PROCESSING', 'COMPLETED', 'REJECTED', ''].map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === s ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {s === '' ? '전체' : STATUS_LABELS[s]?.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          </div>
        ) : settlements.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            {filter ? `${STATUS_LABELS[filter]?.label} 상태의 정산 요청이 없습니다.` : '정산 요청이 없습니다.'}
          </div>
        ) : (
          <div className="space-y-3">
            {settlements.map((s) => (
              <div key={s.id} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[s.status]?.className}`}>
                        {STATUS_LABELS[s.status]?.label}
                      </span>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">₩{s.amount.toLocaleString()}</p>
                      <p className="text-sm text-gray-600 mt-0.5">
                        {s.wallet.partner.name} ({s.wallet.partner.email})
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {s.bankName} {s.accountNumber} · {s.accountHolder}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        신청일: {new Date(s.createdAt).toLocaleDateString('ko-KR')}
                        {s.processedAt && ` · 처리일: ${new Date(s.processedAt).toLocaleDateString('ko-KR')}`}
                      </p>
                      {s.memo && <p className="text-xs text-gray-500 mt-1 italic">메모: {s.memo}</p>}
                    </div>
                  </div>

                  {s.status === 'REQUESTED' && (
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleProcess(s.id, 'COMPLETED')}
                        disabled={processingId === s.id}
                        className="px-4 py-2 bg-green-600 text-white text-sm font-semibold rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                      >
                        {processingId === s.id ? '처리중...' : '승인'}
                      </button>
                      <button
                        onClick={() => {
                          const memo = prompt('거절 사유를 입력하세요:');
                          if (memo !== null) handleProcess(s.id, 'REJECTED', memo);
                        }}
                        disabled={processingId === s.id}
                        className="px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                      >
                        거절
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
