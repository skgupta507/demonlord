/* eslint-disable prettier/prettier */
'use client';
import Link from 'next/link';
import { ArrowLeft, Skull, ExternalLink, Github, Twitter, Instagram, MessageCircle, Zap, Globe, Music, Book } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(24px)',
      transition: `all 0.6s ease ${delay}ms`,
    }}>{children}</div>
  );
}

const TECH = [
  { label: 'Framework', value: 'Next.js 15 (App Router)' },
  { label: 'Language', value: 'TypeScript 5' },
  { label: 'Styling', value: 'Tailwind CSS 4 + shadcn/ui' },
  { label: 'Movies & TV', value: 'TMDB API' },
  { label: 'Anime', value: 'AniList GraphQL' },
  { label: 'Streaming', value: 'ScreenScape Embed' },
  { label: 'Auth', value: 'Firebase Authentication' },
  { label: 'Manga', value: 'AniList + MangaDex API' },
];

const PARTNERS = [
  {
    name: 'Arise Music',
    url: 'https://arise.pp.ua',
    icon: Music,
    color: 'var(--neon-pink)',
    desc: 'Your gateway to free, high-quality music streaming. Arise brings thousands of tracks from indie to mainstream — all without a subscription. A sister project of DemonLord focused purely on audio.',
    features: ['Free Music Streaming', 'Indie & Mainstream', 'No Subscription'],
  },
  {
    name: 'AnimeDex',
    url: 'https://animedex.pp.ua',
    icon: Book,
    color: 'var(--neon-purple)',
    desc: 'The ultimate anime encyclopedia and discovery platform. AnimeDex provides deep metadata, character profiles, staff info, and community ratings — the perfect companion to DemonLord\'s streaming.',
    features: ['Anime Encyclopedia', 'Character Profiles', 'Community Ratings'],
  },
  {
    name: 'Dramzy',
    url: 'https://dramzy.qd.je',
    icon: Globe,
    color: 'var(--neon-green)',
    desc: 'Dedicated to Korean, Chinese and Asian dramas. Dramzy curates the best of K-drama and C-drama with episode guides, actor bios, and streaming links. The drama lover\'s home base.',
    features: ['K-Drama & C-Drama', 'Episode Guides', 'Actor Database'],
  },
];

