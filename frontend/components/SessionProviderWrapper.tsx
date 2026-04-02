'use client';

import { SessionProvider } from 'next-auth/react';
import ReferralAttributor from './ReferralAttributor';

export default function SessionProviderWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <ReferralAttributor />
      {children}
    </SessionProvider>
  );
}
