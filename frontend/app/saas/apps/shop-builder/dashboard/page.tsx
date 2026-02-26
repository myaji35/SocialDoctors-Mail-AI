'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import DashboardShell from '@/components/saas-dashboard/DashboardShell';

const navItems = [
  { label: '대시보드', href: '/saas/apps/shop-builder/dashboard', active: true },
  { label: '상품 관리', href: '#' },
  { label: '주문 관리', href: '#' },
  { label: '디자인', href: '#' },
];

const products = [
  { name: '프리미엄 가죽 지갑', price: '₩89,000', stock: 42, sales: 234, status: '판매중' },
  { name: '무선 이어폰 케이스', price: '₩29,000', stock: 8, sales: 891, status: '재고부족' },
  { name: '캔버스 토트백', price: '₩49,000', stock: 0, sales: 1204, status: '품절' },
];

export default function ShopBuilderDashboard() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/sign-in?callbackUrl=/saas/apps/shop-builder/dashboard');
  }, [status, router]);

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center text-gray-500">로딩 중...</div>;

  return (
    <DashboardShell appName="Shop Builder" appSlug="shop-builder" themeColor="teal" navItems={navItems}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: '오늘 주문', value: '28건', change: '+7건' },
          { label: '이번달 매출', value: '₩12.4M', change: '+34%' },
          { label: '등록 상품', value: '147개', change: '+12개' },
          { label: '방문자', value: '3,420명', change: '+890명' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <p className="text-xs text-gray-500 mb-1">{s.label}</p>
            <p className="text-2xl font-bold text-gray-900">{s.value}</p>
            <p className="text-xs mt-1 text-teal-600 font-semibold">{s.change}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">상품 목록</h2>
            <button className="text-xs px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">+ 상품 추가</button>
          </div>
          <div className="space-y-3">
            {products.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-3 border border-gray-100 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-teal-600 text-lg">🛍️</div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{p.name}</p>
                    <p className="text-xs text-gray-500">재고 {p.stock}개 · 판매 {p.sales}건</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-teal-700">{p.price}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${p.status === '판매중' ? 'bg-green-100 text-green-700' : p.status === '재고부족' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">내 쇼핑몰 미리보기</h2>
          <div className="border-2 border-dashed border-teal-200 rounded-xl p-6 text-center">
            <div className="text-4xl mb-3">🏪</div>
            <p className="font-semibold text-gray-700 mb-1">내 쇼핑몰</p>
            <p className="text-xs text-gray-400 mb-4">myshop.socialdoctors.co.kr</p>
            <div className="flex gap-2 justify-center">
              <button className="px-4 py-2 text-sm bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">미리보기</button>
              <button className="px-4 py-2 text-sm border border-teal-200 text-teal-700 rounded-lg hover:bg-teal-50 transition-colors">디자인 편집</button>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <p className="text-xs font-semibold text-gray-600 mb-2">빠른 설정</p>
            {['도메인 연결', '결제 수단 설정', '배송 정책 설정', 'SNS 연동'].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-50">
                <span className="text-sm text-gray-600">{item}</span>
                <button className="text-xs text-teal-600 hover:underline">설정</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
