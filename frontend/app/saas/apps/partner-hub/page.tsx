'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    title: '레퍼럴 링크 자동 생성',
    desc: '고유 코드(SD-XXXXXX) 즉시 발급, QR코드 자동 생성',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: '실시간 추적',
    desc: 'UTM 파라미터 + 쿠키 기반 클릭/전환 추적 (30~90일)',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    title: '자동 수수료 계산',
    desc: '고정율/단계별 커미션 자동 계산, 월별 정산 내역 제공',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>,
    title: '파트너 대시보드',
    desc: '클릭, 전환, 수익 실시간 시각화 대시보드',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: '파트너 온보딩 자동화',
    desc: '신청 → 심사 → 승인 워크플로우 완전 자동화',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    title: '정산 자동화',
    desc: '파트너 출금 신청 → 관리자 승인 → 토스페이 자동 입금',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '49,000',
    features: ['파트너 50명', '추적 기간 30일', '기본 추적 + 대시보드', '이메일 지원'],
    highlight: false,
  },
  {
    name: 'Business',
    price: '149,000',
    features: ['파트너 500명', '추적 기간 90일', '+ 다단계 + 파트너 등급', '쿠폰 코드 통합'],
    highlight: true,
  },
  {
    name: 'Enterprise',
    price: '399,000',
    features: ['파트너 무제한', '추적 기간 180일', '+ 자동 입금 + 세금계산서', '전담 매니저'],
    highlight: false,
  },
];

const stats = [
  { value: '₩2,340,000', label: '파트너 평균 월수익' },
  { value: '247명', label: '파트너 평균 추천 고객' },
  { value: '20%', label: '수수료율' },
  { value: '30일', label: '쿠키 추적 기간' },
];

export default function PartnerHubPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">Partner Hub</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg hover:bg-emerald-700 transition-colors">
            파트너 신청하기
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 text-sm font-semibold rounded-full mb-6">
            <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
            SocialDoctors #2 · 파트너 관리
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            파트너 프로그램,<br/>
            <span className="text-emerald-600">엑셀 없이 완전 자동화</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            레퍼럴 링크 발급부터 클릭·전환 추적, 수수료 계산, 정산까지
            파트너 비즈니스 전 과정을 자동화하세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-emerald-600 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors text-lg shadow-lg shadow-emerald-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/partner-hub/dashboard" })}>
              무료로 시작하기
            </button>
            <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
              데모 보기
            </button>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="bg-emerald-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-emerald-700 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-10 bg-gray-50 rounded-2xl border border-gray-200 p-6 text-left shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-4 text-sm font-semibold text-gray-700">Partner Hub 대시보드</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100 col-span-1">
              <p className="text-xs text-gray-500 mb-3">내 레퍼럴 링크</p>
              <code className="text-sm font-mono bg-emerald-50 text-emerald-700 px-3 py-2 rounded-lg block mb-3">SD-A1B2C3</code>
              <div className="flex gap-2">
                <button className="flex-1 py-1.5 bg-emerald-600 text-white text-xs font-semibold rounded-lg">복사</button>
                <button className="flex-1 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">QR코드</button>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500">출금 가능 잔액</p>
                <p className="text-2xl font-bold text-emerald-600 mt-1">₩1,200,000</p>
                <button className="mt-2 w-full py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-lg">출금 신청</button>
              </div>
            </div>
            <div className="col-span-2 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '오늘 클릭', value: '247' },
                  { label: '전환', value: '12' },
                  { label: '오늘 수익', value: '₩86,400' },
                ].map((item) => (
                  <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="text-xl font-bold text-gray-900 mt-1">{item.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-3">최근 추천 고객</p>
                {['kim***@naver.com  ₩58,000  방금 전', 'lee***@gmail.com  ₩29,000  1시간 전', 'park***@daum.net  ₩79,000  오늘'].map((r) => (
                  <div key={r} className="text-xs text-gray-700 py-1.5 border-b border-gray-50 last:border-0 font-mono">{r}</div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">파트너 시스템 완전 자동화</h2>
          <p className="text-gray-600">SocialDoctors 자체 운영 중인 파트너 시스템 — 실전 검증 완료</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-emerald-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">투명한 요금제</h2>
            <p className="text-gray-600">SocialDoctors 파트너 소개 시 20% 수수료 제공</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 ${plan.highlight ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && (
                  <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-4">인기</span>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-emerald-100' : 'text-gray-500'}`}>/월</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-emerald-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.highlight ? 'bg-white text-emerald-600 hover:bg-emerald-50' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/partner-hub/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">파트너 프로그램을 자동화하세요</h2>
        <p className="text-gray-600 mb-8">14일 무료 체험 · 신용카드 불필요</p>
        <button className="px-10 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors text-lg shadow-lg shadow-emerald-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/partner-hub/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
