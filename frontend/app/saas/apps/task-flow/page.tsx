'use client';

import { signIn, useSession } from 'next-auth/react';

import { motion } from 'framer-motion';
import Link from 'next/link';

const kanbanColumns = [
  { title: 'TODO', color: 'bg-gray-100', items: ['로그인 UI 설계', '회원가입 플로우'] },
  { title: '진행중', color: 'bg-blue-50', items: ['API 설계', '결제 연동'] },
  { title: '검토중', color: 'bg-yellow-50', items: ['QA 검토'] },
  { title: '완료', color: 'bg-green-50', items: ['DB 설계', '배포 자동화'] },
];

const features = [
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    title: '칸반/리스트/갠트 뷰',
    desc: '작업 방식에 맞춰 칸반보드, 리스트, 갠트 차트로 전환',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>,
    title: 'AI 태스크 자동 분해',
    desc: '"앱 출시 준비" 입력 → AI가 세부 태스크 목록 자동 생성',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    title: '팀 협업',
    desc: '댓글, 파일 첨부, @멘션, 실시간 상태 업데이트',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
    title: 'AI 주간 보고서',
    desc: '완료/진행/지연 태스크를 자동 집계해 팀원에게 이메일 발송',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>,
    title: '팀 진행률 대시보드',
    desc: '프로젝트별 진행률, 기한 임박 태스크, 팀원 업무 부하 시각화',
  },
  {
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    title: 'AI 병목 감지',
    desc: 'AI가 프로젝트 지연 원인을 분석하고 해결책 제안',
  },
];

const plans = [
  { name: 'Free', price: '0', features: ['멤버 3명', '프로젝트 5개', '칸반 뷰'], highlight: false },
  { name: 'Team', price: '29,000', features: ['멤버 10명', '프로젝트 무제한', '+ AI 보고서'], highlight: false },
  { name: 'Business', price: '79,000', features: ['멤버 50명', '프로젝트 무제한', '+ AI 전체 기능'], highlight: true },
  { name: 'Enterprise', price: '199,000', features: ['멤버 무제한', '프로젝트 무제한', '+ 온프레미스'], highlight: false },
];

export default function TaskFlowPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
            SocialDoctors
          </Link>
          <span className="text-gray-300">/</span>
          <span className="text-gray-900 font-semibold text-sm">Task Flow</span>
        </div>
        <div className="flex items-center gap-3">
          <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">요금제</a>
          <button className="px-4 py-2 bg-sky-600 text-white text-sm font-semibold rounded-lg hover:bg-sky-700 transition-colors" onClick={() => signIn("google", { callbackUrl: "/saas/apps/task-flow/dashboard" })}>
            무료 체험 시작
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-sky-50 text-sky-700 text-sm font-semibold rounded-full mb-6">
              <span className="w-2 h-2 bg-sky-500 rounded-full"></span>
              SocialDoctors #10 · 생산성
            </span>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
              Notion + Jira,<br/>
              <span className="text-sky-600">한국 팀을 위한 AI PM</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              AI가 태스크를 자동으로 분해하고, 주간 보고서를 생성하고,
              병목을 감지해 팀 생산성을 2배 높입니다.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-4 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-700 transition-colors text-lg shadow-lg shadow-sky-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/task-flow/dashboard" })}>
                무료로 시작하기
              </button>
              <button className="px-8 py-4 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors text-lg">
                데모 보기
              </button>
            </div>
          </motion.div>

          {/* Kanban Preview */}
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
              <span className="ml-4 text-sm font-semibold text-gray-700">Task Flow — 앱 개발 v2</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {kanbanColumns.map((col) => (
                <div key={col.title} className={`${col.color} rounded-xl p-3`}>
                  <p className="text-xs font-bold text-gray-700 mb-2">{col.title}</p>
                  <div className="space-y-2">
                    {col.items.map((item) => (
                      <div key={item} className="bg-white rounded-lg p-2 shadow-sm border border-gray-100">
                        <p className="text-xs text-gray-700">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 bg-sky-50 border border-sky-200 rounded-xl p-3">
              <p className="text-xs font-bold text-sky-800 mb-1">AI 주간 보고서</p>
              <p className="text-xs text-sky-700">이번주 완료: 8개 · 진행중: 4개 · 지연: 1개 (결제 연동) — 예상 완료일 3일 초과 예상</p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {[
                { label: '전체 진행률', value: '68%' },
                { label: '이번주 완료', value: '8개' },
                { label: '기한 임박', value: '3개' },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 text-center">
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className="text-lg font-bold text-sky-600 mt-0.5">{s.value}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">팀 생산성 2배 향상</h2>
          <p className="text-gray-600">한국 중소팀에 최적화된 AI 프로젝트 관리</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="p-6 bg-white border border-gray-200 rounded-xl hover:border-sky-300 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-lg flex items-center justify-center mb-4">
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
            <p className="text-gray-600">Free 플랜으로 팀과 함께 시작하세요</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {plans.map((plan) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`rounded-2xl p-6 ${plan.highlight ? 'bg-sky-600 text-white shadow-xl shadow-sky-200' : 'bg-white border border-gray-200'}`}
              >
                {plan.highlight && <span className="inline-block px-3 py-1 bg-yellow-400 text-gray-900 text-xs font-bold rounded-full mb-3">인기</span>}
                <h3 className={`text-lg font-bold mb-2 ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>{plan.name}</h3>
                <div className="mb-4">
                  <span className={`text-3xl font-bold ${plan.highlight ? 'text-white' : 'text-gray-900'}`}>₩{plan.price}</span>
                  {plan.price !== '0' && <span className={`text-xs ml-1 ${plan.highlight ? 'text-sky-100' : 'text-gray-500'}`}>/월</span>}
                </div>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className={`flex items-center gap-2 text-sm ${plan.highlight ? 'text-sky-50' : 'text-gray-600'}`}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0"><polyline points="20 6 9 17 4 12"/></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-colors ${plan.highlight ? 'bg-white text-sky-600 hover:bg-sky-50' : 'bg-sky-600 text-white hover:bg-sky-700'}`} onClick={() => signIn("google", { callbackUrl: "/saas/apps/task-flow/dashboard" })}>
                  시작하기
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">팀 생산성을 한 단계 높이세요</h2>
        <p className="text-gray-600 mb-8">Free 플랜 · 멤버 3명 무제한 기간 무료</p>
        <button className="px-10 py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-700 transition-colors text-lg shadow-lg shadow-sky-200" onClick={() => signIn("google", { callbackUrl: "/saas/apps/task-flow/dashboard" })}>
          무료로 시작하기
        </button>
      </section>
    </div>
  );
}
