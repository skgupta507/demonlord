/* eslint-disable prettier/prettier */
'use client';
import Link from 'next/link';
import { Skull, Github, MessageCircle, ExternalLink } from 'lucide-react';
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
];

const NETWORK = [
  { label: 'Arise Music', href: 'https://arise.pp.ua'    },
  { label: 'AnimeDex',    href: 'https://animedex.pp.ua' },
  { label: 'Dramzy',      href: 'https://dramzy.qd.je'   },
];

const SOCIALS = [
  { icon: Github,        href: 'https://github.com/skgupta507',           label: 'GitHub'  },
  { icon: MessageCircle, href: 'https://discord.com/channels/@skgupta507', label: 'Discord' },
];

export const Footer = () => {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isLight = mounted && resolvedTheme === 'light';

  const muted  = isLight ? 'text-gray-500'  : 'text-[hsl(var(--muted-foreground))]';
  const fg     = isLight ? 'text-gray-900'  : 'text-white';
  const hover  = isLight ? 'hover:text-gray-900' : 'hover:text-white';
  const bdr    = isLight ? 'border-gray-200' : 'border-[hsl(var(--border))]';
  const bg     = isLight ? 'bg-white'        : 'bg-[hsl(0_0%_5%)]';
  const mono   = { fontFamily: 'var(--font-geist-mono)' } as const;
  const sans   = { fontFamily: 'var(--font-geist-sans)' } as const;

  return (
    <footer className={`${bg} border-t ${bdr} mt-auto`}>
      <div className="mx-auto max-w-6xl px-6 pt-8 pb-5">

        {/* ── Main grid ── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5 mb-8">

          {/* Brand — 2 cols */}
          <div className="lg:col-span-2 space-y-3">
            <Link href="/home" className="flex items-center gap-2 w-fit">
              <div className="h-7 w-7 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--neon-pink)' }}>
                <Skull size={13} className="text-white" />
              </div>
              <span className={`text-sm font-black tracking-widest ${fg}`} style={mono}>
                DEMONLORD
              </span>
            </Link>

            <p className={`text-xs leading-relaxed max-w-[220px] ${muted}`} style={sans}>
              Free streaming for movies, TV, anime and manga. No media hosted.
            </p>

            <OnlineUsers variant="inline" />

            <div className="flex items-center gap-2 pt-0.5">
              {SOCIALS.map(s => (
                <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer"
                  aria-label={s.label}
                  className={`h-7 w-7 rounded-lg border ${bdr} flex items-center justify-center ${muted} ${hover} hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] transition-all`}>
                  <s.icon size={13} strokeWidth={1.8} />
                </a>
              ))}
            </div>
          </div>

          {/* Streams */}
          <div className="space-y-3">
            <p className={`text-xs font-semibold ${fg}`} style={mono}>Streams</p>
            <ul className="space-y-2">
              {STREAMS.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className={`text-xs ${muted} ${hover} transition-colors`} style={sans}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-3">
            <p className={`text-xs font-semibold ${fg}`} style={mono}>Company</p>
            <ul className="space-y-2">
              {COMPANY.map(l => (
                <li key={l.href}>
                  <Link href={l.href} className={`text-xs ${muted} ${hover} transition-colors`} style={sans}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Network */}
          <div className="space-y-3">
            <p className={`text-xs font-semibold ${fg}`} style={mono}>Network</p>
            <ul className="space-y-2">
              {NETWORK.map(l => (
                <li key={l.href}>
                  <a href={l.href} target="_blank" rel="noopener noreferrer"
                    className={`text-xs ${muted} ${hover} transition-colors inline-flex items-center gap-1 group`}
                    style={sans}>
                    {l.label}
                    <ExternalLink size={9} className="opacity-0 group-hover:opacity-40 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className={`border-t ${bdr} pt-4 flex flex-col sm:flex-row items-center justify-between gap-2`}>
          <p className={`text-[0.65rem] ${muted}`} style={mono}>
            © {new Date().getFullYear()} Demonlord. All rights reserved.
          </p>
          <p className={`text-[0.65rem] ${muted}`} style={mono}>
            No media stored · Third-party links only
          </p>
        </div>

      </div>
    </footer>
  );
};
