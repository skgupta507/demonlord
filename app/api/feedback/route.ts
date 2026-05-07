/* eslint-disable prettier/prettier */
// Feedback endpoint stub — drizzle/neon removed, Firebase used instead.
import { NextResponse } from 'next/server';
export async function POST() {
  return NextResponse.json({ success: false, message: 'Feedback disabled' }, { status: 503 });
}
