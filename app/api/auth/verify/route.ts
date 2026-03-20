import { NextRequest, NextResponse } from 'next/server';
import { getUserById, saveUser } from '@/lib/kv';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { userId, code } = await req.json();
    const user = await getUserById(userId);
    if (!user) return NextResponse.json({ error: 'Benutzer nicht gefunden.' }, { status: 404 });
    if (user.verified) return NextResponse.json({ error: 'Bereits verifiziert.' }, { status: 400 });
    if (user.verificationCode !== code) return NextResponse.json({ error: 'Falscher Code.' }, { status: 400 });
    if (user.verificationExpiry && Date.now() > user.verificationExpiry)
      return NextResponse.json({ error: 'Code abgelaufen.' }, { status: 400 });
    user.verified = true;
    user.verificationCode = undefined;
    user.verificationExpiry = undefined;
    await saveUser(user);
    const token = signToken({ userId: user.id, email: user.email, name: user.name });
    const res = NextResponse.json({ success: true, name: user.name });
    res.cookies.set('jlv_token', token, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 604800 });
    return res;
  } catch (e) {
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 });
  }
}
