/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect } from 'react';
import { Clock, Trash2, Play, Film, Tv2, Antenna, RotateCcw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface HistoryItem {
  id: string;
  title: string;
  type: 'movie' | 'tv' | 'anime';
  poster?: string;
  rating?: number;
  episode?: number;
  season?: number;
  progress?: number; // 0-100
  watchedAt: number;
}

const TYPE_COLOR = { movie: 'var(--neon-pink)', tv: 'var(--neon-blue)', anime: 'var(--neon-purple)' };
const TYPE_ICON = { movie: Film, tv: Tv2, anime: Antenna };
const TYPE_LABEL = { movie: 'Movie', tv: 'TV Show', anime: 'Anime' };

function timeAgo(ms: number) {
  const diff = Date.now() - ms;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (mins > 0) return `${mins}m ago`;
  return 'Just now';
}

export default function HistoryPage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [filter, setFilter] = useState<'all' | 'movie' | 'tv' | 'anime'>('all');

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem('demonlord_history');
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const save = (next: HistoryItem[]) => {
    setItems(next);
    localStorage.setItem('demonlord_history', JSON.stringify(next));
  };

  const remove = (id: string, watchedAt: number) =>
    save(items.filter(i => !(i.id === id && i.watchedAt === watchedAt)));

  const clearAll = () => { if (confirm('Clear all watch history?')) save([]); };

  const filtered = items
    .filter(i => filter === 'all' || i.type === filter)
    .sort((a, b) => b.watchedAt - a.watchedAt);

  // Group by date
  const grouped: Record<string, HistoryItem[]> = {};
  filtered.forEach(item => {
    const d = new Date(item.watchedAt);
    const today = new Date();
    const yesterday = new Date(Date.now() - 86400000);
    let key: string;
    if (d.toDateString() === today.toDateString()) key = 'Today';
    else if (d.toDateString() === yesterday.toDateString()) key = 'Yesterday';
    else key = d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  if (!mounted) return null;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: 'var(--neon-blue)' }}>
            <Clock size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ fontFamily: 'var(--font-geist-mono)' }}>Watch History</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              {items.length} titles watched
            </p>
          </div>
        </div>
        {items.length > 0 && (
          <button onClick={clearAll}
            className="flex items-center gap-1.5 text-xs text-[hsl(var(--muted-foreground))] hover:text-red-400 transition-colors"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            <Trash2 size={12} /> Clear history
          </button>
        )}
      </div>

      {items.length > 0 && (
        <div className="flex gap-1 p-1 rounded-xl border border-[hsl(var(--border))] w-fit">
          {(['all', 'movie', 'tv', 'anime'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-[0.65rem] tracking-wider transition-all ${
                filter === f ? 'text-white font-bold' : 'text-[hsl(var(--muted-foreground))]'
              }`}
              style={{ fontFamily: 'var(--font-geist-mono)', background: filter === f ? 'var(--neon-blue)' : 'transparent' }}>
              {f === 'all' ? 'All' : TYPE_LABEL[f]}
            </button>
          ))}
        </div>
      )}

      {Object.entries(grouped).map(([date, dateItems]) => (
        <div key={date} className="space-y-2">
          <p className="text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] uppercase"
            style={{ fontFamily: 'var(--font-geist-mono)' }}>
            {date}
          </p>
          <div className="space-y-2">
            {dateItems.map(item => {
              const Icon = TYPE_ICON[item.type];
              const color = TYPE_COLOR[item.type];
              const href = item.type === 'anime'
                ? `/anime/watch/${item.id}/${item.episode ?? 1}`
                : item.type === 'tv'
                ? `/tv/watch/${item.id}`
                : `/movie/watch/${item.id}`;

              return (
                <div key={`${item.id}-${item.watchedAt}`}
                  className="card-cyber p-3 flex items-center gap-4 group">
                  {/* Poster / icon */}
                  {item.poster ? (
                    <Image src={item.poster} alt={item.title} width={44} height={66}
                      className="rounded-lg object-cover shrink-0" />
                  ) : (
                    <div className="h-14 w-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `color-mix(in srgb, ${color} 12%, transparent)` }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.title}</p>
                    <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                      <span className="text-[0.5rem] tracking-wider px-1.5 py-0.5 rounded-full text-white font-bold"
                        style={{ background: color, fontFamily: 'var(--font-geist-mono)' }}>
                        {TYPE_LABEL[item.type]}
                      </span>
                      {item.season && <span className="text-xs text-[hsl(var(--muted-foreground))]">S{item.season} E{item.episode}</span>}
                      {item.rating && <span className="text-xs text-yellow-400">★ {item.rating.toFixed(1)}</span>}
                      <span className="text-xs text-[hsl(var(--muted-foreground))]">{timeAgo(item.watchedAt)}</span>
                    </div>
                    {item.progress !== undefined && (
                      <div className="mt-1.5 h-1 rounded-full bg-[hsl(var(--muted))] overflow-hidden w-full max-w-[160px]">
                        <div className="h-full rounded-full transition-all"
                          style={{ width: `${item.progress}%`, background: color }} />
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Link href={href}>
                      <button className="h-8 w-8 rounded-lg border border-[hsl(var(--border))] flex items-center justify-center hover:border-[var(--neon-blue)] hover:text-[var(--neon-blue)] transition-all">
                        <RotateCcw size={13} />
                      </button>
                    </Link>
                    <button onClick={() => remove(item.id, item.watchedAt)}
                      className="h-8 w-8 rounded-lg border border-[hsl(var(--border))] flex items-center justify-center hover:border-red-400 hover:text-red-400 transition-all">
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <div className="flex flex-col items-center py-24 gap-4">
          <div className="h-16 w-16 rounded-2xl flex items-center justify-center opacity-20"
            style={{ background: 'var(--neon-blue)' }}>
            <Clock size={28} className="text-white" />
          </div>
          <p className="font-bold text-lg" style={{ fontFamily: 'var(--font-geist-mono)' }}>No history yet</p>
          <p className="text-sm text-[hsl(var(--muted-foreground))] text-center max-w-xs" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            Start watching and your history will appear here automatically.
          </p>
          <Link href="/movie"><button className="btn-neon text-xs px-5 py-2">Start Watching</button></Link>
        </div>
      )}
    </div>
  );
}
