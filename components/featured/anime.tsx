/* eslint-disable prettier/prettier */
'use client';
import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { anilist } from '@/lib/anilist';
import { Star, AlertCircle } from 'lucide-react';

type FeatureType = 'recent' | 'popular' | 'trending';

export default function FeaturedAnime({ featureType }: { featureType: FeatureType }) {
  const [items, setItems] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    const fetchers: Record<FeatureType, () => Promise<any[]>> = {
      trending: anilist.trending,
      popular: anilist.popular,
      recent: anilist.recent,
    };
    fetchers[featureType]()
      .then(setItems)
      .catch(() => setError('Failed to load from AniList'))
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
      {items.map((item) => {
        const title = item.title?.english || item.title?.romaji || 'Unknown';
        const img = item.coverImage?.extraLarge || item.coverImage?.large;
        const score = item.averageScore ? item.averageScore / 10 : 0;
        return (
          <Link key={item.id} href={`/anime/${item.id}`} className="group space-y-2">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-[hsl(var(--border))] group-hover:border-[var(--neon-purple)] transition-all duration-300">
              {img ? (
                <Image fill src={img} alt={title} sizes="180px"
                  className="object-cover brightness-95 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500" />
              ) : (
                <div className="flex h-full items-center justify-center bg-[hsl(var(--muted))] text-2xl">⚡</div>
              )}
              {score > 0 && (
                <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/75 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                  <Star size={8} className="text-yellow-400 fill-yellow-400" />
                  <span className="text-[0.55rem] text-yellow-300 font-bold" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                    {score.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-0.5 px-0.5">
              <p className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-[var(--neon-purple)] transition-colors"
                style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
                {title}
              </p>
              {item.format && (
                <p className="text-[0.6rem] text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  {item.format.replace(/_/g, ' ')}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
