/* eslint-disable prettier/prettier */
import AnimePlayerClient from '@/components/containers/anime/player-client';
import WatchContainer from '@/components/containers/anime/watch';
import WatchTogether from '@/components/watch-together';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Star, Tv, Clock, Users, Info, Play } from 'lucide-react';
import { anilist } from '@/lib/anilist';
import { notFound } from 'next/navigation';

export default async function Watch({
  params,
}: {
  params: Promise<{ id: string; episode: string }>;
}) {
  const { id, episode } = await params;
  const ep = episode.match(/(\d+)/)?.[1] ?? '1';

  let data: any = null;
  let related: any[] = [];
  try {
    data = await anilist.getById(Number(id));
    const trending = await anilist.trending();
    related = trending.filter((a: any) => a.id !== Number(id)).slice(0, 12);
  } catch {}

  const title = data?.title?.english || data?.title?.romaji || 'Anime';
  const cover = data?.coverImage?.extraLarge || data?.coverImage?.large;
  const score = data?.averageScore ? (data.averageScore / 10).toFixed(1) : null;
  const genres = data?.genres?.slice(0, 4) || [];
  const totalEps = data?.episodes || 0;
  const studio = data?.studios?.nodes?.find((s: any) => s.isAnimationStudio)?.name;

  return (
    <div className="mx-auto max-w-6xl px-4 pt-4 pb-16 space-y-6">
      {/* Back nav */}
      <div className="flex items-center justify-between">
        <Link
          href={`/anime/${id}`}
          className="inline-flex items-center gap-2 text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] hover:text-[var(--neon-purple)] transition-colors uppercase"
          style={{ fontFamily: 'var(--font-geist-mono)' }}
        >
          <ArrowLeft size={10} /> Back to Info
        </Link>
        <div className="flex items-center gap-2">
          <span className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-purple)]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            EP {ep.padStart(2, '0')}
          </span>
          {totalEps > 0 && (
            <span className="text-[0.55rem] text-[hsl(var(--muted-foreground))]"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              / {totalEps}
            </span>
          )}
        </div>
      </div>

      {/* Title */}
      {data && (
        <div className="flex items-center gap-3">
          {cover && (
            <Image src={cover} alt={title} width={40} height={56}
              className="object-cover shrink-0 border border-white/10" />
          )}
          <div>
            <h1 className="text-base font-black tracking-wide uppercase leading-tight"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {title}
            </h1>
            <p className="text-[0.55rem] tracking-widest text-[hsl(var(--muted-foreground))]"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              EPISODE {ep.padStart(2, '0')} {totalEps > 0 ? `· ${totalEps} TOTAL` : ''}
            </p>
          </div>
        </div>
      )}

      {/* Player */}
      <AnimePlayerClient id={id} episode={ep} m3u8Url="" tracks={[]} />

      {/* Two-column layout: episodes + info */}
      <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Episode list */}
        <div>
          <WatchContainer id={id} currentEp={ep} />
        </div>

        {/* Sidebar info */}
        {data && (
          <aside className="space-y-4">
            {/* Anime info card */}
            <div className="border border-white/8 p-4 space-y-3">
              <p className="text-[0.55rem] tracking-[0.2em] text-[var(--neon-purple)]/70 uppercase"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                {'// SERIES INFO'}
              </p>
              <div className="flex gap-3">
                {cover && (
                  <Image src={cover} alt={title} width={60} height={84}
                    className="object-cover shrink-0 border border-white/10" />
                )}
                <div className="space-y-1.5 min-w-0">
                  <p className="text-sm font-bold leading-tight line-clamp-2"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}>{title}</p>
                  <div className="flex flex-wrap gap-1">
                    {score && (
                      <span className="flex items-center gap-0.5 text-[0.55rem] text-[#BD00FF]"
                        style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        <Star size={8} className="fill-current" /> {score}
                      </span>
                    )}
                    {data.format && (
                      <span className="text-[0.55rem] text-white/30 border border-white/10 px-1.5 py-0.5"
                        style={{ fontFamily: 'var(--font-geist-mono)' }}>
                        {data.format.replace(/_/g, ' ')}
                      </span>
                    )}
                  </div>
                  {studio && (
                    <p className="text-[0.55rem] text-white/30" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                      {studio}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap gap-1">
                {genres.map((g: string) => (
                  <span key={g} className="text-[0.5rem] tracking-widest border border-[#BD00FF]/20 px-1.5 py-0.5 text-[#BD00FF]/60"
                    style={{ fontFamily: 'var(--font-geist-mono)' }}>{g}</span>
                ))}
              </div>
              <Link href={`/anime/${id}`}>
                <button className="w-full flex items-center justify-center gap-2 border border-white/10 py-2 text-[0.6rem] tracking-widest text-white/40 hover:border-[#BD00FF]/40 hover:text-[#BD00FF] transition-all"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  <Info size={10} /> VIEW FULL INFO
                </button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'EPISODES', value: totalEps || '?', icon: Tv },
                { label: 'DURATION', value: data.duration ? `${data.duration}m` : '?', icon: Clock },
                { label: 'SCORE', value: score || '?', icon: Star },
                { label: 'FANS', value: data.popularity ? `${(data.popularity / 1000).toFixed(0)}K` : '?', icon: Users },
              ].map(s => (
                <div key={s.label} className="border border-white/8 p-2.5 space-y-1">
                  <p className="text-[0.48rem] tracking-widest text-white/25 uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>{s.label}</p>
                  <p className="text-sm font-bold text-white/70" style={{ fontFamily: 'var(--font-geist-mono)' }}>{s.value}</p>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>

      {/* ── More Anime ── */}
      {related.length > 0 && (
        <div className="space-y-4 pt-4">
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] tracking-[0.25em] text-[#BD00FF]/70 uppercase"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {'// MORE TO WATCH'}
            </span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(189,0,255,0.3), transparent)' }} />
            <Link href="/anime" className="text-[0.55rem] tracking-widest text-[#BD00FF]/50 hover:text-[#BD00FF] transition-colors"
              style={{ fontFamily: 'var(--font-geist-mono)' }}>VIEW ALL →</Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
            {related.map((item: any) => {
              const t = item.title?.english || item.title?.romaji;
              const img = item.coverImage?.large;
              return (
                <Link key={item.id} href={`/anime/${item.id}`} className="group space-y-1.5">
                  <div className="relative aspect-[2/3] overflow-hidden border border-white/8 group-hover:border-[#BD00FF]/40 transition-all">
                    {img && <Image fill src={img} alt={t || ''} sizes="160px"
                      className="object-cover brightness-90 group-hover:brightness-100 group-hover:scale-105 transition-all duration-500" />}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                      <Play size={20} className="text-white fill-white" />
                    </div>
                    {item.averageScore > 0 && (
                      <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/80 rounded-full px-1.5 py-0.5">
                        <Star size={7} className="text-yellow-400 fill-yellow-400" />
                        <span className="text-[0.5rem] text-yellow-300 font-bold" style={{ fontFamily: 'var(--font-geist-mono)' }}>
                          {(item.averageScore / 10).toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-[0.7rem] font-semibold leading-tight line-clamp-2 group-hover:text-[#BD00FF] transition-colors"
                    style={{ fontFamily: 'var(--font-geist-sans)' }}>{t}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Watch Together floating button */}
      <WatchTogether />
    </div>
  );
}
