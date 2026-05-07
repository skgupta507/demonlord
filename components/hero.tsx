/* eslint-disable prettier/prettier */
'use client';
import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Marquee } from '@/components/ui/marquee';
import { ImageIcon, Star, AlertCircle } from 'lucide-react';
import { tmdb, TvSerie, Movie } from '@/lib/tmdb';
import { ListResponse } from '@/lib/tmdb/utils/list-response';

export function Card({ item, type }: { item: Movie | TvSerie; type: string }) {
  const title = 'title' in item ? item.title : item.name;
  const backdropPath = item.backdrop_path
    ? `https://image.tmdb.org/t/p/w500${item.backdrop_path}`
    : null;

  return (
    <Link
      href={`/${type === 'Tv' ? 'tv' : 'movie'}/${item.id}`}
      className="group relative flex w-64 shrink-0 flex-col overflow-hidden border border-[hsl(var(--border))] hover:border-[hsl(350_100%_58%/0.5)] transition-all duration-300"
    >
      <div className="relative aspect-video w-full overflow-hidden bg-[hsl(var(--muted))]">
        {backdropPath ? (
          <Image fill className="object-cover transition-transform duration-500 group-hover:scale-105 brightness-75 group-hover:brightness-90"
            src={backdropPath} alt={title} sizes="256px"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <ImageIcon size={24} className="text-muted-foreground" />
          </div>
        )}
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)' }}
        />
        {item.vote_average > 0 && (
          <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/80 px-1.5 py-0.5 border border-[hsl(350_100%_58%/0.4)]">
            <Star size={8} className="text-[hsl(350_100%_58%)] fill-current" />
            <span className="text-[0.6rem] text-[hsl(350_100%_62%)]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="border border-[hsl(350_100%_58%)] p-3 bg-black/40">
            <div className="h-0 w-0 border-l-[12px] border-l-[hsl(350_100%_58%)] border-y-[8px] border-y-transparent ml-0.5" />
          </div>
        </div>
      </div>
      <div className="p-3 space-y-1 bg-[hsl(var(--card))]">
        <p className="truncate text-xs font-semibold tracking-wide" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>{title}</p>
        <p className="line-clamp-2 text-[0.65rem] leading-relaxed text-muted-foreground" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          {item.overview || 'NO DATA AVAILABLE'}
        </p>
      </div>
    </Link>
  );
}

export default function HeroSection() {
  const [movieData, setMovieData] = React.useState<ListResponse<Movie> | null>(null);
  const [tvData, setTVData] = React.useState<ListResponse<TvSerie> | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(false);

  React.useEffect(() => {
    Promise.all([
      tmdb.movies.popular('en-US').catch(() => null),
      tmdb.tv.popular('en-US').catch(() => null),
    ]).then(([movies, tvs]) => {
      if (movies) setMovieData(movies);
      if (tvs) setTVData(tvs);
      if (!movies && !tvs) setError(true);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex h-48 items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 border-2 border-[hsl(350_100%_58%)] border-t-transparent rounded-full animate-spin" />
        <span className="text-[0.6rem] tracking-widest text-muted-foreground" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
          FETCHING TRANSMISSIONS...
        </span>
      </div>
    </div>
  );

  if (error) return (
    <div className="flex h-32 items-center justify-center gap-3 text-[hsl(0_85%_60%)]">
      <AlertCircle size={16} />
      <span className="text-[0.65rem] tracking-widest" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
        TMDB_API_KEY not set — add it to .env.local
      </span>
    </div>
  );

  return (
    <div className="space-y-8 pb-10 overflow-hidden">
      {movieData?.results && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-6">
            <span className="text-[0.6rem] tracking-[0.25em] text-[hsl(350_100%_58%)] uppercase flex items-center gap-2" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(350_100%_58%)] animate-pulse inline-block" />
              MOVIES
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[hsl(350_100%_58%/0.4)] to-transparent" />
          </div>
          <Marquee pauseOnHover gap="gap-3" className="py-1">
            {movieData.results.map(item => <Card key={item.id} item={item} type="Movie" />)}
          </Marquee>
        </div>
      )}
      {tvData?.results && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 px-6">
            <span className="text-[0.6rem] tracking-[0.25em] text-[hsl(185_100%_48%)] uppercase flex items-center gap-2" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <span className="h-1.5 w-1.5 rounded-full bg-[hsl(185_100%_48%)] animate-pulse inline-block" />
              TV SHOWS
            </span>
            <div className="flex-1 h-px bg-gradient-to-r from-[hsl(185_100%_48%/0.4)] to-transparent" />
          </div>
          <Marquee pauseOnHover gap="gap-3" reverse className="py-1">
            {tvData.results.map(item => <Card key={item.id} item={item} type="Tv" />)}
          </Marquee>
        </div>
      )}
    </div>
  );
}
