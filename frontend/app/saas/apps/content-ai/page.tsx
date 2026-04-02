'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

const contentTypes = [
  { id: 'blog', label: '블로그 글', desc: '제목 + 소제목 + 본문 + CTA' },
  { id: 'sns', label: 'SNS 카피', desc: 'Facebook/Instagram/X 최적 길이' },
  { id: 'ad', label: '광고 카피', desc: '헤드라인 3종 + 설명 2종' },
  { id: 'email', label: '이메일', desc: '뉴스레터 제목 + 본문' },
];

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>,
    title: '브랜드 학습',
    desc: '브랜드 톤앤매너, 업종, 타겟을 학습해 일관된 메시지 생성',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>,
    title: '한/영/일 다국어',
    desc: 'Gemini AI로 키워드 → 완성 콘텐츠 2분 내 생성, 3개 국어 동시 출력',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
    title: 'SEO 최적화',
    desc: '메타 제목, 메타 설명, 키워드 밀도 자동 체크 및 점수 제공',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'A/B 변형 생성',
    desc: '같은 주제로 다양한 각도의 버전 3종 자동 생성',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: 'Social Pulse 연동',
    desc: '생성된 콘텐츠를 Social Pulse로 바로 전송, 예약 발행',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="1 4 1 10 7 10"/><polyline points="23 20 23 14 17 14"/><path d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"/></svg>,
    title: '콘텐츠 히스토리',
    desc: '생성 내역 전체 저장, 언제든 재편집 가능',
  },
];

const plans = [
  { name: 'Free', price: '0', features: ['생성 10회/월', '브랜드 1개', '한국어'], highlight: false },
  { name: 'Creator', price: '39,000', features: ['생성 200회/월', '브랜드 5개', '한/영'], highlight: false },
  { name: 'Business', price: '99,000', features: ['생성 1,000회/월', '브랜드 20개', '한/영/일'], highlight: true },
  { name: 'Enterprise', price: '299,000', features: ['생성 무제한', '브랜드 무제한', '전 언어 + API'], highlight: false },
];

export default function ContentAIPage() {
  const [selectedType, setSelectedType] = useState('blog');
  const [topic, setTopic] = useState('');

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
          <span className="text-gray-900 font-semibold text-sm">Content AI</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors" onClick={() => signIn("google", { callbackUrl: "/saas/apps/content-ai/dashboard" })}>
            무료 체험 시작
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 text-sm font-semibold rounded-full mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
              SocialDoctors #3 · AI 콘텐츠
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              콘텐츠 제작,<br/>
              <span className="text-purple-600">3시간 → 2분</span>으로
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Gemini AI가 브랜드 톤앤매너를 학습해 블로그, SNS, 광고 카피를
              한/영/일 3개 국어로 즉시 생성합니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors text-lg shadow-lg shadow-purple-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/content-ai/dashboard" })}>
                무료로 시작하기
              </button>
              <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
                데모 보기
              </button>
            </div>
          </motion.div>

          {/* Live Demo */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gray-50 rounded-2xl border border-gray-200 p-6 shadow-xl"
          >
            <p className="text-sm font-semibold text-gray-700 mb-4">콘텐츠 유형 선택</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {contentTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedType(type.id)}
                  className={`p-3 rounded-xl text-left transition-all ${selectedType === type.id ? 'bg-purple-600 text-white' : 'bg-white border border-gray-200 text-gray-700 hover:border-purple-300'}`}
                >
                  <div className="font-semibold text-sm">{type.label}</div>
                  <div className={`text-xs mt-0.5 ${selectedType === type.id ? 'text-purple-100' : 'text-gray-500'}`}>{type.desc}</div>
                </button>
              ))}
            </div>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="주제를 입력하세요 (예: 유기농 농산물 직거래)"
              className="w-full px-4 py-3 bg-white border-2 border-gray-300 rounded-xl text-sm focus:border-purple-400 outline-none mb-3"
            />
            <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors flex items-center justify-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              AI 콘텐츠 생성하기
            </button>
            <div className="mt-4 bg-white rounded-xl border border-gray-200 p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-purple-600 font-semibold">AI 생성 예시</span>
              </div>
              <p className="text-sm font-bold text-gray-900 mb-2">🌱 도시에서 만나는 신선한 자연의 맛</p>
              <p className="text-xs text-gray-600 leading-relaxed">우리 농장에서 직접 재배한 유기농 농산물을 당신의 식탁에 전달합니다. 농약 없이, 정직하게 키운 채소와 과일로 가족의 건강을 지키세요...</p>
              <div className="flex gap-2 mt-3">
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg">복사</button>
                <button className="px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-lg">SNS로 보내기</button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">콘텐츠 생산성 10배 향상</h2>
          <p className="text-gray-600">브랜드 정체성을 유지하며 무한한 콘텐츠를 생성하세요</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-purple-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4">
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
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">투명한 요금제</h2>
            <p className="text-gray-600">Free 플랜으로 먼저 체험해보세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-6 ${plan.highlight ? 'bg-purple-600 text-white shadow-xl shadow-purple-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && (
                  <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-3">인기</span>
                )}
                <h3 className={`text-lg font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  {plan.price !== '0' && <span className={`text-xs ml-1 ${plan.highlight ? 'text-purple-100' : 'text-gray-500'}`}>/월</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-purple-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${plan.highlight ? 'bg-white text-purple-600 hover:bg-purple-50' : 'bg-purple-600 text-white hover:bg-purple-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/content-ai/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">콘텐츠 제작의 새로운 기준</h2>
        <p className="text-gray-600 mb-8">Free 플랜으로 지금 바로 체험하세요</p>
        <button className="px-10 py-4 bg-purple-600 text-white font-bold rounded-xl hover:bg-purple-700 transition-colors text-lg shadow-lg shadow-purple-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/content-ai/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
