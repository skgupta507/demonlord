/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect, useRef } from 'react';
import { useSearch } from '@/hooks/use-search';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Film, Tv2, Antenna, Star, Clock, X, TrendingUp } from 'lucide-react';

type Category = 'movie' | 'tv' | 'anime';

const CATEGORIES: { key: Category; label: string; icon: any; color: string }[] = [
  { key: 'movie', label: 'Movies',   icon: Film,    color: 'var(--neon-pink)'   },
  { key: 'tv',    label: 'TV Shows', icon: Tv2,     color: 'var(--neon-blue)'   },
  { key: 'anime', label: 'Anime',    icon: Antenna, color: 'var(--neon-purple)' },
];

const TRENDING_SEARCHES = ['Dune', 'One Piece', 'Breaking Bad', 'Demon Slayer', 'The Bear', 'Jujutsu Kaisen'];

function ResultCard({ item, category }: { item: any; category: Category }) {
  const cat = CATEGORIES.find(c => c.key === category)!;
  const title = item.title || item.name || 'Unknown';
  const year = (item.release_date || item.first_air_date || '').slice(0, 4);
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w342${item.poster_path}`
    : item.image || null;
  const href = category === 'anime' ? `/anime/${item.id}` : `/${category}/${item.id}`;

  return (
    <Link href={href} className="group">
      <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[hsl(var(--muted))] transition-all duration-150 cursor-pointer">
        {/* Poster */}
        <div className="relative w-10 h-14 rounded-lg overflow-hidden shrink-0 bg-[hsl(var(--muted))] border border-[hsl(var(--border))]">
          {poster ? (
            <Image fill src={poster} alt={title} sizes="40px" className="object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <cat.icon size={14} style={{ color: cat.color }} />
            </div>
          )}
        </div>
        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <p className="text-sm font-semibold truncate leading-tight">{title}</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[0.55rem] tracking-wider px-1.5 py-0.5 rounded-full text-white font-medium"
              style={{ background: cat.color, fontFamily: 'Share Tech Mono, monospace' }}>
              {cat.label}
            </span>
            {year && <span className="text-[0.6rem] text-[hsl(var(--muted-foreground))]">{year}</span>}
            {item.vote_average > 0 && (
              <span className="flex items-center gap-0.5 text-[0.6rem] text-yellow-500">
                <Star size={8} className="fill-yellow-500" />
                {(item.vote_average || item.rating / 10 || 0).toFixed(1)}
              </span>
            )}
          </div>
        </div>
        {/* Arrow */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
          style={{ color: cat.color }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

export default function SearchContent() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<Category>('movie');
  const { results, isLoading } = useSearch(query, category);
  const inputRef = useRef<HTMLInputElement>(null);
  const cat = CATEGORIES.find(c => c.key === category)!;

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-10 space-y-8">

      {/* Page header — Rive-style minimal */}
      <div className="space-y-1">
        <h1 className="text-2xl font-black tracking-tight" style={{ fontFamily: 'Orbitron, monospace' }}>
          Search
        </h1>
        <p className="text-sm text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
          Find movies, TV shows and anime instantly.
        </p>
      </div>

      {/* Category tabs — pill style like Rive */}
      <div className="flex gap-2">
        {CATEGORIES.map(c => {
          const Icon = c.icon;
          const active = category === c.key;
          return (
            <button key={c.key} onClick={() => setCategory(c.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all border ${
                active ? 'text-white border-transparent' : 'border-[hsl(var(--border))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:border-[hsl(var(--foreground)/0.3)]'
              }`}
              style={{ background: active ? c.color : 'transparent' }}>
              <Icon size={13} strokeWidth={active ? 2.2 : 1.6} />
              {c.label}
            </button>
          );
        })}
      </div>

      {/* Search input — Rive-style large clean input */}
      <div className="relative">
        <div className={`flex items-center gap-3 border-2 rounded-2xl px-4 py-3.5 transition-all duration-200 ${
          query ? 'border-[hsl(var(--foreground)/0.3)]' : 'border-[hsl(var(--border))]'
        } focus-within:border-[hsl(var(--foreground)/0.4)] bg-[hsl(var(--card))]`}
          style={{ borderColor: query ? cat.color + '80' : undefined }}>
          {isLoading ? (
            <div className="h-5 w-5 border-2 rounded-full animate-spin shrink-0"
              style={{ borderColor: cat.color, borderTopColor: 'transparent' }} />
          ) : (
            <Search size={18} className="shrink-0" style={{ color: query ? cat.color : 'hsl(var(--muted-foreground))' }} />
          )}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={`Search ${cat.label.toLowerCase()}...`}
            className="flex-1 bg-transparent text-base outline-none placeholder:text-[hsl(var(--muted-foreground))]"
            style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '1rem', fontWeight: 500 }}
          />
          {query && (
            <button onClick={() => setQuery('')}
              className="shrink-0 h-6 w-6 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center hover:bg-[hsl(var(--muted-foreground)/0.2)] transition-colors">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Results */}
      {!query && (
        <div className="space-y-4">
          {/* Trending suggestions */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <TrendingUp size={12} /> TRENDING SEARCHES
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map(s => (
                <button key={s} onClick={() => setQuery(s)}
                  className="px-3 py-1.5 rounded-full border border-[hsl(var(--border))] text-sm text-[hsl(var(--muted-foreground))] hover:border-[hsl(var(--foreground)/0.4)] hover:text-[hsl(var(--foreground))] transition-all"
                  style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Quick browse links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs text-[hsl(var(--muted-foreground))]"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <Clock size={12} /> BROWSE BY CATEGORY
            </div>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(c => {
                const Icon = c.icon;
                return (
                  <Link key={c.key} href={`/${c.key}`}>
                    <div className="card-cyber p-4 flex flex-col items-center gap-2 text-center cursor-pointer group">
                      <div className="h-9 w-9 rounded-xl flex items-center justify-center transition-all"
                        style={{ background: `color-mix(in srgb, ${c.color} 12%, transparent)` }}>
                        <Icon size={18} style={{ color: c.color }} strokeWidth={1.8} />
                      </div>
                      <span className="text-xs font-medium">{c.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Query results */}
      {query && (
        <div className="space-y-2">
          {/* Count */}
          {!isLoading && results !== null && (
            <p className="text-xs text-[hsl(var(--muted-foreground))] px-1"
              style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {results.length > 0
                ? `${results.length} results for "${query}"`
                : `No results for "${query}"`}
            </p>
          )}

          {/* Skeleton loading */}
          {isLoading && (
            <div className="space-y-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl">
                  <div className="w-10 h-14 rounded-lg bg-[hsl(var(--muted))] animate-pulse shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[hsl(var(--muted))] rounded-lg animate-pulse w-3/4" />
                    <div className="h-3 bg-[hsl(var(--muted))] rounded-lg animate-pulse w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Results list */}
          {!isLoading && results && results.length > 0 && (
            <div className="space-y-1">
              {results.map((item: any) => (
                <ResultCard key={item.id} item={item} category={category} />
              ))}
            </div>
          )}

          {/* Empty state */}
          {!isLoading && results && results.length === 0 && query.length > 1 && (
            <div className="py-16 flex flex-col items-center gap-4 text-center">
              <div className="h-16 w-16 rounded-2xl flex items-center justify-center opacity-20"
                style={{ background: cat.color }}>
                <Search size={28} className="text-white" />
              </div>
              <div className="space-y-1">
                <p className="font-bold">No results found</p>
                <p className="text-sm text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                  Try a different spelling or search for something else.
                </p>
              </div>
              <div className="flex gap-2 flex-wrap justify-center">
                {CATEGORIES.filter(c => c.key !== category).map(c => (
                  <button key={c.key} onClick={() => setCategory(c.key)}
                    className="btn-outline text-xs px-4 py-2">
                    Search in {c.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
