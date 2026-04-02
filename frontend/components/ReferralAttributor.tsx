'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useRef } from 'react';

/**
 * 로그인 후 ref 쿠키가 있으면 자동으로 파트너 귀속을 처리하는 컴포넌트.
 * httpOnly 쿠키는 클라이언트에서 읽을 수 없으므로,
 * 서버 API가 직접 쿠키를 읽어 처리한다.
 */
export default function ReferralAttributor() {
  const { data: session, status } = useSession();
  const attempted = useRef(false);

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id || attempted.current) {
      return;
    }

    attempted.current = true;

    fetch('/api/affiliate/attribute', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    }).catch(() => {});
  }, [status, session]);

  return null;
}
