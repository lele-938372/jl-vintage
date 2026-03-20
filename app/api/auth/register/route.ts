import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { hashPassword, generateVerificationCode } from '@/lib/auth';
import { getUserByEmail, saveUser } from '@/lib/kv';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();
    if (!email || !password || !name)
      return NextResponse.json({ error: 'Alle Felder ausfuellen.' }, { status: 400 });
    const existing = await getUserByEmail(email);
    if (existing)
      return NextResponse.json({ error: 'E-Mail bereits registriert.' }, { status: 400 });
    const passwordHash = await hashPassword(password);
    const code = generateVerificationCode();
    const user = {
      id: uuidv4(), email: email.toLowerCase(), passwordHash, name,
      verified: false, verificationCode: code,
      verificationExpiry: Date.now() + 15 * 60 * 1000,
      createdAt: new Date().toISOString(),
    };
    await saveUser(user);
    const emailResult = await sendVerificationEmail(email, name, code);
    return NextResponse.json({ success: true, userId: user.id, devCode: (emailResult as any).dev ? code : undefined });
  } catch (e) {
    return NextResponse.json({ error: 'Serverfehler.' }, { status: 500 });
  }
}
