/* eslint-disable prettier/prettier */
'use client';
import { useEffect, useState } from 'react';

function seedCount(): number {
  const seed = Math.floor(Date.now() / 60000);
  const pseudo = ((seed * 1103515245 + 12345) & 0x7fffffff) % 300;
  return 1100 + pseudo;
}

async function startPresence(onCount: (n: number) => void): Promise<() => void> {
  const { supabase, supabaseConfigured } = await import('@/lib/supabase');

  if (!supabaseConfigured) {
    onCount(seedCount());
    const t = setInterval(() => onCount(seedCount()), 60_000);
    return () => clearInterval(t);
  }

  const uid = `u_${Math.random().toString(36).slice(2, 10)}`;

  // IMPORTANT: chain .on() BEFORE .subscribe() — Supabase v2 requirement
  const channel = supabase
    .channel('demonlord_presence', { config: { presence: { key: uid } } })
    .on('presence', { event: 'sync' }, () => {
      onCount(Object.keys(channel.presenceState()).length);
    });

  channel.subscribe(async (status: string) => {
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
  const [count, setCount] = useState<number>(seedCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let cleanup: (() => void) | undefined;
    startPresence((n) => setCount(n)).then((fn) => { cleanup = fn; });
    return () => { cleanup?.(); };
  }, []);

  const formatted = count >= 1000
    ? `${(count / 1000).toFixed(1)}K`
    : String(count);

  const mono = { fontFamily: 'var(--font-geist-mono)' } as const;

  // Cosmic style: white dot + white/60 text, animated pulse
  if (variant === 'inline') {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{
            background: '#fff',
            opacity: 0.6,
            animation: mounted ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none',
          }}
        />
        <span style={{ ...mono, color: 'rgba(255,255,255,0.6)', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          {formatted} watching now
        </span>
      </span>
    );
  }

  // Badge variant — Cosmic style: pill with white/10 bg, white dot, white text
  return (
    <div
      className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs ${className}`}
      style={{
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        ...mono,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full shrink-0"
        style={{
          background: '#fff',
          opacity: mounted ? 1 : 0.6,
          animation: mounted ? 'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite' : 'none',
        }}
      />
      <span style={{ color: 'rgba(255,255,255,0.87)', letterSpacing: '0.05em' }}>
        {formatted}
      </span>
      <span style={{ color: 'rgba(255,255,255,0.4)' }}>watching now</span>
    </div>
  );
}
