/* eslint-disable prettier/prettier */
'use client';
import { AuthProvider } from '@/lib/firebase/auth-context';
import type { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}
