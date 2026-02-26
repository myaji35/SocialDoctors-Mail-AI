'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const kpis = [
  { label: '매출', value: '₩48.2M', change: '▲12%', up: true },
  { label: '방문자', value: '24,810', change: '▲8%', up: true },
  { label: '전환율', value: '3.2%', change: '▼0.3%', up: false },
  { label: '신규고객', value: '342명', change: '▲24%', up: true },
];

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: '실시간 KPI 대시보드',
    desc: '매출, 방문자, 전환율, CAC, LTV를 실시간으로 모니터링',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    title: '다중 데이터 소스 연결',
    desc: 'GA4, Facebook Ads, 카페24, 스마트스토어, CSV 통합',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: '드래그앤드롭 차트 빌더',
    desc: '라인, 바, 파이, 퍼널 차트를 마음대로 배치하고 커스터마이징',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    title: '이상 감지 알림',
    desc: '매출 급감/급증 시 Slack/이메일로 즉시 알림 발송',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
    title: '자동 PDF 리포트',
    desc: '주간/월간 리포트를 자동 생성해 이메일로 발송',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    title: 'AI 예측 분석',
    desc: 'Gemini AI로 향후 30일 매출 예측 및 이상 징후 감지',
  },
];

const plans = [
  { name: 'Starter', price: '39,000', features: ['데이터 소스 3개', '대시보드 3개', '알림 5개', '기본 차트'], highlight: false },
  { name: 'Business', price: '99,000', features: ['데이터 소스 10개', '대시보드 무제한', '알림 무제한', 'PDF 리포트'], highlight: true },
  { name: 'Enterprise', price: '299,000', features: ['데이터 소스 무제한', '무제한', 'AI 예측 분석', '이상 감지'], highlight: false },
];

export default function InsightBoardPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">Insight Board</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-orange-600 text-white text-sm font-semibold rounded-lg hover:bg-orange-700 transition-colors" onClick={() => signIn("google", { callbackUrl: "/saas/apps/insight-board/dashboard" })}>
            무료 체험 시작
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 text-sm font-semibold rounded-full mb-6">
            <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
            SocialDoctors #4 · BI 분석
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            데이터 분산 종식,<br/>
            <span className="text-orange-600">의사결정 속도 10배</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            GA4, Facebook Ads, 카페24 데이터를 통합해 실시간으로 시각화하고
            AI 예측으로 선제적 의사결정을 내리세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-orange-600 text-white font-semibold rounded-xl hover:bg-orange-700 transition-colors text-lg shadow-lg shadow-orange-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/insight-board/dashboard" })}>
              무료로 시작하기
            </button>
            <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
              데모 보기
            </button>
          </div>
        </motion.div>

        {/* KPI Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 bg-gray-50 rounded-2xl border border-gray-200 p-6 text-left shadow-xl"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
              <div className="w-3 h-3 rounded-full bg-green-400"></div>
              <span className="ml-4 text-sm font-semibold text-gray-700">Insight Board</span>
            </div>
            <span className="text-xs bg-orange-100 text-orange-700 px-3 py-1 rounded-full font-semibold">⚡ 실시간</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="bg-white rounded-xl p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1">{kpi.label}</p>
                <p className="text-xl font-bold text-gray-900">{kpi.value}</p>
                <p className={`text-xs mt-1 font-semibold ${kpi.up ? 'text-green-600' : 'text-red-500'}`}>{kpi.change}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-3">매출 트렌드 (30일)</p>
              <div className="flex items-end gap-1 h-16">
                {[40, 55, 45, 70, 60, 80, 75, 90, 85, 95, 88, 100].map((h, i) => (
                  <div key={i} className="flex-1 bg-orange-200 rounded-t" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-100">
              <p className="text-xs text-gray-500 mb-3">채널별 유입</p>
              <div className="space-y-2">
                {[['검색', 45, 'bg-orange-500'], ['소셜', 32, 'bg-orange-300'], ['직접', 23, 'bg-orange-100']].map(([label, pct, color]) => (
                  <div key={label as string} className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-8">{label}</span>
                    <div className="flex-1 bg-gray-100 rounded-full h-2">
                      <div className={`${color} h-2 rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                    <span className="text-xs font-semibold text-gray-700 w-8">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center gap-2">
            <span className="text-yellow-600">⚠</span>
            <p className="text-xs text-yellow-800 font-medium">이상 감지: 어제 페이지 이탈률 28% 급증 — Slack으로 알림 발송됨</p>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">데이터 중심 의사결정</h2>
          <p className="text-gray-600">흩어진 데이터를 통합해 인사이트를 즉시 행동으로 연결</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-orange-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4">
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
                className={`rounded-2xl p-8 ${plan.highlight ? 'bg-orange-600 text-white shadow-xl shadow-orange-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-4">인기</span>}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-orange-100' : 'text-gray-500'}`}>/월</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-orange-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.highlight ? 'bg-white text-orange-600 hover:bg-orange-50' : 'bg-orange-600 text-white hover:bg-orange-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/insight-board/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">데이터 기반 경영을 시작하세요</h2>
        <p className="text-gray-600 mb-8">14일 무료 체험 · 신용카드 불필요</p>
        <button className="px-10 py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition-colors text-lg shadow-lg shadow-orange-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/insight-board/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
