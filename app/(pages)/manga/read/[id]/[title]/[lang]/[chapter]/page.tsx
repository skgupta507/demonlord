/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';

export default function Read() {
  const params = useParams();
  const { id, title, lang, chapter } = params as Record<string, string>;
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Use MangaDex API directly - free, no auth needed
      const res = await fetch(`https://api.mangadex.org/at-home/server/${chapter}`);
      const json = await res.json();
      if (!json.chapter) throw new Error('No chapter data');
      const base = json.baseUrl;
      const hash = json.chapter.hash;
      const pages = json.chapter.data; // HD pages
      setImages(pages.map((p: string) => `${base}/data/${hash}/${p}`));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [chapter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="min-h-screen">
      {/* Nav bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 border-b border-white/8 bg-[#080B14]/95 backdrop-blur-sm">
        <Link href={`/manga/info/${id}`}
          className="flex items-center gap-2 text-[0.6rem] tracking-widest text-white/30 hover:text-[#F9F002] transition-colors"
          style={{ fontFamily: 'var(--font-geist-mono)' }}>
          <ArrowLeft size={10} /> BACK TO INFO
        </Link>
        <span className="text-[0.55rem] tracking-widest text-white/30" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {decodeURIComponent(title || '')} · {lang?.toUpperCase()} · CH. {chapter?.slice(0, 8)}
        </span>
        <span className="text-[0.55rem] tracking-widest text-white/20" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {images.length} PAGES
        </span>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <div className="h-8 w-8 border-2 border-[#F9F002] border-t-transparent rounded-full animate-spin" />
          <span className="text-[0.6rem] tracking-widest text-white/30" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            FETCHING CHAPTER...
          </span>
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <span className="text-[0.6rem] tracking-widest text-[#FF006F]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            FAILED TO LOAD CHAPTER — MangaDex may be unavailable
          </span>
          <button onClick={fetchData} className="btn-neon text-xs">RETRY</button>
        </div>
      )}

      {!loading && !error && (
        <div className="flex flex-1 flex-col items-center py-4 gap-1 max-w-3xl mx-auto px-2">
          {images.map((src, i) => (
            <div key={i} className="relative w-full">
              <Image
                src={src} alt={`Page ${i + 1}`}
                width={800} height={1200}
                className="w-full h-auto"
                unoptimized
                priority={i < 3}
              />
            </div>
          ))}
          {images.length > 0 && (
            <div className="flex items-center gap-3 py-8">
              <span className="text-[0.6rem] tracking-widest text-white/30"
                style={{ fontFamily: 'var(--font-geist-mono)' }}>
                END OF CHAPTER · {images.length} PAGES
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
