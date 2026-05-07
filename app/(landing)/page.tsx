/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import {
  Film, Tv2, Antenna, Book, Play, Skull,
  Zap, Shield, Globe, Star, MonitorPlay,
  BookOpen, Sparkles, ChevronRight,
} from 'lucide-react';
import AuthModal from '@/components/auth-modal';
import OnlineUsers from '@/components/online-users';
import { useAuth } from '@/lib/firebase/auth-context';
import { useTheme } from 'next-themes';

/* ─────────────────────────────────────────────
   Animated counter
───────────────────────────────────────────── */
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [v, setV] = useState(0);
  const [go, setGo] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setGo(true); });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  useEffect(() => {
    if (!go) return;
    let c = 0;
    const step = to / 60;
    const t = setInterval(() => {
      c = Math.min(c + step, to);
      setV(Math.floor(c));
      if (c >= to) clearInterval(t);
    }, 18);
    return () => clearInterval(t);
  }, [go, to]);
  return <span ref={ref}>{v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v}{suffix}</span>;
}

/* ─────────────────────────────────────────────
   Anime title ticker (cosmic-jet style)
───────────────────────────────────────────── */
const TITLES = [
  // Anime
  'One Piece', 'Naruto', 'Attack on Titan', 'Demon Slayer',
  'Jujutsu Kaisen', 'Bleach', 'Dragon Ball Z', 'Hunter x Hunter',
  'Fullmetal Alchemist', 'Tokyo Ghoul', 'Sword Art Online',
  'My Hero Academia', 'Death Note', 'Vinland Saga', 'Chainsaw Man',
  'Re:Zero', 'Steins;Gate', 'Code Geass', 'Cowboy Bebop', 'Evangelion',
  // Movies
  'Inception', 'Interstellar', 'The Dark Knight', 'Avengers: Endgame',
  'Oppenheimer', 'Dune', 'The Matrix', 'Parasite', 'Gladiator',
  'Spider-Man: No Way Home', 'Top Gun: Maverick', 'John Wick',
  'The Godfather', 'Pulp Fiction', 'Fight Club', 'Joker',
  // TV Shows
  'Breaking Bad', 'Game of Thrones', 'Stranger Things', 'The Boys',
  'House of the Dragon', 'Peaky Blinders', 'The Last of Us',
  'Wednesday', 'Squid Game', 'Severance', 'Succession', 'Euphoria',
  // K-Dramas
  'Crash Landing on You', 'Itaewon Class', 'Vincenzo', 'My Love from the Star',
  'Goblin', 'Descendants of the Sun', 'Business Proposal',
  'Extraordinary Attorney Woo', 'Twenty-Five Twenty-One', 'Hometown Cha-Cha-Cha',
];

const TITLES_ROW2 = [
  // More movies
  'Tenet', 'No Time to Die', 'Black Panther', 'Doctor Strange',
  'The Batman', 'Elvis', 'Barbie', 'Killers of the Flower Moon',
  // More TV
  'Andor', 'The Bear', 'White Lotus', 'Yellowstone', 'Ozark',
  'Better Call Saul', 'Dark', 'Money Heist', 'Lupin',
  // More anime
  'Spy x Family', 'Blue Lock', 'Oshi no Ko', 'Frieren',
  'Solo Leveling', 'Dandadan', 'Kaiju No. 8', 'Dungeon Meshi',
  // More K-Drama
  'Hellbound', 'All of Us Are Dead', 'Sweet Home', 'Kingdom',
  'Signal', 'My Mister', 'Reply 1988', 'Mr. Sunshine',
];

