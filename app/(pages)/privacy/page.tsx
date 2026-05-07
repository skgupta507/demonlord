/* eslint-disable prettier/prettier */
'use client';
import Link from 'next/link';
import { ArrowLeft, Lock, Eye, Database, Share2, Trash2, Shield } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setV(true); }, { threshold: 0.05 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: v ? 1 : 0, transform: v ? 'translateY(0)' : 'translateY(18px)', transition: `all 0.55s ease ${delay}ms` }}>
      {children}
    </div>
  );
}

const SECTIONS = [
  { icon: Eye, title: 'Information We Collect', color: 'var(--neon-blue)', content: 'When you create an account via Firebase Authentication, we collect your email address and display name. If you sign in with Google, we receive your public Google profile. We store this securely in Firebase Firestore. We do not collect payment information, browsing history beyond your local device, or any sensitive personal data.' },
  { icon: Database, title: 'How We Use Your Data', color: 'var(--neon-purple)', content: 'We use your information solely to maintain your account, save preferences (watchlist, watch history, settings) locally on your device, and send authentication emails when you request a password reset or magic link. We do not sell your data to advertisers or third parties — ever.' },
  { icon: Share2, title: 'Third-Party Services', color: 'var(--neon-pink)', content: 'DemonLord integrates with TMDB, AniList, ScreenScape, and MangaDex to fetch content metadata and streams. These services have their own privacy policies. We embed content from third-party streaming providers — their trackers and policies apply within those embeds.' },
  { icon: Lock, title: 'Local Storage', color: 'var(--neon-green)', content: 'Your watchlist, watch history, and settings are stored in your browser\'s localStorage — they never leave your device unless you\'re signed in. Clearing your browser data removes all local DemonLord data. You can export your data at any time from Settings.' },
  { icon: Trash2, title: 'Data Retention & Deletion', color: 'var(--neon-yellow)', content: 'Account data is retained until you request deletion. You may delete your account via Settings → Account. Upon deletion, your data is permanently removed from Firebase within 30 days. Local data (watchlist, history) can be cleared instantly from Settings.' },
  { icon: Shield, title: 'Cookies', color: 'var(--neon-blue)', content: 'We use Firebase Authentication session cookies to keep you signed in. We do not use advertising cookies or sell cookie data. You can disable cookies in your browser, though this will prevent authentication from working.' },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden py-24 px-6 border-b border-[hsl(var(--border))]"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--neon-blue) 5%, transparent), transparent 60%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <FadeIn>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-3xl flex items-center justify-center"
                style={{ background: 'color-mix(in srgb, var(--neon-blue) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-blue) 30%, transparent)' }}>
                <Lock size={34} style={{ color: 'var(--neon-blue)' }} />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl" style={{ fontFamily: 'var(--font-geist-mono)' }}>Privacy Policy</h1>
            <p className="text-[0.6rem] tracking-[0.25em] text-[hsl(var(--muted-foreground))] uppercase"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-lg mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-geist-sans)' }}>
              We believe in radical transparency. Here&apos;s exactly what we collect, why, and how you can control it.
            </p>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-8">
        <div className="grid gap-5">
          {SECTIONS.map((s, i) => (
            <FadeIn key={s.title} delay={i * 60}>
              <div className="card-cyber p-6 space-y-3" style={{ borderLeft: `3px solid ${s.color}` }}>
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: `color-mix(in srgb, ${s.color} 12%, transparent)` }}>
                    <s.icon size={15} style={{ color: s.color }} />
                  </div>
                  <h2 className="font-bold text-sm">{s.title}</h2>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed pl-11"
                  style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.9rem' }}>{s.content}</p>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn delay={400}>
          <div className="card-cyber p-6 text-center space-y-3"
            style={{ background: 'color-mix(in srgb, var(--neon-blue) 4%, transparent)' }}>
            <p className="font-bold text-sm">Questions about your privacy?</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Reach out via GitHub or Discord. We respond to all privacy requests.
            </p>
            <div className="flex justify-center gap-3">
              <a href="https://github.com/skgupta507" target="_blank" rel="noopener noreferrer">
                <button className="btn-neon text-xs px-5 py-2">Contact Us</button>
              </a>
              <Link href="/settings"><button className="btn-outline text-xs px-5 py-2">Manage Data</button></Link>
            </div>
          </div>
        </FadeIn>
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] hover:text-[var(--neon-pink)] transition-colors"
          style={{ fontFamily: 'var(--font-geist-mono)' }}>
          <ArrowLeft size={12} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
