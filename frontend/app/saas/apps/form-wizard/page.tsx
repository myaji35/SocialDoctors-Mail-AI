'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>,
    title: '드래그앤드롭 빌더',
    desc: '단문/장문/객관식/체크박스/파일/날짜 필드를 직관적으로 조합',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    title: 'AI 폼 자동 생성',
    desc: '"채용 지원서 만들어줘" 한 마디로 완성된 폼 즉시 생성',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>,
    title: '조건부 로직',
    desc: '특정 답변에 따라 다음 질문을 동적으로 분기 처리',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
    title: 'AI 응답 분석',
    desc: '텍스트 감성 분석, 키워드 추출, 자동 요약 보고서 생성',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>,
    title: '실시간 알림',
    desc: '신규 응답 시 이메일/슬랙 즉시 알림 발송',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: 'CRM Pro 자동 연동',
    desc: '폼 응답이 자동으로 CRM Pro 고객 DB에 등록',
  },
];

const useCases = [
  { icon: '📝', title: '채용 지원서', desc: '이력서 + 포트폴리오 파일 업로드' },
  { icon: '📊', title: '만족도 조사', desc: '구매 후 자동 발송 + AI 분석' },
  { icon: '🎓', title: '수강 신청서', desc: '결제 연동 + 자동 확인 이메일' },
  { icon: '🏆', title: '퀴즈/설문', desc: '자동 채점 + 결과 공개 설정' },
  { icon: '📦', title: '주문서', desc: '재고 연동 + 자동 주문 처리' },
  { icon: '🤝', title: '파트너 신청서', desc: 'Partner Hub 자동 연동' },
];

const plans = [
  { name: 'Free', price: '0', features: ['폼 5개', '응답 100건/월', 'CSV 내보내기'], highlight: false },
  { name: 'Creator', price: '19,000', features: ['폼 20개', '응답 1,000건/월', 'AI 분석 5회/월'], highlight: false },
  { name: 'Business', price: '49,000', features: ['폼 무제한', '응답 10,000건/월', 'AI 분석 무제한'], highlight: true },
  { name: 'Enterprise', price: '129,000', features: ['폼 무제한', '응답 무제한', '+ 화이트라벨'], highlight: false },
];

export default function FormWizardPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">Form Wizard</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-lg hover:bg-violet-700 transition-colors" onClick={() => signIn("google", { callbackUrl: "/saas/apps/form-wizard/dashboard" })}>
            무료 체험 시작
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-violet-50 text-violet-700 text-sm font-semibold rounded-full mb-6">
            <span className="w-2 h-2 bg-violet-500 rounded-full"></span>
            SocialDoctors #9 · 데이터 수집
          </span>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Google Forms의 한계,<br/>
            <span className="text-violet-600">AI 분석으로 돌파</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            AI가 폼을 자동 생성하고, 수집된 응답을 감성 분석·키워드 추출로
            즉시 인사이트로 변환합니다.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button className="px-8 py-4 bg-violet-600 text-white font-semibold rounded-xl hover:bg-violet-700 transition-colors text-lg shadow-lg shadow-violet-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/form-wizard/dashboard" })}>
              무료로 시작하기
            </button>
            <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
              데모 보기
            </button>
          </div>
        </motion.div>

        {/* Form Builder Preview */}
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
            <span className="ml-4 text-sm font-semibold text-gray-700">Form Wizard 빌더</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1 bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-3">폼 목록</p>
              {['채용 지원서 (124건)', '만족도 조사 (89건)', '이벤트 신청 (247건)'].map((f) => (
                <div key={f} className="py-2 text-xs text-gray-600 border-b border-gray-50 last:border-0">{f}</div>
              ))}
              <button className="mt-3 w-full py-2 bg-violet-600 text-white text-xs font-semibold rounded-lg">
                + AI로 폼 생성
              </button>
            </div>
            <div className="col-span-2 bg-white rounded-xl p-4 border border-gray-200">
              <p className="text-xs font-semibold text-gray-700 mb-3">채용 지원서 — 응답 분석</p>
              <div className="grid grid-cols-3 gap-2 mb-3">
                {[
                  { label: '총 응답', value: '124건' },
                  { label: '긍정 감성', value: '78%' },
                  { label: '이번주 접수', value: '23건' },
                ].map((s) => (
                  <div key={s.label} className="bg-violet-50 rounded-lg p-2 text-center">
                    <p className="text-xs text-gray-500">{s.label}</p>
                    <p className="text-lg font-bold text-violet-700">{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs font-semibold text-gray-700 mb-2">AI 분석 요약</p>
                <p className="text-xs text-gray-600 leading-relaxed">지원자의 78%가 "성장 기회"와 "팀 문화"를 지원 동기로 언급. 주요 키워드: 도전적인 업무(42%), 워라밸(38%), 연봉(20%). 긍정적 표현 비율이 전월 대비 12% 증가.</p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Use Cases */}
      <section className="bg-violet-50 py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">다양한 활용 사례</h2>
            <p className="text-gray-600">어떤 데이터도 수집하고 분석할 수 있습니다</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {useCases.map((uc, i) => (
              <motion.div
                key={uc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-5 border border-violet-100 hover:border-violet-300 transition-all"
              >
                <div className="text-2xl mb-2">{uc.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{uc.title}</h3>
                <p className="text-xs text-gray-600">{uc.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Google Forms를 넘어서</h2>
          <p className="text-gray-600">수집에서 인사이트까지 원스톱</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-violet-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center mb-4">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-6 ${plan.highlight ? 'bg-violet-600 text-white shadow-xl shadow-violet-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-3">인기</span>}
                <h3 className={`text-lg font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  {plan.price !== '0' && <span className={`text-xs ml-1 ${plan.highlight ? 'text-violet-100' : 'text-gray-500'}`}>/월</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-violet-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${plan.highlight ? 'bg-white text-violet-600 hover:bg-violet-50' : 'bg-violet-600 text-white hover:bg-violet-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/form-wizard/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">데이터 수집을 스마트하게</h2>
        <p className="text-gray-600 mb-8">Free 플랜으로 지금 바로 시작하세요</p>
        <button className="px-10 py-4 bg-violet-600 text-white font-bold rounded-xl hover:bg-violet-700 transition-colors text-lg shadow-lg shadow-violet-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/form-wizard/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
