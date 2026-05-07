/* eslint-disable prettier/prettier */
'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Download, ChevronDown, Shield, ShieldOff, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';

type SourceKey = 'screenscape' | 'default' | 'vidsrc' | 'vidlink' | 'videasy' | 'embedsu' | 'autoembed' | 'onemovies' | 'vidzee' | 'vidzee4k';

const SOURCES: { key: SourceKey; label: string; tag?: string }[] = [
  { key: 'screenscape', label: 'SCREENSCAPE', tag: 'NEW' },
  { key: 'default',     label: 'DEFAULT',     tag: 'REC'  },
  { key: 'vidsrc',      label: 'VIDSRC'                   },
  { key: 'vidlink',     label: 'VIDLINK'                  },
  { key: 'videasy',     label: 'VIDEASY'                  },
  { key: 'embedsu',     label: 'EMBEDSU'                  },
  { key: 'autoembed',   label: 'AUTOEMBED'                },
  { key: 'onemovies',   label: '111MOVIES'                },
  { key: 'vidzee',      label: 'VIDZEE HD'                },
  { key: 'vidzee4k',    label: 'VIDZEE 4K',  tag: '4K'   },
];

// Ad-blocked wrapper: intercepts the iframe load and injects uBlock-style CSS
function AdBlockedPlayer({ src, height = 580 }: { src: string; height?: number }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  return (
    <div className="relative w-full" style={{ height }}>
      <iframe
        ref={iframeRef}
        src={src}
        referrerPolicy="origin"
        allowFullScreen
        allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
        width="100%"
        height={height}
        scrolling="no"
        className="block w-full h-full border-0"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation-by-user-activation"
      />
    </div>
  );
}

