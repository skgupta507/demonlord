/* eslint-disable prettier/prettier */
'use client';
import Link from 'next/link';
import { ArrowLeft, FileText, CheckCircle } from 'lucide-react';
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

const TERMS = [
  { title: 'Acceptance of Terms', content: 'By accessing DemonLord, you agree to these Terms of Service. If you disagree with any part, you may not use our service. We reserve the right to modify these terms at any time with notice.' },
  { title: 'Use of Service', content: 'DemonLord is provided for personal, non-commercial use only. You may not use this service to distribute, reproduce, or commercially exploit any content accessed through it. You are responsible for all activity under your account.' },
  { title: 'Content Disclaimer', content: 'DemonLord does not host, upload, or own any media content. We aggregate links to streams hosted by third-party services. We make no representations about the accuracy, legality, or availability of third-party content.' },
  { title: 'Intellectual Property', content: 'The DemonLord interface, design, and codebase are open source (MIT License). All media content displayed belongs to its respective copyright holders. We claim no ownership over third-party media.' },
  { title: 'Limitation of Liability', content: 'DemonLord is provided "as is" without warranty of any kind. We are not liable for any damages arising from use of the service, including but not limited to data loss, service interruptions, or content from third-party providers.' },
  { title: 'Account Termination', content: 'We reserve the right to suspend or terminate accounts that violate these terms, abuse the service, or engage in copyright infringement. Users may delete their own accounts at any time via Settings.' },
  { title: 'Governing Law', content: 'These terms are governed by applicable international law. Any disputes will be resolved through good-faith negotiation. By using DemonLord, you agree to resolve disputes informally before pursuing legal action.' },
  { title: 'Changes to Terms', content: 'We may update these terms periodically. Continued use of DemonLord after changes constitutes acceptance of the new terms. Significant changes will be communicated through the site.' },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden py-24 px-6 border-b border-[hsl(var(--border))]"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--neon-pink) 5%, transparent), transparent 60%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-3xl mx-auto text-center space-y-5">
          <FadeIn>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-3xl flex items-center justify-center"
                style={{ background: 'color-mix(in srgb, var(--neon-pink) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-pink) 30%, transparent)' }}>
                <FileText size={34} style={{ color: 'var(--neon-pink)' }} />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <h1 className="text-4xl font-black tracking-tight md:text-5xl" style={{ fontFamily: 'Orbitron, monospace' }}>Terms of Service</h1>
            <p className="text-[0.6rem] tracking-[0.25em] text-[hsl(var(--muted-foreground))] uppercase"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-lg mx-auto leading-relaxed"
              style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Plain English terms. We keep them short, fair, and easy to understand.
            </p>
          </FadeIn>
        </div>
      </div>
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-6">
        {TERMS.map((t, i) => (
          <FadeIn key={t.title} delay={i * 50}>
            <div className="space-y-2">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <CheckCircle size={13} style={{ color: 'var(--neon-pink)', flexShrink: 0 }} />{t.title}
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed pl-5"
                style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>{t.content}</p>
            </div>
          </FadeIn>
        ))}
        <FadeIn delay={450}>
          <div className="card-cyber p-5 text-center space-y-2 mt-4"
            style={{ background: 'color-mix(in srgb, var(--neon-pink) 4%, transparent)' }}>
            <p className="text-sm font-bold">Questions about our terms?</p>
            <a href="https://github.com/skgupta507" target="_blank" rel="noopener noreferrer">
              <button className="btn-neon text-xs px-5 py-2 mt-2">Contact via GitHub</button>
            </a>
          </div>
        </FadeIn>
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))] hover:text-[var(--neon-pink)] transition-colors"
          style={{ fontFamily: 'Share Tech Mono, monospace' }}>
          <ArrowLeft size={12} /> Back to Home
        </Link>
      </div>
    </div>
  );
}
