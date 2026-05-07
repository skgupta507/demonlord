/* eslint-disable prettier/prettier */
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

export default function MangaSearchClient() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  return (
    <div className="flex gap-0 max-w-lg">
      <div className="flex flex-1 items-center border border-white/10 focus-within:border-[#F9F002]/50 transition-colors">
        <span className="pl-4 text-[0.7rem]" style={{ fontFamily: 'var(--font-geist-mono)', color: '#F9F002' }}>&gt;_</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && query.trim()) router.push(`/manga/${encodeURIComponent(query)}`); }}
          placeholder="SEARCH MANGA..."
          className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-white/20"
          style={{ fontFamily: 'var(--font-geist-mono)', fontSize: '0.75rem', letterSpacing: '0.05em' }}
        />
      </div>
      <button
        onClick={() => { if (query.trim()) router.push(`/manga/${encodeURIComponent(query)}`); }}
        className="flex items-center gap-2 px-4 py-3 text-[0.65rem] tracking-[0.15em] text-white transition-all"
        style={{ fontFamily: 'var(--font-geist-mono)', background: '#F9F002', color: '#000' }}
      >
        <Search size={13} /> SEARCH
      </button>
    </div>
  );
}
