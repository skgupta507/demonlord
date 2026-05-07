/* eslint-disable prettier/prettier */
'use client';
import Link from 'next/link';
import { ArrowLeft, ShieldOff, AlertTriangle, Mail, FileText, Clock, CheckCircle } from 'lucide-react';
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

const STEPS = [
  { icon: FileText,     title: 'Identify the work',   desc: 'Describe the copyrighted work and its unique identifiers.' },
  { icon: AlertTriangle, title: 'Identify the link',  desc: 'Provide the specific URL on DemonLord where content appears.' },
  { icon: Mail,         title: 'Send your notice',    desc: 'Include your contact info, statement of good faith, and signature.' },
  { icon: Clock,        title: 'We respond in 48h',   desc: 'We investigate and remove valid claims within 48 hours.' },
];

export default function DmcaPage() {
  return (
    <div className="min-h-screen">
      {/* Cinematic hero */}
      <div className="relative overflow-hidden py-24 px-6 border-b border-[hsl(var(--border))]"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--neon-yellow) 5%, transparent), transparent 60%)' }}>
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--foreground)) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <FadeIn>
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-3xl flex items-center justify-center"
                style={{ background: 'color-mix(in srgb, var(--neon-yellow) 15%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-yellow) 30%, transparent)' }}>
                <ShieldOff size={34} style={{ color: 'var(--neon-yellow)' }} />
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={100}>
            <div className="space-y-3">
              <h1 className="text-4xl font-black tracking-tight md:text-5xl" style={{ fontFamily: 'Orbitron, monospace' }}>
                DMCA Policy
              </h1>
              <p className="text-[0.6rem] tracking-[0.25em] text-[hsl(var(--muted-foreground))] uppercase"
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                Digital Millennium Copyright Act · Compliance Notice
              </p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] max-w-xl mx-auto leading-relaxed"
                style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                DemonLord respects intellectual property rights. We do not host any media files —
                all streams are sourced from third-party providers. Valid DMCA notices are processed within 48 hours.
              </p>
            </div>
          </FadeIn>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-16 space-y-16">
        {/* Important notice */}
        <FadeIn>
          <div className="rounded-2xl p-5 border flex items-start gap-4"
            style={{ background: 'color-mix(in srgb, var(--neon-yellow) 6%, transparent)', borderColor: 'color-mix(in srgb, var(--neon-yellow) 25%, transparent)' }}>
            <AlertTriangle size={20} style={{ color: 'var(--neon-yellow)', flexShrink: 0, marginTop: 2 }} />
            <div className="space-y-1">
              <p className="font-bold text-sm">We do not host any content.</p>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                DemonLord is a streaming aggregator. All media is hosted by external third-party services.
                To remove content at the source, contact the actual hosting provider.
                We can only remove links, not the underlying content.
              </p>
            </div>
          </div>
        </FadeIn>

        {/* Process steps */}
        <FadeIn delay={80}>
          <div className="space-y-6">
            <h2 className="text-xl font-black" style={{ fontFamily: 'Orbitron, monospace' }}>Takedown Process</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {STEPS.map((s, i) => (
                <div key={i} className="card-cyber p-5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ background: 'color-mix(in srgb, var(--neon-yellow) 12%, transparent)' }}>
                      <s.icon size={15} style={{ color: 'var(--neon-yellow)' }} />
                    </div>
                    <span className="text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))]"
                      style={{ fontFamily: 'Share Tech Mono, monospace' }}>STEP {i + 1}</span>
                  </div>
                  <h3 className="font-bold text-sm">{s.title}</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                    {s.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </FadeIn>

        {/* Policy sections */}
        {[
          { title: 'Notice Requirements', content: 'A valid DMCA takedown notice must include: (1) Identification of the copyrighted work. (2) The specific URL on DemonLord. (3) Your contact information. (4) A statement of good faith belief that the use is not authorized. (5) A statement under penalty of perjury that the information is accurate. (6) Your electronic or physical signature.' },
          { title: 'Counter-Notifications', content: 'If you believe content was removed in error, you may submit a counter-notification. Include your contact info, the URL of the removed content, a statement under penalty of perjury that removal was a mistake, and your consent to jurisdiction. We will restore content within 10-14 business days unless the complainant seeks a court order.' },
          { title: 'Repeat Infringers', content: 'DemonLord maintains a policy of terminating access for users who are found to be repeat infringers of copyright. We take intellectual property seriously and will act swiftly on legitimate claims.' },
        ].map((s, i) => (
          <FadeIn key={s.title} delay={i * 80}>
            <div className="space-y-3">
              <h2 className="text-base font-bold flex items-center gap-2">
                <CheckCircle size={15} style={{ color: 'var(--neon-green)' }} /> {s.title}
              </h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed"
                style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>{s.content}</p>
            </div>
          </FadeIn>
        ))}

        <FadeIn delay={200}>
          <div className="card-cyber p-6 text-center space-y-4"
            style={{ borderColor: 'color-mix(in srgb, var(--neon-yellow) 20%, transparent)' }}>
            <p className="text-sm font-bold">Ready to file a notice?</p>
            <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              Contact us with your full DMCA takedown request. We respond within 48 hours.
            </p>
            <a href="https://github.com/skgupta507" target="_blank" rel="noopener noreferrer">
              <button className="btn-neon text-xs px-6 py-2.5">Contact via GitHub</button>
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
