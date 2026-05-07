/* eslint-disable prettier/prettier */
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Star, Film, Tv2, Antenna, Book, TrendingUp, Clock, Flame, Globe } from 'lucide-react';

interface RowItem {
  id: number | string;
  title?: string;
  poster?: string;
  rating?: number;
  year?: string;
  href: string;
  type: 'movie' | 'tv' | 'anime' | 'manga';
}

interface Props {
  title: string;
  subtitle?: string;
  icon: 'film' | 'tv' | 'antenna' | 'book' | 'star' | 'trending' | 'clock' | 'flame' | 'globe';
  color: string;
  href: string;
  items: RowItem[];
}

const ICONS = {
  film: Film, tv: Tv2, antenna: Antenna, book: Book,
  star: Star, trending: TrendingUp, clock: Clock, flame: Flame, globe: Globe,
};

const TYPE_HOVER: Record<string, string> = {
  movie: 'group-hover:border-[var(--neon-pink)]',
  tv: 'group-hover:border-[var(--neon-blue)]',
  anime: 'group-hover:border-[var(--neon-purple)]',
  manga: 'group-hover:border-[var(--neon-yellow)]',
};

const TYPE_TEXT: Record<string, string> = {
  movie: 'group-hover:text-[var(--neon-pink)]',
  tv: 'group-hover:text-[var(--neon-blue)]',
  anime: 'group-hover:text-[var(--neon-purple)]',
  manga: 'group-hover:text-[var(--neon-yellow)]',
};

export default function HomeRowSection({ title, subtitle, icon, color, href, items }: Props) {
  if (!items.length) return null;
  const Icon = ICONS[icon];

  return (
    <section className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
            <Icon size={15} style={{ color }} />
          </div>
          <div>
            <h2 className="text-base font-black tracking-wide" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {title}
            </h2>
            {subtitle && (
              <p className="text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        <Link href={href}
          className="flex items-center gap-1.5 text-[0.6rem] tracking-widest transition-colors hover:opacity-80 shrink-0"
          style={{ color, fontFamily: 'var(--font-geist-mono)' }}>
          VIEW ALL <ArrowRight size={10} />
        </Link>
      </div>

      {/* Accent line */}
      <div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${color}50, transparent)` }} />

      {/* Cards — horizontal scroll on mobile, grid on desktop */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 xl:grid-cols-8">
        {items.slice(0, 16).map((item) => (
          <Link key={item.id} href={item.href} className="group space-y-1.5">
            <div className={`relative aspect-[2/3] overflow-hidden border border-[hsl(var(--border))] transition-all duration-300 ${TYPE_HOVER[item.type] || ''}`}>
              {item.poster ? (
                <Image
                  fill
                  src={item.poster.startsWith('http') ? item.poster : `https://image.tmdb.org/t/p/w342${item.poster}`}
                  alt={item.title || ''}
                  sizes="160px"
                  className="object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500"
                />
              ) : (
                <div className="flex h-full items-center justify-center bg-[hsl(var(--muted))] text-xl">
                  {item.type === 'movie' ? '🎬' : item.type === 'tv' ? '📺' : item.type === 'anime' ? '⚡' : '📖'}
                </div>
              )}
              {(item.rating ?? 0) > 0 && (
                <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/80 rounded-full px-1.5 py-0.5">
                  <Star size={7} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[0.5rem] text-yellow-300 font-bold" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    {item.rating?.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="px-0.5 space-y-0.5">
              <p className={`text-[0.7rem] font-semibold leading-tight line-clamp-2 transition-colors ${TYPE_TEXT[item.type] || ''}`}
                style={{ fontFamily: 'var(--font-geist-sans)' }}>
                {item.title}
              </p>
              {item.year && (
                <p className="text-[0.55rem] text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {item.year}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
