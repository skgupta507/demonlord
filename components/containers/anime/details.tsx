/* eslint-disable prettier/prettier */
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Clock, Tv, ExternalLink, Users, Hash, Calendar, BookOpen } from 'lucide-react';
import { anilist } from '@/lib/anilist';
import AddToWatchlistButton from '@/components/add-to-watchlist';
import CommunityChat from '@/components/community-chat';

export default async function DetailsContainer({ data }: { data: any }) {
  const title = data.title?.english || data.title?.romaji || 'Unknown';
  const score = data.averageScore ? (data.averageScore / 10).toFixed(1) : null;
  const studio = data.studios?.nodes?.find((s: any) => s.isAnimationStudio)?.name;
  const allStudios = data.studios?.nodes?.map((s: any) => s.name) || [];
  const genres = data.genres || [];
  const desc = data.description?.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim() || '';
  const banner = data.bannerImage || null;
  const cover = data.coverImage?.extraLarge || data.coverImage?.large;
  const startYear = data.startDate?.year;
  const endYear = data.endDate?.year;

  // Fetch related/recommendations
  let related: any[] = [];
  try {
    const trending = await anilist.trending();
    related = trending.filter((a: any) => a.id !== data.id).slice(0, 12);
  } catch {}

  const relations = data.relations?.edges || [];

  return (
    <div className="space-y-0">
      {/* Backdrop */}
      <div className="relative h-[38dvh] w-full overflow-hidden md:h-[52dvh]">
        {banner ? (
          <Image fill src={banner} alt={title} className="object-cover object-center brightness-50" sizes="100vw" priority />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#BD00FF]/20 via-[#080B14] to-[#00D4FF]/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--background)/0.3)] to-[hsl(var(--background))]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--background)/0.8)] via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)' }} />
        {/* Trailer button on backdrop */}
        {data.trailer?.id && (
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <a href={`https://youtube.com/watch?v=${data.trailer.id}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-black/50 backdrop-blur-md px-6 py-3 border border-white/20 hover:bg-black/70 transition-all">
              <Play size={20} className="text-white fill-white" />
              <span className="text-white font-bold text-sm">Watch Trailer</span>
            </a>
          </div>
        )}
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-40 relative z-10 pb-12 space-y-10">
        {/* Main info block */}
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Cover */}
          <aside className="w-36 shrink-0 md:w-48 self-end md:self-auto">
            <div className="relative shadow-2xl">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#BD00FF]/50 to-transparent z-0" />
              {cover && (
                <Image src={cover} alt={title} width={192} height={288}
                  className="w-full aspect-[2/3] object-cover relative z-0" />
              )}
            </div>
          </aside>

          {/* Info */}
          <article className="flex flex-col gap-3 pt-2 md:pt-32">
            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-2 text-[0.6rem] tracking-widest text-white/40 uppercase"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {data.format && <span className="border border-white/10 px-2 py-0.5">{data.format.replace(/_/g, ' ')}</span>}
              {data.episodes && <span className="flex items-center gap-1"><Tv size={9} />{data.episodes} EPS</span>}
              {data.duration && <span className="flex items-center gap-1"><Clock size={9} />{data.duration}MIN</span>}
              {data.status && (
                <span style={{ color: data.status === 'RELEASING' ? '#39FF14' : data.status === 'FINISHED' ? '#00D4FF' : '#F9F002' }}>
                  {data.status}
                </span>
              )}
              {startYear && <span className="flex items-center gap-1"><Calendar size={9} />{startYear}{endYear && endYear !== startYear ? `–${endYear}` : ''}</span>}
            </div>

            <h1 className="text-2xl font-black tracking-wide uppercase md:text-4xl"
              style={{ fontFamily: 'Orbitron, monospace', lineHeight: 1.1 }}>
              {title}
            </h1>
            {data.title?.romaji && data.title?.english && (
              <p className="text-[0.65rem] tracking-wide text-white/30" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                {data.title.romaji}
              </p>
            )}
            {data.title?.native && (
              <p className="text-[0.6rem] text-white/20" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                {data.title.native}
              </p>
            )}

            {/* Score + popularity */}
            <div className="flex flex-wrap items-center gap-2">
              {score && (
                <div className="flex items-center gap-1.5 bg-[#BD00FF]/10 border border-[#BD00FF]/30 px-3 py-1.5">
                  <Star size={11} className="text-[#BD00FF] fill-current" />
                  <span className="text-sm font-bold text-[#BD00FF]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>{score}</span>
                  <span className="text-xs text-white/30">/ 10</span>
                </div>
              )}
              {data.popularity && (
                <div className="flex items-center gap-1.5 border border-white/10 px-3 py-1.5">
                  <Users size={10} className="text-white/40" />
                  <span className="text-xs text-white/40" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                    {data.popularity.toLocaleString()} fans
                  </span>
                </div>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-1.5">
              {genres.map((g: string) => (
                <span key={g} className="border border-[#BD00FF]/20 bg-[#BD00FF]/5 px-2.5 py-0.5 text-[0.6rem] tracking-widest text-[#BD00FF]/70 uppercase"
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  {g}
                </span>
              ))}
            </div>

            {/* Description */}
            <p className="max-w-2xl text-sm leading-relaxed text-white/60"
              style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.95rem' }}>
              {desc}
            </p>

            {/* Studio */}
            {studio && (
              <p className="text-xs text-white/40" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Studio: <span className="text-white/70 font-semibold">{studio}</span>
              </p>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/anime/watch/${data.id}/1`}>
                <button className="btn-neon flex items-center gap-2">
                  <Play size={12} className="fill-current" /> WATCH NOW
                </button>
              </Link>
              {data.trailer?.id && (
                <a href={`https://youtube.com/watch?v=${data.trailer.id}`} target="_blank" rel="noopener noreferrer">
                  <button className="btn-outline flex items-center gap-2">
                    <ExternalLink size={11} /> TRAILER
                  </button>
                </a>
              )}
              <AddToWatchlistButton item={{
                id: String(data.id), title, type: 'anime',
                poster: cover, rating: data.averageScore ? data.averageScore / 10 : undefined,
                year: startYear?.toString(),
              }} />
            </div>
          </article>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'FORMAT', value: data.format?.replace(/_/g, ' ') || '—' },
            { label: 'EPISODES', value: data.episodes ? `${data.episodes} eps` : '—' },
            { label: 'DURATION', value: data.duration ? `${data.duration} min` : '—' },
            { label: 'SEASON', value: data.season ? `${data.season} ${startYear || ''}` : startYear || '—' },
          ].map(s => (
            <div key={s.label} className="border border-white/8 p-3 space-y-1">
              <p className="text-[0.5rem] tracking-[0.2em] text-white/30 uppercase" style={{ fontFamily: 'Share Tech Mono, monospace' }}>{s.label}</p>
              <p className="text-sm font-bold text-white/80" style={{ fontFamily: 'Rajdhani, sans-serif' }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* ── Relations ── */}
        {relations.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-[0.6rem] tracking-[0.25em] text-[#BD00FF]/70 uppercase" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                {'// RELATED TITLES'}
              </span>
              <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(189,0,255,0.3), transparent)' }} />
            </div>
            <div className="flex flex-wrap gap-3">
              {relations.slice(0, 8).map((edge: any) => {
                if (!edge.node) return null;
                const relTitle = edge.node.title?.english || edge.node.title?.romaji;
                const relHref = edge.node.type === 'MANGA' ? `/manga/info/${edge.node.id}` : `/anime/${edge.node.id}`;
                return (
                  <Link key={edge.node.id} href={relHref}
                    className="flex items-center gap-2 border border-white/8 px-3 py-2 hover:border-[#BD00FF]/40 transition-colors group">
                    {edge.node.coverImage?.large && (
                      <Image src={edge.node.coverImage.large} alt="" width={28} height={40}
                        className="object-cover w-7 h-10 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs text-white/60 truncate max-w-[120px] group-hover:text-white/90 transition-colors"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}>{relTitle}</p>
                      <p className="text-[0.5rem] tracking-widest text-white/25" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                        {edge.relationType?.replace(/_/g, ' ')} · {edge.node.type}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── More Like This ── */}
        {related.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="text-[0.6rem] tracking-[0.25em] text-[#BD00FF]/70 uppercase" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  {'// MORE ANIME'}
                </span>
                <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(189,0,255,0.3), transparent)' }} />
              </div>
              <Link href="/anime" className="text-[0.55rem] tracking-widest text-[#BD00FF]/60 hover:text-[#BD00FF] transition-colors"
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>VIEW ALL →</Link>
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
                      {item.averageScore > 0 && (
                        <div className="absolute top-1 right-1 flex items-center gap-0.5 bg-black/80 rounded-full px-1.5 py-0.5">
                          <Star size={7} className="text-yellow-400 fill-yellow-400" />
                          <span className="text-[0.5rem] text-yellow-300 font-bold" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                            {(item.averageScore / 10).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-[0.7rem] font-semibold leading-tight line-clamp-2 group-hover:text-[#BD00FF] transition-colors"
                      style={{ fontFamily: 'Rajdhani, sans-serif' }}>{t}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Community Chat ── */}
        <CommunityChat />

      </div>
    </div>
  );
}
