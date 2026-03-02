'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

interface Partner {
  id: string;
  name: string;
  email: string;
  referralCode: string;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED';
  createdAt: string;
  wallet?: { currentBalance: number; totalEarned: number };
  _count?: { referredUsers: number; clicks: number };
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  PENDING:   { label: '심사중', className: 'bg-yellow-100 text-yellow-800' },
  ACTIVE:    { label: '활성', className: 'bg-green-100 text-green-800' },
  SUSPENDED: { label: '정지', className: 'bg-red-100 text-red-800' },
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('adminAuth');
    if (auth === 'true') setIsAuth(true);
    else window.location.href = '/admin';
  }, []);

  const fetchPartners = useCallback(async () => {
    if (!isAuth) return;
    setIsLoading(true);
    const url = filter ? `/api/admin/partners?status=${filter}` : '/api/admin/partners';
    const res = await fetch(url, {
      headers: { 'x-admin-token': sessionStorage.getItem('adminPassword') || '' },
    });
    const data = await res.json();
    if (data.success) {
      setPartners(data.data);
      setTotal(data.total);
    }
    setIsLoading(false);
  }, [isAuth, filter]);

  useEffect(() => { fetchPartners(); }, [fetchPartners]);

  const handleStatusChange = async (partnerId: string, status: string) => {
    await fetch('/api/admin/partners', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': sessionStorage.getItem('adminPassword') || '',
      },
      body: JSON.stringify({ partnerId, status }),
    });
    fetchPartners();
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
          <span className="font-semibold text-gray-900">파트너 관리</span>
        </div>
        <Link href="/admin/settlements" className="text-sm text-blue-600 hover:text-blue-800">
          정산 관리 →
        </Link>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">파트너 관리</h1>
            <p className="text-gray-500 text-sm mt-1">전체 {total}명</p>
          </div>
          <div className="flex gap-2">
            {['', 'PENDING', 'ACTIVE', 'SUSPENDED'].map((s) => (
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
        ) : partners.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center text-gray-500">
            등록된 파트너가 없습니다.
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['이름/이메일', '레퍼럴 코드', '클릭/가입', '총 수익', '잔액', '상태', '관리'].map((h) => (
                    <th key={h} className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {partners.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{p.email}</p>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm text-gray-700">{p.referralCode}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {p._count?.clicks ?? 0} / {p._count?.referredUsers ?? 0}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                      ₩{(p.wallet?.totalEarned ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-600 font-semibold">
                      ₩{(p.wallet?.currentBalance ?? 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_LABELS[p.status]?.className}`}>
                        {STATUS_LABELS[p.status]?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={p.status}
                        onChange={(e) => handleStatusChange(p.id, e.target.value)}
                        className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="PENDING">심사중</option>
                        <option value="ACTIVE">활성화</option>
                        <option value="SUSPENDED">정지</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
