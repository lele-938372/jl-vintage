import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getAllProducts, saveProduct, deleteProduct, getProduct, seedIfEmpty } from '@/lib/kv';
import { verifyToken } from '@/lib/auth';

function requireAdmin(req: NextRequest) {
  const token = req.cookies.get('jlv_token')?.value;
  if (!token) return false;
  const payload = verifyToken(token);
  return payload?.isAdmin === true;
}

export async function GET() {
  await seedIfEmpty();
  const products = await getAllProducts();
  return NextResponse.json(products);
}

export async function POST(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  const body = await req.json();
  const product = { ...body, id: body.id || uuidv4(), createdAt: body.createdAt || new Date().toISOString() };
  await saveProduct(product);
  return NextResponse.json(product);
}

export async function PUT(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  const body = await req.json();
  await saveProduct(body);
  return NextResponse.json(body);
}

export async function DELETE(req: NextRequest) {
  if (!requireAdmin(req)) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  const { id } = await req.json();
  await deleteProduct(id);
  return NextResponse.json({ success: true });
}