const SOCIALS = [
  { icon: Github,        href: 'https://github.com/skgupta507',           label: 'GitHub' },
  { icon: Twitter,       href: 'https://x.com/sk_gupta143',               label: 'X / Twitter' },
  { icon: Instagram,     href: 'https://instagram.com/sk.gupta507',        label: 'Instagram' },
  { icon: MessageCircle, href: 'https://discord.com/channels/@skgupta507', label: 'Discord' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-6 border-b border-[hsl(var(--border))]"
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--neon-pink) 6%, transparent), transparent 60%, color-mix(in srgb, var(--neon-blue) 4%, transparent))' }}>
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center gap-6">
          <div className="h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl"
            style={{ background: 'var(--neon-pink)', boxShadow: '0 0 60px color-mix(in srgb, var(--neon-pink) 40%, transparent)' }}>
            <Skull size={36} className="text-white" />
          </div>
          <div className="space-y-3">
            <h1 className="text-4xl font-black tracking-tight md:text-6xl" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              DEMONLORD
            </h1>
            <p className="text-[0.65rem] tracking-[0.3em] text-[hsl(var(--muted-foreground))] uppercase"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              NEURAL CINEMA INTERFACE · v5.0 · FREE FOREVER
            </p>
            <p className="text-base text-[hsl(var(--muted-foreground))] max-w-lg mx-auto leading-relaxed"
              style={{ fontFamily: 'var(--font-geist-sans)' }}>
              A free, open-source streaming aggregator that connects you to movies, TV shows,
              anime and manga without hosting a single byte of media.
            </p>
          </div>
          <div className="flex gap-3">
            {SOCIALS.map(s => (
              <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                className="h-10 w-10 rounded-xl border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] transition-all hover:scale-110"
                title={s.label}>
                <s.icon size={16} strokeWidth={1.8} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-20">

        {/* Mission */}
        <FadeSection>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>OUR MISSION</p>
              <h2 className="text-2xl font-black" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                Entertainment should be free.
              </h2>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.95rem' }}>
                DemonLord was built on a simple belief: great content shouldn&apos;t be locked behind
                paywalls. We aggregate publicly available streams and present them in a beautiful,
                fast, modern interface — no account needed, no credit card, no region locks.
              </p>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.95rem' }}>
                Think of us as a search engine for streaming — we find the streams, you watch them.
                All media remains hosted by its original providers.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {['No Ads', 'No Paywall', 'Open Source', 'No Sign-up Required', 'Multi-Source', 'Dark & Light Mode'].map(f => (
                <div key={f} className="card-cyber p-4 flex items-center gap-2">
                  <Zap size={12} style={{ color: 'var(--neon-pink)', flexShrink: 0 }} />
                  <span className="text-xs font-medium">{f}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>

        {/* Tech Stack */}
        <FadeSection delay={100}>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>TECH STACK</p>
              <h2 className="text-2xl font-black" style={{ fontFamily: 'var(--font-geist-mono)' }}>Built with the best.</h2>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {TECH.map((t, i) => (
                <div key={t.label} className="card-cyber p-4 flex items-center gap-4">
                  <span className="text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] w-24 shrink-0"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {t.label.toUpperCase()}
                  </span>
                  <div className="flex-1 h-px bg-[hsl(var(--border))]" />
                  <span className="text-sm font-medium text-right">{t.value}</span>
                </div>
              ))}
            </div>
          </div>
        </FadeSection>

        {/* Partner Sites */}
        <FadeSection delay={150}>
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>NETWORK</p>
              <h2 className="text-2xl font-black" style={{ fontFamily: 'var(--font-geist-mono)' }}>Our Sister Sites</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                DemonLord is part of a growing network of free entertainment platforms.
              </p>
            </div>
            <div className="space-y-6">
              {PARTNERS.map((p, i) => (
                <FadeSection key={p.name} delay={i * 100}>
                  <div className="card-cyber p-6 space-y-4 group cursor-pointer"
                    style={{ borderLeft: `3px solid ${p.color}` }}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{ background: `color-mix(in srgb, ${p.color} 15%, transparent)` }}>
                          <p.icon size={18} style={{ color: p.color }} />
                        </div>
                        <div>
                          <h3 className="font-bold text-base">{p.name}</h3>
                          <a href={p.url} target="_blank" rel="noopener noreferrer"
                            className="text-xs flex items-center gap-1 hover:underline"
                            style={{ color: p.color, fontFamily: 'var(--font-geist-mono)' }}>
                            {p.url.replace('https://', '')} <ExternalLink size={9} />
                          </a>
                        </div>
                      </div>
                      <a href={p.url} target="_blank" rel="noopener noreferrer">
                        <button className="btn-outline text-xs px-3 py-1.5 shrink-0">Visit →</button>
                      </a>
                    </div>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed"
                      style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.9rem' }}>
                      {p.desc}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {p.features.map(f => (
                        <span key={f} className="text-[0.55rem] tracking-wider border rounded-full px-2.5 py-1"
                          style={{ color: p.color, borderColor: `color-mix(in srgb, ${p.color} 30%, transparent)`,
                            fontFamily: 'var(--font-geist-mono)' }}>
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </FadeSection>
              ))}
            </div>
          </div>
        </FadeSection>

        {/* Creator */}
        <FadeSection delay={200}>
          <div className="card-cyber p-8 text-center space-y-5"
            style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--neon-pink) 5%, transparent), transparent)' }}>
            <div className="space-y-2">
              <p className="text-[0.55rem] tracking-[0.25em] uppercase text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>BUILT BY</p>
              <h2 className="text-xl font-black" style={{ fontFamily: 'var(--font-geist-mono)' }}>SK Gupta</h2>
              <p className="text-sm text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                Developer, designer, and believer in free entertainment for everyone.
              </p>
            </div>
            <div className="flex justify-center gap-3">
              {SOCIALS.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  className="h-10 w-10 rounded-xl border border-[hsl(var(--border))] flex items-center justify-center text-[hsl(var(--muted-foreground))] hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] transition-all hover:scale-110"
                  title={s.label}>
                  <s.icon size={16} strokeWidth={1.8} />
                </a>
              ))}
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              <Link href="/movie"><button className="btn-neon text-xs px-5 py-2">Start Watching</button></Link>
              <a href="https://github.com/skgupta507" target="_blank" rel="noopener noreferrer">
                <button className="btn-outline text-xs px-5 py-2"><Github size={13} /> GitHub</button>
              </a>
            </div>
          </div>
        </FadeSection>
      </div>
    </div>
  );
}
