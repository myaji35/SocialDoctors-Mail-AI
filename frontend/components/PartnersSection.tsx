'use client';

import { motion } from 'framer-motion';

const benefits = [
  {
    icon: '💰',
    title: '지속적인 수익',
    description: '추천한 사용자의 구독 갱신마다 계속해서 수수료를 받습니다. 단순 일회성 보상이 아닌 평생 수익(LTV) 모델입니다.',
  },
  {
    icon: '📊',
    title: '실시간 대시보드',
    description: '클릭, 가입, 결제, 수수료를 실시간으로 추적합니다. 투명한 성과 지표로 언제든지 실적을 확인하세요.',
  },
  {
    icon: '🎯',
    title: '높은 수수료율',
    description: '업계 최고 수준의 20% 수수료율을 제공합니다. 추천한 사용자가 결제하는 모든 서비스에 적용됩니다.',
  },
  {
    icon: '🔗',
    title: '간편한 추적 시스템',
    description: '전용 추천 링크로 30-90일간 쿠키 추적. 사용자가 나중에 가입해도 귀속됩니다.',
  },
  {
    icon: '💳',
    title: '자동 정산',
    description: '번거로운 정산 절차 없이 자동으로 수수료가 지갑에 적립됩니다. 언제든지 출금 가능합니다.',
  },
  {
    icon: '🚀',
    title: '마케팅 지원',
    description: '배너, 랜딩페이지, 콘텐츠 템플릿 등 다양한 마케팅 자료를 무료로 제공합니다.',
  },
];

const stats = [
  { value: '1,500+', label: '활동 파트너' },
  { value: '20%', label: '평균 수수료율' },
  { value: '₩850만', label: '월평균 수익' },
  { value: '95%', label: '만족도' },
];

const tiers = [
  {
    name: 'Starter',
    icon: '🌱',
    requirement: '월 10건 이상 추천',
    commission: '15%',
    benefits: ['기본 대시보드', '월 정산', '이메일 지원'],
  },
  {
    name: 'Growth',
    icon: '🌳',
    requirement: '월 50건 이상 추천',
    commission: '20%',
    benefits: ['고급 분석 도구', '주간 정산', '우선 지원', '전용 담당자'],
    featured: true,
  },
  {
    name: 'Enterprise',
    icon: '🏆',
    requirement: '월 200건 이상 추천',
    commission: '25%',
    benefits: ['맞춤형 솔루션', '일일 정산', '24/7 전담 지원', 'API 접근', '공동 마케팅'],
  },
];

export default function PartnersSection() {
  return (
    <section id="partners" className="py-20 bg-gradient-to-b from-white to-primary-50">
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
            <span className="text-primary-600">파트너</span>가 되어 함께 성장하세요
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            SocialDoctors와 함께 수익을 창출하세요. 추천만으로 지속적인 수입을 얻을 수 있습니다.
          </p>
        </motion.div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-lg"
            >
              <div className="text-3xl font-bold text-primary-600 mb-2">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            파트너 프로그램의 장점
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{benefit.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h4>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Tier System */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            파트너 등급 시스템
          </h3>
          <p className="text-center text-gray-600 mb-12">
            성과에 따라 더 높은 수수료율과 혜택을 받으세요
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {tiers.map((tier, index) => (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className={`rounded-2xl p-8 ${
                  tier.featured
                    ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-2xl scale-105'
                    : 'bg-white text-gray-900 shadow-lg'
                }`}
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{tier.icon}</div>
                  <h4 className="text-2xl font-bold mb-2">{tier.name}</h4>
                  <p className={`text-sm mb-4 ${tier.featured ? 'text-primary-100' : 'text-gray-600'}`}>
                    {tier.requirement}
                  </p>
                  <div className="text-4xl font-bold mb-2">{tier.commission}</div>
                  <p className={`text-sm ${tier.featured ? 'text-primary-100' : 'text-gray-600'}`}>
                    수수료율
                  </p>
                </div>
                <div className="space-y-3">
                  {tier.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-2">
                      <span className={tier.featured ? 'text-white' : 'text-primary-600'}>✓</span>
                      <span className={`text-sm ${tier.featured ? 'text-white' : 'text-gray-700'}`}>
                        {benefit}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-2xl p-8 md:p-12 shadow-xl mb-16"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            참여 방법
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">가입하기</h4>
              <p className="text-sm text-gray-600">
                무료로 파트너 계정을 생성하고 전용 추천 링크를 받으세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">공유하기</h4>
              <p className="text-sm text-gray-600">
                블로그, SNS, 이메일 등으로 추천 링크를 공유하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">추적하기</h4>
              <p className="text-sm text-gray-600">
                실시간 대시보드에서 클릭, 가입, 결제를 확인하세요
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">4</span>
              </div>
              <h4 className="font-bold text-gray-900 mb-2">수익 받기</h4>
              <p className="text-sm text-gray-600">
                자동으로 정산되는 수수료를 받고 언제든지 출금하세요
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            지금 바로 시작하세요
          </h3>
          <p className="text-gray-600 mb-8">
            가입비 없음. 의무 없음. 언제든 시작할 수 있습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
            >
              파트너 신청하기
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white hover:bg-gray-50 text-primary-600 font-bold rounded-lg border-2 border-primary-600 transition-all duration-300"
            >
              자세히 알아보기
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
