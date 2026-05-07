/* eslint-disable prettier/prettier */
'use client';
import { useEffect, useState } from 'react';

/**
 * Tracks real online users via Supabase Realtime presence.
 * Falls back to a seeded estimate when Supabase is not configured.
 *
 * Setup (add to .env.local):
 *   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
 *   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
 *
 * In Supabase dashboard: no extra tables needed — uses Realtime presence only.
 */

function seedCount(): number {
  // Deterministic per-minute seed so SSR and client match on first render
  const seed = Math.floor(Date.now() / 60000);
  const pseudo = ((seed * 1103515245 + 12345) & 0x7fffffff) % 300;
  return 1100 + pseudo;
}

async function startPresence(onCount: (n: number) => void): Promise<() => void> {
  const { supabase, supabaseConfigured } = await import('@/lib/supabase');

  if (!supabaseConfigured) {
    // No Supabase — show seeded estimate that ticks every minute
    onCount(seedCount());
    const t = setInterval(() => onCount(seedCount()), 60_000);
    return () => clearInterval(t);
  }

  const uid = `u_${Math.random().toString(36).slice(2, 10)}`;

  const channel = supabase.channel('demonlord_presence', {
    config: { presence: { key: uid } },
  });

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState();
      onCount(Object.keys(state).length);
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({ uid, at: Date.now() });
      }
    });

  return () => {
    channel.untrack().catch(() => {});
    supabase.removeChannel(channel);
  };
}

interface Props {
  variant?: 'badge' | 'inline';
  className?: string;
}

export default function OnlineUsers({ variant = 'badge', className = '' }: Props) {
  const [count, setCount]   = useState<number>(seedCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let cleanup: (() => void) | undefined;
    startPresence((n) => setCount(n)).then((fn) => { cleanup = fn; });
    return () => { cleanup?.(); };
  }, []);

  // Always show a number — never blank
  const formatted = count >= 1000
    ? `${(count / 1000).toFixed(1)}K`
    : String(count);

  const mono = { fontFamily: 'var(--font-geist-mono)' } as const;

  if (!mounted) {
    // SSR placeholder — same seed so no hydration mismatch
    const ssrCount = seedCount();
    const ssrFmt = ssrCount >= 1000 ? `${(ssrCount / 1000).toFixed(1)}K` : String(ssrCount);
    if (variant === 'inline') {
      return (
        <span className={`inline-flex items-center gap-1.5 ${className}`}>
          <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--neon-green)' }} />
          <span className="text-[0.65rem] tracking-widest" style={{ ...mono, color: 'var(--neon-green)' }}>
            {ssrFmt} ONLINE
          </span>
        </span>
      );
    }
    return (
      <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-[0.6rem] tracking-widest border-[hsl(var(--border))] ${className}`} style={mono}>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: 'var(--neon-green)' }} />
        <span style={{ color: 'var(--neon-green)' }}>{ssrFmt}</span>
        <span className="text-[hsl(var(--muted-foreground))]">ONLINE NOW</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
        <span className="text-[0.65rem] tracking-widest" style={{ ...mono, color: 'var(--neon-green)' }}>
          {formatted} ONLINE
        </span>
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 border rounded-full px-4 py-1.5 text-[0.6rem] tracking-widest border-[hsl(var(--border))] ${className}`} style={mono}>
      <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: 'var(--neon-green)' }} />
      <span style={{ color: 'var(--neon-green)' }}>{formatted}</span>
      <span className="text-[hsl(var(--muted-foreground))]">ONLINE NOW</span>
    </div>
  );
}
