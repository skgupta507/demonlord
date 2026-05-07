/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import { kmmovies } from '@/lib/screenscape';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q');
  const url = searchParams.get('url');
  const magic = searchParams.get('magic');

  try {
    if (q) {
      const data = await kmmovies.search(q);
      return NextResponse.json(data);
    }
    if (url && magic) {
      const data = await kmmovies.magiclinks(url);
      return NextResponse.json(data);
    }
    if (url) {
      const data = await kmmovies.details(url);
      return NextResponse.json(data);
    }
    const data = await kmmovies.latest();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
