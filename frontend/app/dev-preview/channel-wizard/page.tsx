'use client';
// 개발용 미리보기 페이지 — 프로덕션 배포 전 삭제
import { useEffect } from 'react';
import ChannelRegisterModal from '@/components/social-pulse/ChannelRegisterModal';

export default function PreviewPage() {
  useEffect(() => {
    // dev-preview: API 호출을 mock으로 처리
    const original = window.fetch;
    window.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : (input as Request).url;
      if (url.includes('/api/social-pulse/channels') && init?.method === 'POST') {
        return new Response(JSON.stringify({ channel: { id: 'mock-id' }, message: '채널이 등록되었습니다.' }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        });
      }
      return original(input, init);
    };
    return () => { window.fetch = original; };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <ChannelRegisterModal
        onClose={() => alert('닫기')}
        onSuccess={() => alert('등록 성공!')}
      />
    </div>
  );
}
