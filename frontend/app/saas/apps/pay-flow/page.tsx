'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>,
    title: '결제 수단 통합',
    desc: '카드, 계좌이체, 카카오페이, 네이버페이, 토스페이 원클릭 연동',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    title: '결제 링크/폼 생성',
    desc: '코드 없이 URL 또는 임베드 가능한 결제 폼을 5분 내 생성',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: '정기 구독 관리',
    desc: '구독 플랜 생성, 자동 갱신, 취소/일시정지/재개 원클릭 처리',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>,
    title: '웹훅 시스템',
    desc: '결제 성공/실패/환불 이벤트를 실시간으로 외부 시스템에 전송',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    title: '실시간 매출 현황',
    desc: '오늘/이번달 매출, 환불율, 구독자 현황 실시간 대시보드',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>,
    title: '환불 원클릭 처리',
    desc: '전액/부분 환불을 버튼 하나로 즉시 처리, 자동 내역 기록',
  },
];

const plans = [
  { name: 'Starter', price: '0', sub: '거래 수수료 3.0%', features: ['구독 최대 50명', '기본 결제 수단', '결제 링크 생성'], highlight: false },
  { name: 'Business', price: '49,000', sub: '거래 수수료 1.5%', features: ['구독 무제한', '+ 세금계산서 발행', '+ 웹훅 시스템'], highlight: true },
  { name: 'Enterprise', price: '149,000', sub: '거래 수수료 0.8%', features: ['구독 무제한', '+ 해외 결제 (Stripe)', '+ 전담 매니저'], highlight: false },
];

export default function PayFlowPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">Pay Flow</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700 transition-colors" onClick={() => signIn("google", { callbackUrl: "/saas/apps/pay-flow/dashboard" })}>
            무료 체험 시작
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-full mb-6">
            <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
            SocialDoctors #6 · 결제
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            결제 연동,<br/>
            <span className="text-indigo-600">2-4주 → 5분</span>으로
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            카드, 계좌이체, 간편결제 통합 + 정기 구독 자동 갱신 + 세금계산서 발행까지
            원스톱으로 처리하세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors text-lg shadow-lg shadow-indigo-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/pay-flow/dashboard" })}>
              무료로 시작하기
            </button>
            <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
              데모 보기
            </button>
          </div>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 bg-gray-50 rounded-2xl border border-gray-200 p-6 text-left shadow-xl"
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
            <span className="ml-4 text-sm font-semibold text-gray-700">Pay Flow 대시보드</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: '오늘 매출', value: '₩1,240,000' },
              { label: '이번달 매출', value: '₩38,200,000' },
              { label: '구독자 수', value: '284명' },
              { label: '환불율', value: '1.2%' },
            ].map((item) => (
              <div key={item.label} className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                <p className="text-xl font-bold text-gray-900">{item.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-3">최근 결제</p>
              {[
                { name: '김○○', amount: '₩29,000', status: '성공', time: '2분 전', ok: true },
                { name: '이○○', amount: '₩99,000', status: '성공', time: '1시간 전', ok: true },
                { name: '박○○', amount: '₩79,000', status: '실패', time: '2시간 전', ok: false },
              ].map((r) => (
                <div key={r.name} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-xs font-semibold text-gray-700">{r.name}</span>
                  <span className="text-xs font-bold text-gray-900">{r.amount}</span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.ok ? 'bg-green-600 text-white' : 'bg-red-500 text-white'}`}>{r.status}</span>
                  <span className="text-xs text-gray-500">{r.time}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-3">구독 현황</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">활성 구독</span>
                  <span className="text-lg font-bold text-indigo-600">284명</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">이번달 갱신 예정</span>
                  <span className="text-lg font-bold text-gray-900">48명</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700 flex items-center gap-1"><span className="text-yellow-500">⚠</span>취소 위험</span>
                  <span className="text-lg font-bold text-yellow-600">12명</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">결제의 모든 것, 하나로</h2>
          <p className="text-gray-600">5분 설정, 월 정액, 수수료 최소화</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
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
            <p className="text-gray-600">PG 수수료 별도 (토스페이: 약 2.2%)</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 ${plan.highlight ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-4">인기</span>}
                <h3 className={`text-xl font-bold mb-1 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <p className={`text-xs mb-4 ${plan.highlight ? 'text-indigo-200' : 'text-gray-500'}`}>{plan.sub}</p>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  {plan.price !== '0' && <span className={`text-sm ml-1 ${plan.highlight ? 'text-indigo-100' : 'text-gray-500'}`}>/월</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-indigo-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.highlight ? 'bg-white text-indigo-600 hover:bg-indigo-50' : 'bg-indigo-600 text-white hover:bg-indigo-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/pay-flow/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">지금 바로 결제를 시작하세요</h2>
        <p className="text-gray-600 mb-8">Starter 플랜은 영원히 무료 · 수수료만 발생</p>
        <button className="px-10 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors text-lg shadow-lg shadow-indigo-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/pay-flow/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
