/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Info, ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface BannerItem {
  id: number;
  title?: string;
  name?: string;
  backdrop_path?: string | null;
  poster_path?: string;
  vote_average?: number;
  overview?: string;
  release_date?: string;
  first_air_date?: string;
  _banner?: string;
  _type: 'movie' | 'tv' | 'anime';
}

const TYPE_COLOR: Record<string, string> = {
  movie: '#FF006F',
  tv: '#00D4FF',
  anime: '#BD00FF',
};

const TYPE_LABEL: Record<string, string> = {
  movie: 'MOVIE',
  tv: 'TV SHOW',
  anime: 'ANIME',
};

export default function HomeBannerClient({ items }: { items: BannerItem[] }) {
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const go = useCallback((idx: number) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent(idx);
      setAnimating(false);
    }, 300);
  }, [animating]);

  const prev = () => go((current - 1 + items.length) % items.length);
  const next = useCallback(() => go((current + 1) % items.length), [current, go, items.length]);

  useEffect(() => {
    const t = setInterval(next, 6000);
    return () => clearInterval(t);
  }, [next]);

  if (!items.length) return null;

  const item = items[current];
  const title = item.title || item.name || 'Unknown';
  const year = (item.release_date || item.first_air_date)?.slice(0, 4);
  const color = TYPE_COLOR[item._type] || '#FF006F';
  const href = item._type === 'anime' ? `/anime/${item.id}` : `/${item._type}/${item.id}`;
  const watchHref = item._type === 'anime' ? `/anime/watch/${item.id}/1` : `/${item._type}/watch/${item.id}`;
  const bgImage = item._banner ||
    (item.backdrop_path ? `https://image.tmdb.org/t/p/original${item.backdrop_path}` : null) ||
    (item.poster_path?.startsWith('http') ? item.poster_path : item.poster_path ? `https://image.tmdb.org/t/p/original${item.poster_path}` : null);

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '75vh', minHeight: '480px' }}>
      {/* Background */}
      <div className={`absolute inset-0 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        {bgImage ? (
          <Image src={bgImage} alt={title} fill priority
            className="object-cover object-center brightness-50" sizes="100vw" />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 50%, ${color}22 0%, #080B14 70%)` }} />
        )}
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)' }} />
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />

      {/* Neon corner */}
      <div className="absolute top-6 left-6 w-8 h-8 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: color }} />
        <div className="absolute top-0 left-0 h-full w-[1px]" style={{ background: color }} />
      </div>

      {/* Live indicator */}
      <div className="absolute top-5 right-5 flex items-center gap-1.5">
        <div className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#39FF14' }} />
        <span className="text-[0.48rem] tracking-widest text-white/50" style={{ fontFamily: 'Share Tech Mono, monospace' }}>LIVE</span>
      </div>

      {/* Content */}
      <div className={`absolute inset-0 flex items-end pb-16 px-8 md:px-16 transition-opacity duration-300 ${animating ? 'opacity-0' : 'opacity-100'}`}>
        <div className="flex flex-col gap-4 max-w-2xl">
          {/* Type + year + rating */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="border px-2.5 py-0.5 text-[0.55rem] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'Share Tech Mono, monospace', color, borderColor: `${color}66` }}>
              {TYPE_LABEL[item._type]}
            </span>
            {year && <span className="text-[0.55rem] tracking-widest text-white/40" style={{ fontFamily: 'Share Tech Mono, monospace' }}>{year}</span>}
            {(item.vote_average ?? 0) > 0 && (
              <div className="flex items-center gap-1 bg-black/60 border px-1.5 py-0.5" style={{ borderColor: `${color}33` }}>
                <Star size={8} style={{ color, fill: color }} />
                <span className="text-[0.55rem]" style={{ fontFamily: 'Share Tech Mono, monospace', color }}>
                  {item.vote_average?.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl font-black uppercase tracking-wide text-white leading-tight md:text-5xl lg:text-6xl"
            style={{ fontFamily: 'Orbitron, monospace', textShadow: `0 0 40px ${color}44` }}>
            {title}
          </h1>

          {/* Overview */}
          {item.overview && (
            <p className="line-clamp-2 text-sm leading-relaxed text-white/60 max-w-lg" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
              {item.overview}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <Link href={watchHref}>
              <button className="btn-neon flex items-center gap-2 px-6 py-2.5">
                <Play size={13} className="fill-current" /> WATCH NOW
              </button>
            </Link>
            <Link href={href}>
              <button className="flex items-center gap-2 border border-white/20 px-5 py-2.5 text-[0.6rem] tracking-widest text-white/60 hover:border-white/40 hover:text-white transition-all"
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                <Info size={11} /> MORE INFO
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {items.map((_, i) => (
          <button key={i} onClick={() => go(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? '24px' : '6px',
              height: '6px',
              background: i === current ? color : 'rgba(255,255,255,0.3)',
            }} />
        ))}
      </div>

      {/* Prev/Next */}
      <button onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center border border-white/15 bg-black/40 hover:border-white/40 hover:bg-black/60 transition-all text-white/60 hover:text-white">
        <ChevronLeft size={18} />
      </button>
      <button onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center border border-white/15 bg-black/40 hover:border-white/40 hover:bg-black/60 transition-all text-white/60 hover:text-white">
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
