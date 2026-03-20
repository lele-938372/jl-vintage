import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('jlv_token')?.value;
  if (!token) return NextResponse.json({ user: null });
  const payload = verifyToken(token);
  if (!payload) return NextResponse.json({ user: null });
  return NextResponse.json({ user: { id: payload.userId, email: payload.email, name: payload.name, isAdmin: payload.isAdmin } });
}
export async function DELETE() {
  const res = NextResponse.json({ success: true });
  res.cookies.delete('jlv_token');
  return res;
}
