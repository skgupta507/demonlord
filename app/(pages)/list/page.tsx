/* eslint-disable prettier/prettier */
'use client';
import Link from 'next/link';
import { Film, Antenna, Heart, Bookmark } from 'lucide-react';
import { useState } from 'react';

const sections = [
  { title: 'Movie & TV', desc: 'Your saved movies and TV shows watchlist.', href: '/watchlist', icon: Film, color: 'var(--neon-pink)' },
  { title: 'Anime', desc: 'Your saved anime watchlist.', href: '/watchlist?tab=anime', icon: Antenna, color: 'var(--neon-purple)' },
];

export default function List() {
  return (
    <div className="min-h-[80vh] p-6 space-y-8 max-w-4xl mx-auto">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--neon-pink)' }}>
            <Heart size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-wide" style={{ fontFamily: 'Orbitron, monospace' }}>
              My Library
            </h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              Your saved content — watchlist, favourites & history
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/watchlist">
          <div className="card-cyber p-6 space-y-4 cursor-pointer group">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: 'color-mix(in srgb, var(--neon-pink) 15%, transparent)' }}>
              <Bookmark size={18} style={{ color: 'var(--neon-pink)' }} />
            </div>
            <div>
              <h2 className="font-bold text-base">Watchlist</h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Movies and shows you want to watch later.
              </p>
            </div>
            <span className="text-xs" style={{ color: 'var(--neon-pink)', fontFamily: 'Share Tech Mono, monospace' }}>
              VIEW →
            </span>
          </div>
        </Link>
        <Link href="/history">
          <div className="card-cyber p-6 space-y-4 cursor-pointer group">
            <div className="h-10 w-10 rounded-xl flex items-center justify-center"
              style={{ background: 'color-mix(in srgb, var(--neon-blue) 15%, transparent)' }}>
              <Film size={18} style={{ color: 'var(--neon-blue)' }} />
            </div>
            <div>
              <h2 className="font-bold text-base">Watch History</h2>
              <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1" style={{ fontFamily: 'Rajdhani, sans-serif' }}>
                Everything you&apos;ve watched recently.
              </p>
            </div>
            <span className="text-xs" style={{ color: 'var(--neon-blue)', fontFamily: 'Share Tech Mono, monospace' }}>
              VIEW →
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
