'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface PaymentResult {
  success: boolean;
  payment?: {
    orderId: string;
    orderName: string;
    amount: number;
    method: string | null;
    approvedAt: string | null;
    status: string;
  };
  error?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();

  const orderId = searchParams.get('orderId') ?? '';
  const paymentKey = searchParams.get('paymentKey') ?? '';
  const amount = searchParams.get('amount') ?? '';
  const serviceId = searchParams.get('serviceId') ?? '';
  const serviceName = searchParams.get('serviceName') ?? '';

  const [result, setResult] = useState<PaymentResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!orderId || !paymentKey || !amount) {
      setResult({ success: false, error: '결제 정보가 올바르지 않습니다.' });
      setLoading(false);
      return;
    }

    async function confirmPayment() {
      try {
        const res = await fetch('/api/payments/confirm', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId,
            paymentKey,
            amount: parseInt(amount, 10),
            serviceId,
            serviceName,
          }),
        });

        const data = await res.json();
        setResult(data);
      } catch {
        setResult({ success: false, error: '결제 확인 중 오류가 발생했습니다.' });
      } finally {
        setLoading(false);
      }
    }

    confirmPayment();
  }, [orderId, paymentKey, amount, serviceId, serviceName]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#00A1E0] mx-auto mb-4" />
          <p className="text-sm text-gray-500">결제를 확인하고 있습니다...</p>
        </div>
      </div>
    );
  }

  if (!result?.success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <svg className="mx-auto mb-4 w-14 h-14 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900 mb-2">결제 확인 실패</h2>
          <p className="text-sm text-gray-500 mb-6">{result?.error ?? '알 수 없는 오류가 발생했습니다.'}</p>
          <Link
            href="/"
            className="inline-block px-6 py-2.5 bg-[#00A1E0] text-white text-sm font-semibold rounded-lg hover:bg-[#0090c8] transition-colors"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const payment = result.payment!;
  const methodLabel: Record<string, string> = {
    CARD: '카드',
    VIRTUAL_ACCOUNT: '가상계좌',
    TRANSFER: '계좌이체',
    MOBILE_PHONE: '휴대폰',
    CULTURE_GIFT_CERTIFICATE: '문화상품권',
    TOSS_PAY: '토스페이',
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md w-full">
        {/* 성공 아이콘 */}
        <div className="text-center mb-6">
          <svg className="mx-auto mb-4 w-16 h-16 text-green-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <h1 className="text-xl font-bold text-[#16325C]">결제가 완료되었습니다</h1>
          <p className="text-sm text-gray-500 mt-1">감사합니다! 서비스를 이용하실 수 있습니다.</p>
        </div>

        {/* 결제 정보 */}
        <div className="border-t border-gray-100 pt-5 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">주문명</span>
            <span className="text-sm font-medium text-gray-900">{payment.orderName}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">주문번호</span>
            <span className="text-xs font-mono text-gray-600">{payment.orderId}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">결제 수단</span>
            <span className="text-sm font-medium text-gray-900">
              {payment.method ? (methodLabel[payment.method] ?? payment.method) : '-'}
            </span>
          </div>
          {payment.approvedAt && (
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">승인 시각</span>
              <span className="text-sm text-gray-600">
                {new Date(payment.approvedAt).toLocaleString('ko-KR')}
              </span>
            </div>
          )}
          <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
            <span className="text-sm font-semibold text-gray-700">결제 금액</span>
            <span className="text-lg font-bold text-[#00A1E0]">
              {payment.amount.toLocaleString('ko-KR')}원
            </span>
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="mt-8 space-y-3">
          <Link
            href="/"
            className="block w-full text-center py-2.5 bg-[#00A1E0] text-white text-sm font-semibold rounded-lg hover:bg-[#0090c8] transition-colors"
          >
            대시보드로 이동
          </Link>
          <Link
            href="/saas"
            className="block w-full text-center py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            다른 서비스 둘러보기
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">로딩 중...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
