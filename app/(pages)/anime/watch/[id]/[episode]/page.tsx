/* eslint-disable prettier/prettier */
import AnimePlayerClient from '@/components/containers/anime/player-client';
import WatchContainer from '@/components/containers/anime/watch';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function Watch({
  params,
}: {
  params: Promise<{ id: string; episode: string }>;
}) {
  const { id, episode } = await params;
  const ep = episode.match(/(\d+)/)?.[1] ?? '1';

  return (
    <div className="mx-auto max-w-5xl px-4 pt-6 pb-12 space-y-5">
      <Link
        href={`/anime/${id}`}
        className="inline-flex items-center gap-2 text-[0.6rem] tracking-widest text-[hsl(var(--muted-foreground))] hover:text-[var(--neon-pink)] transition-colors uppercase"
        style={{ fontFamily: 'Share Tech Mono, monospace' }}
      >
        <ArrowLeft size={10} /> Back to Info
      </Link>

      <div className="flex items-center gap-2">
        <span
          className="text-[0.55rem] tracking-[0.2em]"
          style={{ fontFamily: 'Share Tech Mono, monospace', color: 'var(--neon-purple)' }}
        >
          EPISODE {ep.padStart(2, '0')}
        </span>
      </div>

      <AnimePlayerClient id={id} episode={ep} m3u8Url="" tracks={[]} />

      <div className="pt-4">
        <WatchContainer id={id} currentEp={ep} />
      </div>
    </div>
  );
}
