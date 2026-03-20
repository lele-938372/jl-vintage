import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail } from '@/lib/kv';
import { verifyPassword, signToken, isAdminCredentials, ADMIN_EMAIL } from '@/lib/auth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (isAdminCredentials(email, password)) {
      const token = signToken({ userId: 'admin', email: ADMIN_EMAIL, name: 'Admin', isAdmin: true });
      const res = NextResponse.json({ success: true, name: 'Admin', isAdmin: true });
      res.cookies.set('jlv_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800 });
      return res;
    }
    const user = await getUserByEmail(email);
    if (!user) return NextResponse.json({ error: 'E-Mail oder Passwort falsch.' }, { status: 401 });
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return NextResponse.json({ error: 'E-Mail oder Passwort falsch.' }, { status: 401 });
    if (!user.verified)
      return NextResponse.json({ error: 'Bitte zuerst E-Mail bestaetigen.', needsVerification: true, userId: user.id }, { status: 403 });
    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    const res = NextResponse.json({ success: true, name: user.name });
    res.cookies.set('jlv_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 });
  }
}
