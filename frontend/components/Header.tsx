'use client';

import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Image from 'next/image';

export default function Header() {
  const { isSignedIn, user } = useUser();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="SaaS Clinic Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-gray-900 leading-tight">
                SaaS Clinic
              </span>
              <span className="text-sm font-semibold text-primary-600 leading-tight">
                SocialDoctor's
              </span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#saas" className="text-gray-600 hover:text-primary-600 transition-colors">
              SaaS
            </a>
            <a href="#services" className="text-gray-600 hover:text-primary-600 transition-colors">
              서비스
            </a>
            <a href="#partners" className="text-gray-600 hover:text-primary-600 transition-colors">
              파트너
            </a>
            <a href="#pricing" className="text-gray-600 hover:text-primary-600 transition-colors">
              요금제
            </a>
            <a href="#about" className="text-gray-600 hover:text-primary-600 transition-colors">
              소개
            </a>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center gap-4">
            {!isSignedIn ? (
              <>
                <SignInButton mode="modal">
                  <button className="px-4 py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors">
                    로그인
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="px-6 py-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300">
                    시작하기
                  </button>
                </SignUpButton>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600 hidden md:block">
                  환영합니다, {user?.firstName || '회원'}님
                </span>
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-10 h-10"
                    }
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
}
