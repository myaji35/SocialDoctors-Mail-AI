'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Image from 'next/image';

interface DashboardShellProps {
  appName: string;
  appSlug: string;
  themeColor: string; // tailwind color name e.g. "blue"
  children: React.ReactNode;
  navItems?: { label: string; href: string; active?: boolean }[];
}

export default function DashboardShell({
  appName,
  appSlug,
  themeColor,
  children,
  navItems = [],
}: DashboardShellProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar */}
      <header className={`bg-${themeColor}-700 text-white px-6 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-4">
          <Link href={`/saas/apps/${appSlug}`} className="flex items-center gap-2 text-white/80 hover:text-white text-sm transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
              <path d="M19 12H5M12 5l-7 7 7 7"/>
            </svg>
            SocialDoctors
          </Link>
          <span className="text-white/60">/</span>
          <span className="font-bold text-white">{appName}</span>
          <span className={`text-xs px-2 py-0.5 bg-${themeColor}-500 rounded-full font-semibold`}>무료 체험</span>
        </div>
        <div className="flex items-center gap-3">
          {session?.user?.image && (
            <Image src={session.user.image} alt="프로필" width={32} height={32} className="rounded-full border-2 border-white/30" />
          )}
          <span className="text-sm text-white/80">{session?.user?.name?.split(' ')[0]}님</span>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="text-xs text-white/60 hover:text-white transition-colors"
          >
            로그아웃
          </button>
        </div>
      </header>

      {/* Sub Nav */}
      {navItems.length > 0 && (
        <nav className="bg-white border-b border-gray-200 px-6">
          <div className="flex gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  item.active
                    ? `border-${themeColor}-600 text-${themeColor}-700`
                    : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}

      {/* Content */}
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        {children}
      </main>

      {/* 업그레이드 배너 */}
      <div className={`bg-${themeColor}-50 border-t border-${themeColor}-200 px-6 py-3 flex items-center justify-between`}>
        <p className={`text-sm text-${themeColor}-800`}>
          무료 체험 중입니다. 프리미엄으로 업그레이드하면 모든 기능을 사용할 수 있습니다.
        </p>
        <Link
          href={`/saas/apps/${appSlug}#pricing`}
          className={`text-sm font-semibold px-4 py-1.5 bg-${themeColor}-600 text-white rounded-lg hover:bg-${themeColor}-700 transition-colors`}
        >
          업그레이드
        </Link>
      </div>
    </div>
  );
}
