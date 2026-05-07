/* eslint-disable prettier/prettier */
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, Clock, Tv, ExternalLink } from 'lucide-react';

export default function DetailsContainer({ data }: { data: any }) {
  const title = data.title?.english || data.title?.romaji || 'Unknown';
  const score = data.averageScore ? (data.averageScore / 10).toFixed(1) : null;
  const studio = data.studios?.nodes?.find((s: any) => s.isAnimationStudio)?.name;
  const genres = data.genres?.slice(0, 5) || [];
  const desc = data.description?.replace(/<[^>]*>/g, '') || '';
  const banner = data.bannerImage || null;
  const cover = data.coverImage?.extraLarge || data.coverImage?.large;

  return (
    <div className="space-y-0">
      {/* Backdrop */}
      <div className="relative h-[35dvh] w-full overflow-hidden md:h-[50dvh]">
        {banner ? (
          <Image fill src={banner} alt={title} className="object-cover object-center brightness-50" sizes="100vw" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#BD00FF]/20 via-[#080B14] to-[#00D4FF]/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[hsl(var(--background)/0.4)] to-[hsl(var(--background))]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[hsl(var(--background)/0.8)] via-transparent to-transparent" />
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)' }} />
      </div>

      <div className="mx-auto max-w-5xl px-4 md:px-6 -mt-36 relative z-10 pb-10 space-y-8">
        <div className="flex flex-col gap-6 md:flex-row">
          {/* Cover */}
          <aside className="w-36 shrink-0 md:w-48 self-end md:self-auto">
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#BD00FF]/40 to-transparent z-0" />
              {cover && (
                <Image src={cover} alt={title} width={192} height={288}
                  className="w-full aspect-[2/3] object-cover relative z-0" />
              )}
            </div>
          </aside>

          {/* Info */}
          <article className="flex flex-col gap-3 pt-2 md:pt-28">
            <div className="flex flex-wrap items-center gap-2 text-[0.6rem] tracking-widest text-white/40 uppercase"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {data.format && <span>{data.format.replace(/_/g, ' ')}</span>}
              {data.episodes && <><span className="opacity-30">|</span><span className="flex items-center gap-1"><Tv size={9} />{data.episodes} EPS</span></>}
              {data.duration && <><span className="opacity-30">|</span><span className="flex items-center gap-1"><Clock size={9} />{data.duration}MIN</span></>}
              {data.status && <><span className="opacity-30">|</span><span style={{ color: data.status === 'RELEASING' ? '#39FF14' : undefined }}>{data.status}</span></>}
              {studio && <><span className="opacity-30">|</span><span>{studio}</span></>}
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

            <div className="flex flex-wrap items-center gap-2">
              {score && (
                <div className="flex items-center gap-1.5 bg-[#BD00FF]/10 border border-[#BD00FF]/30 px-2 py-1">
                  <Star size={10} className="text-[#BD00FF] fill-current" />
                  <span className="text-[0.7rem] font-bold text-[#BD00FF]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                    {score}
                  </span>
                </div>
              )}
              {genres.map((g: string) => (
                <span key={g} className="border border-white/10 px-2 py-0.5 text-[0.6rem] tracking-widest text-white/40 uppercase"
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  {g}
                </span>
              ))}
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-white/60 line-clamp-4"
              style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>
              {desc}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link href={`/anime/watch/${data.id}/1`}>
                <button className="btn-neon flex items-center gap-2">
                  <Play size={12} className="fill-current" /> WATCH NOW
                </button>
              </Link>
              {data.trailer?.id && (
                <a href={`https://youtube.com/watch?v=${data.trailer.id}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 border border-white/15 px-4 py-2 text-[0.65rem] tracking-widest text-white/40 hover:border-[#00D4FF]/40 hover:text-[#00D4FF] transition-all"
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  <ExternalLink size={11} /> TRAILER
                </a>
              )}
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}
