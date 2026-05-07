/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import { crysoline } from '@/lib/crysoline';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get('id');
  const ep = searchParams.get('ep') || '1';

  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  try {
    // Search for the anime on AnimePahe via Crysoline
    // then find the episode and return stream sources
    const searchRes: any = await crysoline.searchAnime(String(id));
    const results = searchRes?.data || searchRes?.results || [];

    if (!results.length) {
      return NextResponse.json({ sources: [], message: 'Anime not found on AnimePahe' });
    }

    // Get episodes for first match
    const animeId = results[0]?.session || results[0]?.id;
    if (!animeId) return NextResponse.json({ sources: [] });

    const epRes: any = await crysoline.getEpisodes(animeId, 1);
    const episodes = epRes?.data || epRes?.episodes || [];

    // Find episode by number
    const epNum = parseInt(ep);
    const epObj = episodes.find((e: any) => e.episode === epNum || e.episode_number === epNum)
      || episodes[epNum - 1];

    if (!epObj) return NextResponse.json({ sources: [] });

    const epSession = epObj.session || epObj.id;
    const streamRes: any = await crysoline.getStream(epSession);
    const sources = streamRes?.data || streamRes?.sources || [];

    return NextResponse.json({ sources, episode: epObj });
  } catch (err: any) {
    console.error('[Crysoline stream error]', err.message);
    return NextResponse.json({ sources: [], error: err.message }, { status: 200 });
  }
}
