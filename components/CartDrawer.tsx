'use client';
import { useCart } from './CartProvider';
import Link from 'next/link';
import Image from 'next/image';

export default function CartDrawer() {
  const { items, remove, update, total, open, setOpen } = useCart();

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-[#1C1812]/40 z-[60] transition-opacity duration-300 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-[400px] bg-[#F7F3EC] z-[70] flex flex-col transition-transform duration-500 ease-in-out ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#E8DFC8]">
          <div>
            <h2 className="font-display text-xl font-bold">Warenkorb</h2>
            <p className="font-sans text-[11px] tracking-[2px] uppercase text-[#6B6560] mt-0.5">{items.length} Artikel</p>
          </div>
          <button onClick={() => setOpen(false)} className="text-[#6B6560] hover:text-[#1C1812] transition-colors">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E8DFC8" strokeWidth="1"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              <p className="font-display text-lg italic text-[#6B6560]">Dein Warenkorb ist leer.</p>
              <button onClick={() => setOpen(false)} className="btn-outline text-sm">Weiter einkaufen</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.product.id} className="flex gap-4 pb-6 border-b border-[#E8DFC8] last:border-0">
                <div className="relative w-20 h-24 flex-shrink-0 overflow-hidden bg-[#E8DFC8]">
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-display text-sm font-semibold leading-tight">{item.product.name}</h4>
                  <p className="font-sans text-[11px] tracking-widest uppercase text-[#6B6560] mt-1">{item.product.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-[#E8DFC8]">
                      <button onClick={() => update(item.product.id, item.quantity - 1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#E8DFC8] transition-colors font-sans text-sm">-</button>
                      <span className="font-sans text-sm w-6 text-center">{item.quantity}</span>
                      <button onClick={() => update(item.product.id, item.quantity + 1)} className="w-7 h-7 flex items-center justify-center hover:bg-[#E8DFC8] transition-colors font-sans text-sm">+</button>
                    </div>
                    <span className="font-display font-semibold">{(item.product.price * item.quantity).toFixed(2)} EUR</span>
                  </div>
                </div>
                <button onClick={() => remove(item.product.id)} className="text-[#6B6560] hover:text-[#C4501A] transition-colors self-start mt-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-[#E8DFC8] space-y-4">
            <div className="flex justify-between items-center">
              <span className="font-sans text-[11px] tracking-[2px] uppercase text-[#6B6560]">Zwischensumme</span>
              <span className="font-display font-bold text-lg">{total.toFixed(2)} EUR</span>
            </div>
            <p className="font-sans text-[11px] text-[#6B6560]">Versand und Rabattcode werden beim Checkout berechnet.</p>
            <Link href="/checkout" onClick={() => setOpen(false)} className="btn-primary w-full block text-center">
              Zur Kasse
            </Link>
            <button onClick={() => setOpen(false)} className="btn-outline w-full">
              Weiter einkaufen
            </button>
          </div>
        )}
      </div>
    </>
  );
}
