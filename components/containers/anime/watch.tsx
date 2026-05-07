/* eslint-disable prettier/prettier */
import Link from 'next/link';
import { ScrollArea } from '@/components/ui/scroll-area';
import { anilist } from '@/lib/anilist';

export default async function WatchContainer({ id, currentEp }: { id: string; currentEp?: string }) {
  let episodes: { number: number; title: string }[] = [];
  try {
    const data = await anilist.getById(Number(id));
    const count = data?.episodes || 12;
    episodes = Array.from({ length: count }, (_, i) => ({
      number: i + 1,
      title: `Episode ${i + 1}`,
    }));
  } catch {
    return null;
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[0.6rem] tracking-[0.25em] text-white/30 uppercase"
          style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {'// EPISODE INDEX'}
        </span>
        <div className="flex-1 h-px bg-white/5" />
        <span className="text-[0.55rem] tracking-widest text-white/20"
          style={{ fontFamily: 'var(--font-geist-mono)' }}>
          {episodes.length} EPISODES
        </span>
      </div>
      <ScrollArea className="h-[320px] border border-white/8">
        <div className="grid grid-cols-3 gap-1.5 p-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
          {episodes.map(ep => {
            const isCurrent = currentEp === String(ep.number);
            return (
              <Link
                key={ep.number}
                href={`/anime/watch/${id}/${ep.number}`}
                className={`group flex flex-col items-start border p-2.5 text-left transition-all ${
                  isCurrent
                    ? 'border-[#BD00FF]/60 bg-[#BD00FF]/10'
                    : 'border-white/6 hover:border-[#BD00FF]/30 hover:bg-[#BD00FF]/5'
                }`}
              >
                <span className={`text-[0.6rem] tracking-widest ${isCurrent ? 'text-[#BD00FF]' : 'text-white/40'}`}
                  style={{ fontFamily: 'var(--font-geist-mono)' }}>
                  E{String(ep.number).padStart(2, '0')}
                </span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
