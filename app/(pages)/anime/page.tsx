/* eslint-disable prettier/prettier */
import FeaturedAnime from '@/components/featured/anime';
import Carousal from '@/components/carousal/anime';
import AnimeTabClient from '@/components/containers/anime/tab-client';
import { Antenna } from 'lucide-react';

export default function AnimePage() {
  return (
    <div className="space-y-0">
      <Carousal />
      <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12 space-y-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--neon-purple)' }}>
            <Antenna size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black" style={{ fontFamily: 'var(--font-geist-mono)' }}>Anime</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))]" style={{ fontFamily: 'var(--font-geist-mono)' }}>
              Powered by AniList · Sub & Dub
            </p>
          </div>
        </div>
        <AnimeTabClient />
      </div>
    </div>
  );
}
