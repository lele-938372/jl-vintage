'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import type { Order } from '@/lib/types';

export default function AccountPage() {
  const { user, loading, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user && !user.isAdmin) {
      fetch('/api/orders').then(r => r.json()).then(setOrders).catch(() => {});
    }
  }, [user]);

  if (loading || !user) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#8B6914] border-t-transparent rounded-full animate-spin" /></div>;

  const STATUS_LABELS: Record<string, string> = {
    pending: 'Ausstehend', paid: 'Bezahlt', shipped: 'Versendet', delivered: 'Zugestellt', cancelled: 'Storniert',
  };
  const STATUS_COLORS: Record<string, string> = {
    pending: 'text-[#8B6914]', paid: 'text-green-700', shipped: 'text-blue-600', delivered: 'text-green-800', cancelled: 'text-[#C4501A]',
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="font-sans text-[10px] tracking-[4px] uppercase text-[#8B6914] mb-2">Mein Konto</p>
            <h1 className="font-display text-5xl font-bold italic">{user.name}</h1>
            <p className="font-body text-[#6B6560] mt-1">{user.email}</p>
          </div>
          <button onClick={logout} className="btn-outline !py-2 !px-5 text-sm">Abmelden</button>
        </div>

        {/* Orders */}
        <div>
          <div className="divider-vintage mb-8"><span className="font-display italic">Meine Bestellungen</span></div>
          {orders.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-display text-xl italic text-[#6B6560]">Noch keine Bestellungen.</p>
              <a href="/shop" className="btn-primary inline-block mt-6">Zum Shop</a>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-[#E8DFC8] p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-sans text-[10px] tracking-[2px] uppercase text-[#6B6560]">Bestellung #{order.id.slice(0, 8).toUpperCase()}</p>
                      <p className="font-sans text-xs text-[#6B6560] mt-1">{new Date(order.createdAt).toLocaleDateString('de-DE')}</p>
                    </div>
                    <span className={`font-sans text-[11px] tracking-[1px] uppercase ${STATUS_COLORS[order.status]}`}>{STATUS_LABELS[order.status]}</span>
                  </div>
                  <div className="flex gap-3 mb-4 overflow-x-auto">
                    {order.items.map(item => (
                      <div key={item.productId} className="flex-shrink-0 w-16 h-20 overflow-hidden bg-[#E8DFC8]">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center border-t border-[#E8DFC8] pt-4">
                    <p className="font-body text-sm text-[#6B6560]">{order.items.reduce((s, i) => s + i.quantity, 0)} Artikel</p>
                    <p className="font-display font-bold">{order.total.toFixed(2)} EUR</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
