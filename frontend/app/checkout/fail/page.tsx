'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

function FailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const code = searchParams.get('code') ?? '';
  const message = searchParams.get('message') ?? '결제 처리 중 오류가 발생했습니다.';
  const orderId = searchParams.get('orderId') ?? '';

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
        {/* 실패 아이콘 */}
        <svg className="mx-auto mb-4 w-16 h-16 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>

        <h1 className="text-xl font-bold text-[#16325C] mb-2">결제에 실패했습니다</h1>
        <p className="text-sm text-gray-500 mb-2">{message}</p>
        {code && (
          <p className="text-xs text-gray-400 mb-1">오류 코드: {code}</p>
        )}
        {orderId && (
          <p className="text-xs text-gray-400 mb-6">주문번호: {orderId}</p>
        )}

        {!code && !orderId && <div className="mb-6" />}

        {/* 액션 버튼 */}
        <div className="space-y-3">
          <button
            onClick={() => router.back()}
            className="w-full py-2.5 bg-[#00A1E0] text-white text-sm font-semibold rounded-lg hover:bg-[#0090c8] transition-colors"
          >
            다시 시도하기
          </button>
          <button
            onClick={() => router.push('/')}
            className="w-full py-2.5 bg-white border border-gray-300 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-50 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutFailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">로딩 중...</div>
      </div>
    }>
      <FailContent />
    </Suspense>
  );
}
