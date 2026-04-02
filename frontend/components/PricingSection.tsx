'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const pricingPlans = [
  {
    name: 'Free',
    price: '₩0',
    amount: 0,
    period: '영구 무료',
    description: '개인 사용자와 소규모 프로젝트에 적합',
    features: [
      '마케팅 자동화 (월 10회)',
      'AI 콘텐츠 생성 (월 20회)',
      '기본 분석 대시보드',
      '고객 관리 (최대 100명)',
      '이메일 지원',
      '3개 SaaS 접근',
    ],
    limitations: [
      '프로젝트 관리 제한',
      '파트너 관리 제한',
      '고급 분석 불가',
    ],
    cta: '무료 시작하기',
    popular: false,
  },
  {
    name: 'Professional',
    price: '₩49,000',
    amount: 49000,
    period: '/월',
    description: '성장하는 비즈니스와 팀에 최적화',
    features: [
      '마케팅 자동화 (무제한)',
      'AI 콘텐츠 생성 (무제한)',
      '고급 분석 대시보드',
      '고객 관리 (무제한)',
      '파트너 관리 (최대 50명)',
      '프로젝트 관리',
      'SEO 최적화 도구',
      '이메일 마케팅',
      '우선 지원',
      '모든 SaaS 접근',
    ],
    limitations: [],
    cta: '14일 무료 체험',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '₩149,000',
    amount: 149000,
    period: '/월',
    description: '대규모 조직을 위한 엔터프라이즈 솔루션',
    features: [
      'Professional 모든 기능',
      '무제한 팀 멤버',
      '무제한 파트너 관리',
      '커스텀 브랜딩',
      '전용 계정 매니저',
      'API 접근',
      '고급 보안 기능',
      'SSO (Single Sign-On)',
      '맞춤형 교육',
      '24/7 전화 지원',
      'SLA 보장',
    ],
    limitations: [],
    cta: '영업팀 문의',
    popular: false,
  },
];

const faqs = [
  {
    question: '무료 플랜에서 유료 플랜으로 언제든지 전환할 수 있나요?',
    answer: '네, 언제든지 플랜을 업그레이드할 수 있습니다. 업그레이드 시 즉시 프로 기능이 활성화되며, 결제는 일할 계산됩니다.',
  },
  {
    question: '환불 정책은 어떻게 되나요?',
    answer: '14일 무료 체험 기간 내에는 언제든지 취소 가능하며, 유료 전환 후에도 30일 이내 전액 환불이 가능합니다.',
  },
  {
    question: '팀 멤버를 추가하는데 비용이 드나요?',
    answer: 'Professional 플랜은 최대 5명까지 무료이며, 추가 멤버당 월 ₩9,900입니다. Enterprise는 무제한 무료입니다.',
  },
  {
    question: '모든 SaaS 제품이 포함되나요?',
    answer: 'Professional 이상 플랜에서는 10가지 모든 SaaS 제품에 무제한 접근이 가능합니다. Free 플랜은 3가지 핵심 서비스만 이용 가능합니다.',
  },
];

