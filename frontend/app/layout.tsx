import type { Metadata } from "next";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

export const metadata: Metadata = {
  title: "SocialDoctors - 비즈니스를 치료하는 SaaS 클리닉",
  description: "10개 이상의 SaaS를 하나의 계정으로. 비즈니스 문제 진단부터 솔루션 처방까지.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="ko">
        <body className="antialiased">
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
