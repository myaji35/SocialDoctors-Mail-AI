import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialDoctors - 비즈니스를 치료하는 SaaS 클리닉",
  description: "10개 이상의 SaaS를 하나의 계정으로. 비즈니스 문제 진단부터 솔루션 처방까지.",
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // 빌드 시 환경 변수가 없을 경우 빈 문자열 사용 (런타임에 재설정됨)
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || '';

  return (
    <ClerkProvider publishableKey={publishableKey}>
      <html lang="ko">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
