/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import { animesalt, animepahe } from '@/lib/screenscape';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q');
  const url = searchParams.get('url');
  const stream = searchParams.get('stream');
  const provider = searchParams.get('provider') || 'animesalt';

  const api = provider === 'animepahe' ? animepahe : animesalt;

  try {
    if (q) {
      const data = await api.search(q);
      return NextResponse.json(data);
    }
    if (url && stream) {
      const data = await api.stream(url);
      return NextResponse.json(data);
    }
    if (url) {
      const data = await api.details(url);
      return NextResponse.json(data);
    }
    const data = await api.latest();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
