'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';

export default function FundingPage() {
  const [investorCount] = useState(37);
  const maxInvestors = 100;

  const fundingPlans = [
    {
      amount: '5만원',
      benefit: '3년 무료이용권',
      description: 'Professional 플랜을 3년간 무료로 이용',
      features: [
        '모든 SaaS 3년 무료',
        '우선 지원',
        '신규 기능 베타 테스트 참여',
      ],
      color: 'from-blue-500 to-cyan-500',
      popular: false,
    },
    {
      amount: '10만원',
      benefit: '+ 5% 수수료 공유',
      description: '3년 무료 + 플랫폼 수익의 5% 배당',
      features: [
        '모든 SaaS 3년 무료',
        '분기별 수익 5% 배당',
        '투자자 전용 커뮤니티',
        '신규 서비스 우선 체험',
      ],
      color: 'from-purple-500 to-pink-500',
      popular: true,
    },
    {
      amount: '15만원',
      benefit: '+10% 수수료 공유',
      description: '3년 무료 + 플랫폼 수익의 10% 배당',
      features: [
        '모든 SaaS 3년 무료',
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link href="/" className="text-primary-600 hover:text-primary-700 font-semibold">
            ← 홈으로 돌아가기
          </Link>
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
          <div className="inline-block mb-6">
            <span className="bg-purple-100 text-purple-700 px-6 py-2 rounded-full text-sm font-bold">
              선착순 100명 한정
            </span>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            SD 펀딩 - 투자 회원 모집
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            SocialDoctors 생태계에 투자하고, 특별한 혜택을 받으세요
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
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
              />
            </div>
            <p className="text-gray-600 text-sm mt-2">
              남은 자리: <span className="font-bold text-purple-600">{maxInvestors - investorCount}명</span>
            </p>
          </div>
        </motion.div>

        {/* Funding Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {fundingPlans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  <h3 className="text-4xl font-bold text-gray-900 mb-2">
                    {plan.amount}
                  </h3>
                  <p className="text-xl font-semibold text-purple-600 mb-4">
                    {plan.benefit}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {plan.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
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

        {/* 제품 정보 섹션 (이미지 참고) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 mb-16"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* 왼쪽 - 로고 & 소개 */}
            <div>
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">제품 소개</h2>
                <p className="text-gray-600 leading-relaxed">
                  소셜 미디어 자동화 마케팅 플랫폼, AI 기반 콘텐츠 생성 및 예약 게시 기능 제공
                </p>
              </div>
            </div>

            {/* 오른쪽 - 제품 정보 */}
            <div className="bg-gray-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">제품 정보</h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">카테고리</label>
                  <span className="inline-block bg-blue-100 text-blue-700 px-4 py-2 rounded-lg text-sm font-semibold">
                    마케팅
                  </span>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">참여 파트너</label>
                  <div className="flex gap-2">
                    <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">마케팅팀</span>
                    <span className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm">파트너A</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-600 block mb-2">웹사이트</label>
                  <a href="#" className="text-blue-600 hover:text-blue-700 underline text-sm">
                    https://socialpulse.example.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">자주 묻는 질문</h2>

          <div className="space-y-4 max-w-3xl mx-auto">
            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-semibold text-gray-900">투자금은 환불 가능한가요?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 px-4">
                투자 후 7일 이내 100% 환불 가능합니다. 이후에는 투자금 회수 기간(최소 2년)이 적용됩니다.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-semibold text-gray-900">수수료 배당은 언제 받나요?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 px-4">
                분기별(3개월마다) 플랫폼 수익에 따라 배당금이 지급됩니다. 투자 비율에 따라 5% 또는 10%의 수수료를 받으실 수 있습니다.
              </p>
            </details>

            <details className="group">
              <summary className="flex justify-between items-center cursor-pointer list-none p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <span className="font-semibold text-gray-900">100명이 다 차면 어떻게 되나요?</span>
                <span className="transition group-open:rotate-180">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </summary>
              <p className="text-gray-600 mt-3 px-4">
                선착순 100명 마감 후에는 투자 회원 모집을 종료합니다. 이후에는 일반 유료 플랜으로만 이용 가능합니다.
              </p>
            </details>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            * 투자 신청 후 심사를 거쳐 최종 확정됩니다
          </p>
        </motion.div>
      </div>
    </div>
  );
}
