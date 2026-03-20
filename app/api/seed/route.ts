import { NextResponse } from 'next/server';
import { seedIfEmpty } from '@/lib/kv';
export async function GET() {
  await seedIfEmpty();
  return NextResponse.json({ ok: true });
}
