/* eslint-disable prettier/prettier */
'use client';
import { useState } from 'react';
import { ChevronDown, Shield, ShieldOff, Download } from 'lucide-react';
import Link from 'next/link';

interface Props { id: string; episode: string; m3u8Url?: string; tracks?: any[]; }

const SERVERS = [
  { key: 'screenscape', label: 'SCREENSCAPE', tag: 'REC',
    url: (id: string, ep: string) => `https://screenscape.me/embed?anilist=${id}&type=anime&ep=${ep}` },
  { key: 'default',     label: 'DEFAULT',
    url: (id: string, ep: string) => `https://flix.1ani.me/embed/anilist-${id}-${ep}` },
  { key: 'vidsrc',      label: 'VIDSRC',
    url: (id: string, ep: string) => `https://vidsrc.in/embed/anime/${id}/${ep}` },
  { key: 'vidlink',     label: 'VIDLINK',
    url: (id: string, ep: string) => `https://vidlink.pro/anime/${id}?ep=${ep}` },
  { key: 'videasy',     label: 'VIDEASY',
    url: (id: string, ep: string) => `https://player.videasy.net/anime/${id}/${ep}` },
  { key: 'embedsu',     label: 'EMBEDSU',
    url: (id: string, ep: string) => `https://embed.su/embed/anime/${id}/${ep}` },
];

function epNum(ep: string) { return ep.match(/(\d+)/)?.[1] ?? '1'; }

export default function AnimePlayerClient({ id, episode }: Props) {
  const ep = epNum(episode);
  const [server, setServer] = useState('screenscape');
  const [open, setOpen] = useState(false);
  const [adBlock, setAdBlock] = useState(true);
  const [loading, setLoading] = useState(false);

  const current = SERVERS.find(s => s.key === server) ?? SERVERS[0];

  const select = (key: string) => {
    setLoading(true); setServer(key); setOpen(false);
    setTimeout(() => setLoading(false), 500);
  };

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative">
          <button onClick={() => setOpen(!open)}
            className="flex items-center gap-2 border border-[hsl(var(--border))] rounded-lg px-3 py-2 text-[0.65rem] tracking-wide hover:border-[var(--neon-purple)] transition-colors"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            <span className="text-[hsl(var(--muted-foreground))]">SERVER:</span>
            <span className="font-bold">{current.label}</span>
            {current.tag && <span className="text-[var(--neon-yellow)] text-[0.5rem]">[{current.tag}]</span>}
            <ChevronDown size={10} className={`${open ? 'rotate-180' : ''} transition-transform text-[hsl(var(--muted-foreground))]`} />
          </button>
          {open && (
            <div className="absolute top-full left-0 z-50 mt-1 w-56 border border-[hsl(var(--border))] rounded-xl shadow-xl bg-[hsl(var(--popover))] overflow-hidden">
              {SERVERS.map(s => (
                <button key={s.key} onClick={() => select(s.key)}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-[0.65rem] hover:bg-[hsl(var(--muted))] transition-colors ${s.key === server ? 'text-[var(--neon-purple)]' : 'text-[hsl(var(--muted-foreground))]'}`}
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  <span>{s.label}</span>
                  {s.tag && <span className="text-[var(--neon-yellow)] text-[0.5rem]">[{s.tag}]</span>}
                </button>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => setAdBlock(!adBlock)}
          className={`flex items-center gap-1.5 border rounded-lg px-3 py-2 text-[0.65rem] transition-all ${
            adBlock ? 'border-[var(--neon-green)] text-[var(--neon-green)]' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))]'
          }`} style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {adBlock ? <Shield size={11} /> : <ShieldOff size={11} />}
          {adBlock ? 'ADBLOCK ON' : 'ADS'}
        </button>
        <Link href={`https://dl.vidsrc.vip/anime/${id}/${ep}`} target="_blank"
          className="flex items-center gap-1.5 border border-[hsl(var(--border))] rounded-lg px-3 py-2 text-[0.65rem] text-[hsl(var(--muted-foreground))] hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)] transition-all ml-auto"
          style={{ fontFamily: 'var(--font-geist-mono)' }}>
          <Download size={11} /> DOWNLOAD
        </Link>
      </div>

      <div className="player-container">
        {loading ? (
          <div className="flex h-[540px] items-center justify-center bg-[hsl(var(--card))]">
            <div className="h-8 w-8 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--neon-purple)', borderTopColor: 'transparent' }} />
          </div>
        ) : (
          <iframe key={`${server}-${id}-${ep}`} src={current.url(id, ep)}
            width="100%" height="540" allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            className="block" referrerPolicy="no-referrer"
            {...(adBlock ? { sandbox: 'allow-scripts allow-same-origin allow-forms allow-presentation allow-top-navigation-by-user-activation' } : {})} />
        )}
      </div>
      <p className="text-[0.5rem] tracking-widest text-[hsl(var(--muted-foreground))]"
        style={{ fontFamily: 'var(--font-geist-mono)' }}>
        SERVER: {current.label} · EP: {ep} · ADBLOCK: {adBlock ? 'ON' : 'OFF'}
      </p>
    </div>
  );
}
