'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

export default function FundingSection() {
  const [investorCount] = useState(37); // 현재 투자자 수
  const maxInvestors = 100;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            요금제
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SocialDoctors 생태계에서 마음에 드는 Saas에 투자하시고, 선착순 100명에게 평생 무료로 제공합니다
          </p>
        </motion.div>

        {/* SD Funding Card */}
        <div className="max-w-sm mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white border-2 border-purple-500 rounded-3xl shadow-lg p-10 relative hover:shadow-2xl transition-shadow"
          >
            {/* 인기 Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-purple-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
                투자
              </span>
            </div>

            {/* Title */}
            <div className="text-center mb-8 mt-4">
              <h3 className="text-3xl font-bold text-gray-900 mb-3">SD 펀딩</h3>
              <div className="mb-4">
                <span className="text-6xl font-bold text-purple-600">100만원</span>
                <span className="text-gray-500 text-lg ml-2">최소</span>
              </div>
              <p className="text-gray-600 text-base">선착순 {maxInvestors}명 한정</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">투자 진행률</span>
                <span className="text-sm font-bold text-purple-600">{investorCount}/{maxInvestors}명</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(investorCount / maxInvestors) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                />
              </div>
            </div>

            {/* Features */}
            <ul className="space-y-4 mb-10">
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base">모든 SaaS <strong>평생 무료</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base">분기별 수익 배당</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base">신규 기능 우선 투표권</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base">투자자 전용 커뮤니티</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700 text-base">최소 2년 lock-up</span>
              </li>
            </ul>

            {/* CTA Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-bold rounded-xl shadow-lg transition-all"
            >
              투자 회원 신청하기
            </motion.button>

            <p className="text-center text-gray-500 text-sm mt-4">
              * 투자 신청 후 심사를 거쳐 최종 확정됩니다
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
