'use client';

import { motion } from 'framer-motion';

const values = [
  {
    icon: '🎯',
    title: '혁신',
    description: '최신 기술로 비즈니스 문제를 해결하는 혁신적인 솔루션을 제공합니다.',
  },
  {
    icon: '🤝',
    title: '파트너십',
    description: '고객과 파트너의 성공이 곧 우리의 성공입니다. 함께 성장합니다.',
  },
  {
    icon: '💡',
    title: '단순함',
    description: '복잡한 것을 단순하게. 누구나 쉽게 사용할 수 있는 서비스를 만듭니다.',
  },
  {
    icon: '🚀',
    title: '성장',
    description: '고객의 비즈니스 성장을 돕는 것이 우리의 최우선 목표입니다.',
  },
];

const team = [
  {
    name: '김철수',
    role: 'CEO & Founder',
    image: '👨‍💼',
    description: '15년 경력의 SaaS 전문가. 여러 스타트업을 성공시킨 경험을 바탕으로 SocialDoctors를 설립했습니다.',
  },
  {
    name: '이영희',
    role: 'CTO',
    image: '👩‍💻',
    description: '전 대기업 개발 팀장. AI와 마이크로서비스 아키텍처 전문가로 기술 혁신을 주도합니다.',
  },
  {
    name: '박민수',
    role: 'Head of Marketing',
    image: '👨‍🎨',
    description: '마케팅 자동화 분야 10년 경력. 수백 개 기업의 디지털 전환을 성공시켰습니다.',
  },
  {
    name: '정수진',
    role: 'Head of Partnerships',
    image: '👩‍💼',
    description: '파트너 네트워크 구축 전문가. 1,500+ 파트너와의 성공적인 협업을 이끌고 있습니다.',
  },
];

const milestones = [
  { year: '2022', event: 'SocialDoctors 설립', description: '비즈니스 클리닉 개념으로 시작' },
  { year: '2023.Q1', event: '시드 투자 유치', description: '50억원 규모 투자 유치 성공' },
  { year: '2023.Q3', event: '첫 SaaS 출시', description: '마케팅 자동화 플랫폼 런칭' },
  { year: '2024.Q1', event: '10개 서비스 통합', description: '마이크로 SaaS 마켓플레이스 완성' },
  { year: '2024.Q2', event: '1,000 고객 돌파', description: '누적 고객 1,000개 기업 달성' },
  { year: '2024.Q4', event: '글로벌 확장', description: '동남아시아 시장 진출 예정' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-gradient-to-b from-white to-gray-50">
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
            <span className="text-primary-600">SocialDoctors</span>를 소개합니다
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            비즈니스 문제를 진단하고 최적의 SaaS 솔루션을 처방하는 디지털 비즈니스 클리닉
          </p>
        </motion.div>

        {/* Mission Statement */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-3xl p-12 text-white text-center shadow-2xl">
            <span className="text-6xl mb-6 block">🏥</span>
            <h3 className="text-3xl font-bold mb-6">우리의 미션</h3>
            <p className="text-xl leading-relaxed max-w-4xl mx-auto">
              "모든 비즈니스가 복잡한 IT 시스템 없이도 디지털 전환을 이룰 수 있도록 돕습니다.
              마치 병원에서 증상을 진단하고 처방하듯, 비즈니스 문제를 분석하고
              딱 맞는 SaaS 솔루션을 제공합니다."
            </p>
          </div>
        </motion.div>

        {/* Story */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">
                왜 SocialDoctors를 만들었나요?
              </h3>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  많은 중소기업과 스타트업이 디지털 전환의 필요성은 느끼지만,
                  어떤 도구를 선택해야 할지, 어떻게 통합해야 할지 막막해합니다.
                </p>
                <p>
                  각각의 SaaS 서비스는 훌륭하지만, 여러 도구를 따로 관리하는 것은
                  시간과 비용이 많이 듭니다. 또한 서비스마다 계정을 만들고
                  결제를 따로 해야 하는 번거로움도 있습니다.
                </p>
                <p>
                  <strong className="text-primary-600">SocialDoctors</strong>는 이러한 문제를 해결하기 위해 탄생했습니다.
                  하나의 계정으로 10가지 이상의 SaaS 서비스를 사용하고,
                  통합된 대시보드에서 모든 것을 관리할 수 있습니다.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-2xl p-8 lg:p-12">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">문제 진단</h4>
                    <p className="text-gray-600 text-sm">
                      AI가 비즈니스 니즈를 분석하고 최적의 서비스를 추천합니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">솔루션 처방</h4>
                    <p className="text-gray-600 text-sm">
                      필요한 SaaS 도구를 선택하여 즉시 사용을 시작합니다
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-2">지속 관리</h4>
                    <p className="text-gray-600 text-sm">
                      통합 대시보드에서 모든 서비스를 한눈에 모니터링합니다
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Core Values */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            핵심 가치
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-5xl mb-4">{value.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-4">
            팀을 소개합니다
          </h3>
          <p className="text-center text-gray-600 mb-12">
            각 분야 전문가들이 모여 최고의 서비스를 만듭니다
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 text-center shadow-md hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-6xl mb-4">{member.image}</div>
                <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                <p className="text-primary-600 font-medium text-sm mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            성장 여정
          </h3>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary-200"></div>

            {/* Timeline items */}
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex items-center ${
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  }`}
                >
                  <div className={`w-5/12 ${index % 2 === 0 ? 'text-right' : 'text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                      <div className="text-primary-600 font-bold text-sm mb-2">
                        {milestone.year}
                      </div>
                      <h4 className="text-lg font-bold text-gray-900 mb-2">
                        {milestone.event}
                      </h4>
                      <p className="text-gray-600 text-sm">{milestone.description}</p>
                    </div>
                  </div>
                  <div className="w-2/12 flex justify-center">
                    <div className="w-4 h-4 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                  <div className="w-5/12"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-3xl p-12 text-center text-white shadow-2xl"
        >
          <h3 className="text-3xl font-bold mb-4">함께 성장할 준비가 되셨나요?</h3>
          <p className="text-xl mb-8 text-primary-100">
            SocialDoctors와 함께 비즈니스를 한 단계 업그레이드하세요
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-primary-600 font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              무료로 시작하기
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-primary-800 hover:bg-primary-900 text-white font-bold rounded-lg transition-all duration-300"
            >
              영업팀과 상담하기
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
