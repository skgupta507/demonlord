/* eslint-disable prettier/prettier */
import Link from 'next/link';
import { Tv, WifiOff, ArrowRight } from 'lucide-react';

export default function DramaPage() {
  return (
    <div className="relative min-h-[80vh] flex items-center justify-center overflow-hidden p-6">
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(hsl(280 100% 68%) 1px, transparent 1px), linear-gradient(90deg, hsl(280 100% 68%) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
      <div className="relative z-10 max-w-lg text-center space-y-6">
        <div className="flex justify-center">
          <div className="relative border border-[hsl(280_100%_68%/0.3)] p-5">
            <WifiOff size={36} className="text-[hsl(280_100%_68%)]" />
            <div className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-[hsl(0_85%_60%)]" />
          </div>
        </div>
        <div>
          <div
            className="text-[0.6rem] tracking-[0.3em] text-[hsl(280_100%_68%)] uppercase mb-2"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            STATUS: NODE OFFLINE
          </div>
          <h1 className="text-3xl font-black tracking-[0.1em] uppercase" style={{ fontFamily: 'var(--font-geist-mono)' }}>
            DRAMA
          </h1>
        </div>
        <div className="border border-[hsl(var(--border))] p-4 text-left space-y-2">
          <div
            className="text-[0.55rem] tracking-widest text-[hsl(280_100%_68%)]"
            style={{ fontFamily: 'var(--font-geist-mono)' }}
          >
            {'// INCIDENT REPORT'}
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed" style={{ fontFamily: 'var(--font-geist-sans)' }}>
            The Drama streaming node has been taken offline. Our previous provider
            <span className="text-foreground font-semibold"> Dramacool</span> is no longer available
            and no suitable replacement has been found. Check the archive for alternative sources.
          </p>
        </div>
        <div className="flex justify-center gap-3">
          <Link href="/list/mtv">
            <button className="btn-neon flex items-center gap-2">
              ALTERNATIVE NODES <ArrowRight size={12} />
            </button>
          </Link>
          <Link href="/">
            <button
              className="border border-[hsl(var(--border))] px-5 py-2 text-[0.65rem] tracking-widest text-muted-foreground hover:border-muted-foreground/50 transition-colors"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              HOME BASE
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
