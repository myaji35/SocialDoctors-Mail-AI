'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { loadTossPayments, TossPaymentsWidgets } from '@tosspayments/tosspayments-sdk';
import { TOSS_CLIENT_KEY, generateOrderId } from '@/lib/toss';

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();

  const serviceId = searchParams.get('serviceId') ?? '';
  const serviceName = searchParams.get('serviceName') ?? '서비스';
  const amount = parseInt(searchParams.get('amount') ?? '0', 10);
  const planName = searchParams.get('planName') ?? '';

  const [widgets, setWidgets] = useState<TossPaymentsWidgets | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState('');
  const paymentMethodRef = useRef<HTMLDivElement>(null);
  const agreementRef = useRef<HTMLDivElement>(null);

  // 로그인 체크
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace(`/sign-in?callbackUrl=${encodeURIComponent(window.location.href)}`);
    }
  }, [status, router]);

  // Toss Payments 위젯 초기화
  useEffect(() => {
    if (status !== 'authenticated' || !amount || !TOSS_CLIENT_KEY) return;

    let cancelled = false;

    async function initWidgets() {
      try {
        const tossPayments = await loadTossPayments(TOSS_CLIENT_KEY);
        const w = tossPayments.widgets({
          customerKey: session!.user!.id ?? 'anonymous',
        });

        await w.setAmount({ currency: 'KRW', value: amount });

        if (!cancelled && paymentMethodRef.current) {
          await w.renderPaymentMethods({
            selector: '#payment-method',
            variantKey: 'DEFAULT',
          });
        }

        if (!cancelled && agreementRef.current) {
          await w.renderAgreement({
            selector: '#agreement',
            variantKey: 'AGREEMENT',
          });
        }

        if (!cancelled) {
          setWidgets(w);
          setIsReady(true);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[Checkout] Widget init error:', err);
          setError('결제 위젯을 초기화할 수 없습니다.');
        }
      }
    }

    initWidgets();
    return () => { cancelled = true; };
  }, [status, amount, session]);

  async function handlePayment() {
    if (!widgets) return;

    const orderId = generateOrderId();

    try {
      await widgets.requestPayment({
        orderId,
        orderName: planName ? `${serviceName} - ${planName}` : serviceName,
        successUrl: `${window.location.origin}/checkout/success?serviceId=${serviceId}&serviceName=${encodeURIComponent(serviceName)}`,
        failUrl: `${window.location.origin}/checkout/fail`,
        customerEmail: session?.user?.email ?? undefined,
        customerName: session?.user?.name ?? undefined,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : '결제 요청 중 오류가 발생했습니다.';
      setError(message);
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">로딩 중...</div>
      </div>
    );
  }

  if (!amount) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 max-w-md w-full text-center">
          <svg className="mx-auto mb-4 w-12 h-12 text-red-500" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
          <h2 className="text-lg font-bold text-gray-900 mb-2">잘못된 접근입니다</h2>
          <p className="text-sm text-gray-500 mb-6">결제 금액 정보가 없습니다.</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-2.5 bg-[#00A1E0] text-white text-sm font-semibold rounded-lg hover:bg-[#0090c8] transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-lg mx-auto">
        {/* 헤더 */}
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-[#16325C]">결제하기</h1>
          <p className="text-sm text-gray-500 mt-1">SocialDoctors 서비스 결제</p>
        </div>

        {/* 주문 요약 카드 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-semibold text-gray-600 mb-4 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              <rect x="9" y="3" width="6" height="4" rx="1" />
            </svg>
            주문 요약
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">서비스</span>
              <span className="text-sm font-medium text-gray-900">{serviceName}</span>
            </div>
            {planName && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">플랜</span>
                <span className="text-sm font-medium text-gray-900">{planName}</span>
              </div>
            )}
            <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
              <span className="text-sm font-semibold text-gray-700">결제 금액</span>
              <span className="text-lg font-bold text-[#00A1E0]">
                {amount.toLocaleString('ko-KR')}원
              </span>
            </div>
          </div>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* 결제 수단 위젯 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-4">
          <div id="payment-method" ref={paymentMethodRef} />
        </div>

        {/* 동의 위젯 */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 mb-6">
          <div id="agreement" ref={agreementRef} />
        </div>

        {/* 결제 버튼 */}
        <button
          onClick={handlePayment}
          disabled={!isReady}
          className="w-full py-3 bg-[#00A1E0] text-white text-sm font-semibold rounded-lg hover:bg-[#0090c8] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isReady ? `${amount.toLocaleString('ko-KR')}원 결제하기` : '결제 준비 중...'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-4">
          결제는 토스페이먼츠를 통해 안전하게 처리됩니다.
        </p>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500 text-sm">결제 페이지 로딩 중...</div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
