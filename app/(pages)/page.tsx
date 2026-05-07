/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Film, Tv2, Antenna, Book, ArrowRight, Play, Skull, Star, Zap, Shield, Globe } from 'lucide-react';
import AuthModal from '@/components/auth-modal';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTheme } from 'next-themes';

/* ── Glitch Text ── */
const G = 'アイウエ0123456789!#$%@ABCDEF';
function GlitchText({ text, active, style, className }: { text: string; active: boolean; style?: React.CSSProperties; className?: string }) {
  const [out, setOut] = useState(text);
  useEffect(() => {
    if (!active) { setOut(text); return; }
    let f = 0;
    const t = setInterval(() => {
      if (f < 10) { setOut(text.split('').map(c => c === ' ' ? c : Math.random() < 0.4 ? G[Math.floor(Math.random() * G.length)] : c).join('')); f++; }
      else { setOut(text); clearInterval(t); }
    }, 55);
    return () => clearInterval(t);
  }, [text, active]);
  return <span style={style} className={className}>{out}</span>;
}

/* ── Counter ── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!go) return;
    let c = 0; const s = to / 60;
    const t = setInterval(() => { c = Math.min(c + s, to); setV(Math.floor(c)); if (c >= to) clearInterval(t); }, 18);
    return () => clearInterval(t);
  }, [go, to]);
  return <span ref={ref}>{v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v}{suffix}</span>;
}

/* ── Feature Card ── */
function FeatureCard({ icon: Icon, title, desc, href, color, delay }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current); return () => obs.disconnect();
  }, []);
  return (
    <Link href={href}>
      <div ref={ref} className="card-cyber p-5 h-full space-y-4 cursor-pointer group"
        style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.5s ease ${delay}ms` }}>
        <div className="h-10 w-10 rounded-xl flex items-center justify-center"
          style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
          <Icon size={20} style={{ color }} strokeWidth={1.8} />
        </div>
        <div>
          <h3 className="font-bold text-sm mb-1.5">{title}</h3>
          <p className="text-xs leading-relaxed text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{desc}</p>
        </div>
        <div className="flex items-center gap-1.5 text-[0.6rem] tracking-wider group-hover:gap-2.5 transition-all"
          style={{ color, fontFamily: 'Share Tech Mono, monospace' }}>
          Browse <ArrowRight size={10} />
        </div>
      </div>
    </Link>
  );
}

const FEATURES = [
  { icon: Film,    title: 'Movies',   desc: 'Blockbusters to indie gems. Latest releases, HD quality, zero cost.',            color: 'var(--neon-pink)',   href: '/movie' },
  { icon: Tv2,     title: 'TV Shows', desc: 'Every season, every episode. Stream series from every era, any genre.',          color: 'var(--neon-blue)',   href: '/tv'    },
  { icon: Antenna, title: 'Anime',    desc: 'Sub & dub. Seasonal to legendary. Powered by AniList & ScreenScape.',            color: 'var(--neon-purple)', href: '/anime' },
  { icon: Book,    title: 'Manga',    desc: 'Thousands of chapters. Read anywhere, anytime, completely free.',                 color: 'var(--neon-yellow)', href: '/manga' },
];

const STATS = [{ to: 50, suffix: 'K+', label: 'Movies' }, { to: 10, suffix: 'K+', label: 'TV Shows' }, { to: 15, suffix: 'K+', label: 'Anime' }, { to: 100, suffix: '%', label: 'Free' }];
const STATCOLORS = ['var(--neon-pink)', 'var(--neon-blue)', 'var(--neon-purple)', 'var(--neon-green)'];

const WHY = [
  { icon: Shield,  title: 'Ad-Free Streaming', desc: 'Built-in ad blocker in every player. No pop-ups, no redirects.',   color: 'var(--neon-green)'  },
  { icon: Zap,     title: 'Multiple Servers',   desc: '6+ streaming servers per title. If one fails, switch instantly.', color: 'var(--neon-yellow)' },
  { icon: Globe,   title: 'No Region Locks',    desc: 'Watch from anywhere in the world. No VPN required.',              color: 'var(--neon-blue)'   },
  { icon: Star,    title: 'Curated Content',    desc: 'TMDB & AniList metadata for rich info, ratings and discovery.',   color: 'var(--neon-pink)'   },
];

export default function Home() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isLight = resolvedTheme === 'light';

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => { setGlitch(true); setTimeout(() => setGlitch(false), 600); }, 4500);
    return () => clearInterval(id);
  }, []);

  const muted = isLight ? 'text-gray-500' : 'text-[hsl(var(--muted-foreground))]';
  const border = `border-[hsl(var(--border))]`;

  return (
    <div className="w-full">
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* ════════════════════ HERO ════════════════════ */}
      <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 45% at 50% 42%, color-mix(in srgb, var(--neon-pink) 7%, transparent) 0%, transparent 70%)' }} />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center text-center w-full max-w-3xl mx-auto px-6 gap-7">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-[0.52rem] tracking-widest transition-all duration-700 ${border} ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}
            style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
            <span style={{ color: 'var(--neon-green)' }}>ONLINE</span>
            <span className={muted}>· Neural Cinema · Free Streaming</span>
          </div>

          {/* Giant Title */}
          <div className={`transition-all duration-700 delay-150 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="relative select-none" style={{ lineHeight: 0.85 }}>
              {/* Glitch layers */}
              {['var(--neon-blue)', 'var(--neon-purple)'].map((c, i) => (
                <div key={i} className="absolute inset-0 pointer-events-none" style={{
                  fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(4rem, 16vw, 12rem)',
                  color: c, opacity: 0.28, letterSpacing: '0.04em',
                  animation: glitch ? `glitch-${i + 1} 0.4s steps(2) forwards` : 'none',
                }}>DEMON</div>
              ))}
              <h1 style={{
                fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(4rem, 16vw, 12rem)',
                letterSpacing: '0.04em', lineHeight: 0.85,
                background: 'linear-gradient(175deg, var(--neon-pink) 0%, var(--neon-pink) 50%, var(--neon-purple) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>DEMON</h1>
            </div>
            <h1 style={{
              fontFamily: 'Orbitron, monospace', fontWeight: 900, fontSize: 'clamp(4rem, 16vw, 12rem)',
              letterSpacing: '0.04em', lineHeight: 0.85,
              color: isLight ? 'hsl(222 30% 8%)' : 'hsl(var(--foreground))',
            }}>LORD</h1>
          </div>

          {/* Tagline */}
          <div className={`space-y-2 transition-all duration-700 delay-250 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <p className="text-[0.62rem] tracking-[0.22em] uppercase" style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--neon-blue)' }}>
              Neural Cinema Interface · v5.0
            </p>
            <p className={`text-sm leading-relaxed max-w-sm mx-auto ${muted}`} style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem' }}>
              Millions of movies, series and anime — free, forever.
              <span style={{ color: 'var(--neon-pink)' }}> No subscriptions. No limits.</span>
            </p>
          </div>

          {/* CTAs */}
          <div className={`flex flex-wrap justify-center gap-3 transition-all duration-700 delay-350 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'}`}>
            <Link href="/movie"><button className="btn-neon px-7 py-2.5 text-sm"><Play size={14} className="fill-white" /> Watch Now</button></Link>
            <Link href="/anime"><button className="btn-outline px-7 py-2.5 text-sm"><Antenna size={14} /> Anime</button></Link>
            {!user && (
              <button onClick={() => setAuthOpen(true)}
                className={`text-[0.65rem] tracking-wider border rounded-lg px-5 py-2.5 transition-all ${border} ${muted} hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)]`}
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                SIGN IN
              </button>
            )}
          </div>

          {/* Stats */}
          <div className={`flex flex-wrap justify-center gap-8 md:gap-14 transition-all duration-700 delay-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <span className="text-3xl font-black" style={{ fontFamily: 'Orbitron, monospace', color: STATCOLORS[i] }}>
                  <Counter to={s.to} suffix={s.suffix} />
                </span>
                <span className={`text-[0.48rem] tracking-[0.25em] uppercase ${muted}`} style={{ fontFamily: 'Share Tech Mono, monospace' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 animate-bounce">
          <div className={`h-8 w-5 rounded-full border-2 ${border} flex items-start justify-center pt-1.5`}>
            <div className="h-2 w-1 rounded-full animate-pulse" style={{ background: 'var(--neon-pink)' }} />
          </div>
        </div>
      </section>

      {/* ════════════════════ FEATURES ════════════════════ */}
      <section className={`w-full py-20 px-6 border-t ${border}`}>
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className={`text-[0.55rem] tracking-[0.25em] uppercase ${muted}`} style={{ fontFamily: 'Share Tech Mono, monospace' }}>WHAT&apos;S INSIDE</p>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl" style={{ fontFamily: 'Orbitron, monospace' }}>Everything you need.</h2>
            <p className={`text-sm max-w-sm mx-auto ${muted}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>One platform for all your entertainment.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => <FeatureCard key={f.href} {...f} delay={i * 80} />)}
          </div>
        </div>
      </section>

      {/* ════════════════════ WHY DEMONLORD ════════════════════ */}
      <section className={`w-full py-20 px-6 border-t ${border}`}
        style={{ background: isLight ? 'hsl(220 20% 98%)' : 'hsl(0 0% 6%)' }}>
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className={`text-[0.55rem] tracking-[0.25em] uppercase ${muted}`} style={{ fontFamily: 'Share Tech Mono, monospace' }}>WHY US</p>
            <h2 className="text-2xl font-black tracking-tight md:text-3xl" style={{ fontFamily: 'Orbitron, monospace' }}>Built different.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((w, i) => (
              <div key={w.title} className="card-cyber p-5 space-y-3">
                <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${w.color} 12%, transparent)` }}>
                  <w.icon size={17} style={{ color: w.color }} strokeWidth={1.8} />
                </div>
                <h3 className="font-bold text-sm">{w.title}</h3>
                <p className={`text-xs leading-relaxed ${muted}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ NETWORK ════════════════════ */}
      <section className={`w-full py-20 px-6 border-t ${border}`}>
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <div className="space-y-2">
            <p className={`text-[0.55rem] tracking-[0.25em] uppercase ${muted}`} style={{ fontFamily: 'Share Tech Mono, monospace' }}>NETWORK</p>
            <h2 className="text-2xl font-black" style={{ fontFamily: 'Orbitron, monospace' }}>Our Sister Sites</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { name: 'Arise Music', url: 'https://arise.pp.ua', desc: 'Free music streaming', color: 'var(--neon-pink)' },
              { name: 'AnimeDex', url: 'https://animedex.pp.ua', desc: 'Anime encyclopedia', color: 'var(--neon-purple)' },
              { name: 'Dramzy', url: 'https://dramzy.qd.je', desc: 'K-Drama & Asian dramas', color: 'var(--neon-green)' },
            ].map(p => (
              <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer" className="group">
                <div className="card-cyber p-5 space-y-3 text-center h-full group-hover:scale-[1.02] transition-transform">
                  <div className="h-2 w-8 rounded-full mx-auto" style={{ background: p.color }} />
                  <p className="font-bold text-sm">{p.name}</p>
                  <p className={`text-xs ${muted}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>{p.desc}</p>
                  <p className="text-[0.55rem] tracking-wider" style={{ color: p.color, fontFamily: 'Share Tech Mono, monospace' }}>VISIT →</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════ CTA ════════════════════ */}
      <section className={`w-full py-24 px-6 text-center border-t ${border}`}
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--neon-pink) 5%, transparent), transparent 60%)' }}>
        <div className="max-w-md mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-2xl flex items-center justify-center shadow-2xl"
              style={{ background: 'var(--neon-pink)', boxShadow: '0 0 40px color-mix(in srgb, var(--neon-pink) 40%, transparent)' }}>
              <Skull size={28} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-black" style={{ fontFamily: 'Orbitron, monospace' }}>Ready to watch?</h2>
          <p className={`text-sm ${muted}`} style={{ fontFamily: 'Rajdhani, sans-serif' }}>Free, forever. No registration needed.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/movie"><button className="btn-neon px-8 py-3">Enter Cinema</button></Link>
            <Link href="/anime"><button className="btn-outline px-8 py-3">Browse Anime</button></Link>
          </div>
          <div className="flex justify-center flex-wrap gap-4 pt-2">
            {[['About','/about'],['Privacy','/privacy'],['Terms','/terms'],['DMCA','/dmca']].map(([l,h]) => (
              <Link key={h} href={h} className={`text-[0.52rem] tracking-widest uppercase transition-colors hover:text-[var(--neon-pink)] ${muted}`}
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>{l}</Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
