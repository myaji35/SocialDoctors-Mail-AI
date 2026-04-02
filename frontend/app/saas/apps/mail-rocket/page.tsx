'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
    title: '드래그앤드롭 에디터',
    desc: '반응형 이메일 템플릿을 코딩 없이 블록 조합으로 제작',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: '구독자 세그먼트',
    desc: 'CSV 가져오기, 태그 기반 세그먼트, 행동 기반 필터링',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    title: 'A/B 테스트',
    desc: '제목 2종 테스트 후 AI가 승자를 자동 선택해 나머지에 발송',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    title: '자동화 드립 캠페인',
    desc: '환영 이메일, 구매 확인, 미오픈 시 카카오 알림톡 재발송',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: '상세 분석',
    desc: '오픈율, 클릭률, 수신거부율, 전환율 실시간 트래킹',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: 'AI 제목 최적화',
    desc: 'Gemini AI가 오픈율 최대화를 위한 이메일 제목 추천',
  },
];

const stats = [
  { value: '28.4%', label: '평균 오픈율 (업계 평균 대비 2배)' },
  { value: '4.2%', label: '클릭률' },
  { value: '$0.10', label: '/1,000건 발송 비용' },
  { value: '0.3%', label: '수신거부율' },
];

const plans = [
  { name: 'Free', price: '0', features: ['구독자 1,000명', '발송 5,000건/월', '기본 분석'], highlight: false },
  { name: 'Creator', price: '29,000', features: ['구독자 5,000명', '발송 50,000건/월', 'A/B 테스트'], highlight: false },
  { name: 'Business', price: '79,000', features: ['구독자 25,000명', '발송 250,000건/월', '+ 자동화 워크플로우'], highlight: true },
  { name: 'Enterprise', price: '199,000', features: ['무제한', '무제한', '전체 기능 + 카카오'], highlight: false },
];

export default function MailRocketPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">Mail Rocket</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-rose-600 text-white text-sm font-semibold rounded-lg hover:bg-rose-700 transition-colors" onClick={() => signIn("google", { callbackUrl: "/saas/apps/mail-rocket/dashboard" })}>
            무료 체험 시작
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-rose-50 text-rose-700 text-sm font-semibold rounded-full mb-6">
            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
            SocialDoctors #7 · 이메일 마케팅
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            한국형 이메일 마케팅,<br/>
            <span className="text-rose-600">Mailchimp보다 저렴하게</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            한글 최적화 + 카카오 알림톡 통합 + AI 제목 최적화로
            이메일 마케팅의 새 기준을 경험하세요.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors text-lg shadow-lg shadow-rose-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/mail-rocket/dashboard" })}>
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
            <div key={stat.label} className="bg-rose-50 rounded-xl p-6">
              <div className="text-3xl font-bold text-rose-700 mb-1">{stat.value}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Campaign Preview */}
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
            <span className="ml-4 text-sm font-semibold text-gray-700">Mail Rocket 캠페인</span>
          </div>
          <div className="grid grid-cols-4 gap-3 mb-4">
            {[
              { label: '오픈율', value: '28.4%', good: true },
              { label: '클릭률', value: '4.2%', good: true },
              { label: '수신거부', value: '0.3%', good: true },
              { label: '전환율', value: '1.8%', good: null },
            ].map((m) => (
              <div key={m.label} className="bg-white rounded-xl p-3 border border-gray-200 text-center">
                <p className="text-xs text-gray-500">{m.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{m.value}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-3">최근 캠페인</p>
              {['2월 뉴스레터  오픈율: 31%', '신제품 출시  오픈율: 24%', '이탈 재활성화  오픈율: 18%'].map((c) => (
                <div key={c} className="text-xs text-gray-700 py-2 border-b border-gray-50 last:border-0">{c}</div>
              ))}
            </div>
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs text-gray-500 mb-3">A/B 테스트 결과</p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-600 mb-1">버전 A: "신제품 출시 안내"</p>
                  <div className="bg-gray-100 rounded-full h-2"><div className="bg-gray-400 h-2 rounded-full" style={{ width: '32%' }}></div></div>
                  <p className="text-xs text-gray-500 mt-0.5">오픈율 32%</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-rose-700 mb-1">🏆 버전 B: "지금 놓치면 후회할 신제품"</p>
                  <div className="bg-gray-100 rounded-full h-2"><div className="bg-rose-500 h-2 rounded-full" style={{ width: '48%' }}></div></div>
                  <p className="text-xs text-rose-600 font-semibold mt-0.5">오픈율 48% — 승자 자동 발송</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">이메일 마케팅 자동화</h2>
          <p className="text-gray-600">국내 환경에 최적화된 All-in-One 이메일 플랫폼</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center mb-4">
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
            <p className="text-gray-600">Free 플랜으로 먼저 체험해보세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-6 ${plan.highlight ? 'bg-rose-600 text-white shadow-xl shadow-rose-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-3">인기</span>}
                <h3 className={`text-lg font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  {plan.price !== '0' && <span className={`text-xs ml-1 ${plan.highlight ? 'text-rose-100' : 'text-gray-500'}`}>/월</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-rose-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${plan.highlight ? 'bg-white text-rose-600 hover:bg-rose-50' : 'bg-rose-600 text-white hover:bg-rose-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/mail-rocket/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">이메일 마케팅을 자동화하세요</h2>
        <p className="text-gray-600 mb-8">Free 플랜으로 지금 바로 시작하세요</p>
        <button className="px-10 py-4 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors text-lg shadow-lg shadow-rose-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/mail-rocket/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
