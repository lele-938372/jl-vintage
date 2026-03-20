'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/components/CartProvider';
import { useAuth } from '@/components/AuthProvider';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { items, total, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', street: '', city: '', zip: '', country: 'DE' });
  const [discount, setDiscount] = useState('');
  const [discountData, setDiscountData] = useState<{ discount: number; type: string } | null>(null);
  const [discountError, setDiscountError] = useState('');
  const [step, setStep] = useState<'form' | 'payment' | 'success'>('form');

  useEffect(() => {
    if (user) setForm(f => ({ ...f, name: user.name, email: user.email }));
  }, [user]);

  const finalTotal = discountData
    ? discountData.type === 'percent'
      ? total * (1 - discountData.discount / 100)
      : Math.max(0, total - discountData.discount)
    : total;

  const applyDiscount = async () => {
    setDiscountError('');
    if (!discount.trim()) return;
    const r = await fetch('/api/discounts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: discount.trim(), validate: true }),
    });
    const d = await r.json();
    if (!r.ok) { setDiscountError(d.error); setDiscountData(null); }
    else setDiscountData(d);
  };

  const handleOrder = async (paypalOrderId?: string) => {
    const order = {
      userEmail: form.email,
      userName: form.name,
      items: items.map(i => ({ productId: i.product.id, name: i.product.name, price: i.product.price, quantity: i.quantity, image: i.product.images[0] })),
      subtotal: total,
      discount: total - finalTotal,
      total: finalTotal,
      discountCode: discountData ? discount.toUpperCase() : undefined,
      paypalOrderId,
      shippingAddress: { name: form.name, street: form.street, city: form.city, zip: form.zip, country: form.country },
    };
    await fetch('/api/orders', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(order) });
    clear();
    setStep('success');
  };

  if (items.length === 0 && step !== 'success') {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6">
        <p className="font-display text-2xl italic text-[#6B6560]">Dein Warenkorb ist leer.</p>
        <a href="/shop" className="btn-primary">Zum Shop</a>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen pt-32 flex flex-col items-center justify-center gap-6 px-8 text-center animate-fade-up">
        <div className="w-16 h-16 bg-[#1C1812] rounded-full flex items-center justify-center mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 className="font-display text-5xl font-bold italic">Bestellung bestatigt.</h1>
        <p className="font-body text-lg text-[#6B6560]">Vielen Dank! Deine Bestellung ist bei uns eingegangen.</p>
        <a href="/shop" className="btn-outline mt-4">Weiter shoppen</a>
      </div>
    );
  }

  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-8">
        <div className="mb-12">
          <p className="font-sans text-[10px] tracking-[4px] uppercase text-[#8B6914] mb-2">Sicher bezahlen</p>
          <h1 className="font-display text-5xl font-bold italic">Checkout</h1>
        </div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left: Form + Payment */}
          <div>
            {step === 'form' && (
              <div className="space-y-8 animate-fade-up">
                <Section title="Kontakt">
                  <Input label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
                  <Input label="E-Mail" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
                </Section>
                <Section title="Lieferadresse">
                  <Input label="Strase" value={form.street} onChange={v => setForm({ ...form, street: v })} />
                  <div className="grid grid-cols-2 gap-4">
                    <Input label="PLZ" value={form.zip} onChange={v => setForm({ ...form, zip: v })} />
                    <Input label="Stadt" value={form.city} onChange={v => setForm({ ...form, city: v })} />
                  </div>
                  <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })} className="input-vintage">
                    <option value="DE">Deutschland</option>
                    <option value="AT">Osterreich</option>
                    <option value="CH">Schweiz</option>
                  </select>
                </Section>
                {/* Discount */}
                <Section title="Rabattcode">
                  <div className="flex gap-3">
                    <input value={discount} onChange={e => setDiscount(e.target.value)} placeholder="Code eingeben..." className="input-vintage flex-1" />
                    <button onClick={applyDiscount} className="btn-outline !py-2 !px-4">Anwenden</button>
                  </div>
                  {discountError && <p className="font-sans text-xs text-[#C4501A] mt-2">{discountError}</p>}
                  {discountData && <p className="font-sans text-xs text-green-700 mt-2">Rabatt angewendet: {discountData.type === 'percent' ? `-${discountData.discount}%` : `-${discountData.discount} EUR`}</p>}
                </Section>
                <button
                  onClick={() => { if (form.name && form.email && form.street && form.city && form.zip) setStep('payment'); }}
                  className="btn-primary w-full"
                >
                  Weiter zur Zahlung
                </button>
              </div>
            )}

            {step === 'payment' && (
              <div className="space-y-6 animate-fade-up">
                <button onClick={() => setStep('form')} className="font-sans text-[11px] tracking-[2px] uppercase text-[#6B6560] hover:text-[#1C1812] flex items-center gap-2 mb-4 transition-colors">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
                  Zurück
                </button>
                <Section title="Zahlung via PayPal">
                  <p className="font-body text-sm text-[#6B6560] mb-4">Du wirst sicher uber PayPal abgerechnet.</p>
                  <PayPalScriptProvider options={{ clientId, currency: 'EUR' }}>
                    <PayPalButtons
                      style={{ layout: 'vertical', color: 'black', shape: 'rect', label: 'pay' }}
                      createOrder={(_data, actions) => actions.order.create({
                        intent: 'CAPTURE',
                        purchase_units: [{ amount: { value: finalTotal.toFixed(2), currency_code: 'EUR' } }],
                      })}
                      onApprove={async (data, actions) => {
                        if (actions.order) {
                          const details = await actions.order.capture();
                          await handleOrder(details.id);
                        }
                      }}
                      onError={() => alert('PayPal Fehler. Bitte versuche es erneut.')}
                    />
                  </PayPalScriptProvider>
                </Section>
              </div>
            )}
          </div>

          {/* Right: Order summary */}
          <div className="bg-[#F7F3EC] border border-[#E8DFC8] p-8 h-fit">
            <h3 className="font-display text-xl font-bold mb-6">Bestellübersicht</h3>
            <div className="space-y-4 mb-6">
              {items.map(item => (
                <div key={item.product.id} className="flex gap-4">
                  <div className="w-16 h-20 overflow-hidden bg-[#E8DFC8] flex-shrink-0">
                    <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display text-sm font-semibold">{item.product.name}</p>
                    <p className="font-sans text-[11px] text-[#6B6560] tracking-wide">Menge: {item.quantity}</p>
                    <p className="font-display text-sm font-bold mt-1">{(item.product.price * item.quantity).toFixed(2)} EUR</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-[#E8DFC8] pt-4 space-y-2">
              <div className="flex justify-between font-body text-sm text-[#6B6560]">
                <span>Zwischensumme</span><span>{total.toFixed(2)} EUR</span>
              </div>
              {discountData && (
                <div className="flex justify-between font-body text-sm text-green-700">
                  <span>Rabatt ({discount.toUpperCase()})</span>
                  <span>-{(total - finalTotal).toFixed(2)} EUR</span>
                </div>
              )}
              <div className="flex justify-between font-body text-sm text-[#6B6560]">
                <span>Versand</span><span>Kostenlos</span>
              </div>
              <div className="flex justify-between font-display text-lg font-bold pt-2 border-t border-[#E8DFC8]">
                <span>Gesamt</span><span>{finalTotal.toFixed(2)} EUR</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="font-sans text-[11px] tracking-[3px] uppercase text-[#8B6914] mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Input({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div className="relative">
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={label} className="input-vintage peer" required />
    </div>
  );
}
