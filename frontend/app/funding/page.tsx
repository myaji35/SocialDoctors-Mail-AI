'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function FundingPage() {
  const [investorCount] = useState(37);
  const maxInvestors = 100;

  // 수험생 수요 조사 폼 상태
  const [surveyStep, setSurveyStep] = useState<'form' | 'done'>('form');
  const [surveyData, setSurveyData] = useState({
    cert: '',
    method: '',
    pain: '',
    budget: '',
    email: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fundingPlans = [
    {
      amount: '5만원',
      benefit: '3년 무료이용권',
      description: 'SocialDoctors + CertiGraph Professional 플랜 3년 무료',
      features: [
        '모든 SaaS 3년 무료',
        'CertiGraph 프리미엄 3년',
        '우선 지원',
        '신규 기능 베타 테스트 참여',
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false,
    },
    {
      amount: '10만원',
      benefit: '+ 수익 5% 배당',
      description: '3년 무료 + 플랫폼 수익의 5% 분기 배당',
      features: [
        '모든 SaaS 3년 무료',
        'CertiGraph 프리미엄 3년',
        '분기별 수익 5% 배당',
        '투자자 전용 커뮤니티',
        '신규 서비스 우선 체험',
      ],
      color: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      amount: '15만원',
      benefit: '+ 수익 10% 배당',
      description: '3년 무료 + 플랫폼 수익의 10% 분기 배당',
      features: [
        '모든 SaaS 3년 무료',
        'CertiGraph 프리미엄 3년',
        '분기별 수익 10% 배당',
        '투자자 전용 커뮤니티',
        '신규 서비스 우선 체험',
        '투자 의결권 부여',
        '1:1 전담 매니저',
      ],
      color: 'from-orange-500 to-red-500',
      popular: false,
    },
  ];

  const handleSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!surveyData.cert || !surveyData.email) return;
    setSubmitting(true);
    try {
      await fetch('/api/survey/certigraph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(surveyData),
      });
    } catch {
      // 조용히 실패 처리
    } finally {
      setSubmitting(false);
      setSurveyStep('done');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link href="/" className="text-purple-600 hover:text-purple-700 font-semibold text-sm">
            ← SocialDoctors 홈
          </Link>
          <a
            href="https://exams.townin.net"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline"
          >
            CertiGraph 바로가기 →
          </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 mb-6">
            <span className="bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-bold">CertiGraph</span>
            <span className="text-gray-400">×</span>
            <span className="bg-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-bold">SocialDoctors</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI가 합격을 처방합니다
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
            자격증 시험 준비, 이제 AI Knowledge Graph로 내 약점을 정확히 찾고 최단 경로로 합격하세요.
          </p>
          <p className="text-base text-purple-600 font-semibold max-w-2xl mx-auto mb-10">
            선착순 100명 투자 회원 모집 — 수익 배당 + 3년 무료 이용
          </p>

          {/* Progress */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="flex justify-between items-center mb-3">
              <span className="text-gray-700 font-semibold">투자 진행률</span>
              <span className="text-purple-600 font-bold text-2xl">{investorCount}/{maxInvestors}명</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden shadow-inner">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(investorCount / maxInvestors) * 100}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
              />
            </div>
            <p className="text-gray-600 text-sm mt-2">
              남은 자리: <span className="font-bold text-purple-600">{maxInvestors - investorCount}명</span>
            </p>
          </div>
        </motion.div>

        {/* CertiGraph 소개 배너 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
        >
          {[
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                </svg>
              ),
              title: 'PDF → Knowledge Graph',
              desc: 'PDF 업로드 30초 만에 개념 관계도 자동 생성. 내 약점 노드를 시각적으로 파악',
              color: 'blue',
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              ),
              title: 'CBT 실전 모의고사',
              desc: '타이머·보기 셔플 랜덤화로 실제 시험 환경 재현. 즉시 채점 + 오답노트 자동 생성',
              color: 'green',
            },
            {
              icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: 'AI 합격 예측',
              desc: 'GPT-4 기반 개인화 학습 경로 추천. 현재 실력으로 예상 점수를 수치로 확인',
              color: 'purple',
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-6 text-center`}
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl mb-4 ${
                item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                item.color === 'green' ? 'bg-green-50 text-green-600' :
                'bg-purple-50 text-purple-600'
              }`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-600">{item.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* 수험생 수요 조사 섹션 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl border border-purple-100 p-8 md:p-12 mb-16"
        >
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <span className="inline-block bg-blue-500 text-white px-4 py-1.5 rounded-full text-sm font-bold mb-4">
                얼리어답터 혜택
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                어떤 자격증을 준비하고 계신가요?
              </h2>
              <p className="text-gray-600">
                설문 완료 시 <span className="font-bold text-purple-600">CertiGraph 첫 달 50% 할인 쿠폰</span>을 드립니다
              </p>
            </div>

            {surveyStep === 'done' ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">참여해 주셔서 감사합니다!</h3>
                <p className="text-gray-600 mb-6">
                  입력하신 이메일로 50% 할인 쿠폰을 보내드렸습니다.
                </p>
                <a
                  href="https://exams.townin.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                >
                  CertiGraph 무료 체험하기 →
                </a>
              </div>
            ) : (
              <form onSubmit={handleSurveySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    준비 중인 자격증 <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['사회복지사 1급', '요양보호사', '간호조무사', '기타'].map((cert) => (
                      <button
                        key={cert}
                        type="button"
                        onClick={() => setSurveyData((d) => ({ ...d, cert }))}
                        className={`py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                          surveyData.cert === cert
                            ? 'bg-purple-600 text-white border-purple-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                        }`}
                      >
                        {cert}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">현재 학습 방법</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['독학', '인강', '학원', '스터디'].map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setSurveyData((d) => ({ ...d, method }))}
                        className={`py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                          surveyData.method === method
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">가장 힘든 점</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['약점 파악이 어려움', '시간이 부족함', '동기 유지 힘듦', '비용 부담'].map((pain) => (
                      <button
                        key={pain}
                        type="button"
                        onClick={() => setSurveyData((d) => ({ ...d, pain }))}
                        className={`py-2.5 px-4 rounded-xl text-sm font-semibold border-2 transition-all ${
                          surveyData.pain === pain
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-green-300'
                        }`}
                      >
                        {pain}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">월 교육비 예산</label>
                  <div className="grid grid-cols-4 gap-2">
                    {['1만원', '3만원', '5만원', '10만원+'].map((budget) => (
                      <button
                        key={budget}
                        type="button"
                        onClick={() => setSurveyData((d) => ({ ...d, budget }))}
                        className={`py-2.5 px-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                          surveyData.budget === budget
                            ? 'bg-orange-500 text-white border-orange-500'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        {budget}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    이메일 (쿠폰 발송용) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={surveyData.email}
                    onChange={(e) => setSurveyData((d) => ({ ...d, email: e.target.value }))}
                    placeholder="example@email.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-purple-400 focus:outline-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!surveyData.cert || !surveyData.email || submitting}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-base rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {submitting ? '제출 중...' : '50% 할인 쿠폰 받기 →'}
                </button>
                <p className="text-center text-xs text-gray-400">
                  마케팅 활용에 동의하며, 언제든 수신 거부 가능합니다.
                </p>
              </form>
            )}
          </div>
        </motion.div>

        {/* Funding Plans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-4"
        >
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">투자 회원 플랜</h2>
          <p className="text-gray-500 text-center mb-10">선착순 100명 한정 — CertiGraph + SocialDoctors 통합 혜택</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {fundingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              className={`relative bg-white rounded-3xl shadow-xl overflow-hidden ${
                plan.popular ? 'ring-4 ring-purple-500 scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-yellow-400 text-gray-900 px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                    인기
                  </span>
                </div>
              )}

              <div className={`h-3 bg-gradient-to-r ${plan.color}`}></div>

              <div className="p-8">
                <div className="text-center mb-8">
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">{plan.amount}</h3>
                  <p className="text-xl font-semibold text-purple-600 mb-4">{plan.benefit}</p>
                  <p className="text-gray-600 text-sm">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      <span className="text-gray-700 text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-base shadow-lg transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                >
                  투자하기
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">자주 묻는 질문</h2>

          <div className="space-y-4 max-w-3xl mx-auto">
            {[
              {
                q: 'CertiGraph는 어떤 자격증을 지원하나요?',
                a: '현재 사회복지사 1급을 지원하며, 6개월 내 요양보호사·간호조무사·사회복지사 2급 등으로 확장 예정입니다. PDF 업로드 방식이라 이론상 모든 자격증 적용 가능합니다.',
              },
              {
                q: '투자금은 환불 가능한가요?',
                a: '투자 후 7일 이내 100% 환불 가능합니다. 이후에는 투자금 회수 기간(최소 2년)이 적용됩니다.',
              },
              {
                q: '수수료 배당은 언제 받나요?',
                a: '분기별(3개월마다) 플랫폼 수익에 따라 배당금이 지급됩니다. 10만원/15만원 플랜에 해당됩니다.',
              },
              {
                q: '100명이 다 차면 어떻게 되나요?',
                a: '선착순 100명 마감 후에는 투자 회원 모집을 종료합니다. 이후에는 일반 유료 플랜으로만 이용 가능합니다.',
              },
            ].map((item, i) => (
              <details key={i} className="group">
                <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-semibold text-gray-900 text-sm">{item.q}</span>
                  <svg className="w-5 h-5 text-gray-500 transition-transform group-open:rotate-180 flex-shrink-0 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </summary>
                <p className="text-gray-600 mt-3 px-4 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </motion.div>

        {/* CTA Bottom */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center"
        >
          <a
            href="https://exams.townin.net"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-xl mb-4"
          >
            CertiGraph 무료 체험하기 →
          </a>
          <p className="text-gray-400 text-sm mt-3">
            * 투자 신청 후 심사를 거쳐 최종 확정됩니다 &nbsp;|&nbsp; 문의: myaji35@gmail.com
          </p>
        </motion.div>
      </div>
    </div>
  );
}
