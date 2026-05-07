/* eslint-disable prettier/prettier */
'use client';
import { useState } from 'react';
import FeaturedAnime from '@/components/featured/anime';
import { TrendingUp, Star, Clock } from 'lucide-react';

const TABS = [
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'popular',  label: 'Popular',  icon: Star       },
  { key: 'recent',   label: 'Recent',   icon: Clock      },
] as const;
type Tab = typeof TABS[number]['key'];

export default function AnimeTabClient() {
  const [active, setActive] = useState<Tab>('trending');
  return (
    <>
      <div className="flex gap-1 p-1 rounded-xl border border-[hsl(var(--border))] w-fit flex-wrap">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.key} onClick={() => setActive(tab.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                active === tab.key ? 'text-white' : 'text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]'
              }`}
              style={{ background: active === tab.key ? 'var(--neon-purple)' : 'transparent' }}>
              <Icon size={13} />{tab.label}
            </button>
          );
        })}
      </div>
      <FeaturedAnime featureType={active} />
    </>
  );
}
