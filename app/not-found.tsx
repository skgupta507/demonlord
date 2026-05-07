/* eslint-disable prettier/prettier */
'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const GLITCH_CHARS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ABCDEF!@#$%^&*';

function GlitchText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    let frame = 0;
    const interval = setInterval(() => {
      if (frame < 12) {
        setDisplay(text.split('').map((c, i) =>
          Math.random() < 0.3 ? GLITCH_CHARS[Math.floor(Math.random() * GLITCH_CHARS.length)] : c
        ).join(''));
        frame++;
      } else {
        setDisplay(text);
        frame = 0;
      }
    }, 80);
    return () => clearInterval(interval);
  }, [text]);

  return <span className={className} style={style}>{display}</span>;
}

function DataStream() {
  const [lines, setLines] = useState<string[]>([]);
  useEffect(() => {
    const msgs = [
      'ERROR: NODE_NOT_FOUND at 0xFF9A3E2C',
      'ATTEMPTING REROUTE...',
      'PACKET LOSS: 100%',
      'SIGNAL TRACE: NULL',
      'NETRUNNER ACCESS DENIED',
      'ICE BREACH DETECTED',
      'RECONNECTING TO MAINFRAME...',
      'CONNECTION TIMEOUT',
      'SECTOR WIPED: [DATA EXPUNGED]',
      'CORP FIREWALL ACTIVE',
    ];
    const t = setInterval(() => {
      setLines(prev => [msgs[Math.floor(Math.random() * msgs.length)], ...prev].slice(0, 8));
    }, 600);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="space-y-1 text-left w-full max-w-sm">
      {lines.map((l, i) => (
        <div key={i} className="flex items-center gap-2 opacity-0 animate-[fadeIn_0.3s_ease_forwards]"
          style={{ opacity: Math.max(0.1, 1 - i * 0.12), fontFamily: 'var(--font-geist-mono)', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
          <span style={{ color: i === 0 ? '#FF006F' : 'rgba(255,255,255,0.3)' }}>
            {i === 0 ? '▶' : '·'}
          </span>
          <span style={{ color: i === 0 ? '#FF006F' : 'rgba(255,255,255,0.25)' }}>{l}</span>
        </div>
      ))}
    </div>
  );
}

export default function NotFound() {
  const [scanY, setScanY] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setScanY(y => (y + 0.5) % 100), 16);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">

      {/* Animated scanline */}
      <div className="absolute left-0 right-0 h-[2px] pointer-events-none z-10"
        style={{
          top: `${scanY}%`,
          background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.3), rgba(0,212,255,0.6), rgba(0,212,255,0.3), transparent)',
          boxShadow: '0 0 10px rgba(0,212,255,0.4)',
        }}
      />

      {/* Horizontal glitch bars - random */}
      {[15, 42, 67, 83].map((y, i) => (
        <div key={i}
          className="absolute left-0 right-0 h-[1px] pointer-events-none"
          style={{
            top: `${y}%`,
            background: `rgba(${i % 2 === 0 ? '255,0,111' : '189,0,255'}, 0.15)`,
            animation: `glitch-1 ${2 + i * 0.7}s steps(2) infinite`,
          }}
        />
      ))}

      {/* Main content */}
      <div className="relative z-20 flex flex-col items-center gap-8 text-center">

        {/* 404 glitch number */}
        <div className="relative select-none">
          {/* Behind layers for glitch effect */}
          <div className="absolute inset-0 text-[10rem] font-black leading-none tracking-tighter"
            style={{
              fontFamily: 'var(--font-geist-mono)',
              color: '#00D4FF',
              opacity: 0.4,
              animation: 'glitch-1 3s steps(2) infinite',
              transform: 'translate(-4px, 0)',
              clipPath: 'inset(20% 0 60% 0)',
            }}>
            404
          </div>
          <div className="absolute inset-0 text-[10rem] font-black leading-none tracking-tighter"
            style={{
              fontFamily: 'var(--font-geist-mono)',
              color: '#BD00FF',
              opacity: 0.4,
              animation: 'glitch-2 2.5s steps(2) infinite',
              transform: 'translate(4px, 0)',
              clipPath: 'inset(60% 0 15% 0)',
            }}>
            404
          </div>
          {/* Main */}
          <div className="text-[10rem] font-black leading-none tracking-tighter relative"
            style={{
              fontFamily: 'var(--font-geist-mono)',
              background: 'linear-gradient(180deg, #FF006F 0%, #BD00FF 60%, #00D4FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(255,0,111,0.5)) drop-shadow(0 0 60px rgba(189,0,255,0.3))',
            }}>
            404
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <GlitchText
            text="SIGNAL LOST"
            className="block text-2xl font-black tracking-[0.25em] text-white"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          />
          <p className="text-[0.6rem] tracking-[0.3em] uppercase"
            style={{ fontFamily: 'var(--font-geist-mono)', color: '#00D4FF', textShadow: '0 0 10px #00D4FF' }}>
            NODE DOES NOT EXIST IN THIS SECTOR
          </p>
        </div>

        {/* Data stream terminal */}
        <div className="border border-white/8 p-4 bg-black/40 w-full max-w-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/8">
            <div className="h-2 w-2 rounded-full bg-[#FF006F] animate-pulse" />
            <span className="text-[0.5rem] tracking-widest text-white/30" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              NETRUNNER DIAGNOSTIC v4.2.1
            </span>
          </div>
          <DataStream />
        </div>

        {/* Actions */}
        <div className="flex gap-3 flex-wrap justify-center">
          <Link href="/">
            <button className="btn-neon">JACK BACK IN</button>
          </Link>
          <Link href="/movie">
            <button className="btn-cyber-blue">BROWSE STREAMS</button>
          </Link>
        </div>

        <p className="text-[0.55rem] tracking-widest text-white/20" style={{ fontFamily: 'var(--font-geist-mono)' }}>
          ERR_CODE: 404 · demonlord.pp.ua · NEURAL CINEMA
        </p>
      </div>
    </div>
  );
}
