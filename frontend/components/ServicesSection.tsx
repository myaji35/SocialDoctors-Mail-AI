'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
  Smartphone,
  Handshake,
  Sparkles,
  BarChart3,
  Users,
  CreditCard,
  Mail,
  Search,
  Layout,
  Globe,
  LucideIcon
} from 'lucide-react';

interface Service {
  icon: LucideIcon;
  iconColor: string;
  gradientFrom: string;
  gradientTo: string;
  title: string;
  description: string;
  features: string[];
  detailedDescription?: string;
  useCases?: string[];
  benefits?: string[];
  pricing?: string;
}

const services: Service[] = [
  {
    icon: Smartphone,
    iconColor: 'text-purple-600',
    gradientFrom: 'from-purple-500',
    gradientTo: 'to-pink-500',
    title: '마케팅 자동화',
    description: '소셜 미디어 콘텐츠를 자동으로 생성하고 예약 게시합니다. AI 기반 콘텐츠 최적화로 효과적인 마케팅을 실현하세요.',
    features: ['AI 콘텐츠 생성', '예약 게시', '성과 분석', '멀티 플랫폼 지원'],
    detailedDescription: `
      마케팅 자동화 플랫폼은 소셜 미디어 마케팅의 모든 과정을 자동화하여 시간과 비용을 절약합니다.

      AI 기반 콘텐츠 생성 엔진이 브랜드 톤에 맞는 매력적인 콘텐츠를 자동으로 생성하고,
      최적의 게시 시간을 분석하여 예약 게시합니다.

      Facebook, Instagram, Twitter, LinkedIn 등 주요 소셜 미디어 플랫폼을 모두 지원하며,
      하나의 대시보드에서 모든 채널을 통합 관리할 수 있습니다.

      실시간 성과 분석 기능으로 각 게시물의 도달률, 참여율, 전환율을 추적하고,
      AI가 데이터를 학습하여 점점 더 효과적인 콘텐츠를 생성합니다.
    `,
    useCases: [
      '소셜 미디어 콘텐츠 제작 및 게시 자동화',
      '브랜드 일관성을 유지하면서 다채널 마케팅 실행',
      '캠페인 성과 실시간 모니터링 및 최적화',
      '경쟁사 분석 및 트렌드 파악',
      '고객 인게이지먼트 자동 응답 및 관리',
    ],
    benefits: [
      '마케팅 팀의 업무 시간 70% 절감',
      '일관된 브랜드 메시지 전달',
      '데이터 기반 의사결정으로 ROI 200% 향상',
      '24/7 자동 운영으로 기회 손실 방지',
      '멀티 채널 통합 관리로 효율성 극대화',
    ],
    pricing: 'Professional 플랜 이상에서 무제한 사용 가능',
  },
  {
    icon: Handshake,
    iconColor: 'text-orange-600',
    gradientFrom: 'from-orange-500',
    gradientTo: 'to-yellow-500',
    title: '파트너 관리',
    description: '제휴사와 인플루언서를 체계적으로 관리합니다. 실시간 성과 추적과 커미션 관리로 파트너십을 강화하세요.',
    features: ['파트너 대시보드', '실시간 추적', '자동 정산', '성과 리포트'],
    detailedDescription: `
      파트너 관리 플랫폼은 제휴 마케팅과 인플루언서 협업을 효율적으로 관리하는 통합 솔루션입니다.

      각 파트너에게 전용 대시보드를 제공하여 실시간으로 추천 링크 클릭, 가입 전환, 매출 발생을 추적할 수 있습니다.
      투명한 성과 지표로 파트너의 신뢰를 높이고 적극적인 홍보를 유도합니다.

      자동 커미션 계산 시스템이 모든 거래를 추적하여 정확한 수수료를 산출하고,
      설정된 일정에 따라 자동으로 정산 처리합니다. 수동 정산의 번거로움을 완전히 제거합니다.

      파트너 등급 시스템으로 성과에 따라 차별화된 수수료율과 혜택을 제공하여
      파트너들의 동기부여를 높이고 장기적인 협력 관계를 구축합니다.
    `,
    useCases: [
      '어필리에이트 마케팅 프로그램 운영',
      '인플루언서 협업 캠페인 관리',
      '리셀러 및 대리점 네트워크 관리',
      '추천 프로그램 운영 및 추적',
      '파트너 성과 분석 및 최적화',
    ],
    benefits: [
      '파트너 관리 시간 80% 절감',
      '투명한 성과 추적으로 파트너 신뢰도 향상',
      '자동 정산으로 관리 비용 최소화',
      '데이터 기반 파트너 최적화로 ROI 150% 증가',
      '확장 가능한 구조로 무제한 파트너 관리',
    ],
    pricing: 'Professional 플랜 이상에서 최대 50명, Enterprise에서 무제한',
  },
  {
    icon: Sparkles,
    iconColor: 'text-blue-600',
    gradientFrom: 'from-blue-500',
    gradientTo: 'to-cyan-500',
    title: 'AI 콘텐츠',
    description: 'GPT 기반 카피라이팅으로 매력적인 콘텐츠를 즉시 생성합니다. 블로그, SNS, 광고 문구까지 모두 지원합니다.',
    features: ['다국어 지원', '브랜드 톤 학습', '무제한 생성', 'SEO 최적화']
  },
  {
    icon: BarChart3,
    iconColor: 'text-green-600',
    gradientFrom: 'from-green-500',
    gradientTo: 'to-emerald-500',
    title: '분석 대시보드',
    description: '실시간 성과 추적과 인사이트를 제공합니다. 데이터 기반 의사결정으로 비즈니스를 성장시키세요.',
    features: ['실시간 모니터링', '맞춤형 리포트', '예측 분석', '통합 대시보드'],
    detailedDescription: `
      분석 대시보드는 비즈니스의 모든 데이터를 통합하여 실시간으로 시각화하는 강력한 BI 도구입니다.

      마케팅, 세일즈, 고객 서비스, 재무 등 모든 부서의 데이터를 하나의 대시보드에서 확인할 수 있습니다.
      드래그 앤 드롭으로 원하는 위젯을 배치하여 나만의 대시보드를 구성하세요.

      AI 기반 예측 분석 엔진이 과거 데이터를 학습하여 미래 트렌드를 예측합니다.
      매출 예측, 이탈률 분석, 재고 최적화 등 비즈니스 의사결정에 필요한 인사이트를 제공합니다.

      자동 리포트 생성 기능으로 주간/월간 성과 리포트를 이메일로 받아보고,
      이상 징후 감지 시스템이 중요한 지표 변화를 즉시 알려드립니다.
    `,
    useCases: [
      '경영진을 위한 통합 성과 대시보드 구축',
      '마케팅 캠페인 ROI 실시간 추적',
      '세일즈 파이프라인 및 전환율 모니터링',
      '고객 행동 패턴 분석 및 세그먼트화',
      'AI 기반 매출 예측 및 재고 최적화',
    ],
    benefits: [
      '의사결정 속도 3배 향상',
      '데이터 기반 의사결정으로 실패율 50% 감소',
      '리포트 작성 시간 90% 절감',
      'AI 예측 분석으로 매출 예측 정확도 85% 달성',
      '실시간 알림으로 문제 대응 시간 80% 단축',
    ],
    pricing: 'Professional 플랜 이상에서 고급 분석 기능 제공',
  },
  {
    icon: Users,
    iconColor: 'text-indigo-600',
    gradientFrom: 'from-indigo-500',
    gradientTo: 'to-purple-500',
    title: '고객 관리 (CRM)',
    description: '고객과의 모든 접점을 관리합니다. 자동화된 커뮤니케이션과 개인화된 마케팅으로 고객 만족도를 높이세요.',
    features: ['고객 세그먼트', '자동 응답', '구매 이력 관리', '로열티 프로그램']
  },
  {
    icon: CreditCard,
    iconColor: 'text-red-600',
    gradientFrom: 'from-red-500',
    gradientTo: 'to-orange-500',
    title: '결제 시스템',
    description: '통합 결제 및 정산 관리 시스템입니다. 다양한 결제 수단을 지원하고 자동 정산 처리로 업무를 간소화합니다.',
    features: ['멀티 결제 지원', '자동 정산', '세금 계산', '환불 관리']
  },
  {
    icon: Mail,
    iconColor: 'text-violet-600',
    gradientFrom: 'from-violet-500',
    gradientTo: 'to-purple-500',
    title: '이메일 마케팅',
    description: '자동화된 이메일 캠페인으로 고객과 소통합니다. A/B 테스트와 세그먼트 기능으로 전환율을 높이세요.',
    features: ['드래그 앤 드롭 에디터', '자동화 워크플로우', 'A/B 테스팅', '상세 분석']
  },
  {
    icon: Search,
    iconColor: 'text-lime-600',
    gradientFrom: 'from-lime-500',
    gradientTo: 'to-green-500',
    title: 'SEO 최적화',
    description: '검색 엔진 최적화 도구로 웹사이트 순위를 향상시킵니다. 키워드 분석, 백링크 추적, 경쟁사 분석을 제공합니다.',
    features: ['키워드 리서치', '순위 추적', '기술 SEO 감사', '백링크 분석']
  },
  {
    icon: Layout,
    iconColor: 'text-pink-600',
    gradientFrom: 'from-pink-500',
    gradientTo: 'to-rose-500',
    title: '프로젝트 관리',
    description: '팀 협업과 일정 관리를 한 곳에서 해결합니다. 칸반 보드, 간트 차트, 시간 추적 기능을 제공합니다.',
    features: ['칸반 보드', '간트 차트', '시간 추적', '팀 협업']
  },
  {
    icon: Globe,
    iconColor: 'text-teal-600',
    gradientFrom: 'from-teal-500',
    gradientTo: 'to-cyan-500',
    title: '커뮤니티',
    description: '회원 커뮤니티 플랫폼으로 고객 참여를 유도합니다. 포럼, 이벤트, 멤버십 관리 기능을 제공합니다.',
    features: ['포럼 관리', '이벤트 캘린더', '멤버십 등급', '포인트 시스템']
  }
];

