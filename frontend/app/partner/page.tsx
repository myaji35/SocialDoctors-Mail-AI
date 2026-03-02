'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PartnerLandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F3F2F2]">
      {/* Header */}
      <div className="bg-[#16325C] px-6 sm:px-8 py-4 flex items-center gap-3">
        <span className="text-[#00A1E0] font-bold text-xl">SocialDoctors</span>
        <span className="text-white text-sm">파트너 프로그램</span>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#16325C] mb-5 leading-tight">
            내 네트워크로<br />수익을 만드세요
          </h1>
          <p className="text-base sm:text-lg text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
            SocialDoctors 파트너로 가입하면 소개한 분들의 모든 SaaS 결제에서{' '}
            <strong className="text-[#00A1E0]">20% 수수료</strong>를 자동으로 적립받습니다.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => router.push('/partner/register')}
              className="bg-[#00A1E0] text-white rounded-lg px-8 py-3.5 text-base font-semibold hover:bg-[#0090C8] transition-colors"
            >
              파트너 신청하기
            </button>
            <button
              onClick={() => router.push('/partner/dashboard')}
              className="bg-white text-[#16325C] border-2 border-[#16325C] rounded-lg px-8 py-3.5 text-base font-semibold hover:bg-gray-50 transition-colors"
            >
              대시보드 바로가기
            </button>
          </div>
        </motion.div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: '20% 수수료', desc: '소개한 유저의 모든 SaaS 결제에서 자동 적립' },
            { title: '실시간 추적', desc: '클릭, 가입, 결제 현황을 대시보드에서 즉시 확인' },
            { title: '투명한 정산', desc: '50,000원 이상 적립 시 언제든 정산 신청 가능' },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white rounded-xl p-7 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-[#00A1E0] font-bold text-lg mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
