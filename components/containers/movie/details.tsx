/* eslint-disable prettier/prettier */
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Clock, Globe, ExternalLink, TrendingUp } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { Poster } from '@/components/common/poster';
import AddToWatchlistButton from '@/components/add-to-watchlist';

const DetailsContainer = async ({ data, id }: any) => {
  const [videosRes, creditsRes, similarRes] = await Promise.allSettled([
    tmdb.videos('movie', id),
    tmdb.credits('movie', id, 'en-US'),
    tmdb.movies.related(Number(id), 'similar', 'en-US'),
  ]);

  const trailer = videosRes.status === 'fulfilled'
    ? videosRes.value.results?.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
    : null;
  const credits = creditsRes.status === 'fulfilled' ? creditsRes.value : { cast: [], crew: [] };
  const similar = (similarRes.status === 'fulfilled' ? similarRes.value?.results ?? [] : []).slice(0, 8);
  const director = credits.crew?.find((c: any) => c.job === 'Director');
  const topCast = credits.cast?.slice(0, 8) ?? [];
  const runtime = data.runtime ? `${Math.floor(data.runtime / 60)}h ${data.runtime % 60}m` : null;

  return (
    <div className="pb-12">
      {/* BACKDROP */}
      <div className="relative h-[40dvh] w-full overflow-hidden md:h-[55dvh]">
        {data.backdrop_path && (
          <Image fill priority src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
            alt={data.title} className="object-cover brightness-50" sizes="100vw" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--background))] via-[hsl(var(--background)/0.2)] to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--background)/0.8)] via-transparent to-transparent" />
        {trailer && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black/40 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20 hover:bg-black/60 transition-all">
              <Play size={22} className="text-white fill-white" />
              <span className="text-white font-bold text-sm">Watch Trailer</span>
            </a>
          </div>
        )}
      </div>

      {/* MAIN INFO */}
      <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-36 relative z-10 space-y-10">
        <div className="flex flex-col gap-6 md:flex-row">
          <aside className="w-36 shrink-0 md:w-44 self-end md:self-start">
            <div className="rounded-2xl overflow-hidden shadow-2xl border border-[hsl(var(--border))]">
              <Poster url={data.poster_path} alt={data.title} />
            </div>
          </aside>

          <article className="flex flex-col gap-4 md:pt-32">
            <div className="flex flex-wrap items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {data.release_date && <span>{format(new Date(data.release_date), 'MMMM d, yyyy')}</span>}
              {runtime && <><span>·</span><span className="flex items-center gap-1"><Clock size={9} />{runtime}</span></>}
              {data.original_language && <><span>·</span><Globe size={9} /><span>{data.original_language.toUpperCase()}</span></>}
              {data.status && <><span>·</span><span style={{ color: data.status === 'Released' ? 'var(--neon-green)' : 'var(--neon-yellow)' }}>{data.status}</span></>}
            </div>

            <h1 className="text-3xl font-black tracking-tight leading-none md:text-5xl">{data.title}</h1>

            <div className="flex flex-wrap items-center gap-2">
              {data.vote_average > 0 && (
                <div className="flex items-center gap-1.5 rounded-full px-3 py-1"
                  style={{ background: 'color-mix(in srgb, var(--neon-pink) 12%, transparent)', border: '1px solid color-mix(in srgb, var(--neon-pink) 30%, transparent)' }}>
                  <Star size={11} style={{ color: 'var(--neon-pink)', fill: 'var(--neon-pink)' }} />
                  <span className="text-sm font-bold" style={{ color: 'var(--neon-pink)', fontFamily: 'Share Tech Mono, monospace' }}>
                    {data.vote_average.toFixed(1)}</span>
                  <span className="text-xs text-[hsl(var(--muted-foreground))]">/ 10 ({data.vote_count?.toLocaleString()})</span>
                </div>
              )}
              {data.genres?.map((g: any) => (
                <span key={g.id} className="text-xs border border-[hsl(var(--border))] rounded-full px-3 py-1 text-[hsl(var(--muted-foreground))]">{g.name}</span>
              ))}
            </div>

            <p className="text-sm leading-relaxed text-[hsl(var(--muted-foreground))] max-w-2xl"
              style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem' }}>{data.overview}</p>

            {director && (
              <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Directed by <span className="font-semibold text-[hsl(var(--foreground))]">{director.name}</span>
              </p>
            )}

            {data.production_companies?.length > 0 && (
              <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Production: {data.production_companies.slice(0,3).map((c: any) => c.name).join(', ')}
              </p>
            )}

            <div className="flex flex-wrap gap-3 pt-1">
              <Link href={`/movie/watch/${id}`}>
                <button className="btn-neon"><Play size={14} className="fill-white" /> Watch Now</button>
              </Link>
              {trailer && (
                <a href={`https://youtube.com/watch?v=${trailer.key}`} target="_blank" rel="noopener noreferrer">
                  <button className="btn-outline"><ExternalLink size={13} /> Trailer</button>
                </a>
              )}
              <AddToWatchlistButton item={{
                id: String(id), title: data.title, type: 'movie',
                poster: data.poster_path ? `https://image.tmdb.org/t/p/w342${data.poster_path}` : undefined,
                rating: data.vote_average, year: data.release_date?.slice(0, 4),
              }} />
            </div>
          </article>
        </div>

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
                      <div className="w-full h-full flex items-center justify-center font-bold text-[hsl(var(--muted-foreground))]">
                        {c.name[0]}
                      </div>
                    )}
                  </div>
                  <p className="text-[0.65rem] font-semibold line-clamp-1 leading-tight w-full">{c.name}</p>
                  <p className="text-[0.58rem] text-[hsl(var(--muted-foreground))] line-clamp-1 leading-tight w-full">{c.character}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SIMILAR */}
        {similar.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold flex items-center gap-2">
              <TrendingUp size={16} style={{ color: 'var(--neon-pink)' }} /> More Like This
            </h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {similar.map((s: any) => (
                <Link key={s.id} href={`/movie/${s.id}`} className="group">
                  <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-[hsl(var(--border))] group-hover:border-[var(--neon-pink)] transition-all duration-200">
                    {s.poster_path ? (
                      <Image fill src={`https://image.tmdb.org/t/p/w342${s.poster_path}`}
                        alt={s.title} sizes="200px"
                        className="object-cover brightness-90 group-hover:brightness-100 transition-all" />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-[hsl(var(--muted))] text-2xl">🎬</div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 p-2 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-200 rounded-b-xl">
                      <p className="text-xs font-semibold text-white truncate">{s.title}</p>
                    </div>
                    {s.vote_average > 0 && (
                      <div className="absolute top-2 right-2 bg-black/70 rounded-full px-1.5 py-0.5 text-[0.55rem] text-yellow-400">
                        ★ {s.vote_average.toFixed(1)}
                      </div>
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