function TitleTicker() {
  const row1 = [...TITLES, ...TITLES];
  const row2 = [...TITLES_ROW2, ...TITLES_ROW2];
  return (
    <div className={`relative w-full overflow-hidden border-y border-[hsl(var(--border))] py-0`}
      style={{ maskImage: 'linear-gradient(90deg, transparent, black 6%, black 94%, transparent)' }}>
      {/* Row 1 — left to right, slower */}
      <div className="flex gap-6 whitespace-nowrap w-max py-2.5"
        style={{ animation: 'marquee 60s linear infinite' }}>
        {row1.map((t, i) => (
          <span key={i} className="text-[0.65rem] tracking-widest uppercase text-[hsl(var(--muted-foreground))]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {t}
            <span className="mx-3 opacity-25">·</span>
          </span>
        ))}
      </div>
      {/* Row 2 — right to left */}
      <div className="flex gap-6 animate-marquee-reverse whitespace-nowrap w-max py-2.5 border-t border-[hsl(var(--border))]">
        {row2.map((t, i) => (
          <span key={i} className="text-[0.65rem] tracking-widest uppercase text-[hsl(var(--muted-foreground))]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {t}
            <span className="mx-3 opacity-25">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Feature card
───────────────────────────────────────────── */
const FEATURES = [
  {
    icon: Shield,
    title: 'Zero Ads',
    desc: 'Watch without interruptions. No banners, no pop-ups, ever.',
    color: 'var(--neon-green)',
  },
  {
    icon: MonitorPlay,
    title: 'Sub & Dub',
    desc: 'Every anime title in both subbed and dubbed formats.',
    color: 'var(--neon-blue)',
  },
  {
    icon: Zap,
    title: 'HD Streaming',
    desc: 'Up to 1080p with multiple server fallbacks for any connection.',
    color: 'var(--neon-yellow)',
  },
  {
    icon: Sparkles,
    title: 'Daily Updates',
    desc: 'New episodes and releases added within hours of broadcast.',
    color: 'var(--neon-purple)',
  },
  {
    icon: Globe,
    title: 'Any Device',
    desc: 'Works seamlessly on desktop, tablet, and mobile.',
    color: 'var(--neon-pink)',
  },
  {
    icon: BookOpen,
    title: 'Manga & More',
    desc: 'Thousands of manga chapters alongside anime and movies.',
    color: 'var(--neon-yellow)',
  },
];

const STATS = [
  { to: 50,  suffix: 'K+', label: 'Movies'       },
  { to: 500, suffix: 'K+', label: 'Active Users'  },
  { to: 15,  suffix: 'K+', label: 'Anime Titles'  },
  { to: 0,   suffix: '',   label: 'Ads',  zero: true },
];
const STAT_COLORS = [
  'var(--neon-pink)',
  'var(--neon-blue)',
  'var(--neon-purple)',
  'var(--neon-green)',
];

const CONTENT_TYPES = [
  { icon: Film,    label: 'Movies',   href: '/movie',  color: 'var(--neon-pink)'   },
  { icon: Tv2,     label: 'TV Shows', href: '/tv',     color: 'var(--neon-blue)'   },
  { icon: Antenna, label: 'Anime',    href: '/anime',  color: 'var(--neon-purple)' },
  { icon: Book,    label: 'Manga',    href: '/manga',  color: 'var(--neon-yellow)' },
];

/* ─────────────────────────────────────────────
   Page
───────────────────────────────────────────── */
export default function LandingPage() {
  const { user } = useAuth();
  const { resolvedTheme } = useTheme();
  const [authOpen, setAuthOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const isLight = mounted && resolvedTheme === 'light';

  useEffect(() => { setMounted(true); }, []);

  const fg = isLight ? 'text-gray-900' : 'text-white';
  const muted = isLight ? 'text-gray-500' : 'text-[hsl(var(--muted-foreground))]';
  const border = 'border-[hsl(var(--border))]';
  const card = isLight ? 'bg-white border border-gray-200' : 'bg-[hsl(var(--card))] border border-[hsl(var(--border))]';
  const mono = { fontFamily: 'var(--font-geist-mono)' } as const;

  return (
    <div className="w-full">
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="relative w-full min-h-[92vh] flex flex-col items-center justify-center overflow-hidden px-6">
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 40%, color-mix(in srgb, var(--neon-pink) 8%, transparent) 0%, transparent 70%)' }} />

        <div className={`relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto gap-8 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* Online badge */}
          <OnlineUsers variant="badge" />

          {/* Eyebrow */}
          <p className={`text-xs tracking-[0.3em] uppercase ${muted}`} style={mono}>
            Your Complete Entertainment Platform
          </p>

          {/* Main headline */}
          <div className="space-y-2">
            <h1 className={`text-5xl font-black leading-[0.9] tracking-tight md:text-7xl lg:text-8xl ${fg}`}
              style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 900 }}>
              DEMON
              <span style={{
                background: 'linear-gradient(135deg, var(--neon-pink) 0%, var(--neon-purple) 60%, var(--neon-blue) 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>LORD</span>
            </h1>
          </div>

          {/* Sub-headline */}
          <p className={`text-base leading-relaxed max-w-xl ${muted}`}
            style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 400 }}>
            Thousands of movies, TV shows, anime and manga — in English Sub &amp; Dub —{' '}
            <span style={{ color: 'var(--neon-pink)', fontWeight: 600 }}>completely free.</span>
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/home">
              <button className="btn-neon px-8 py-3 text-sm gap-2">
                <Play size={14} className="fill-white" /> Start Watching
              </button>
            </Link>
            <Link href="/anime">
              <button className="btn-outline px-8 py-3 text-sm gap-2">
                <Antenna size={14} /> Browse Anime
              </button>
            </Link>
            {!user && (
              <button
                onClick={() => setAuthOpen(true)}
                className={`px-6 py-3 text-xs tracking-widest border rounded-lg transition-all ${border} ${muted} hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)]`}
                style={mono}>
                SIGN IN
              </button>
            )}
          </div>

          {/* Content type pills */}
          <div className="flex flex-wrap justify-center gap-2 pt-2">
            {CONTENT_TYPES.map(({ icon: Icon, label, href, color }) => (
              <Link key={href} href={href}>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs border transition-all hover:scale-105 ${border}`}
                  style={mono}>
                  <Icon size={12} style={{ color }} />
                  <span className={muted}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className={`h-8 w-5 rounded-full border-2 ${border} flex items-start justify-center pt-1.5`}>
            <div className="h-2 w-1 rounded-full animate-pulse" style={{ background: 'var(--neon-pink)' }} />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TITLE TICKER
      ══════════════════════════════════════════ */}
      <TitleTicker />

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section className={`w-full py-16 px-6 border-b ${border}`}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div key={i} className="flex flex-col items-center gap-1 text-center">
              <span className="text-4xl font-black tabular-nums"
                style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 900, color: STAT_COLORS[i] }}>
                {s.zero ? '0' : <Counter to={s.to} suffix={s.suffix} />}
              </span>
              <span className={`text-[0.6rem] tracking-[0.2em] uppercase ${muted}`} style={mono}>
                {s.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES GRID
      ══════════════════════════════════════════ */}
      <section className={`w-full py-20 px-6`}>
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <p className={`text-[0.6rem] tracking-[0.3em] uppercase ${muted}`} style={mono}>
              Everything you need
            </p>
            <h2 className={`text-2xl font-black md:text-3xl ${fg}`}
              style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 900 }}>
              Built for entertainment fans, by fans.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => (
              <div key={f.title} className={`${card} rounded-xl p-6 space-y-3 transition-all hover:-translate-y-1 hover:shadow-lg`}>
                <div className="h-10 w-10 rounded-xl flex items-center justify-center"
                  style={{ background: `color-mix(in srgb, ${f.color} 12%, transparent)` }}>
                  <f.icon size={20} style={{ color: f.color }} strokeWidth={1.8} />
                </div>
                <h3 className={`font-bold text-sm ${fg}`}
                  style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 700 }}>
                  {f.title}
                </h3>
                <p className={`text-xs leading-relaxed ${muted}`}
                  style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          BROWSE CATEGORIES
      ══════════════════════════════════════════ */}
      <section className={`w-full py-20 px-6 border-t ${border}`}
        style={{ background: isLight ? 'hsl(220 20% 98%)' : 'hsl(0 0% 5%)' }}>
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <p className={`text-[0.6rem] tracking-[0.3em] uppercase ${muted}`} style={mono}>
              Browse by category
            </p>
            <h2 className={`text-2xl font-black md:text-3xl ${fg}`}
              style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 900 }}>
              What do you want to watch?
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Film,    label: 'Movies',   sub: '50K+ titles',         href: '/movie',  color: 'var(--neon-pink)'   },
              { icon: Tv2,     label: 'TV Shows',  sub: 'Every season',        href: '/tv',     color: 'var(--neon-blue)'   },
              { icon: Antenna, label: 'Anime',     sub: 'Sub & Dub',           href: '/anime',  color: 'var(--neon-purple)' },
              { icon: Book,    label: 'Manga',     sub: 'Thousands of chapters', href: '/manga', color: 'var(--neon-yellow)' },
            ].map((c) => (
              <Link key={c.href} href={c.href}>
                <div className={`${card} rounded-xl p-6 space-y-4 cursor-pointer group transition-all hover:-translate-y-1 hover:shadow-lg`}>
                  <div className="h-12 w-12 rounded-2xl flex items-center justify-center"
                    style={{ background: `color-mix(in srgb, ${c.color} 15%, transparent)` }}>
                    <c.icon size={24} style={{ color: c.color }} strokeWidth={1.6} />
                  </div>
                  <div>
                    <p className={`font-bold text-base ${fg}`}
                      style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 700 }}>
                      {c.label}
                    </p>
                    <p className={`text-xs mt-0.5 ${muted}`} style={{ fontFamily: 'var(--font-geist-sans)' }}>
                      {c.sub}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs transition-all group-hover:gap-2"
                    style={{ color: c.color, fontFamily: 'var(--font-geist-mono)' }}>
                    Browse <ChevronRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          JOIN CTA  (cosmic-jet style)
      ══════════════════════════════════════════ */}
      <section className={`w-full py-24 px-6 border-t ${border} text-center`}
        style={{ background: 'linear-gradient(135deg, color-mix(in srgb, var(--neon-pink) 5%, transparent), transparent 60%, color-mix(in srgb, var(--neon-purple) 4%, transparent))' }}>
        <div className="max-w-lg mx-auto space-y-6">
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-3xl flex items-center justify-center shadow-2xl"
              style={{ background: 'var(--neon-pink)', boxShadow: '0 0 60px color-mix(in srgb, var(--neon-pink) 40%, transparent)' }}>
              <Skull size={32} className="text-white" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className={`text-3xl font-black md:text-4xl ${fg}`}
              style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 900 }}>
              Ready to Start Watching?
            </h2>
            <p className={`text-sm leading-relaxed ${muted}`}
              style={{ fontFamily: 'var(--font-geist-sans)' }}>
              Dive into movies, TV shows, anime and manga — free and ad-free.
              No credit card required.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/home">
              <button className="btn-neon px-10 py-3.5 text-sm">
                Get Started
              </button>
            </Link>
            <Link href="/anime">
              <button className="btn-outline px-10 py-3.5 text-sm">
                Browse Anime
              </button>
            </Link>
          </div>

          {/* Footer links */}
          <div className="flex justify-center flex-wrap gap-5 pt-4">
            {[['About', '/about'], ['Privacy', '/privacy'], ['Terms', '/terms'], ['DMCA', '/dmca']].map(([l, h]) => (
              <Link key={h} href={h}
                className={`text-[0.6rem] tracking-widest uppercase transition-colors hover:text-[var(--neon-pink)] ${muted}`}
                style={mono}>
                {l}
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
