import { NextRequest, NextResponse } from 'next/server';
import { kvSMembers, kvGet } from '@/lib/kv';
import { verifyToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('jlv_token')?.value;
  if (!token) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  const payload = verifyToken(token);
  if (!payload?.isAdmin) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  const ids = await kvSMembers('users:all');
  const users = await Promise.all(ids.map(id => kvGet(`user:${id}`)));
  const clean = (users.filter(Boolean) as any[]).map(u => ({
    id: u.id,
    name: u.name,
    email: u.email,
    verified: u.verified,
    createdAt: u.createdAt,
  }));
  return NextResponse.json(clean);
}
