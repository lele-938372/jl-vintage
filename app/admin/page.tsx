'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { useRouter } from 'next/navigation';
import type { Product, Order, DiscountCode } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

type Tab = 'products' | 'orders' | 'discounts';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('products');

  useEffect(() => {
    if (!loading && (!user || !user.isAdmin)) router.push('/auth/login');
  }, [user, loading, router]);

  if (loading || !user?.isAdmin) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#8B6914] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#F7F3EC]">
      <div className="max-w-7xl mx-auto px-8">
        <div className="mb-10">
          <p className="font-sans text-[10px] tracking-[4px] uppercase text-[#8B6914] mb-2">Backend</p>
          <h1 className="font-display text-5xl font-bold italic">Admin-Bereich</h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-10 border-b border-[#E8DFC8]">
          {(['products', 'orders', 'discounts'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={`font-sans text-[11px] tracking-[2px] uppercase px-6 py-4 transition-all border-b-2 -mb-px ${tab === t ? 'border-[#8B6914] text-[#8B6914]' : 'border-transparent text-[#6B6560] hover:text-[#1C1812]'}`}>
              {t === 'products' ? 'Produkte' : t === 'orders' ? 'Bestellungen' : 'Rabattcodes'}
            </button>
          ))}
        </div>

        {tab === 'products' && <ProductsTab />}
        {tab === 'orders' && <OrdersTab />}
        {tab === 'discounts' && <DiscountsTab />}
      </div>
    </div>
  );
}

