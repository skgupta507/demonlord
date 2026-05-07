/* eslint-disable prettier/prettier */
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Globe, ExternalLink, Tv, Hash, TrendingUp } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { Poster } from '@/components/common/poster';
import AddToWatchlistButton from '@/components/add-to-watchlist';

const DetailsContainer = async ({ data, id }: any) => {
  const [videosRes, creditsRes, similarRes] = await Promise.allSettled([
    tmdb.videos('tv', id),
    tmdb.credits('tv', id, 'en-US'),
    tmdb.tv.related(Number(id), 'similar', 'en-US').catch(() => ({ results: [] })),
  ]);

  const trailer = videosRes.status === 'fulfilled'
    ? videosRes.value.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
    : null;
  const credits = creditsRes.status === 'fulfilled' ? creditsRes.value : { cast: [], crew: [] };
  const similar = (similarRes.status === 'fulfilled' ? similarRes.value?.results ?? [] : []).slice(0, 8);
  const topCast = credits.cast?.slice(0, 8) ?? [];
  const creator = data.created_by?.[0];
  const seasons = data.seasons?.filter((s: any) => s.season_number > 0) ?? [];

  return (
    <div className="pb-12">
      {/* BACKDROP */}
      <div className="relative h-[40dvh] w-full overflow-hidden md:h-[55dvh]">
        {data.backdrop_path && (
          <Image fill priority src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            alt={data.name} className="object-cover brightness-50" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-[hsl(var(--background)/0.2)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--background)/0.8)] via-transparent to-transparent" />
        {trailer && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 hover:bg-black/60 transition-all">
              <Play size={22} className="text-white fill-white" />
              <span className="text-white font-bold text-sm">Watch Trailer</span>
            </a>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-36 relative z-10 space-y-10">
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="w-36 shrink-0 md:w-44 self-end md:self-start">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-[hsl(var(--border))]">
              <Poster url={data.poster_path} alt={data.name} />
            </div>
          </aside>
          <article className="flex flex-col gap-4 md:pt-32">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {data.first_air_date && <span>{format(new Date(data.first_air_date), 'yyyy')}</span>}
              {data.number_of_seasons && <><span>·</span><span>{data.number_of_seasons}S</span></>}
              {data.number_of_episodes && <><span>·</span><span>{data.number_of_episodes}EP</span></>}
              {data.status && <><span>·</span><span style={{ color: data.status === 'Returning Series' ? 'var(--neon-green)' : 'var(--neon-yellow)' }}>{data.status}</span></>}
            </div>
            <h1 className="text-3xl font-black tracking-tight leading-none md:text-5xl">{data.name}</h1>
            <div className="flex flex-wrap items-center gap-2">
              {data.vote_average > 0 && (
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background: 'color-mix(in srgb, var(--neon-blue) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-blue) 30%, transparent)' }}>
                  <Star size={11} style={{ color: 'var(--neon-blue)', fill: 'var(--neon-blue)' }} />
                  <span className="text-sm font-bold" style={{ color: 'var(--neon-blue)', fontFamily: 'var(--font-geist-mono)' }}>
                    {data.vote_average.toFixed(1)}</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">/ 10</span>
                </div>
              )}
              {data.genres?.map((g: any) => (
                <span key={g.id} className="text-xs border border-[hsl(var(--border))] rounded-full px-3 py-1 text-[hsl(var(--muted-foreground))]">{g.name}</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))] max-w-2xl"
              style={{ fontFamily: 'var(--font-geist-sans)', fontSize: '0.95rem' }}>{data.overview}</p>
            {creator && (
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                Created by <span className="font-semibold text-[hsl(var(--foreground))]">{creator.name}</span>
              </p>
            )}
            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={`/tv/watch/${id}`}>
                <button className="btn-neon"><Play size={14} className="fill-white" /> Watch Now</button>
              </Link>
              {trailer && (
                <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                  <button className="btn-outline"><ExternalLink size={13} /> Trailer</button>
                </a>
              )}
              <AddToWatchlistButton item={{
                id: String(id), title: data.name, type: 'tv',
                poster: data.poster_path ? `https://image.tmdb.org/t/p/w342${data.poster_path}` : undefined,
                rating: data.vote_average, year: data.first_air_date?.slice(0, 4),
              }} />
            </div>
          </article>
        </div>

        {/* SEASONS */}
        {seasons.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Tv size={15} style={{ color: 'var(--neon-blue)' }} /> Seasons
            </h2>
            <div className="flex gap-3 flex-wrap">
              {seasons.map((s: any) => (
                <div key={s.id} className="card-cyber p-3 flex items-center gap-3 min-w-[140px]">
                  {s.poster_path ? (
                    <Image src={`https://image.tmdb.org/t/p/w92${s.poster_path}`} alt={s.name}
                      width={40} height={60} className="rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="w-10 h-14 rounded-lg bg-[hsl(var(--muted))] shrink-0 flex items-center justify-center">
                      <Tv size={14} className="text-[hsl(var(--muted-foreground))]" />
                    </div>
                  )}
                  <div>
                    <p className="text-xs font-bold">S{String(s.season_number).padStart(2,'0')}</p>
                    <p className="text-[0.6rem] text-[hsl(var(--muted-foreground))]">{s.episode_count} eps</p>
                    {s.air_date && <p className="text-[0.55rem] text-[hsl(var(--muted-foreground))]">{s.air_date.slice(0,4)}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CAST */}
        {topCast.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold">Top Cast</h2>
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-6 md:grid-cols-8">
              {topCast.map((c: any) => (
                <div key={c.id} className="flex flex-col items-center gap-1.5 text-center">
                  <div className="w-full aspect-square rounded-xl overflow-hidden bg-[hsl(var(--muted))]">
                    {c.profile_path ? (
                      <Image src={`https://image.tmdb.org/t/p/w185${c.profile_path}`}
                        alt={c.name} width={80} height={80} className="w-full h-full object-cover object-top" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-[hsl(var(--muted-foreground))]">{c.name[0]}</div>
                    )}
                  </div>
                  <p className="text-[0.65rem] font-semibold line-clamp-1 w-full">{c.name}</p>
                  <p className="text-[0.58rem] text-[hsl(var(--muted-foreground))] line-clamp-1 w-full">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIMILAR */}
        {similar.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <TrendingUp size={15} style={{ color: 'var(--neon-blue)' }} /> More Like This
            </h2>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
              {similar.map((s: any) => (
                <Link key={s.id} href={`/tv/${s.id}`} className="group space-y-1.5">
                  <div className="relative aspect-[2/3] overflow-hidden border border-[hsl(var(--border))] group-hover:border-[var(--neon-blue)] transition-all duration-300">
                    {s.poster_path ? (
                      <Image fill src={`https://image.tmdb.org/t/p/w342${s.poster_path}`}
                        alt={s.name} sizes="180px"
                        className="object-cover brightness-95 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[hsl(var(--muted))] text-2xl">📺</div>
                    )}
                    {s.vote_average > 0 && (
                      <div className="absolute top-1.5 right-1.5 flex items-center gap-0.5 bg-black/75 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                        <Star size={8} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[0.55rem] text-yellow-300 font-bold" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                          {s.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-0.5 px-0.5">
                    <p className="text-xs font-medium leading-tight line-clamp-2 group-hover:text-[var(--neon-blue)] transition-colors"
                      style={{ fontFamily: 'var(--font-geist-sans)', fontWeight: 600 }}>
                      {s.name}
                    </p>
                    {s.first_air_date && (
                      <p className="text-[0.6rem] text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        {s.first_air_date.slice(0, 4)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default DetailsContainer;
