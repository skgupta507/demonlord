/* eslint-disable prettier/prettier */
import { anilist } from '@/lib/anilist';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, BookOpen, Star, Hash } from 'lucide-react';
import { notFound } from 'next/navigation';

export default async function MangaInfo({ params }: any) {
  const { id } = await params;
  let data: any;
  try {
    data = await anilist.getMangaById(Number(id));
    if (!data) return notFound();
  } catch { return notFound(); }

  const title = data.title?.english || data.title?.romaji || 'Unknown';
  const desc = data.description?.replace(/<[^>]*>/g, '').replace(/&[a-z]+;/gi, ' ').trim() || '';
  const cover = data.coverImage?.extraLarge || data.coverImage?.large;
  const score = data.averageScore ? (data.averageScore / 10).toFixed(1) : null;

  return (
    <div className="min-h-screen">
      {/* Top gradient banner */}
      <div className="relative h-40 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(249,240,2,0.08) 0%, rgba(255,0,111,0.05) 50%, rgba(0,0,0,0) 100%)' }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 3px)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[hsl(var(--background))]" />
      </div>

      <div className="mx-auto max-w-5xl px-6 -mt-24 relative z-10 pb-12 space-y-8">
        <Link href="/manga" className="inline-flex items-center gap-2 text-[0.6rem] tracking-widest text-white/30 hover:text-[#F9F002] transition-colors"
          style={{ fontFamily: 'Share Tech Mono, monospace' }}>
          <ArrowLeft size={10} /> BACK
        </Link>

        <div className="flex flex-col gap-6 md:flex-row">
          {/* Cover */}
          <aside className="w-36 shrink-0 md:w-48 self-start">
            <div className="relative">
              <div className="absolute -inset-[1px] bg-gradient-to-b from-[#F9F002]/30 to-transparent z-0" />
              {cover && (
                <Image src={cover} alt={title} width={192} height={288}
                  className="w-full aspect-[2/3] object-cover relative z-0" />
              )}
            </div>
          </aside>

          {/* Info */}
          <article className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2 text-[0.6rem] tracking-widest text-white/40 uppercase"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {data.format && <span>{data.format.replace(/_/g, ' ')}</span>}
              {data.chapters && <><span className="opacity-30">|</span><span className="flex items-center gap-1"><Hash size={9} />{data.chapters} CH</span></>}
              {data.volumes && <><span className="opacity-30">|</span><span>{data.volumes} VOL</span></>}
              {data.status && <><span className="opacity-30">|</span><span style={{ color: data.status === 'RELEASING' ? '#39FF14' : undefined }}>{data.status}</span></>}
            </div>

            <h1 className="text-2xl font-black tracking-wide uppercase md:text-4xl"
              style={{ fontFamily: 'Orbitron, monospace', lineHeight: 1.1 }}>
              {title}
            </h1>
            {data.title?.romaji && data.title?.english && (
              <p className="text-[0.65rem] tracking-wide text-white/30"
                style={{ fontFamily: 'Share Tech Mono, monospace' }}>{data.title.romaji}</p>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {score && (
                <div className="flex items-center gap-1.5 bg-[#F9F002]/10 border border-[#F9F002]/30 px-2 py-1">
                  <Star size={10} className="text-[#F9F002] fill-current" />
                  <span className="text-[0.7rem] font-bold text-[#F9F002]"
                    style={{ fontFamily: 'Share Tech Mono, monospace' }}>{score}</span>
                </div>
              )}
              {data.genres?.slice(0, 5).map((g: string) => (
                <span key={g} className="border border-white/10 px-2 py-0.5 text-[0.6rem] tracking-widest text-white/40 uppercase"
                  style={{ fontFamily: 'Share Tech Mono, monospace' }}>{g}</span>
              ))}
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-white/60 line-clamp-5"
              style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '0.9rem' }}>
              {desc}
            </p>
          </article>
        </div>

        {/* Related */}
        {data.relations?.edges?.length > 0 && (
          <div className="space-y-3">
            <span className="text-[0.6rem] tracking-[0.25em] text-[#F9F002]/60 uppercase"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>{'// RELATED'}</span>
            <div className="flex flex-wrap gap-3">
              {data.relations.edges.slice(0, 6).map((edge: any) => (
                edge.node && (
                  <Link key={edge.node.id}
                    href={edge.node.type === 'MANGA' ? `/manga/info/${edge.node.id}` : `/anime/${edge.node.id}`}
                    className="flex items-center gap-2 border border-white/8 px-3 py-2 hover:border-[#F9F002]/30 transition-colors">
                    {edge.node.coverImage?.large && (
                      <Image src={edge.node.coverImage.large} alt="" width={30} height={42}
                        className="object-cover w-7 h-10" />
                    )}
                    <div>
                      <p className="text-xs text-white/60 truncate max-w-[120px]"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                        {edge.node.title?.english || edge.node.title?.romaji}
                      </p>
                      <p className="text-[0.5rem] tracking-widest text-white/25"
                        style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                        {edge.relationType} · {edge.node.type}
                      </p>
                    </div>
                  </Link>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
