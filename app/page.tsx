'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useCart } from '@/components/CartProvider';
import type { Product } from '@/lib/types';

const HERO_SLIDES = [
  {
    title: 'Zeitlos.',
    subtitle: 'Authentic Pieces',
    bg: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=80',
    label: 'New Arrivals',
  },
  {
    title: 'Raritat.',
    subtitle: 'Curated Vintage',
    bg: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600&q=80',
    label: 'Sale Pieces',
  },
  {
    title: 'Charakter.',
    subtitle: 'Every Piece Has a Story',
    bg: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=1600&q=80',
    label: 'Explore All',
  },
];

export default function Home() {
  const [slide, setSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [saleProducts, setSaleProducts] = useState<Product[]>([]);
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { add } = useCart();

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then((data: Product[]) => {
      setProducts(data.filter(p => p.featured).slice(0, 4));
      setSaleProducts(data.filter(p => p.originalPrice && p.originalPrice > p.price));
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setSlide(s => (s + 1) % HERO_SLIDES.length), 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (sectionRef.current) obs.observe(sectionRef.current);
    return () => obs.disconnect();
  }, []);

  const current = HERO_SLIDES[slide];

  return (
    <div className="min-h-screen">
      <section className="relative h-screen overflow-hidden">
        {HERO_SLIDES.map((s, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === slide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={s.bg} alt="" className="w-full h-full object-cover" style={{ transform: i === slide ? 'scale(1)' : 'scale(1.05)', transition: 'transform 8s ease' }} />
            <div className="absolute inset-0 bg-gradient-to-b from-[#1C1812]/20 via-transparent to-[#1C1812]/60" />
          </div>
        ))}
        <div className="relative z-10 h-full flex flex-col justify-end pb-20 px-8 md:px-20 max-w-7xl mx-auto">
          <div key={slide} className="animate-fade-up">
            <p className="font-sans text-[11px] tracking-[4px] uppercase text-[#E8DFC8] mb-4">{current.label}</p>
            <h1 className="font-display text-7xl md:text-9xl font-black text-white leading-none mb-4">{current.title}</h1>
            <p className="font-body text-xl italic text-[#E8DFC8]/80 mb-8">{current.subtitle}</p>
            <div className="flex gap-4">
              <Link href="/shop" className="btn-primary">Shop entdecken</Link>
              <Link href="/about" className="btn-outline !text-white !border-white hover:!bg-white hover:!text-[#1C1812]">Uber Uns</Link>
            </div>
          </div>
          <div className="absolute bottom-8 right-8 flex gap-2">
            {HERO_SLIDES.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} className={`h-px transition-all duration-300 ${i === slide ? 'w-8 bg-white' : 'w-4 bg-white/40'}`} />
            ))}
          </div>
        </div>
      </section>

      <div className="bg-[#1C1812] py-4 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(4).fill(['VINTAGE', 'AUTHENTIC', 'CURATED', 'JL VINTAGE', 'RARE PIECES', 'SINCE 2024']).flat().map((t, i) => (
            <span key={i} className="mx-8 font-sans text-[11px] tracking-[4px] uppercase text-[#8B6914]">{t}</span>
          ))}
        </div>
      </div>

      {saleProducts.length > 0 && (
        <section className="py-20 bg-[#1C1812] overflow-hidden">
          <div className="max-w-7xl mx-auto px-8 mb-10 flex items-center justify-between">
            <div>
              <p className="font-sans text-[10px] tracking-[4px] uppercase text-[#C4501A] mb-2">Aktuell im Rabatt</p>
              <h2 className="font-display text-4xl text-white font-bold italic">Sale Pieces</h2>
            </div>
            <Link href="/shop?filter=sale" className="font-sans text-[11px] tracking-[2px] uppercase text-[#8B6914] hover:text-white transition-colors hidden md:block">Alle ansehen &rarr;</Link>
          </div>
          <div className="flex gap-6 px-8 overflow-x-auto pb-4" style={{ scrollbarWidth: 'none' }}>
            {saleProducts.map((p, i) => (
              <SaleCard key={p.id} product={p} delay={i * 100} onAdd={() => add(p)} />
            ))}
          </div>
        </section>
      )}

      <section ref={sectionRef} className="py-24 max-w-7xl mx-auto px-8">
        <div className="divider-vintage mb-16">
          <span className="font-display italic text-lg">Ausgewahlte Pieces</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((p, i) => (
            <ProductCard key={p.id} product={p} visible={visible} delay={i * 150} onAdd={() => add(p)} />
          ))}
        </div>
        <div className="text-center mt-16">
          <Link href="/shop" className="btn-outline">Gesamte Kollektion</Link>
        </div>
      </section>

      <section className="py-32 bg-[#E8DFC8] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1/2 h-full bg-[url('https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=800')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 max-w-3xl mx-auto text-center px-8">
          <p className="font-sans text-[11px] tracking-[4px] uppercase text-[#8B6914] mb-6">Unsere Mission</p>
          <h2 className="font-display text-5xl md:text-6xl font-bold italic leading-tight mb-8">
            Kleidung mit Geschichte. Stil ohne Kompromisse.
          </h2>
          <p className="font-body text-lg text-[#6B6560] leading-relaxed mb-10">
            Jedes Stuck in unserem Shop wurde handverlesen. Wir glauben an Mode, die Bestand hat.
          </p>
          <Link href="/about" className="btn-primary">Unsere Geschichte</Link>
        </div>
      </section>

      <section className="py-24 max-w-7xl mx-auto px-8">
        <p className="font-sans text-[11px] tracking-[4px] uppercase text-[#8B6914] mb-4 text-center">Kategorien</p>
        <h2 className="font-display text-4xl font-bold text-center mb-16">Nach Stil shoppen</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Tops & Shirts', img: 'https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600', filter: 'Tops' },
            { label: 'Jacken & Outerwear', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600', filter: 'Outerwear' },
            { label: 'Bottoms', img: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600', filter: 'Bottoms' },
          ].map(cat => (
            <Link key={cat.label} href={`/shop?category=${cat.filter}`} className="group relative h-80 overflow-hidden block">
              <img src={cat.img} alt={cat.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-[#1C1812]/40 group-hover:bg-[#1C1812]/60 transition-colors duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl font-bold text-white">{cat.label}</h3>
                <p className="font-sans text-[11px] tracking-[2px] uppercase text-[#E8DFC8]/80 mt-1">Entdecken &rarr;</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <footer className="bg-[#1C1812] text-[#E8DFC8] py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            <div>
              <h3 className="font-display text-3xl font-black tracking-wider mb-4">JL<br/>VINTAGE</h3>
              <p className="font-body text-sm text-[#E8DFC8]/60 italic leading-relaxed">Kuratierte Vintage-Mode von Leandro & Justin.</p>
            </div>
            <div>
              <h4 className="font-sans text-[10px] tracking-[3px] uppercase text-[#8B6914] mb-6">Navigation</h4>
              <ul className="space-y-3">
                {[['Shop', '/shop'], ['Uber Uns', '/about'], ['Anmelden', '/auth/login']].map(([l, h]) => (
                  <li key={l}><Link href={h} className="font-body text-sm hover:text-[#8B6914] transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-sans text-[10px] tracking-[3px] uppercase text-[#8B6914] mb-6">Kontakt</h4>
              <p className="font-body text-sm text-[#E8DFC8]/60">Fragen? Schreib uns auf Instagram oder per E-Mail.</p>
              <div className="mt-4 h-px w-16 bg-[#8B6914]" />
            </div>
          </div>
          <div className="border-t border-[#E8DFC8]/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-sans text-[11px] tracking-[2px] uppercase text-[#E8DFC8]/30">2024 JL Vintage — Leandro & Justin</p>
            <p className="font-sans text-[11px] tracking-[2px] uppercase text-[#E8DFC8]/30">Handgepflegt. Handverlesen.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function SaleCard({ product, delay, onAdd }: { product: Product; delay: number; onAdd: () => void }) {
  const pct = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  return (
    <div className="flex-shrink-0 w-56 group cursor-pointer">
      <div className="relative h-72 overflow-hidden bg-[#2C2416]">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
        <div className="absolute top-3 left-3 sale-badge">-{pct}%</div>
        <button onClick={onAdd} className="absolute bottom-3 left-3 right-3 bg-[#F7F3EC] text-[#1C1812] font-sans text-[10px] tracking-[2px] uppercase py-2.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          In den Warenkorb
        </button>
      </div>
      <div className="mt-3">
        <h4 className="font-display text-sm font-semibold text-white truncate">{product.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className="font-display text-base font-bold text-[#C4501A]">{product.price.toFixed(2)} EUR</span>
          {product.originalPrice && <span className="font-sans text-xs text-[#6B6560] line-through">{product.originalPrice.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}

function ProductCard({ product, visible, delay, onAdd }: { product: Product; visible: boolean; delay: number; onAdd: () => void }) {
  return (
    <div className={`product-card ${visible ? 'animate-fade-up' : 'opacity-0'}`} style={{ animationDelay: `${delay}ms` }}>
      <div className="relative overflow-hidden bg-[#E8DFC8] h-80 group">
        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        {product.originalPrice && <div className="absolute top-3 left-3 sale-badge">Sale</div>}
        <div className="product-overlay absolute inset-0 bg-[#1C1812]/20 flex items-end p-4">
          <button onClick={onAdd} className="btn-primary w-full text-sm py-3">Zum Warenkorb</button>
        </div>
      </div>
      <div className="mt-4">
        <p className="font-sans text-[10px] tracking-[2px] uppercase text-[#6B6560]">{product.category}</p>
        <h3 className="font-display text-base font-semibold mt-1">{product.name}</h3>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-display font-bold">{product.price.toFixed(2)} EUR</span>
          {product.originalPrice && <span className="font-sans text-xs text-[#6B6560] line-through">{product.originalPrice.toFixed(2)}</span>}
        </div>
      </div>
    </div>
  );
}
