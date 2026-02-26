'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const segments = [
  { label: 'VIP', count: 42, color: 'bg-yellow-500', amount: '₩2.3M+' },
  { label: '충성', count: 86, color: 'bg-green-500', amount: '₩500K+' },
  { label: '잠재', count: 128, color: 'bg-blue-500', amount: '₩100K+' },
  { label: '이탈 위험', count: 18, color: 'bg-red-500', amount: '90일 미구매' },
  { label: '신규', count: 50, color: 'bg-gray-400', amount: '0~30일' },
];

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: '통합 고객 DB',
    desc: '이름, 연락처, 구매이력, 태그, 메모를 한 곳에서 관리',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
    title: 'RFM 세그먼트 자동 분류',
    desc: '구매 최신성·빈도·금액 기반으로 VIP/충성/이탈위험 자동 분류',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 12 16 12 13 21 11 3 8 12 2 12"/></svg>,
    title: '커뮤니케이션 타임라인',
    desc: '상담/구매/이메일 이력을 시간순으로 한눈에 확인',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    title: '자동화 시나리오',
    desc: '구매 후 리뷰 요청, 90일 미구매 쿠폰, 생일 혜택 자동 발송',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>,
    title: '영업 파이프라인',
    desc: '리드 → 상담 → 계약 → 완료 단계 시각화 관리',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: '이탈 예측 AI',
    desc: 'AI가 이탈 가능성 높은 고객을 사전에 감지하고 알림',
  },
];

const plans = [
  { name: 'Starter', price: '29,000', features: ['고객 500명', '자동화 3개', 'SMS 100건/월'], highlight: false },
  { name: 'Growth', price: '79,000', features: ['고객 5,000명', '자동화 20개', 'SMS 1,000건/월'], highlight: true },
  { name: 'Business', price: '199,000', features: ['고객 무제한', '자동화 무제한', 'SMS 5,000건/월'], highlight: false },
];

export default function CrmProPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">CRM Pro</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-cyan-600 text-white text-sm font-semibold rounded-lg hover:bg-cyan-700 transition-colors" onClick={() => signIn("google", { callbackUrl: "/saas/apps/crm-pro/dashboard" })}>
            무료 체험 시작
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-50 text-cyan-700 text-sm font-semibold rounded-full mb-6">
              <span className="w-2 h-2 bg-cyan-500 rounded-full"></span>
              SocialDoctors #5 · CRM
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              고객 관리,<br/>
              <span className="text-cyan-600">엑셀에서 AI로</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              RFM 자동 세그먼트, 이탈 예측 AI, 자동화 커뮤니케이션으로
              고객 생애 가치(LTV)를 극대화하세요.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-cyan-600 text-white font-semibold rounded-xl hover:bg-cyan-700 transition-colors text-lg shadow-lg shadow-cyan-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/crm-pro/dashboard" })}>
                무료로 시작하기
              </button>
              <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
                데모 보기
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
              <span className="ml-4 text-sm font-semibold text-gray-700">CRM Pro</span>
            </div>

            <p className="text-xs text-gray-500 mb-3">RFM 고객 세그먼트</p>
            <div className="space-y-2 mb-4">
              {segments.map((seg) => (
                <div key={seg.label} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${seg.color}`}></div>
                  <span className="text-sm text-gray-700 w-16">{seg.label}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className={`${seg.color} h-2 rounded-full`} style={{ width: `${(seg.count / 324) * 100}%` }}></div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 w-6">{seg.count}</span>
                  <span className="text-xs text-gray-500 w-20 text-right">{seg.amount}</span>
                </div>
              ))}
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
              <span className="text-red-500 mt-0.5">⚠</span>
              <div>
                <p className="text-xs font-bold text-red-800">이탈 위험 고객 감지</p>
                <p className="text-xs text-red-600 mt-0.5">이준혁 고객 89일 미구매 — 자동 쿠폰 발송 예약됨</p>
              </div>
            </div>

            <div className="mt-3 bg-white rounded-xl border border-gray-100 p-3">
              <p className="text-xs text-gray-500 mb-2">이번달 자동화 성과</p>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <p className="text-lg font-bold text-cyan-600">87%</p>
                  <p className="text-xs text-gray-500">SMS 오픈율</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-cyan-600">₩4.2M</p>
                  <p className="text-xs text-gray-500">자동화 매출</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-cyan-600">12명</p>
                  <p className="text-xs text-gray-500">이탈 방어</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">고객 LTV 극대화 도구</h2>
          <p className="text-gray-600">AI 세그먼트 + 자동화로 재구매율을 2배 높이세요</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-cyan-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">투명한 요금제</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 ${plan.highlight ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-4">인기</span>}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-cyan-100' : 'text-gray-500'}`}>/월</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-cyan-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.highlight ? 'bg-white text-cyan-600 hover:bg-cyan-50' : 'bg-cyan-600 text-white hover:bg-cyan-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/crm-pro/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">고객과의 관계를 자동화하세요</h2>
        <p className="text-gray-600 mb-8">14일 무료 체험 · 신용카드 불필요</p>
        <button className="px-10 py-4 bg-cyan-600 text-white font-bold rounded-xl hover:bg-cyan-700 transition-colors text-lg shadow-lg shadow-cyan-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/crm-pro/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
