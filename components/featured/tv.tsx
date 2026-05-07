/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { tmdb, TvSerie } from '@/lib/tmdb';
import { Star, AlertCircle } from 'lucide-react';

type FeatureType = 'popular' | 'toprated' | 'ontheair' | 'airingtoday';

const LIST_MAP: Record<FeatureType, string> = {
  popular: 'popular',
  toprated: 'top_rated',
  ontheair: 'on_the_air',
  airingtoday: 'airing_today',
};

async function fetchTV(featureType: FeatureType, lang: string) {
  if (featureType === 'popular') return tmdb.tv.popular(lang as any);
  return tmdb.tv.list({ list: LIST_MAP[featureType] as any, language: lang as any, page: 1 });
}

export default function FeaturedTV({ featureType }: { featureType: FeatureType }) {
  const [items, setItems] = useState<TvSerie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true); setError(null);
    fetchTV(featureType, 'en-US')
      .then((d: any) => setItems(d?.results || []))
      .catch(() => setError('TMDB_API_KEY not set'))
      .finally(() => setLoading(false));
  }, [featureType]);

  if (loading)
    return (
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="aspect-[2/3] rounded-xl bg-[hsl(var(--muted))] animate-pulse" />
            <div className="h-3 rounded bg-[hsl(var(--muted))] animate-pulse w-3/4" />
          </div>
        ))}
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center gap-3 py-16 rounded-2xl border border-red-500/20 bg-red-500/5">
        <AlertCircle size={24} className="text-red-400" />
        <span className="text-sm text-red-400">{error}</span>
      </div>
    );

  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
      {items.map((item) => (
        <Link key={item.id} href={`/tv/${item.id}`} className="group space-y-2">
          <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-[hsl(var(--border))] group-hover:border-[var(--neon-blue)] transition-all duration-300">
            {item.poster_path ? (
              <Image fill src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                alt={item.name} sizes="180px"
                className="object-cover brightness-95 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500" />
            ) : (
              <div className="flex h-full items-center justify-center bg-[hsl(var(--muted))] text-2xl">📺</div>
            )}
            {item.vote_average > 0 && (
              <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/75 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                <Star size={8} className="text-yellow-400 fill-yellow-400" />
                <span className="text-[0.55rem] text-yellow-300 font-bold" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {item.vote_average.toFixed(1)}
                </span>
              </div>
            )}
          </div>
          <div className="space-y-0.5 px-0.5">
            <p className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-[var(--neon-blue)] transition-colors"
              style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 600 }}>
              {item.name}
            </p>
            {item.first_air_date && (
              <p className="text-[0.6rem] text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {item.first_air_date.slice(0, 4)}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