export default function ServicesSection() {
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
    <section id="services" className="py-20 bg-gradient-to-b from-white to-gray-50">
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
            비즈니스를 성장시키는 <span className="text-primary-600">통합 솔루션</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            10가지 강력한 SaaS 서비스로 마케팅부터 운영까지 모든 비즈니스 문제를 해결합니다.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100"
              >
                {/* Icon */}
                <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.gradientFrom} ${service.gradientTo} mb-6 shadow-md`}>
                  <IconComponent className="w-10 h-10 text-white" strokeWidth={2} />
                </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <div className="space-y-2">
                {service.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-2">
                    <span className="text-primary-600">✓</span>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleServiceClick(service)}
                className="mt-6 w-full py-3 bg-primary-50 hover:bg-primary-100 text-primary-700 font-semibold rounded-lg transition-colors duration-200"
              >
                자세히 보기 →
              </motion.button>
            </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-gray-600 mb-6">
            지금 시작하고 비즈니스 성장의 차이를 경험하세요
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            무료로 시작하기
          </motion.button>
        </motion.div>

        {/* Service Detail Modal */}
        {isModalOpen && selectedService && (() => {
          const ModalIconComponent = selectedService.icon;
          return (
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
                className="bg-white rounded-3xl p-8 md:p-12 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                {/* Close Button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <span className="text-2xl text-gray-600">×</span>
                </button>

                {/* Header */}
                <div className="text-center mb-8 pb-8 border-b-2 border-gray-200">
                  <div className={`inline-flex p-8 bg-gradient-to-br ${selectedService.gradientFrom} ${selectedService.gradientTo} rounded-3xl mb-4 shadow-lg`}>
                    <ModalIconComponent className="w-20 h-20 text-white" strokeWidth={2} />
                  </div>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  {selectedService.title}
                </h2>
                <p className="text-xl text-gray-700 font-medium max-w-2xl mx-auto">
                  {selectedService.description}
                </p>
              </div>

              {/* Detailed Description */}
              {selectedService.detailedDescription && (
                <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">상세 설명</h3>
                  <div className="text-base text-gray-700 leading-relaxed whitespace-pre-line">
                    {selectedService.detailedDescription}
                  </div>
                </div>
              )}

              {/* Use Cases */}
              {selectedService.useCases && selectedService.useCases.length > 0 && (
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
              )}

              {/* Benefits */}
              {selectedService.benefits && selectedService.benefits.length > 0 && (
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
              )}

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
              {selectedService.pricing && (
                <div className="mb-8 p-6 bg-gradient-to-br from-primary-100 to-primary-200 border border-primary-300 rounded-xl">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">💳 요금 정보</h3>
                  <p className="text-gray-800 font-medium">{selectedService.pricing}</p>
                </div>
              )}

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
          );
        })()}
      </div>
    </section>
  );
}
