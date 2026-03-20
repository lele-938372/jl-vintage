import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { saveOrder, getAllOrders, getOrder } from '@/lib/kv';
import { verifyToken } from '@/lib/auth';

function getUser(req: NextRequest) {
  const token = req.cookies.get('jlv_token')?.value;
  if (!token) return null;
  return verifyToken(token);
}

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'Nicht angemeldet.' }, { status: 401 });
  const orders = await getAllOrders();
  if (user.isAdmin) return NextResponse.json(orders);
  return NextResponse.json(orders.filter((o: any) => o.userId === user.userId));
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const user = getUser(req);
  const order = {
    ...body,
    id: uuidv4(),
    userId: user?.userId,
    status: 'paid',
    createdAt: new Date().toISOString(),
  };
  await saveOrder(order);
  return NextResponse.json(order);
}

export async function PUT(req: NextRequest) {
  const user = getUser(req);
  if (!user?.isAdmin) return NextResponse.json({ error: 'Kein Zugriff.' }, { status: 403 });
  const body = await req.json();
  const existing = await getOrder(body.id);
  if (!existing) return NextResponse.json({ error: 'Bestellung nicht gefunden.' }, { status: 404 });
  const updated = { ...existing, ...body };
  await saveOrder(updated);
  return NextResponse.json(updated);
}
