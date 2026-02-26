'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function PartnerLandingPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: '100vh', background: '#F3F2F2' }}>
      {/* Header */}
      <div style={{ background: '#16325C', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ color: '#00A1E0', fontWeight: 700, fontSize: '20px' }}>SocialDoctors</span>
        <span style={{ color: '#fff', fontSize: '14px' }}>파트너 프로그램</span>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '60px 24px' }}>
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <h1 style={{ fontSize: '40px', fontWeight: 700, color: '#16325C', marginBottom: '16px' }}>
            내 네트워크로<br />수익을 만드세요
          </h1>
          <p style={{ fontSize: '18px', color: '#555', marginBottom: '32px', lineHeight: 1.6 }}>
            SocialDoctors 파트너로 가입하면 소개한 분들의 모든 SaaS 결제에서<br />
            <strong style={{ color: '#00A1E0' }}>20% 수수료</strong>를 자동으로 적립받습니다.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <button
              onClick={() => router.push('/partner/register')}
              style={{
                background: '#00A1E0',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              파트너 신청하기
            </button>
            <button
              onClick={() => router.push('/partner/dashboard')}
              style={{
                background: '#fff',
                color: '#16325C',
                border: '2px solid #16325C',
                borderRadius: '6px',
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              대시보드 바로가기
            </button>
          </div>
        </motion.div>

        {/* Benefits */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
          {[
            { title: '20% 수수료', desc: '소개한 유저의 모든 SaaS 결제에서 자동 적립' },
            { title: '실시간 추적', desc: '클릭, 가입, 결제 현황을 대시보드에서 즉시 확인' },
            { title: '투명한 정산', desc: '50,000원 이상 적립 시 언제든 정산 신청 가능' },
          ].map((item) => (
            <div
              key={item.title}
              style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '28px 24px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              }}
            >
              <h3 style={{ color: '#00A1E0', fontWeight: 700, fontSize: '20px', marginBottom: '8px' }}>
                {item.title}
              </h3>
              <p style={{ color: '#555', fontSize: '14px', lineHeight: 1.6 }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
