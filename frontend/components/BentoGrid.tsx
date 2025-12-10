'use client';

import { motion } from 'framer-motion';

const services = [
  {
    id: 1,
    title: "마케팅 자동화",
    description: "소셜 미디어 콘텐츠 자동 생성 및 예약",
    icon: "📱",
    color: "from-blue-500 to-cyan-500",
    size: "large"
  },
  {
    id: 2,
    title: "파트너 관리",
    description: "제휴사 및 인플루언서 협업 시스템",
    icon: "🤝",
    color: "from-purple-500 to-pink-500",
    size: "medium"
  },
  {
    id: 3,
    title: "AI 콘텐츠",
    description: "GPT 기반 카피라이팅",
    icon: "✨",
    color: "from-amber-500 to-orange-500",
    size: "small"
  },
  {
    id: 4,
    title: "분석 대시보드",
    description: "실시간 성과 추적 및 인사이트",
    icon: "📊",
    color: "from-green-500 to-emerald-500",
    size: "medium"
  },
  {
    id: 5,
    title: "고객 관리",
    description: "CRM 및 커뮤니케이션",
    icon: "👥",
    color: "from-red-500 to-rose-500",
    size: "small"
  },
  {
    id: 6,
    title: "결제 시스템",
    description: "통합 결제 및 정산 관리",
    icon: "💳",
    color: "from-indigo-500 to-blue-500",
    size: "medium"
  },
  {
    id: 7,
    title: "이메일 마케팅",
    description: "자동화된 이메일 캠페인",
    icon: "📧",
    color: "from-teal-500 to-cyan-500",
    size: "small"
  },
  {
    id: 8,
    title: "SEO 최적화",
    description: "검색 엔진 최적화 도구",
    icon: "🔍",
    color: "from-violet-500 to-purple-500",
    size: "small"
  },
  {
    id: 9,
    title: "프로젝트 관리",
    description: "업무 협업 및 일정 관리",
    icon: "📋",
    color: "from-slate-500 to-gray-500",
    size: "medium"
  },
  {
    id: 10,
    title: "커뮤니티",
    description: "회원 커뮤니티 플랫폼",
    icon: "💬",
    color: "from-pink-500 to-rose-500",
    size: "large"
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5
    }
  }
};

export default function BentoGrid() {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            하나의 계정으로
            <span className="text-primary-600"> 모든 것을</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            10개 이상의 전문 SaaS 서비스를 통합 플랫폼에서 관리하세요
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4 auto-rows-fr"
        >
          {services.map((service, index) => {
            const gridClass = {
              large: "md:col-span-2 md:row-span-2",
              medium: "md:col-span-2",
              small: "md:col-span-1"
            }[service.size];

            return (
              <motion.div
                key={service.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02, translateY: -4 }}
                className={`${gridClass} group relative overflow-hidden rounded-2xl bg-gradient-to-br ${service.color} p-6 sm:p-8 cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300`}
              >
                {/* Background pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full transform translate-x-16 -translate-y-16" />
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full transform -translate-x-12 translate-y-12" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-between text-white">
                  <div>
                    <div className="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">
                      {service.title}
                    </h3>
                    <p className="text-white/90 text-sm">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold">
                      자세히 보기
                      <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-16 text-center"
        >
          <button className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            모든 서비스 보기
          </button>
        </motion.div>
      </div>
    </section>
  );
}
