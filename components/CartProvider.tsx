'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { CartItem, Product } from '@/lib/types';

interface CartCtx {
  items: CartItem[];
  add: (product: Product, qty?: number) => void;
  remove: (id: string) => void;
  update: (id: string, qty: number) => void;
  clear: () => void;
  total: number;
  count: number;
  open: boolean;
  setOpen: (v: boolean) => void;
}
const Ctx = createContext<CartCtx>({} as CartCtx);

export default function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try { const s = localStorage.getItem('jlv_cart'); if (s) setItems(JSON.parse(s)); } catch {}
  }, []);
  useEffect(() => {
    localStorage.setItem('jlv_cart', JSON.stringify(items));
  }, [items]);

  const add = (product: Product, qty = 1) => {
    setItems(prev => {
      const ex = prev.find(i => i.product.id === product.id);
      if (ex) return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      return [...prev, { product, quantity: qty }];
    });
    setOpen(true);
  };
  const remove = (id: string) => setItems(p => p.filter(i => i.product.id !== id));
  const update = (id: string, qty: number) => {
    if (qty <= 0) return remove(id);
    setItems(p => p.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0);
  const count = items.reduce((s, i) => s + i.quantity, 0);
  return <Ctx.Provider value={{ items, add, remove, update, clear, total, count, open, setOpen }}>{children}</Ctx.Provider>;
}
export const useCart = () => useContext(Ctx);
