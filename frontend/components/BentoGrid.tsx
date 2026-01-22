'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  size: 'large' | 'medium' | 'small';
  detailedDescription: string;
  features: string[];
  useCases: string[];
  benefits: string[];
  pricing: string;
}

const services: Service[] = [
  {
    id: 1,
    title: "마케팅 자동화",
    description: "소셜 미디어 콘텐츠 자동 생성 및 예약",
    icon: "📱",
    color: "from-blue-500 to-cyan-500",
    size: "large",
    detailedDescription: `마케팅 자동화 플랫폼은 소셜 미디어 마케팅의 모든 과정을 자동화하여 시간과 비용을 절약합니다.

AI 기반 콘텐츠 생성 엔진이 브랜드 톤에 맞는 매력적인 콘텐츠를 자동으로 생성하고, 최적의 게시 시간을 분석하여 예약 게시합니다.

Facebook, Instagram, Twitter, LinkedIn 등 주요 소셜 미디어 플랫폼을 모두 지원하며, 하나의 대시보드에서 모든 채널을 통합 관리할 수 있습니다.`,
    features: ['AI 콘텐츠 생성', '예약 게시', '성과 분석', '멀티 플랫폼 지원'],
    useCases: [
      '소셜 미디어 콘텐츠 제작 및 게시 자동화',
      '브랜드 일관성을 유지하면서 다채널 마케팅 실행',
      '캠페인 성과 실시간 모니터링 및 최적화'
    ],
    benefits: [
      '마케팅 팀의 업무 시간 70% 절감',
      '일관된 브랜드 메시지 전달',
      '데이터 기반 의사결정으로 ROI 200% 향상'
    ],
    pricing: 'Professional 플랜 이상에서 무제한 사용 가능'
  },
  {
    id: 2,
    title: "파트너 관리",
    description: "제휴사 및 인플루언서 협업 시스템",
    icon: "🤝",
    color: "from-purple-500 to-pink-500",
    size: "medium",
    detailedDescription: `파트너 관리 플랫폼은 제휴 마케팅과 인플루언서 협업을 효율적으로 관리하는 통합 솔루션입니다.

각 파트너에게 전용 대시보드를 제공하여 실시간으로 추천 링크 클릭, 가입 전환, 매출 발생을 추적할 수 있습니다.

자동 커미션 계산 시스템이 모든 거래를 추적하여 정확한 수수료를 산출하고, 설정된 일정에 따라 자동으로 정산 처리합니다.`,
    features: ['파트너 대시보드', '실시간 추적', '자동 정산', '성과 리포트'],
    useCases: [
      '어필리에이트 마케팅 프로그램 운영',
      '인플루언서 협업 캠페인 관리',
      '추천 프로그램 운영 및 추적'
    ],
    benefits: [
      '파트너 관리 시간 80% 절감',
      '투명한 성과 추적으로 파트너 신뢰도 향상',
      '자동 정산으로 관리 비용 최소화'
    ],
    pricing: 'Professional 플랜 이상에서 최대 50명, Enterprise에서 무제한'
  },
  {
    id: 3,
    title: "AI 콘텐츠",
    description: "GPT 기반 카피라이팅",
    icon: "✨",
    color: "from-amber-500 to-orange-500",
    size: "small",
    detailedDescription: `GPT 기반 AI 콘텐츠 생성 도구로 블로그, SNS, 광고 문구를 즉시 생성합니다. 브랜드 톤을 학습하여 일관된 메시지를 전달합니다.`,
    features: ['다국어 지원', '브랜드 톤 학습', '무제한 생성', 'SEO 최적화'],
    useCases: ['블로그 포스트 작성', 'SNS 콘텐츠 생성', '광고 카피 제작'],
    benefits: ['콘텐츠 제작 시간 90% 단축', 'SEO 최적화 자동 적용', '다국어 콘텐츠 즉시 생성'],
    pricing: 'Professional 플랜 이상에서 무제한'
  },
  {
    id: 4,
    title: "분석 대시보드",
    description: "실시간 성과 추적 및 인사이트",
    icon: "📊",
    color: "from-green-500 to-emerald-500",
    size: "medium",
    detailedDescription: `비즈니스의 모든 데이터를 통합하여 실시간으로 시각화하는 강력한 BI 도구입니다. AI 기반 예측 분석으로 미래 트렌드를 파악합니다.`,
    features: ['실시간 모니터링', '맞춤형 리포트', '예측 분석', '통합 대시보드'],
    useCases: ['경영진 성과 대시보드', '마케팅 ROI 추적', '매출 예측'],
    benefits: ['의사결정 속도 3배 향상', '리포트 작성 시간 90% 절감', 'AI 예측 정확도 85%'],
    pricing: 'Professional 플랜 이상에서 고급 분석 제공'
  },
  {
    id: 5,
    title: "고객 관리",
    description: "CRM 및 커뮤니케이션",
    icon: "👥",
    color: "from-red-500 to-rose-500",
    size: "small",
    detailedDescription: `고객과의 모든 접점을 관리하는 CRM 시스템입니다. 자동화된 커뮤니케이션으로 고객 만족도를 높입니다.`,
    features: ['고객 세그먼트', '자동 응답', '구매 이력 관리', '로열티 프로그램'],
    useCases: ['고객 데이터 통합 관리', '자동화된 고객 응대', '로열티 프로그램 운영'],
    benefits: ['고객 응대 시간 60% 절감', '고객 만족도 40% 향상', '재구매율 30% 증가'],
    pricing: 'Professional 플랜 이상에서 무제한'
  },
  {
    id: 6,
    title: "결제 시스템",
    description: "통합 결제 및 정산 관리",
    icon: "💳",
    color: "from-indigo-500 to-blue-500",
    size: "medium",
    detailedDescription: `다양한 결제 수단을 지원하는 통합 결제 시스템입니다. 자동 정산과 세금 계산으로 업무를 간소화합니다.`,
    features: ['멀티 결제 지원', '자동 정산', '세금 계산', '환불 관리'],
    useCases: ['온라인 결제 처리', '정기 구독 관리', '자동 정산 처리'],
    benefits: ['결제 처리 시간 80% 단축', '정산 오류 제로화', '수수료 최적화'],
    pricing: 'Professional 플랜 이상에서 사용 가능'
  },
  {
    id: 7,
    title: "이메일 마케팅",
    description: "자동화된 이메일 캠페인",
    icon: "📧",
    color: "from-teal-500 to-cyan-500",
    size: "small",
    detailedDescription: `자동화된 이메일 마케팅으로 고객과 효과적으로 소통합니다. A/B 테스트로 전환율을 최적화합니다.`,
    features: ['드래그 앤 드롭 에디터', '자동화 워크플로우', 'A/B 테스팅', '상세 분석'],
    useCases: ['환영 이메일 자동 발송', '장바구니 이탈 방지', '뉴스레터 발송'],
    benefits: ['이메일 전환율 50% 향상', '작업 시간 70% 절감', '고객 참여도 증가'],
    pricing: 'Professional 플랜 이상에서 무제한'
  },
  {
    id: 8,
    title: "SEO 최적화",
    description: "검색 엔진 최적화 도구",
    icon: "🔍",
    color: "from-violet-500 to-purple-500",
    size: "small",
    detailedDescription: `검색 엔진 최적화 도구로 웹사이트 순위를 향상시킵니다. 키워드 분석과 백링크 추적을 제공합니다.`,
    features: ['키워드 리서치', '순위 추적', '기술 SEO 감사', '백링크 분석'],
    useCases: ['키워드 순위 모니터링', 'SEO 문제 자동 감지', '경쟁사 분석'],
    benefits: ['검색 순위 평균 30% 상승', '오가닉 트래픽 2배 증가', 'SEO 작업 시간 80% 절감'],
    pricing: 'Professional 플랜 이상에서 사용 가능'
  },
  {
    id: 9,
    title: "프로젝트 관리",
    description: "업무 협업 및 일정 관리",
    icon: "📋",
    color: "from-slate-500 to-gray-500",
    size: "medium",
    detailedDescription: `팀 협업과 일정 관리를 한 곳에서 해결합니다. 칸반 보드, 간트 차트로 프로젝트를 체계적으로 관리합니다.`,
    features: ['칸반 보드', '간트 차트', '시간 추적', '팀 협업'],
    useCases: ['프로젝트 진행 상황 추적', '팀 업무 배분', '일정 관리'],
    benefits: ['프로젝트 완료율 40% 향상', '팀 생산성 50% 증가', '커뮤니케이션 비용 절감'],
    pricing: 'Professional 플랜 이상에서 사용 가능'
  },
  {
    id: 10,
    title: "커뮤니티",
    description: "회원 커뮤니티 플랫폼",
    icon: "💬",
    color: "from-pink-500 to-rose-500",
    size: "large",
    detailedDescription: `회원 커뮤니티 플랫폼으로 고객 참여를 유도합니다. 포럼, 이벤트, 멤버십 관리 기능을 제공합니다.`,
    features: ['포럼 관리', '이벤트 캘린더', '멤버십 등급', '포인트 시스템'],
    useCases: ['고객 커뮤니티 운영', '이벤트 관리', '멤버십 프로그램'],
    benefits: ['고객 참여도 3배 증가', '브랜드 로열티 향상', '고객 생애 가치 증대'],
    pricing: 'Professional 플랜 이상에서 사용 가능'
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
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleServiceClick = (service: Service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

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
            개발하는 모든 Saas에
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            10개 이상의 전문 서비스를 Saas에 연동합니다.
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
                onClick={() => handleServiceClick(service)}
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

        {/* Service Detail Modal */}
        {isModalOpen && selectedService && (
          <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl p-8 md:p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative"
            >
              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-10"
              >
                <span className="text-2xl text-gray-600">×</span>
              </button>

              {/* Header */}
              <div className="text-center mb-8 pb-8 border-b-2 border-gray-200">
                <div className={`inline-flex p-8 bg-gradient-to-br ${selectedService.color} rounded-3xl mb-4 shadow-lg`}>
                  <span className="text-6xl">{selectedService.icon}</span>
                </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedService.title}
                </h2>
                <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
                  {selectedService.description}
                </p>
              </div>

              {/* Detailed Description */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">상세 설명</h3>
                <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                  {selectedService.detailedDescription}
                </div>
              </div>

              {/* Use Cases */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">주요 활용 사례</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedService.useCases.map((useCase, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-5 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <span className="text-blue-600 font-bold text-lg flex-shrink-0">
                        {index + 1}.
                      </span>
                      <span className="text-gray-800 font-medium">{useCase}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">주요 이점</h3>
                <div className="space-y-3">
                  {selectedService.benefits.map((benefit, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-5 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                    >
                      <span className="text-emerald-600 text-2xl flex-shrink-0">✓</span>
                      <span className="text-gray-800 font-medium">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">핵심 기능</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {selectedService.features.map((feature, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg text-center hover:shadow-md transition-shadow"
                    >
                      <span className="text-gray-800 font-semibold text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div className="mb-8 p-6 bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-300 rounded-xl">
                <h3 className="text-xl font-bold text-gray-900 mb-2">💳 요금 정보</h3>
                <p className="text-gray-800 font-medium">{selectedService.pricing}</p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  무료 체험 시작하기
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={closeModal}
                  className="flex-1 px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold rounded-lg transition-all duration-300"
                >
                  닫기
                </motion.button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
}
