'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/components/CartProvider';
import type { Product } from '@/lib/types';

const CATEGORIES = ['Alle', 'Tops', 'Bottoms', 'Outerwear'];
const SORTS = ['Neueste', 'Preis aufsteigend', 'Preis absteigend', 'Sale'];

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [cat, setCat] = useState('Alle');
  const [sort, setSort] = useState('Neueste');
  const [search, setSearch] = useState('');
  const { add } = useCart();
  const params = useSearchParams();

  useEffect(() => {
    const c = params.get('category');
    const f = params.get('filter');
    if (c) setCat(c);
    if (f === 'sale') setSort('Sale');
  }, [params]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then((d: Product[]) => {
      setProducts(d);
      setLoading(false);
    });
  }, []);

  let filtered = products.filter(p => {
    if (cat !== 'Alle' && p.category !== cat) return false;
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.tags.some(t => t.includes(search.toLowerCase()))) return false;
    if (sort === 'Sale' && !(p.originalPrice && p.originalPrice > p.price)) return false;
    return true;
  });

  if (sort === 'Preis aufsteigend') filtered = [...filtered].sort((a, b) => a.price - b.price);
  else if (sort === 'Preis absteigend') filtered = [...filtered].sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen pt-24">
      {/* Header */}
      <div className="bg-[#1C1812] py-20 px-8 text-center">
        <p className="font-sans text-[10px] tracking-[4px] uppercase text-[#8B6914] mb-3 animate-fade-up">Kollektion</p>
        <h1 className="font-display text-6xl md:text-7xl font-black text-white italic animate-fade-up stagger-2">The Archive</h1>
        <p className="font-body text-[#E8DFC8]/60 italic mt-4 animate-fade-up stagger-3">Handverlesen. Jedes Stuck einmalig.</p>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-12">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mb-12 items-start md:items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCat(c)} className={`tag transition-all duration-200 ${cat === c ? 'bg-[#1C1812] text-[#F7F3EC] border-[#1C1812]' : 'text-[#6B6560] border-[#E8DFC8] hover:border-[#1C1812] hover:text-[#1C1812]'}`}>{c}</button>
            ))}
          </div>
          <div className="flex items-center gap-4">
            <input
              type="text"
              placeholder="Suchen..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-vintage w-40 md:w-56 text-sm"
            />
            <select value={sort} onChange={e => setSort(e.target.value)} className="bg-transparent border-b border-[#E8DFC8] font-sans text-[11px] tracking-[1px] uppercase py-2 pr-6 cursor-pointer outline-none text-[#6B6560] focus:text-[#1C1812] focus:border-[#1C1812]">
              {SORTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {/* Count */}
        <p className="font-sans text-[11px] tracking-[2px] uppercase text-[#6B6560] mb-8">{filtered.length} Artikel</p>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array(8).fill(0).map((_, i) => (
              <div key={i}>
                <div className="skeleton h-80 w-full" />
                <div className="skeleton h-4 w-3/4 mt-4" />
                <div className="skeleton h-4 w-1/2 mt-2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-display text-2xl italic text-[#6B6560]">Keine Artikel gefunden.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filtered.map((p, i) => (
              <ProductCard key={p.id} product={p} delay={i * 80} onAdd={() => add(p)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product, delay, onAdd }: { product: Product; delay: number; onAdd: () => void }) {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), delay); return () => clearTimeout(t); }, [delay]);
  const hasSale = product.originalPrice && product.originalPrice > product.price;
  const pct = hasSale ? Math.round((1 - product.price / (product.originalPrice || 1)) * 100) : 0;

  return (
    <div className={`product-card transition-all ${vis ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'} duration-500`}>
      <div className="relative overflow-hidden bg-[#E8DFC8] h-80 group">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute top-3 left-3 flex gap-2">
          {hasSale && <span className="sale-badge">-{pct}%</span>}
          {product.stock <= 2 && product.stock > 0 && <span className="bg-[#1C1812] text-[#F7F3EC] font-sans text-[9px] tracking-wider uppercase px-2 py-1">Nur {product.stock} left</span>}
          {product.stock === 0 && <span className="bg-[#6B6560] text-white font-sans text-[9px] tracking-wider uppercase px-2 py-1">Ausverkauft</span>}
        </div>
        <div className="product-overlay absolute inset-0 bg-[#1C1812]/30 flex items-end p-4">
          <button onClick={onAdd} disabled={product.stock === 0} className="btn-primary w-full text-xs py-3 disabled:opacity-50 disabled:cursor-not-allowed">
            {product.stock === 0 ? 'Ausverkauft' : 'In den Warenkorb'}
          </button>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <p className="font-sans text-[10px] tracking-[2px] uppercase text-[#6B6560]">{product.category}</p>
        <h3 className="font-display text-base font-semibold leading-snug">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className={`font-display font-bold ${hasSale ? 'text-[#C4501A]' : ''}`}>{product.price.toFixed(2)} EUR</span>
          {hasSale && <span className="font-sans text-xs text-[#6B6560] line-through">{product.originalPrice?.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}
