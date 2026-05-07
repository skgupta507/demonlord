/* eslint-disable prettier/prettier */
import VideoPlayer from '@/components/containers/tv/videoplayer';
import WatchTogether from '@/components/watch-together';
import CommunityChat from '@/components/community-chat';
import { tmdb } from '@/lib/tmdb';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Play, Info, TrendingUp, Tv2 } from 'lucide-react';

export default async function TVWatchPage({ params }: any) {
  const id = (await params).id;

  let data: any = null;
  let credits: any = { cast: [], crew: [] };
  let similar: any[] = [];
  let trailer: any = null;

  try {
    [data, credits] = await Promise.all([
      tmdb.tv.details(Number(id), 'en-US'),
      tmdb.credits('tv', id, 'en-US'),
    ]);
    const [videosRes, similarRes] = await Promise.allSettled([
      tmdb.videos('tv', id),
      tmdb.tv.related(Number(id), 'similar', 'en-US'),
    ]);
    if (videosRes.status === 'fulfilled') {
      trailer = videosRes.value.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    }
    if (similarRes.status === 'fulfilled') {
      similar = (similarRes.value?.results ?? []).slice(0, 12);
    }
  } catch {}

  const topCast = credits.cast?.slice(0, 8) ?? [];
  const creator = data?.created_by?.[0];
  const seasons = data?.seasons?.filter((s: any) => s.season_number > 0) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 space-y-6">
      {/* Back nav */}
      <div className="flex items-center justify-between">
        <Link href={data ? `/tv/${id}` : '/tv'}
          className="inline-flex items-center gap-2 text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] hover:text-[var(--neon-blue)] transition-colors uppercase"
          style={{ fontFamily: 'var(--font-geist-mono)' }}>
          <ArrowLeft size={10} /> {data ? 'Back to Info' : 'Back to TV'}
        </Link>
        {data && (
          <span className="text-[0.55rem] tracking-widest text-[hsl(var(--muted-foreground))]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {data.first_air_date?.slice(0, 4)} · {seasons.length}S · {data.number_of_episodes}EP
          </span>
        )}
      </div>

      {/* Show title */}
      {data && (
        <div className="flex items-center gap-3">
          {data.poster_path && (
            <div className="w-10 h-14 shrink-0 overflow-hidden border border-[hsl(var(--border))]">
              <Image src={`https://image.tmdb.org/t/p/w92${data.poster_path}`} alt={data.name}
                width={40} height={56} className="object-cover w-full h-full" />
            </div>
          )}
          <div>
            <h1 className="text-base font-black tracking-wide leading-tight"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {data.name}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              {data.vote_average > 0 && (
                <span className="flex items-center gap-1 text-[0.55rem] text-[var(--neon-blue)]"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  <Star size={8} className="fill-current" /> {data.vote_average.toFixed(1)}
                </span>
              )}
              <span className="text-[0.5rem] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] px-1.5 py-0.5"
                style={{ fontFamily: 'var(--font-geist-mono)', color: data.status === 'Returning Series' ? 'var(--neon-green)' : undefined }}>
                {data.status || 'TV SHOW'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Player */}
      <VideoPlayer id={id} />

      {/* Two-column: overview + sidebar */}
      {data && (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Overview + cast */}
          <div className="space-y-4">
            <div className="border border-[hsl(var(--border))] p-4 space-y-3">
              <p className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-blue)]/70 uppercase"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {'// OVERVIEW'}
              </p>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.95rem' }}>
                {data.overview}
              </p>
              {creator && (
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Created by <span className="font-semibold text-[hsl(var(--foreground))]">{creator.name}</span>
                </p>
              )}
            </div>

            {/* Seasons overview */}
            {seasons.length > 0 && (
              <div className="space-y-3">
                <p className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-blue)]/70 uppercase"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {'// SEASONS'}
                </p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                  {seasons.slice(0, 8).map((s: any) => (
                    <div key={s.id} className="border border-[hsl(var(--border))] p-2.5 space-y-1 hover:border-[var(--neon-blue)]/40 transition-colors">
                      <p className="text-[0.6rem] font-bold" style={{ fontFamily: 'var(--font-geist-mono)', color: 'var(--neon-blue)' }}>
                        S{String(s.season_number).padStart(2, '0')}
                      </p>
                      <p className="text-xs text-[hsl(var(--muted-foreground))] truncate" style={{ fontFamily: 'var(--font-geist-sans)' }}>
                        {s.name}
                      </p>
                      <p className="text-[0.55rem] text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        {s.episode_count} eps
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cast */}
            {topCast.length > 0 && (
              <div className="space-y-3">
                <p className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-blue)]/70 uppercase"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  {'// CAST'}
                </p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-8">
                  {topCast.map((c: any) => (
                    <div key={c.id} className="flex flex-col items-center gap-1 text-center">
                      <div className="w-full aspect-square overflow-hidden bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
                        {c.profile_path ? (
                          <Image src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                            alt={c.name} width={80} height={80} className="w-full h-full object-cover object-top" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-sm font-bold text-[hsl(var(--muted-foreground))]">
                            {c.name[0]}
                          </div>
                        )}
                      </div>
                      <p className="text-[0.6rem] font-semibold line-clamp-1 w-full">{c.name}</p>
                      <p className="text-[0.55rem] text-[hsl(var(--muted-foreground))] line-clamp-1 w-full">{c.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <div className="border border-[hsl(var(--border))] p-4 space-y-3">
              <p className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-blue)]/70 uppercase"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {'// DETAILS'}
              </p>
              <div className="space-y-2">
                {[
                  { label: 'FIRST AIR', value: data.first_air_date?.slice(0, 10) || '—' },
                  { label: 'SEASONS', value: `${seasons.length}` },
                  { label: 'EPISODES', value: `${data.number_of_episodes || '—'}` },
                  { label: 'LANGUAGE', value: data.original_language?.toUpperCase() || '—' },
                  { label: 'STATUS', value: data.status || '—' },
                  { label: 'NETWORK', value: data.networks?.[0]?.name || '—' },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between gap-2">
                    <span className="text-[0.5rem] tracking-widest text-[hsl(var(--muted-foreground))]"
                      style={{ fontFamily: 'var(--font-geist-mono)' }}>{d.label}</span>
                    <span className="text-xs font-medium text-right" style={{ fontFamily: 'var(--font-geist-sans)' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Link href={`/tv/${id}`}>
                <button className="w-full flex items-center justify-center gap-2 border border-[hsl(var(--border))] py-2.5 text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)] transition-all"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  <Info size={11} /> FULL INFO PAGE
                </button>
              </Link>
              {trailer && (
                <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                  <button className="w-full flex items-center justify-center gap-2 border border-[hsl(var(--border))] py-2.5 text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] transition-all"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}>
                    <Play size={11} /> WATCH TRAILER
                  </button>
                </a>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Similar Shows */}
      {similar.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Tv2 size={14} style={{ color: 'var(--neon-blue)' }} />
              <span className="text-[0.6rem] tracking-[0.25em] text-[var(--neon-blue)]/70 uppercase"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {'// MORE LIKE THIS'}
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(0,212,255,0.3), transparent)' }} />
            </div>
            <Link href="/tv" className="text-[0.55rem] tracking-widest text-[var(--neon-blue)]/50 hover:text-[var(--neon-blue)] transition-colors"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {similar.map((s: any) => (
              <Link key={s.id} href={`/tv/${s.id}`} className="group space-y-1.5">
                <div className="relative aspect-[2/3] overflow-hidden border border-[hsl(var(--border))] group-hover:border-[var(--neon-blue)] transition-all duration-300">
                  {s.poster_path ? (
                    <Image fill src={`https://image.tmdb.org/t/p/w342${s.poster_path}`}
                      alt={s.name} sizes="160px"
                      className="object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[hsl(var(--muted))] text-xl">📺</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                  {s.vote_average > 0 && (
                    <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/80 rounded-full px-1.5 py-0.5">
                      <Star size={7} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[0.5rem] text-yellow-300 font-bold" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        {s.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-0.5 space-y-0.5">
                  <p className="text-[0.7rem] font-semibold leading-tight line-clamp-2 group-hover:text-[var(--neon-blue)] transition-colors"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}>{s.name}</p>
                  {s.first_air_date && (
                    <p className="text-[0.55rem] text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {s.first_air_date.slice(0, 4)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Watch Together floating button */}
      <WatchTogether />

      {/* Community Chat */}
      <CommunityChat />
    </div>
  );
}