export default function PricingSection() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const router = useRouter();

  const handlePlanCta = (plan: typeof pricingPlans[0]) => {
    if (plan.cta === '영업팀 문의') {
      window.location.href = 'mailto:hello@socialdoctors.co.kr?subject=Enterprise 플랜 문의';
      return;
    }
    if (plan.amount === 0) {
      router.push('/sign-up');
      return;
    }
    const amount = billingPeriod === 'yearly' ? Math.floor(plan.amount * 10) : plan.amount;
    const params = new URLSearchParams({
      serviceName: `SocialDoctors ${plan.name}`,
      serviceId: `sd-${plan.name.toLowerCase()}`,
      planName: `${plan.name} ${billingPeriod === 'yearly' ? '연간' : '월간'}`,
      amount: amount.toString(),
    });
    router.push(`/checkout?${params.toString()}`);
  };

  return (
    <section id="pricing" className="py-20 bg-gradient-to-b from-primary-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            비즈니스에 맞는 <span className="text-primary-600">요금제</span>를 선택하세요
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            모든 플랜에는 14일 무료 체험이 포함되어 있습니다. 신용카드 등록 없이 시작하세요.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                billingPeriod === 'monthly'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600'
              }`}
            >
              월간 결제
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                billingPeriod === 'yearly'
                  ? 'bg-white text-primary-600 shadow-md'
                  : 'text-gray-600'
              }`}
            >
              연간 결제
              <span className="ml-2 text-xs bg-green-600 text-white px-2 py-1 rounded-full">
                20% 할인
              </span>
            </button>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8 mb-20">
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
              className={`relative rounded-2xl p-10 ${
                plan.popular
                  ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-2xl scale-105'
                  : 'bg-white text-gray-900 shadow-lg'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-yellow-400 text-gray-900 px-4 py-1 rounded-full text-sm font-bold">
                    가장 인기있는 플랜
                  </span>
                </div>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
              <p
                className={`text-sm mb-6 ${
                  plan.popular ? 'text-primary-100' : 'text-gray-600'
                }`}
              >
                {plan.description}
              </p>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold">
                    {billingPeriod === 'yearly' && plan.price !== '₩0'
                      ? `₩${Math.floor(parseInt(plan.price.replace(/[₩,]/g, '')) * 0.8).toLocaleString()}`
                      : plan.price}
                  </span>
                  <span
                    className={`ml-2 ${
                      plan.popular ? 'text-primary-100' : 'text-gray-600'
                    }`}
                  >
                    {plan.price === '₩0' ? plan.period : billingPeriod === 'yearly' ? '/년' : plan.period}
                  </span>
                </div>
                {billingPeriod === 'yearly' && plan.price !== '₩0' && (
                  <p
                    className={`text-sm mt-1 ${
                      plan.popular ? 'text-primary-100' : 'text-gray-500'
                    }`}
                  >
                    연간 {parseInt(plan.price.replace(/[₩,]/g, '')) * 12 * 0.8}원 (월{' '}
                    {Math.floor(parseInt(plan.price.replace(/[₩,]/g, '')) * 0.8).toLocaleString()}원)
                  </p>
                )}
              </div>

              {/* CTA Button */}
              <motion.button
                onClick={() => handlePlanCta(plan)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`w-full py-3 rounded-lg font-semibold mb-8 transition-colors duration-200 ${
                  plan.popular
                    ? 'bg-white text-primary-600 hover:bg-gray-100'
                    : 'bg-primary-600 text-white hover:bg-primary-700'
                }`}
              >
                {plan.cta}
              </motion.button>

              {/* Features */}
              <div className="space-y-2.5 mb-6">
                <div
                  className={`text-sm font-semibold mb-3 ${
                    plan.popular ? 'text-white' : 'text-gray-900'
                  }`}
                >
                  포함된 기능:
                </div>
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-2.5">
                    <span
                      className={`mt-0.5 shrink-0 ${plan.popular ? 'text-white' : 'text-primary-600'}`}
                    >
                      ✓
                    </span>
                    <span
                      className={`text-sm leading-snug ${
                        plan.popular ? 'text-white/95' : 'text-gray-700'
                      }`}
                    >
                      {feature}
                    </span>
                  </div>
                ))}
              </div>

              {/* Limitations */}
              {plan.limitations.length > 0 && (
                <div className="space-y-2.5 pt-6 border-t border-gray-200">
                  <div className="text-sm font-semibold mb-2 text-gray-600">제한 사항:</div>
                  {plan.limitations.map((limitation) => (
                    <div key={limitation} className="flex items-start gap-2.5">
                      <span className="text-gray-400 mt-0.5 shrink-0">✗</span>
                      <span className="text-sm leading-snug text-gray-500">{limitation}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}

          {/* SD Funding Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="relative bg-white border-2 border-purple-500 rounded-2xl p-10 shadow-lg"
          >
            {/* 투자 Badge */}
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
              <p className="text-gray-600 text-base">선착순 100명 한정</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold text-gray-600">투자 진행률</span>
                <span className="text-sm font-bold text-purple-600">37/100명</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: '37%' }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
                />
              </div>
            </div>

            {/* CTA Button */}
            <motion.a
              href="/funding"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white text-lg font-bold rounded-lg shadow-lg transition-all mb-8 text-center"
            >
              투자 회원 신청하기
            </motion.a>

            {/* Features */}
            <div className="space-y-3 mb-6">
              <div className="text-sm font-semibold mb-3 text-gray-900">
                포함된 기능:
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span className="text-sm text-gray-700">
                  모든 SaaS <strong>평생 무료</strong>
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span className="text-sm text-gray-700">분기별 수익 배당</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span className="text-sm text-gray-700">신규 기능 우선 투표권</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span className="text-sm text-gray-700">투자자 전용 커뮤니티</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-purple-600 mt-0.5">✓</span>
                <span className="text-sm text-gray-700">최소 2년 lock-up</span>
              </div>
            </div>

            <p className="text-center text-gray-500 text-sm mt-4">
              * 투자 신청 후 심사를 거쳐 최종 확정됩니다
            </p>
          </motion.div>
        </div>

        {/* Feature Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            모든 플랜에 포함된 기능
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {[
              { icon: '🔒', text: '안전한 데이터 암호화' },
              { icon: '☁️', text: '클라우드 자동 백업' },
              { icon: '📱', text: '모바일 앱 지원' },
              { icon: '🔄', text: '무료 업데이트' },
              { icon: '📚', text: '온라인 교육 자료' },
              { icon: '🌍', text: '다국어 지원' },
              { icon: '⚡', text: '99.9% 가동 시간' },
              { icon: '🛡️', text: 'GDPR 준수' },
            ].map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="flex items-center gap-3 bg-white rounded-lg p-4 shadow-md"
              >
                <span className="text-2xl sm:text-3xl shrink-0">{item.icon}</span>
                <span className="text-sm font-medium text-gray-700">{item.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* FAQs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            자주 묻는 질문
          </h3>
          <div className="max-w-3xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={faq.question}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md"
              >
                <h4 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h4>
                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            더 궁금한 점이 있으신가요? 언제든지 문의하세요.
          </p>
          <motion.a
            href="mailto:hello@socialdoctors.co.kr?subject=요금제 문의"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-white hover:bg-gray-50 text-primary-600 font-bold rounded-lg border-2 border-primary-600 transition-all duration-300"
          >
            영업팀에 문의하기
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