function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);
  const empty: Omit<Product, 'id' | 'createdAt'> = { name: '', price: 0, originalPrice: undefined, category: 'Tops', images: [''], description: '', stock: 1, tags: [], featured: false };
  const [form, setForm] = useState<any>(empty);

  const load = () => fetch('/api/products').then(r => r.json()).then(setProducts);
  useEffect(() => { load(); }, []);

  const save = async () => {
    const method = editing ? 'PUT' : 'POST';
    const body = editing ? { ...form, id: editing.id, createdAt: editing.createdAt } : { ...form, id: uuidv4(), createdAt: new Date().toISOString() };
    await fetch('/api/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    setShowForm(false); setEditing(null); setForm(empty); load();
  };

  const del = async (id: string) => {
    if (!confirm('Produkt wirklich loschen?')) return;
    await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    load();
  };

  const startEdit = (p: Product) => { setEditing(p); setForm({ ...p, tags: p.tags.join(', '), images: p.images }); setShowForm(true); };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="font-sans text-sm text-[#6B6560]">{products.length} Produkte</p>
        <button onClick={() => { setEditing(null); setForm(empty); setShowForm(true); }} className="btn-primary !py-2">+ Hinzufugen</button>
      </div>

      {showForm && (
        <div className="bg-white border border-[#E8DFC8] p-8 mb-8 animate-fade-up">
          <h3 className="font-display text-xl font-bold mb-6">{editing ? 'Bearbeiten' : 'Neues Produkt'}</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Field label="Name"><input className="input-vintage" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></Field>
            <Field label="Kategorie">
              <select className="input-vintage" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                {['Tops', 'Bottoms', 'Outerwear', 'Accessories'].map(c => <option key={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Preis (EUR)"><input type="number" step="0.01" className="input-vintage" value={form.price} onChange={e => setForm({ ...form, price: parseFloat(e.target.value) })} /></Field>
            <Field label="Originalpreis (optional)"><input type="number" step="0.01" className="input-vintage" value={form.originalPrice || ''} onChange={e => setForm({ ...form, originalPrice: e.target.value ? parseFloat(e.target.value) : undefined })} /></Field>
            <Field label="Bestand"><input type="number" className="input-vintage" value={form.stock} onChange={e => setForm({ ...form, stock: parseInt(e.target.value) })} /></Field>
            <Field label="Tags (kommagetrennt)"><input className="input-vintage" value={typeof form.tags === 'string' ? form.tags : form.tags.join(', ')} onChange={e => setForm({ ...form, tags: e.target.value })} /></Field>
            <Field label="Bild-URL"><input className="input-vintage" value={form.images[0]} onChange={e => setForm({ ...form, images: [e.target.value] })} /></Field>
            <Field label="Featured">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={!!form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 accent-[#8B6914]" />
                <span className="font-body text-sm">Als Featured markieren</span>
              </label>
            </Field>
          </div>
          <Field label="Beschreibung">
            <textarea className="input-vintage resize-none h-24" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          </Field>
          <div className="flex gap-3 mt-6">
            <button onClick={save} className="btn-primary">Speichern</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="btn-outline">Abbrechen</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white border border-[#E8DFC8] overflow-hidden">
            <div className="h-48 overflow-hidden"><img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" /></div>
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-sans text-[9px] tracking-widest uppercase text-[#6B6560]">{p.category}</p>
                  <h4 className="font-display font-semibold">{p.name}</h4>
                  <p className="font-display font-bold mt-1">{p.price.toFixed(2)} EUR {p.originalPrice && <span className="font-sans text-xs text-[#6B6560] line-through">{p.originalPrice.toFixed(2)}</span>}</p>
                  <p className="font-sans text-[11px] text-[#6B6560] mt-1">Bestand: {p.stock} {p.featured && <span className="text-[#8B6914] ml-2">Featured</span>}</p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={() => startEdit(p)} className="btn-outline !py-1.5 !px-4 flex-1 text-xs">Bearbeiten</button>
                <button onClick={() => del(p.id)} className="font-sans text-[11px] tracking-wider uppercase px-4 py-1.5 border border-[#C4501A] text-[#C4501A] hover:bg-[#C4501A] hover:text-white transition-colors">Loschen</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { fetch('/api/orders').then(r => r.json()).then(setOrders); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch('/api/orders', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) });
    setOrders(o => o.map(ord => ord.id === id ? { ...ord, status: status as any } : ord));
  };

  const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];
  const STATUS_DE: Record<string, string> = { pending: 'Ausstehend', paid: 'Bezahlt', shipped: 'Versendet', delivered: 'Zugestellt', cancelled: 'Storniert' };

  return (
    <div>
      <p className="font-sans text-sm text-[#6B6560] mb-6">{orders.length} Bestellungen gesamt — Umsatz: {orders.filter(o => o.status === 'paid' || o.status === 'shipped' || o.status === 'delivered').reduce((s, o) => s + o.total, 0).toFixed(2)} EUR</p>
      {orders.length === 0 ? <p className="font-display text-xl italic text-[#6B6560] text-center py-16">Keine Bestellungen vorhanden.</p> : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="bg-white border border-[#E8DFC8] p-6">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-sans text-[10px] tracking-[2px] uppercase text-[#6B6560]">#{order.id.slice(0, 8).toUpperCase()}</p>
                  <p className="font-display font-semibold">{order.userName} — {order.userEmail}</p>
                  <p className="font-sans text-xs text-[#6B6560] mt-1">{new Date(order.createdAt).toLocaleString('de-DE')}</p>
                </div>
                <div className="text-right">
                  <p className="font-display font-bold text-lg">{order.total.toFixed(2)} EUR</p>
                  <select value={order.status} onChange={e => updateStatus(order.id, e.target.value)} className="mt-1 bg-transparent border border-[#E8DFC8] font-sans text-[11px] tracking-wide uppercase py-1 px-2 cursor-pointer outline-none">
                    {STATUSES.map(s => <option key={s} value={s}>{STATUS_DE[s]}</option>)}
                  </select>
                </div>
              </div>
              <div className="border-t border-[#E8DFC8] pt-4 space-y-1">
                {order.items.map(item => (
                  <p key={item.productId} className="font-body text-sm text-[#6B6560]">{item.quantity}x {item.name} — {(item.price * item.quantity).toFixed(2)} EUR</p>
                ))}
                <p className="font-sans text-xs text-[#6B6560] pt-2">{order.shippingAddress.street}, {order.shippingAddress.zip} {order.shippingAddress.city}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DiscountsTab() {
  const [discounts, setDiscounts] = useState<DiscountCode[]>([]);
  const [form, setForm] = useState({ code: '', discount: 10, type: 'percent', active: true, maxUsage: '' });
  const load = () => fetch('/api/discounts').then(r => r.json()).then(setDiscounts).catch(() => {});
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.code) return;
    await fetch('/api/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, maxUsage: form.maxUsage ? parseInt(form.maxUsage) : undefined }),
    });
    setForm({ code: '', discount: 10, type: 'percent', active: true, maxUsage: '' });
    load();
  };

  const del = async (code: string) => {
    if (!confirm(`Code "${code}" loschen?`)) return;
    await fetch('/api/discounts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
    load();
  };

  return (
    <div>
      {/* Create form */}
      <div className="bg-white border border-[#E8DFC8] p-8 mb-8">
        <h3 className="font-display text-xl font-bold mb-6">Neuer Rabattcode</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <Field label="Code"><input className="input-vintage uppercase" value={form.code} onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="SOMMER20" /></Field>
          <Field label="Rabatt">
            <div className="flex gap-2">
              <input type="number" className="input-vintage flex-1" value={form.discount} onChange={e => setForm({ ...form, discount: parseFloat(e.target.value) })} />
              <select className="input-vintage w-24" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
                <option value="percent">%</option>
                <option value="fixed">EUR</option>
              </select>
            </div>
          </Field>
          <Field label="Max. Nutzungen (leer = unbegrenzt)"><input type="number" className="input-vintage" value={form.maxUsage} onChange={e => setForm({ ...form, maxUsage: e.target.value })} /></Field>
          <Field label="Aktiv">
            <label className="flex items-center gap-2 cursor-pointer mt-3">
              <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} className="w-4 h-4 accent-[#8B6914]" />
              <span className="font-body text-sm">Aktiviert</span>
            </label>
          </Field>
        </div>
        <button onClick={save} className="btn-primary mt-6">Code erstellen</button>
      </div>

      {/* List */}
      {discounts.length === 0 ? <p className="font-display text-xl italic text-[#6B6560] text-center py-12">Keine Codes vorhanden.</p> : (
        <div className="space-y-3">
          {discounts.map(d => (
            <div key={d.code} className="bg-white border border-[#E8DFC8] px-6 py-4 flex items-center justify-between">
              <div>
                <span className="font-sans text-sm font-bold tracking-[2px] text-[#1C1812]">{d.code}</span>
                <span className="ml-4 font-body text-sm text-[#6B6560]">{d.discount}{d.type === 'percent' ? '%' : ' EUR'} Rabatt</span>
                <span className="ml-3 font-body text-xs text-[#6B6560]">Genutzt: {d.usageCount}{d.maxUsage ? `/${d.maxUsage}` : ''}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`font-sans text-[10px] tracking-wider uppercase ${d.active ? 'text-green-600' : 'text-[#6B6560]'}`}>{d.active ? 'Aktiv' : 'Inaktiv'}</span>
                <button onClick={() => del(d.code)} className="font-sans text-[11px] uppercase tracking-wide text-[#C4501A] hover:underline">Loschen</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-sans text-[10px] tracking-[3px] uppercase text-[#6B6560] block mb-2">{label}</label>
      {children}
    </div>
  );
}
