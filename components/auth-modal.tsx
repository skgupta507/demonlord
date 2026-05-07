/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '@/lib/firebase/auth-context';
import { X, Mail, Lock, Zap, Eye, EyeOff, ArrowRight, AlertTriangle } from 'lucide-react';

type Mode = 'signin' | 'signup' | 'magic' | 'reset';

interface Props { open: boolean; onClose: () => void; }

export default function AuthModal({ open, onClose }: Props) {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendMagicLink, resetPassword, error, configured } = useAuth();
  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!open || !mounted) return null;

  const handle = async () => {
    if (!configured) return;
    setLoading(true); setSuccess('');
    try {
      if (mode === 'signin') await signInWithEmail(email, password);
      else if (mode === 'signup') await signUpWithEmail(email, password);
      else if (mode === 'magic') { await sendMagicLink(email); setSuccess('Magic link sent! Check your email.'); }
      else if (mode === 'reset') { await resetPassword(email); setSuccess('Reset email sent!'); }
      if (mode === 'signin' || mode === 'signup') onClose();
    } catch {} finally { setLoading(false); }
  };

  const handleGoogle = async () => {
    if (!configured) return;
    setLoading(true);
    try { await signInWithGoogle(); onClose(); } catch {} finally { setLoading(false); }
  };

  const titles: Record<Mode, string> = {
    signin: 'SIGN IN', signup: 'CREATE ACCOUNT', magic: 'MAGIC LINK', reset: 'RESET PASSWORD',
  };

  const modal = (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 99999 }}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-md border border-white/10 bg-[#080B14] overflow-hidden"
        style={{ zIndex: 100000, boxShadow: '0 0 60px rgba(255,0,111,0.15), 0 0 120px rgba(0,212,255,0.08)' }}>
        <div className="absolute top-0 left-0 right-0 h-[1px]"
          style={{ background: 'linear-gradient(90deg, transparent, #FF006F, #BD00FF, #00D4FF, transparent)' }} />

        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <div className="text-[0.5rem] tracking-[0.3em] text-[#FF006F]/60 mb-1"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>DEMONLORD // AUTH PORTAL</div>
            <h2 className="text-lg font-black tracking-[0.15em] text-white"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>{titles[mode]}</h2>
          </div>
          <button onClick={onClose} className="text-white/30 hover:text-white p-1"><X size={18} /></button>
        </div>

        <div className="px-6 py-6 space-y-4">
          {!configured && (
            <div className="border border-[#F9F002]/30 bg-[#F9F002]/5 p-4 space-y-2">
              <div className="flex items-center gap-2">
                <AlertTriangle size={14} style={{ color: '#F9F002' }} />
                <span className="text-[0.6rem] tracking-widest text-[#F9F002]"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>FIREBASE NOT CONFIGURED</span>
              </div>
              <p className="text-xs text-white/40" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                Add these to your <code className="text-[#F9F002]">.env.local</code> to enable auth:
              </p>
              <div className="text-[0.55rem] text-white/30 space-y-0.5" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                <div>NEXT_PUBLIC_FIREBASE_API_KEY</div>
                <div>NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN</div>
                <div>NEXT_PUBLIC_FIREBASE_PROJECT_ID</div>
                <div>NEXT_PUBLIC_FIREBASE_APP_ID</div>
              </div>
              <a href="https://console.firebase.google.com" target="_blank" rel="noopener noreferrer"
                className="text-[0.55rem] tracking-widest text-[#00D4FF] underline"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                Get config at console.firebase.google.com →
              </a>
            </div>
          )}

          {configured && (mode === 'signin' || mode === 'signup') && (
            <button onClick={handleGoogle} disabled={loading}
              className="w-full flex items-center justify-center gap-3 border border-white/10 py-3 hover:border-[#00D4FF]/40 hover:bg-[#00D4FF]/5 transition-all text-white/60 hover:text-white"
              style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.65rem', letterSpacing: '0.2em' }}>
              <svg viewBox="0 0 24 24" width="16" height="16">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              CONTINUE WITH GOOGLE
            </button>
          )}

          {configured && (mode === 'signin' || mode === 'signup') && (
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-white/8" />
              <span className="text-[0.5rem] tracking-widest text-white/20"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>OR</span>
              <div className="flex-1 h-px bg-white/8" />
            </div>
          )}

          {configured && (
            <div className="space-y-3">
              <div className="flex items-center border border-white/10 focus-within:border-[#FF006F]/50 transition-colors">
                <Mail size={13} className="ml-3 text-white/30 shrink-0" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="EMAIL ADDRESS"
                  className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-white/20"
                  style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.7rem', letterSpacing: '0.08em' }} />
              </div>
              {(mode === 'signin' || mode === 'signup') && (
                <div className="flex items-center border border-white/10 focus-within:border-[#FF006F]/50 transition-colors">
                  <Lock size={13} className="ml-3 text-white/30 shrink-0" />
                  <input type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)} placeholder="PASSWORD"
                    onKeyDown={e => e.key === 'Enter' && handle()}
                    className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-white/20"
                    style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.7rem', letterSpacing: '0.08em' }} />
                  <button onClick={() => setShowPw(!showPw)} className="mr-3 text-white/20 hover:text-white/50">
                    {showPw ? <EyeOff size={13} /> : <Eye size={13} />}
                  </button>
                </div>
              )}
            </div>
          )}

          {(error || success) && (
            <div className={`p-3 border text-[0.6rem] space-y-1 ${error ? 'border-[#FF006F]/30 bg-[#FF006F]/5' : 'border-[#39FF14]/30 bg-[#39FF14]/5'}`}>
              <p className={error ? 'text-[#FF006F]' : 'text-[#39FF14]'}
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {error || success}
              </p>
              {error?.includes('configuration-not-found') && (
                <p className="text-white/40 text-[0.55rem]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  Fix: In Firebase Console → Authentication → Sign-in method → enable Email/Password and Google providers.
                </p>
              )}
              {error?.includes('auth/invalid-api-key') && (
                <p className="text-white/40 text-[0.55rem]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  Fix: Check your NEXT_PUBLIC_FIREBASE_API_KEY in .env — do not wrap in quotes.
                </p>
              )}
            </div>
          )}

          {configured && (
            <button onClick={handle} disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 font-black tracking-[0.2em] transition-all disabled:opacity-50 text-white"
              style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.65rem',
                background: 'linear-gradient(90deg, #FF006F, #BD00FF)',
                boxShadow: '0 0 20px rgba(255,0,111,0.3)' }}>
              {loading
                ? <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <>{titles[mode]} <ArrowRight size={13} /></>}
            </button>
          )}

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 pt-1">
            {mode !== 'signin' && (
              <button onClick={() => { setMode('signin'); setSuccess(''); }}
                className="text-[0.55rem] tracking-widest text-white/30 hover:text-[#00D4FF] transition-colors"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>SIGN IN</button>
            )}
            {mode !== 'signup' && (
              <button onClick={() => { setMode('signup'); setSuccess(''); }}
                className="text-[0.55rem] tracking-widest text-white/30 hover:text-[#BD00FF] transition-colors"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>CREATE ACCOUNT</button>
            )}
            {mode !== 'magic' && (
              <button onClick={() => { setMode('magic'); setSuccess(''); }}
                className="text-[0.55rem] tracking-widest text-white/30 hover:text-[#F9F002] transition-colors flex items-center gap-1"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                <Zap size={9} /> MAGIC LINK
              </button>
            )}
            {mode === 'signin' && (
              <button onClick={() => { setMode('reset'); setSuccess(''); }}
                className="text-[0.55rem] tracking-widest text-white/30 hover:text-[#39FF14] transition-colors"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>FORGOT PASSWORD</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
