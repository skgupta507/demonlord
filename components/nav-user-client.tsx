/* eslint-disable prettier/prettier */
'use client';
import { useState } from 'react';
import { useAuth } from '@/lib/firebase/auth-context';
import AuthModal from '@/components/auth-modal';
import { LogIn, LogOut, User } from 'lucide-react';
import Image from 'next/image';

export default function NavUserClient() {
  const { user, signOut } = useAuth();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      {user ? (
        <div className="flex items-center gap-2 px-2">
          {user.photoURL ? (
            <Image src={user.photoURL} alt="avatar" width={24} height={24}
              className="rounded-full border border-[#FF006F]/30" />
          ) : (
            <div className="h-6 w-6 flex items-center justify-center border border-[#FF006F]/30">
              <User size={12} style={{ color: '#FF006F' }} />
            </div>
          )}
          <div className="flex flex-col leading-none flex-1 min-w-0">
            <span className="text-xs text-white/60 truncate" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              {user.displayName || user.email?.split('@')[0] || 'User'}
            </span>
            <span className="text-[0.45rem] tracking-widest text-white/25" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              AUTHENTICATED
            </span>
          </div>
          <button onClick={signOut} className="p-1 text-white/20 hover:text-[#FF006F] transition-colors">
            <LogOut size={12} />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setAuthOpen(true)}
          className="flex items-center gap-2 px-3 py-2 border border-white/8 hover:border-[#FF006F]/40 transition-colors w-full"
        >
          <LogIn size={13} className="text-white/30" />
          <span className="text-[0.6rem] tracking-widest text-white/30 hover:text-white/60" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            SIGN IN
          </span>
        </button>
      )}
    </>
  );
}
