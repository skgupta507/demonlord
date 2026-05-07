/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import { kmmovies, animesalt } from '@/lib/screenscape';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Query parameter q is required' }, { status: 400 });
  }

  try {
    const [movies, anime] = await Promise.allSettled([
      kmmovies.search(q),
      animesalt.search(q),
    ]);

    return NextResponse.json({
      movies: movies.status === 'fulfilled' ? movies.value : null,
      anime: anime.status === 'fulfilled' ? anime.value : null,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
