/* eslint-disable prettier/prettier */
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Info } from 'lucide-react';
import { Show } from '@/types';

interface Props {
  show: Show & { _banner?: string; _cover?: string };
  type?: 'tv' | 'movie' | 'anime';
  banner?: string;
}

export default function CarousalCard({ show, type, banner }: Props) {
  const title = show.title || show.name || 'Unknown Title';
  const releaseDate = show.release_date || show.first_air_date;
  const year = releaseDate ? format(new Date(releaseDate), 'yyyy') : null;
  const bgImage = banner || show._banner ||
    (show.backdrop_path ? `https://image.tmdb.org/t/p/original${show.backdrop_path}` : null) ||
    show._cover ||
    (show.poster_path ? `https://image.tmdb.org/t/p/original${show.poster_path}` : null);

  const href = type === 'anime' ? `/anime/${show.id}` : `/${type}/${show.id}`;

  const typeColors: Record<string, string> = {
    movie: '#FF006F',
    tv: '#00D4FF',
    anime: '#BD00FF',
  };
  const color = typeColors[type || 'movie'] || '#FF006F';

  return (
    <div className="relative w-full overflow-hidden" style={{ height: '68vh', minHeight: '380px' }}>
      {bgImage ? (
        <Image alt={title} src={bgImage} fill priority
          className="object-cover object-center brightness-50" sizes="100vw" />
      ) : (
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 50%, ${color}22 0%, #080B14 70%)` }} />
      )}

      {/* Scanlines */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)' }} />

      {/* Neon grid */}
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }} />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

      {/* Neon corner decoration */}
      <div className="absolute top-6 left-6 w-8 h-8 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1px]" style={{ background: color }} />
        <div className="absolute top-0 left-0 h-full w-[1px]" style={{ background: color }} />
      </div>
      <div className="absolute top-4 right-4 flex flex-col items-end gap-1 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-1 rounded-full animate-pulse" style={{ background: '#39FF14', boxShadow: '0 0 6px #39FF14' }} />
          <span className="text-[0.5rem] tracking-widest" style={{ fontFamily: 'var(--font-geist-mono)', color: '#39FF14' }}>STREAMING</span>
        </div>
        <span className="text-[0.45rem] tracking-widest text-white/20" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          NEURAL_CINEMA
        </span>
      </div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end pb-12 px-8 md:px-12">
        <div className="flex flex-col gap-3 max-w-2xl">
          {/* Type tag + year */}
          <div className="flex items-center gap-3">
            <span className="border px-2 py-0.5 text-[0.55rem] tracking-[0.2em] uppercase"
              style={{ fontFamily: 'var(--font-geist-mono)', color, borderColor: `${color}66` }}>
              {type?.toUpperCase() || 'CONTENT'}
            </span>
            {year && <span className="text-[0.55rem] tracking-widest text-white/40" style={{ fontFamily: 'var(--font-geist-mono)' }}>{year}</span>}
            {show.vote_average > 0 && (
              <div className="flex items-center gap-1 bg-black/60 border px-1.5 py-0.5" style={{ borderColor: `${color}33` }}>
                <Star size={8} style={{ color, fill: color }} />
                <span className="text-[0.55rem]" style={{ fontFamily: 'var(--font-geist-mono)', color }}>
                  {show.vote_average?.toFixed(1)}
                </span>
              </div>
            )}
          </div>

          {/* Title */}
          <h2 className="text-3xl font-black uppercase tracking-wide text-white leading-tight md:text-5xl"
            style={{ fontFamily: 'var(--font-geist-mono)', textShadow: `0 0 40px ${color}44` }}>
            {title}
          </h2>

          {/* Overview */}
          {show.overview && (
            <p className="line-clamp-2 text-sm leading-relaxed text-white/60 max-w-lg" style={{ fontFamily: 'var(--font-geist-sans)' }}>
              {show.overview}
            </p>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <Link href={href}>
              <button className="btn-neon flex items-center gap-2">
                <Play size={11} className="fill-current" /> WATCH NOW
              </button>
            </Link>
            <Link href={href}>
              <button className="flex items-center gap-2 border border-white/15 px-4 py-2 text-[0.6rem] tracking-widest text-white/50 hover:border-white/30 hover:text-white/80 transition-all"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                <Info size={10} /> MORE INFO
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
