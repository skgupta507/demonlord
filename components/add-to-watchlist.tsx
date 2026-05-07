/* eslint-disable prettier/prettier */
'use client';
import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface Item {
  id: string; title: string; type: 'movie' | 'tv' | 'anime';
  poster?: string; rating?: number; year?: string;
}

export default function AddToWatchlistButton({ item }: { item: Item }) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const wl = JSON.parse(localStorage.getItem('demonlord_watchlist') ?? '[]');
    setSaved(wl.some((i: Item) => i.id === item.id && i.type === item.type));
  }, [item.id, item.type]);

  const toggle = () => {
    const wl = JSON.parse(localStorage.getItem('demonlord_watchlist') ?? '[]');
    let next;
    if (saved) {
      next = wl.filter((i: Item) => !(i.id === item.id && i.type === item.type));
    } else {
      next = [...wl, { ...item, addedAt: Date.now() }];
    }
    localStorage.setItem('demonlord_watchlist', JSON.stringify(next));
    setSaved(!saved);
  };

  return (
    <button onClick={toggle}
      className={`btn-outline flex items-center gap-2 transition-all ${
        saved ? 'border-[var(--neon-pink)] text-[var(--neon-pink)]' : ''
      }`}>
      {saved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
      {saved ? 'Saved' : 'Watchlist'}
    </button>
  );
}
