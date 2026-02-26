'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
    title: '5분 쇼핑몰 개설',
    desc: '템플릿 선택 → 브랜드 설정 → 즉시 개설. 코딩 불필요',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>,
    title: '상품 관리',
    desc: '옵션(색상/사이즈), 재고 관리, 카테고리 분류까지 한번에',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    title: '결제 통합',
    desc: '카드, 계좌이체, 카카오페이, 네이버페이, 토스페이 모두 지원',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>,
    title: '주문/배송 관리',
    desc: 'CJ대한통운, 우체국 운송장 자동 발행 및 배송 추적',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    title: 'AI 상품 설명 생성',
    desc: 'Content AI 연동으로 상품 설명을 2분 내 자동 작성',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    title: '커스텀 도메인',
    desc: '내 브랜드 도메인 연결 또는 무료 서브도메인 제공',
  },
];

const plans = [
  { name: 'Free', price: '0', sub: '거래 수수료 2.9%', features: ['상품 10개', '서브도메인 제공', '기본 결제'], highlight: false },
  { name: 'Basic', price: '19,000', sub: '거래 수수료 1.5%', features: ['상품 100개', '서브도메인 제공', '배송 연동'], highlight: false },
  { name: 'Pro', price: '49,000', sub: '거래 수수료 0.8%', features: ['상품 무제한', '커스텀 도메인', '+ AI 상품 설명'], highlight: true },
  { name: 'Enterprise', price: '99,000', sub: '수수료 0%', features: ['상품 무제한', '커스텀 도메인', '전용 서버 + 전담 매니저'], highlight: false },
];

export default function ShopBuilderPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">Shop Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-teal-600 text-white text-sm font-semibold rounded-lg hover:bg-teal-700 transition-colors">
            내 쇼핑몰 만들기
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-teal-50 text-teal-700 text-sm font-semibold rounded-full mb-6">
              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
              SocialDoctors #8 · 커머스
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              자사몰 구축,<br/>
              <span className="text-teal-600">500만원 → 5분</span>으로
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              스마트스토어 수수료 5.5%는 그만! 코딩 없이 5분 만에
              전문적인 온라인 쇼핑몰을 직접 운영하세요.
            </p>
            <div className="flex flex-wrap gap-3 mb-8">
              {['수수료 0%', '코딩 불필요', '즉시 개설', 'PG 통합'].map((tag) => (
                <span key={tag} className="px-3 py-1.5 bg-teal-50 text-teal-700 text-sm font-semibold rounded-lg">{tag}</span>
              ))}
            </div>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-teal-600 text-white font-semibold rounded-xl hover:bg-teal-700 transition-colors text-lg shadow-lg shadow-teal-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/shop-builder/dashboard" })}>
                무료로 시작하기
              </button>
              <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
                쇼핑몰 예시 보기
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-xl"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-4 text-sm font-semibold text-gray-700">현주네 직거래 농장</span>
            </div>

            <div className="grid grid-cols-4 gap-2 mb-4">
              {[
                { label: '오늘 매출', value: '₩842,000' },
                { label: '신규 주문', value: '12건' },
                { label: '처리 대기', value: '5건' },
                { label: '재고 경고', value: '2개' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-base font-bold text-gray-900 mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4 mb-3">
              <p className="text-xs text-gray-500 mb-2">최근 주문</p>
              {[
                { no: '#1024', name: '김○○', amount: '₩45,000', status: '배송준비', color: 'text-blue-600' },
                { no: '#1023', name: '이○○', amount: '₩128,000', status: '결제완료', color: 'text-green-600' },
                { no: '#1022', name: '박○○', amount: '₩67,000', status: '배송중', color: 'text-teal-600' },
              ].map((o) => (
                <div key={o.no} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs font-mono text-gray-500">{o.no}</span>
                  <span className="text-xs font-semibold text-gray-700">{o.name}</span>
                  <span className="text-xs font-bold text-gray-900">{o.amount}</span>
                  <span className={`text-xs font-semibold ${o.color}`}>{o.status}</span>
                </div>
              ))}
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-orange-500">⚠</span>
              <div>
                <p className="text-xs font-bold text-orange-800">재고 부족 알림</p>
                <p className="text-xs text-orange-600 mt-0.5">제주 감귤 재고 0개 — 즉시 보충 필요</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">내 가게, 내 마음대로</h2>
          <p className="text-gray-600">플랫폼 수수료 없이 100% 내 브랜드로 운영하세요</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">투명한 요금제</h2>
            <p className="text-gray-600">Free 플랜으로 먼저 시작하세요 · 언제든 업그레이드 가능</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-6 ${plan.highlight ? 'bg-teal-600 text-white shadow-xl shadow-teal-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-3">인기</span>}
                <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-xs mb-3 ${plan.highlight ? 'text-teal-200' : 'text-gray-500'}`}>{plan.sub}</p>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  {plan.price !== '0' && <span className={`text-xs ml-1 ${plan.highlight ? 'text-teal-100' : 'text-gray-500'}`}>/월</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-teal-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${plan.highlight ? 'bg-white text-teal-600 hover:bg-teal-50' : 'bg-teal-600 text-white hover:bg-teal-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/shop-builder/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">내 쇼핑몰, 지금 만들어보세요</h2>
        <p className="text-gray-600 mb-8">Free 플랜 · 수수료 2.9% · 언제든 취소 가능</p>
        <button className="px-10 py-4 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors text-lg shadow-lg shadow-teal-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/shop-builder/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
