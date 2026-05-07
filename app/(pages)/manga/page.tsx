/* eslint-disable prettier/prettier */
import { Book, Search } from 'lucide-react';
import MangaSearchClient from '@/components/manga-search-client';
import { anilist } from '@/lib/anilist';
import Link from 'next/link';
import Image from 'next/image';

export default async function MangaPage() {
  let trending: any[] = [];
  try { trending = await anilist.trendingManga(); } catch {}

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="border border-[#F9F002]/30 p-2">
          <Book size={18} style={{ color: '#F9F002' }} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-[0.15em] uppercase"
            style={{ fontFamily: 'Orbitron, monospace' }}>MANGA</h1>
          <p className="text-[0.6rem] tracking-widest text-white/30 uppercase"
            style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            POWERED BY ANILIST DATABASE
          </p>
        </div>
      </div>

      {/* Search */}
      <MangaSearchClient />

      {/* Trending */}
      {trending.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[0.6rem] tracking-[0.25em] text-[#F9F002]/70 uppercase"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              // TRENDING MANGA
            </span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(90deg, rgba(249,240,2,0.3), transparent)' }} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {trending.map(item => {
              const title = item.title?.english || item.title?.romaji || 'Unknown';
              return (
                <Link key={item.id} href={`/manga/info/${item.id}`} className="group">
                  <div className="relative aspect-[2/3] overflow-hidden border border-white/8 group-hover:border-[#F9F002]/40 transition-all">
                    {item.coverImage?.large && (
                      <Image fill src={item.coverImage.large} alt={title} sizes="160px"
                        className="object-cover brightness-90 group-hover:brightness-100 transition-all group-hover:scale-105 duration-500" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-0 inset-x-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs font-semibold text-white truncate"
                        style={{ fontFamily: 'Rajdhani, sans-serif' }}>{title}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
