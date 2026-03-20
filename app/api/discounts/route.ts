import { NextRequest, NextResponse } from 'next/server';
import { getAllDiscounts, getDiscount, saveDiscount, deleteDiscount } from '@/lib/kv';
import { verifyToken } from '@/lib/auth';

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('jlv_token')?.value;
  if (!token) return false;
  const p = verifyToken(token);
  return p?.isAdmin === true;
}

export async function GET(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  return NextResponse.json(await getAllDiscounts());
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { code } = body;
  // Validate discount (public endpoint for checking)
  if (body.validate) {
    const discount = await getDiscount(code);
    if (!discount || !discount.active) return NextResponse.json({ error: 'Ungültiger Code.' }, { status: 400 });
    if (discount.maxUsage && discount.usageCount >= discount.maxUsage)
      return NextResponse.json({ error: 'Code bereits aufgebraucht.' }, { status: 400 });
    return NextResponse.json({ discount: discount.discount, type: discount.type });
  }
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  const newDiscount = { ...body, code: code.toUpperCase(), usageCount: 0, createdAt: new Date().toISOString() };
  await saveDiscount(newDiscount);
  return NextResponse.json(newDiscount);
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  const { code } = await req.json();
  await deleteDiscount(code);
  return NextResponse.json({ success: true });
}
