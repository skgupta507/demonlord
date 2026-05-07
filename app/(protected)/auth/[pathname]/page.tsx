/* eslint-disable prettier/prettier */
// Auth is now handled by Firebase.
// This stub replaces the old @daveyplate/better-auth-ui auth page.
// The AuthModal component (components/auth-modal.tsx) handles all auth UI.
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();
  useEffect(() => {
    // Redirect to home — auth is handled by the modal on any page
    router.replace('/');
  }, [router]);
  return null;
}
