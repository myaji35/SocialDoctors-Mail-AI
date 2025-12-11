import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // 빌드 시 환경 변수 검증 스킵
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // 빌드 시 환경 변수 누락 무시 - 실제 테스트 키 사용
  env: {
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_b2JsaWdpbmctdGVhbC03OC5jbGVyay5hY2NvdW50cy5kZXYk',
    NEXT_PUBLIC_CLERK_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL || '/sign-in',
    NEXT_PUBLIC_CLERK_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL || '/sign-up',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL || '/',
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL: process.env.NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL || '/',
  },
};

export default nextConfig;