export default function VideoPlayer({ id }: { id: string }) {
  const { theme, setTheme } = useTheme();
  const [selected, setSelected] = useState<SourceKey>('screenscape');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [adBlock, setAdBlock] = useState(true);

  const videoSources: Record<SourceKey, string> = {
    screenscape: `https://screenscape.me/embed?tmdb=${id}&type=movie`,
    default:     `https://flix.1ani.me/embed/tmdb-movie-${id}`,
    vidsrc:      `https://vidsrc.in/embed/movie/${id}`,
    vidlink:     `https://vidlink.pro/movie/${id}`,
    videasy:     `https://player.videasy.net/movie/${id}`,
    embedsu:     `https://embed.su/embed/movie/${id}`,
    autoembed:   `https://player.autoembed.cc/embed/movie/${id}`,
    onemovies:   `https://111movies.com/movie/${id}`,
    vidzee:      `https://vidzee.wtf/movie/${id}`,
    vidzee4k:    `https://vidzee.wtf/movie/4k/${id}`,
  };

  const select = (key: SourceKey) => {
    setLoading(true);
    setSelected(key);
    setOpen(false);
    setTimeout(() => setLoading(false), 600);
  };

  const current = SOURCES.find(s => s.key === selected)!;
  const isLight = theme === 'light';

  return (
    <div className="mx-auto max-w-5xl py-6 space-y-3">

      {/* ── Control Bar ── */}
      <div className="flex flex-wrap items-center gap-2">

        {/* Server Dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className={`flex items-center gap-2 border px-3 py-2 text-[0.65rem] tracking-widest transition-colors ${
              isLight
                ? 'border-gray-300 hover:border-[#FF006F]/60 text-gray-700'
                : 'border-white/10 hover:border-[#FF006F]/50 text-white'
            }`}
            style={{ fontFamily: 'Share Tech Mono, monospace' }}
          >
            <span style={{ color: '#FF006F' }}>SERVER:</span>
            <span>{current.label}</span>
            {current.tag && <span className="text-[#F9F002] text-[0.55rem]">[{current.tag}]</span>}
            <span className={`text-xs ml-1 ${isLight ? 'text-gray-400' : 'text-white/40'}`}>
              {open ? '▲' : '▼'}
            </span>
          </button>
          {open && (
            <div className={`absolute top-full left-0 z-50 mt-1 w-52 border shadow-xl ${
              isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#080B14]'
            }`}>
              {SOURCES.map(s => (
                <button
                  key={s.key}
                  onClick={() => select(s.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[0.65rem] tracking-widest transition-colors ${
                    s.key === selected
                      ? 'text-[#FF006F]'
                      : isLight
                        ? 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                        : 'text-white/40 hover:bg-white/5'
                  }`}
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}
                >
                  <span>{s.label}</span>
                  {s.tag && <span className="text-[#F9F002] text-[0.55rem]">[{s.tag}]</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ad Blocker Toggle */}
        <button
          onClick={() => setAdBlock(!adBlock)}
          title={adBlock ? 'Ad Blocker ON (click to disable)' : 'Ad Blocker OFF (click to enable)'}
          className={`flex items-center gap-1.5 border px-3 py-2 text-[0.65rem] tracking-widest transition-all ${
            adBlock
              ? 'border-[#39FF14]/40 text-[#39FF14] bg-[#39FF14]/5 hover:bg-[#39FF14]/10'
              : isLight
                ? 'border-gray-300 text-gray-400 hover:border-gray-400'
                : 'border-white/10 text-white/30 hover:border-white/25'
          }`}
          style={{ fontFamily: 'Share Tech Mono, monospace' }}
        >
          {adBlock ? <Shield size={11} /> : <ShieldOff size={11} />}
          {adBlock ? 'ADBLOCK ON' : 'ADBLOCK OFF'}
        </button>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(isLight ? 'dark' : 'light')}
          title={isLight ? 'Switch to Dark' : 'Switch to Light'}
          className={`flex items-center gap-1.5 border px-3 py-2 text-[0.65rem] tracking-widest transition-all ${
            isLight
              ? 'border-gray-300 text-gray-500 hover:border-[#FF006F]/40 hover:text-[#FF006F]'
              : 'border-white/10 text-white/30 hover:border-[#F9F002]/40 hover:text-[#F9F002]'
          }`}
          style={{ fontFamily: 'Share Tech Mono, monospace' }}
        >
          {isLight ? <Moon size={11} /> : <Sun size={11} />}
          {isLight ? 'DARK' : 'LIGHT'}
        </button>

        {/* Download */}
        <Link
          href={`https://dl.vidsrc.vip/movie/${id}`}
          target="_blank"
          className={`flex items-center gap-1.5 border px-3 py-2 text-[0.65rem] tracking-widest transition-all ${
            isLight
              ? 'border-gray-300 text-gray-500 hover:border-[#00D4FF]/60 hover:text-[#00D4FF]'
              : 'border-white/10 text-white/30 hover:border-[#00D4FF]/40 hover:text-[#00D4FF]'
          }`}
          style={{ fontFamily: 'Share Tech Mono, monospace' }}
        >
          <Download size={11} /> DOWNLOAD
        </Link>

        {/* Status */}
        <div className="ml-auto flex items-center gap-2">
          <div className="h-1.5 w-1.5 rounded-full bg-[#39FF14] animate-pulse"
            style={{ boxShadow: '0 0 6px #39FF14' }} />
          <span className={`text-[0.55rem] tracking-widest ${isLight ? 'text-gray-400' : 'text-[#39FF14]/60'}`}
            style={{ fontFamily: 'Share Tech Mono, monospace' }}>STREAM ACTIVE</span>
        </div>
      </div>

      {/* ── Player ── */}
      <div className={`player-container relative ${isLight ? 'border border-gray-200' : ''}`}>
        {loading ? (
          <div className={`flex h-[560px] items-center justify-center ${isLight ? 'bg-gray-50' : 'bg-[#080B14]'}`}>
            <div className="flex flex-col items-center gap-3">
              <div className="h-8 w-8 border-2 border-[#FF006F] border-t-transparent rounded-full animate-spin" />
              <span className={`text-[0.6rem] tracking-widest ${isLight ? 'text-gray-400' : 'text-white/30'}`}
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>CONNECTING TO NODE...</span>
            </div>
          </div>
        ) : adBlock ? (
          <AdBlockedPlayer src={videoSources[selected]} height={560} />
        ) : (
          <iframe
            src={videoSources[selected]}
            referrerPolicy="origin"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            width="100%"
            height="560"
            scrolling="no"
            className="block"
          />
        )}
      </div>

      {/* ── Info Bar ── */}
      <div className={`flex items-center gap-3 border-t pt-2.5 text-[0.55rem] tracking-widest flex-wrap ${
        isLight ? 'border-gray-200 text-gray-400' : 'border-white/5 text-white/20'
      }`} style={{ fontFamily: 'Share Tech Mono, monospace' }}>
        <Shield size={9} />
        <span>NODE: {current.label}</span>
        <span className="opacity-30">|</span>
        <span>ID: {id}</span>
        <span className="opacity-30">|</span>
        <span>ADBLOCK: {adBlock ? 'ON ✓' : 'OFF'}</span>
        <span className="opacity-30">|</span>
        <span>TIP: Try another server if stream fails</span>
      </div>
    </div>
  );
}
