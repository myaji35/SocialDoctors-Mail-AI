'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
      </svg>
    ),
    title: '멀티 플랫폼 연동',
    desc: 'Facebook, Instagram, X, YouTube를 하나의 대시보드에서 통합 관리',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
    title: '콘텐츠 예약 발행',
    desc: '날짜/시간 지정 발행, 반복 예약으로 최적 시간에 자동 포스팅',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'AI 카피 생성',
    desc: 'Gemini AI가 업종별 최적화 카피를 2분 내 자동 생성',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
      </svg>
    ),
    title: '통합 인박스',
    desc: '모든 채널 댓글/DM을 한 화면에서 확인하고 빠르게 대응',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    title: '통합 분석',
    desc: '게시물별 도달, 좋아요, 공유 통계를 한눈에 파악',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
      </svg>
    ),
    title: '콘텐츠 캘린더',
    desc: '월간/주간 뷰로 발행 일정 한눈에 관리',
  },
];

const plans = [
  {
    name: 'Starter',
    price: '29,000',
    features: ['채널 3개', '예약 게시물 30개/월', 'AI 생성 50회/월', '기본 분석'],
    highlight: false,
  },
  {
    name: 'Growth',
    price: '79,000',
    features: ['채널 10개', '예약 게시물 무제한', 'AI 생성 200회/월', '고급 분석 + A/B 테스트'],
    highlight: true,
  },
  {
    name: 'Agency',
    price: '199,000',
    features: ['채널 무제한', '예약 게시물 무제한', 'AI 생성 무제한', '팀 협업 + 승인 워크플로우'],
    highlight: false,
  },
];

export default function SocialPulsePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">Social Pulse</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors" onClick={() => signIn("google", { callbackUrl: "/saas/apps/social-pulse/dashboard" })}>
            무료 체험 시작
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full mb-6">
            <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
            SocialDoctors #1 · 소셜 마케팅
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            소셜 채널 관리,<br/>
            <span className="text-blue-600">하루 3시간 → 90분</span>으로
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            AI 카피 생성 + 예약 발행 + 통합 인박스로 Facebook, Instagram, X, YouTube를
            하나의 대시보드에서 관리하세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-lg shadow-lg shadow-blue-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/social-pulse/dashboard" })}>
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
            <div className="ml-4 flex gap-4 text-sm text-gray-500">
              <span className="font-semibold text-gray-700">Social Pulse</span>
              <span>새 게시물</span>
              <span>캘린더</span>
              <span>분석</span>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: '이번달 게시물', value: '47', change: '+12%', up: true },
              { label: '총 도달수', value: '124,800', change: '+8%', up: true },
              { label: '평균 참여율', value: '4.2%', change: '+0.8%', up: true },
              { label: 'AI 카피 생성', value: '89회', change: '이번달', up: null },
            ].map((stat) => (
              <div key={stat.label} className="bg-white rounded-xl p-4 border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-xs mt-1 font-semibold ${stat.up === true ? 'text-green-600' : 'text-gray-500'}`}>{stat.change}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {['Facebook 예약 발행 완료 - 2시간 후 자동 포스팅', 'Instagram 카피 AI 생성 완료', 'X(Twitter) 새 댓글 14건'].map((item) => (
              <div key={item} className="bg-blue-50 rounded-lg p-3 text-xs text-blue-800 font-medium">{item}</div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Business Clinic 처방</h2>
          <p className="text-gray-600">소셜 채널 관리에 지친 마케터를 위한 완벽한 솔루션</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
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
            <p className="text-gray-600">파트너 소개 시 20% 수수료 · 연간 결제 시 20% 할인</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-8 ${plan.highlight ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && (
                  <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-4">인기</span>
                )}
                <h3 className={`text-xl font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  <span className={`text-sm ml-1 ${plan.highlight ? 'text-blue-100' : 'text-gray-500'}`}>/월</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-blue-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0 text-current"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-semibold transition-colors ${plan.highlight ? 'bg-white text-blue-600 hover:bg-blue-50' : 'bg-blue-600 text-white hover:bg-blue-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/social-pulse/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">지금 바로 시작하세요</h2>
        <p className="text-gray-600 mb-8">14일 무료 체험 · 신용카드 불필요 · 언제든 취소 가능</p>
        <button className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors text-lg shadow-lg shadow-blue-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/social-pulse/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
