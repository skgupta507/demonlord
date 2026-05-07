/* eslint-disable prettier/prettier */
'use client';
import Link from 'next/link';
import { Skull, Github, Twitter, Instagram, MessageCircle, ExternalLink } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';
import OnlineUsers from '@/components/online-users';

const STREAMS = [
  { label: 'Movies',   href: '/movie'  },
  { label: 'TV Shows', href: '/tv'     },
  { label: 'Anime',    href: '/anime'  },
  { label: 'Manga',    href: '/manga'  },
  { label: 'K-Drama',  href: '/drama'  },
];

const COMPANY = [
  { label: 'About',    href: '/about'   },
  { label: 'Privacy',  href: '/privacy' },
  { label: 'Terms',    href: '/terms'   },
  { label: 'DMCA',     href: '/dmca'    },
  { label: 'Settings', href: '/settings'},
];

const NETWORK = [
  { label: 'Arise Music', href: 'https://arise.pp.ua'    },
  { label: 'AnimeDex',    href: 'https://animedex.pp.ua' },
  { label: 'Dramzy',      href: 'https://dramzy.qd.je'   },
];

const SOCIALS = [
  { icon: Github,        href: 'https://github.com/skgupta507',           label: 'GitHub'    },
  { icon: Twitter,       href: 'https://x.com/sk_gupta143',               label: 'X'         },
  { icon: Instagram,     href: 'https://instagram.com/sk.gupta507',        label: 'Instagram' },
  { icon: MessageCircle, href: 'https://discord.com/channels/@skgupta507', label: 'Discord'   },
];

export const Footer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLight = mounted && resolvedTheme === 'light';

  const bg    = isLight ? 'bg-white'                       : 'bg-[hsl(0_0%_5%)]';
  const fg    = isLight ? 'text-gray-900'                  : 'text-white';
  const muted = isLight ? 'text-gray-500'                  : 'text-[hsl(var(--muted-foreground))]';
  const hover = isLight ? 'hover:text-gray-900'            : 'hover:text-white';
  const bdr   = isLight ? 'border-gray-200'                : 'border-[hsl(var(--border))]';
  const mono  = { fontFamily: 'var(--font-geist-mono)' } as const;
  const sans  = { fontFamily: 'var(--font-geist-sans)'  } as const;

  return (
    <footer className={`${bg} border-t ${bdr} mt-auto`}>
      <div className="mx-auto max-w-6xl px-6 pt-14 pb-8 space-y-12">

        {/* ── Top: brand + columns ── */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand — 2 cols wide */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/home" className="flex items-center gap-2.5 w-fit">
              <div className="h-9 w-9 rounded-xl flex items-center justify-center"
                style={{ background: 'var(--neon-pink)' }}>
                <Skull size={16} className="text-white" />
              </div>
              <span className={`font-black text-sm tracking-widest ${fg}`}
                style={{ fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.15em' }}>
                DEMONLORD
              </span>
            </Link>

            <p className={`text-sm leading-relaxed max-w-xs ${muted}`} style={sans}>
              Free streaming aggregator for movies, TV shows, anime and manga.
              No media hosted — third-party links only.
            </p>

            <OnlineUsers variant="badge" />

            {/* Socials */}
            <div className="flex items-center gap-2">
              {SOCIALS.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`h-8 w-8 rounded-lg border ${bdr} flex items-center justify-center ${muted} ${hover} hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] transition-all`}>
                  <s.icon size={14} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Streams */}
          <div className="space-y-4">
            <p className={`text-xs font-semibold ${fg}`} style={mono}>Streams</p>
            <ul className="space-y-3">
              {STREAMS.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className={`text-sm ${muted} ${hover} transition-colors`}
                    style={sans}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <p className={`text-xs font-semibold ${fg}`} style={mono}>Company</p>
            <ul className="space-y-3">
              {COMPANY.map(l => (
                <li key={l.href}>
                  <Link href={l.href}
                    className={`text-sm ${muted} ${hover} transition-colors`}
                    style={sans}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Network */}
          <div className="space-y-4">
            <p className={`text-xs font-semibold ${fg}`} style={mono}>Network</p>
            <ul className="space-y-3">
              {NETWORK.map(l => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className={`text-sm ${muted} ${hover} transition-colors inline-flex items-center gap-1.5 group`}
                    style={sans}>
                    {l.label}
                    <ExternalLink size={10} className="opacity-0 group-hover:opacity-50 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className={`border-t ${bdr}`} />

        {/* ── Bottom bar ── */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={`text-xs ${muted}`} style={mono}>
            © {new Date().getFullYear()} Demonlord. All rights reserved.
          </p>
          <p className={`text-xs ${muted}`} style={mono}>
            No media stored · Third-party links only
          </p>
        </div>

      </div>
    </footer>
  );
};
