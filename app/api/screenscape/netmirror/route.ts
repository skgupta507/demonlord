/* eslint-disable prettier/prettier */
import { NextRequest, NextResponse } from 'next/server';
import { netmirror } from '@/lib/screenscape';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get('q');
  const id = searchParams.get('id');
  const stream = searchParams.get('stream');

  try {
    if (q) {
      const data = await netmirror.search(q);
      return NextResponse.json(data);
    }
    if (id && stream) {
      const data = await netmirror.stream(id);
      return NextResponse.json(data);
    }
    if (id) {
      const data = await netmirror.getpost(id);
      return NextResponse.json(data);
    }
    const data = await netmirror.latest();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
