/* eslint-disable prettier/prettier */
// Auth is handled by Firebase client-side.
// This stub prevents build errors from stale better-auth routes in git history.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Auth handled by Firebase' }, { status: 200 });
}
export async function POST() {
  return NextResponse.json({ message: 'Auth handled by Firebase' }, { status: 200 });
}
