/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect } from 'react';
import { Heart, Trash2, Play, Film, Tv2, Antenna, Search, Grid, List } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface WatchlistItem {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'anime';
  poster?: string;
  rating?: number;
  year?: string;
  addedAt: number;
}

const TYPE_ICON = { movie: Film, tv: Tv2, anime: Antenna };
const TYPE_COLOR = { movie: 'var(--neon-pink)', tv: 'var(--neon-blue)', anime: 'var(--neon-purple)' };
const TYPE_LABEL = { movie: 'Movie', tv: 'TV Show', anime: 'Anime' };

function EmptyState({ filter }: { filter: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4">
      <div className="h-16 w-16 rounded-2xl flex items-center justify-center opacity-20"
        style={{ background: 'var(--neon-pink)' }}>
        <Heart size={28} className="text-white" />
      </div>
      <p className="font-bold text-lg" style={{ fontFamily: 'Orbitron, monospace' }}>
        {filter === 'all' ? 'Your watchlist is empty' : `No ${TYPE_LABEL[filter as keyof typeof TYPE_LABEL]}s saved`}
      </p>
      <p className="text-sm text-[hsl(var(--muted-foreground))] text-center max-w-xs" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
        Browse movies, TV shows, and anime then click the bookmark icon to save them here.
      </p>
      <div className="flex gap-3 mt-2">
        <Link href="/movie"><button className="btn-neon text-xs px-5 py-2">Browse Movies</button></Link>
        <Link href="/anime"><button className="btn-outline text-xs px-5 py-2">Browse Anime</button></Link>
      </div>
    </div>
  );
}

export default function WatchlistPage() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv' | 'anime'>('all');
  const [search, setSearch] = useState('');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('demonlord_watchlist');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const save = (newItems: WatchlistItem[]) => {
    setItems(newItems);
    localStorage.setItem('demonlord_watchlist', JSON.stringify(newItems));
  };

  const remove = (id: string) => save(items.filter(i => i.id !== id));
  const clearAll = () => { if (confirm('Clear your entire watchlist?')) save([]); };

  const filtered = items.filter(i => {
    const matchFilter = filter === 'all' || i.type === filter;
    const matchSearch = !search || i.title.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }).sort((a, b) => b.addedAt - a.addedAt);

  const counts = { all: items.length, movie: items.filter(i => i.type === 'movie').length, tv: items.filter(i => i.type === 'tv').length, anime: items.filter(i => i.type === 'anime').length };

  if (!mounted) return null;

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--neon-pink)' }}>
            <Heart size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ fontFamily: 'Orbitron, monospace' }}>My Watchlist</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {items.length} saved · sorted by newest
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <button onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-red-400 transition-colors"
            style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            <Trash2 size={12} /> Clear all
          </button>
        )}
      </div>

      {items.length > 0 && (
        <>
          {/* Filters + Search + View toggle */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex gap-1 p-1 rounded-xl border border-[hsl(var(--border))]">
              {(['all', 'movie', 'tv', 'anime'] as const).map(f => (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-[0.65rem] tracking-wider transition-all ${
                    filter === f
                      ? 'text-white font-bold'
                      : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
                  }`}
                  style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    background: filter === f ? 'var(--neon-pink)' : 'transparent',
                  }}>
                  {f === 'all' ? `All (${counts.all})` : `${TYPE_LABEL[f]} (${counts[f]})`}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 border border-[hsl(var(--border))] rounded-xl px-3 py-1.5 flex-1 max-w-xs">
              <Search size={13} className="text-[hsl(var(--muted-foreground))]" />
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search watchlist..."
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-[hsl(var(--muted-foreground))]"
                style={{ fontFamily: 'Rajdhani, sans-serif' }} />
            </div>

            <div className="flex gap-1 ml-auto">
              <button onClick={() => setView('grid')}
                className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'text-[var(--neon-pink)]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                <Grid size={15} />
              </button>
              <button onClick={() => setView('list')}
                className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'text-[var(--neon-pink)]' : 'text-[hsl(var(--muted-foreground))]'}`}>
                <List size={15} />
              </button>
            </div>
          </div>

          {/* Grid/List view */}
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-[hsl(var(--muted-foreground))] text-sm">
              No results for &quot;{search}&quot;
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(item => {
                const Icon = TYPE_ICON[item.type];
                const color = TYPE_COLOR[item.type];
                const href = `/${item.type === 'tv' ? 'tv' : item.type}/${item.id}`;
                return (
                  <div key={item.id} className="group relative">
                    <Link href={href}>
                      <div className="relative aspect-[2/3] rounded-xl overflow-hidden border border-[hsl(var(--border))] bg-[hsl(var(--card))] group-hover:border-[var(--neon-pink)] transition-all">
                        {item.poster ? (
                          <Image fill src={item.poster} alt={item.title} sizes="200px"
                            className="object-cover brightness-90 group-hover:brightness-100 transition-all" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Icon size={24} style={{ color }} className="opacity-50" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                        <div className="absolute bottom-0 inset-x-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-200">
                          <p className="text-xs font-semibold text-white truncate">{item.title}</p>
                        </div>
                        <div className="absolute top-2 left-2">
                          <span className="text-[0.5rem] tracking-wider px-1.5 py-0.5 rounded-full text-white font-bold"
                            style={{ background: color, fontFamily: 'Share Tech Mono, monospace' }}>
                            {TYPE_LABEL[item.type]}
                          </span>
                        </div>
                        {item.rating && (
                          <div className="absolute top-2 right-2 bg-black/70 rounded-full px-1.5 py-0.5 text-[0.55rem] text-yellow-400"
                            style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                            ★ {item.rating.toFixed(1)}
                          </div>
                        )}
                      </div>
                    </Link>
                    <button onClick={() => remove(item.id)}
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600 z-10">
                      <Trash2 size={11} />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map(item => {
                const Icon = TYPE_ICON[item.type];
                const color = TYPE_COLOR[item.type];
                const href = `/${item.type === 'tv' ? 'tv' : item.type}/${item.id}`;
                return (
                  <div key={item.id} className="card-cyber p-3 flex items-center gap-4">
                    {item.poster ? (
                      <Image src={item.poster} alt={item.title} width={48} height={72}
                        className="rounded-lg object-cover shrink-0" />
                    ) : (
                      <div className="h-16 w-12 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: 'color-mix(in srgb,' + color + ' 10%, transparent)' }}>
                        <Icon size={18} style={{ color }} />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[0.55rem] tracking-wider px-1.5 py-0.5 rounded-full text-white"
                          style={{ background: color, fontFamily: 'Share Tech Mono, monospace' }}>
                          {TYPE_LABEL[item.type]}
                        </span>
                        {item.year && <span className="text-xs text-[hsl(var(--muted-foreground))]">{item.year}</span>}
                        {item.rating && <span className="text-xs text-yellow-400">★ {item.rating.toFixed(1)}</span>}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link href={href}>
                        <button className="h-8 w-8 rounded-lg border border-[hsl(var(--border))] flex items-center justify-center hover:border-[var(--neon-pink)] hover:text-[var(--neon-pink)] transition-all">
                          <Play size={13} />
                        </button>
                      </Link>
                      <button onClick={() => remove(item.id)}
                        className="h-8 w-8 rounded-lg border border-[hsl(var(--border))] flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-all">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {items.length === 0 && <EmptyState filter={filter} />}
    </div>
  );
}
