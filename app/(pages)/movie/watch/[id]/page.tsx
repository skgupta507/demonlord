/* eslint-disable prettier/prettier */
import VideoPlayer from '@/components/containers/movie/videoplayer';
import { tmdb } from '@/lib/tmdb';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Clock, Globe, Play, Info, TrendingUp } from 'lucide-react';
import { Poster } from '@/components/common/poster';

export default async function MovieWatchPage({ params }: any) {
  const id = (await params).id;

  let data: any = null;
  let credits: any = { cast: [], crew: [] };
  let similar: any[] = [];
  let trailer: any = null;

  try {
    [data, credits] = await Promise.all([
      tmdb.movies.details(Number(id), 'en-US'),
      tmdb.credits('movie', id, 'en-US'),
    ]);
    const [videosRes, similarRes] = await Promise.allSettled([
      tmdb.videos('movie', id),
      tmdb.movies.related(Number(id), 'similar', 'en-US'),
    ]);
    if (videosRes.status === 'fulfilled') {
      trailer = videosRes.value.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube');
    }
    if (similarRes.status === 'fulfilled') {
      similar = (similarRes.value?.results ?? []).slice(0, 12);
    }
  } catch {}

  const runtime = data?.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : null;
  const director = credits.crew?.find((c: any) => c.job === 'Director');
  const topCast = credits.cast?.slice(0, 8) ?? [];

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 space-y-6">
      {/* Back nav */}
      <div className="flex items-center justify-between">
        <Link href={data ? `/movie/${id}` : '/movie'}
          className="inline-flex items-center gap-2 text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] hover:text-[var(--neon-pink)] transition-colors uppercase"
          style={{ fontFamily: 'Share Tech Mono, monospace' }}>
          <ArrowLeft size={10} /> {data ? 'Back to Info' : 'Back to Movies'}
        </Link>
        {data && (
          <span className="text-[0.55rem] tracking-widest text-[hsl(var(--muted-foreground))]"
            style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            {data.release_date?.slice(0, 4)} · {runtime || 'MOVIE'}
          </span>
        )}
      </div>

      {/* Movie title */}
      {data && (
        <div className="flex items-center gap-3">
          {data.poster_path && (
            <div className="w-10 h-14 shrink-0 overflow-hidden border border-[hsl(var(--border))]">
              <Image src={`https://image.tmdb.org/t/p/w92${data.poster_path}`} alt={data.title}
                width={40} height={56} className="object-cover w-full h-full" />
            </div>
          )}
          <div>
            <h1 className="text-base font-black tracking-wide leading-tight"
              style={{ fontFamily: 'Orbitron, monospace' }}>
              {data.title}
            </h1>
            <div className="flex items-center gap-2 mt-0.5">
              {data.vote_average > 0 && (
                <span className="flex items-center gap-1 text-[0.55rem] text-[var(--neon-pink)]"
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  <Star size={8} className="fill-current" /> {data.vote_average.toFixed(1)}
                </span>
              )}
              {data.genres?.slice(0, 3).map((g: any) => (
                <span key={g.id} className="text-[0.5rem] text-[hsl(var(--muted-foreground))] border border-[hsl(var(--border))] px-1.5 py-0.5"
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}>{g.name}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Player */}
      <VideoPlayer id={id} />

      {/* Two-column: overview + sidebar */}
      {data && (
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          {/* Overview */}
          <div className="space-y-4">
            <div className="border border-[hsl(var(--border))] p-4 space-y-3">
              <p className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-pink)]/70 uppercase"
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                {'// OVERVIEW'}
              </p>
              <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem' }}>
                {data.overview}
              </p>
              {director && (
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  Directed by <span className="font-semibold text-[hsl(var(--foreground))]">{director.name}</span>
                </p>
              )}
            </div>

            {/* Cast */}
            {topCast.length > 0 && (
              <div className="space-y-3">
                <p className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-pink)]/70 uppercase"
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}>
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
            {/* Movie details */}
            <div className="border border-[hsl(var(--border))] p-4 space-y-3">
              <p className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-pink)]/70 uppercase"
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                {'// DETAILS'}
              </p>
              <div className="space-y-2">
                {[
                  { label: 'RELEASE', value: data.release_date?.slice(0, 10) || '—' },
                  { label: 'RUNTIME', value: runtime || '—' },
                  { label: 'LANGUAGE', value: data.original_language?.toUpperCase() || '—' },
                  { label: 'STATUS', value: data.status || '—' },
                  { label: 'BUDGET', value: data.budget > 0 ? `$${(data.budget / 1e6).toFixed(0)}M` : '—' },
                  { label: 'REVENUE', value: data.revenue > 0 ? `$${(data.revenue / 1e6).toFixed(0)}M` : '—' },
                ].map(d => (
                  <div key={d.label} className="flex items-center justify-between gap-2">
                    <span className="text-[0.5rem] tracking-widest text-[hsl(var(--muted-foreground))]"
                      style={{ fontFamily: 'Share Tech Mono, monospace' }}>{d.label}</span>
                    <span className="text-xs font-medium text-right" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{d.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Link href={`/movie/${id}`}>
                <button className="w-full flex items-center justify-center gap-2 border border-[hsl(var(--border))] py-2.5 text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] transition-all"
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  <Info size={11} /> FULL INFO PAGE
                </button>
              </Link>
              {trailer && (
                <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                  <button className="w-full flex items-center justify-center gap-2 border border-[hsl(var(--border))] py-2.5 text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)] transition-all"
                    style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                    <Play size={11} /> WATCH TRAILER
                  </button>
                </a>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Similar Movies */}
      {similar.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <TrendingUp size={14} style={{ color: 'var(--neon-pink)' }} />
              <span className="text-[0.6rem] tracking-[0.25em] text-[var(--neon-pink)]/70 uppercase"
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                {'// MORE LIKE THIS'}
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(255,0,111,0.3), transparent)' }} />
            </div>
            <Link href="/movie" className="text-[0.55rem] tracking-widest text-[var(--neon-pink)]/50 hover:text-[var(--neon-pink)] transition-colors"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {similar.map((s: any) => (
              <Link key={s.id} href={`/movie/${s.id}`} className="group space-y-1.5">
                <div className="relative aspect-[2/3] overflow-hidden border border-[hsl(var(--border))] group-hover:border-[var(--neon-pink)] transition-all duration-300">
                  {s.poster_path ? (
                    <Image fill src={`https://image.tmdb.org/t/p/w342${s.poster_path}`}
                      alt={s.title} sizes="160px"
                      className="object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[hsl(var(--muted))] text-xl">🎬</div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                    <Play size={20} className="text-white fill-white" />
                  </div>
                  {s.vote_average > 0 && (
                    <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/80 rounded-full px-1.5 py-0.5">
                      <Star size={7} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[0.5rem] text-yellow-300 font-bold" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                        {s.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <div className="px-0.5 space-y-0.5">
                  <p className="text-[0.7rem] font-semibold leading-tight line-clamp-2 group-hover:text-[var(--neon-pink)] transition-colors"
                    style={{ fontFamily: 'Rajdhani, sans-serif' }}>{s.title}</p>
                  {s.release_date && (
                    <p className="text-[0.55rem] text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                      {s.release_date.slice(0, 4)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
