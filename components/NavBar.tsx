'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { useCart } from './CartProvider';
import CartDrawer from './CartDrawer';

export default function NavBar() {
  const { user, logout } = useAuth();
  const { count, setOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <>
      <CartDrawer />
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#F7F3EC]/95 backdrop-blur-sm border-b border-[#E8DFC8] py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Left nav */}
          <div className="hidden md:flex items-center gap-8">
            <NavLink href="/shop">Shop</NavLink>
            <NavLink href="/about">Uber Uns</NavLink>
          </div>

          {/* Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center group">
            <span className="font-display font-black text-2xl tracking-[0.15em] text-[#1C1812] transition-all duration-300 group-hover:tracking-[0.2em]">JL</span>
            <span className="font-sans text-[9px] tracking-[0.4em] text-[#8B6914] uppercase mt-[-2px]">VINTAGE</span>
          </Link>

          {/* Right nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {user.isAdmin ? (
                  <NavLink href="/admin">Admin</NavLink>
                ) : (
                  <NavLink href="/account">Konto</NavLink>
                )}
                <button onClick={logout} className="font-sans text-[11px] tracking-[2px] uppercase text-[#6B6560] hover:text-[#1C1812] transition-colors">Abmelden</button>
              </>
            ) : (
              <NavLink href="/auth/login">Anmelden</NavLink>
            )}
            <button onClick={() => setOpen(true)} className="relative flex items-center gap-2 font-sans text-[11px] tracking-[2px] uppercase hover:text-[#8B6914] transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
              {count > 0 && <span className="absolute -top-2 -right-2 bg-[#C4501A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-sans">{count}</span>}
            </button>
          </div>

          {/* Mobile menu btn */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden ml-auto flex flex-col gap-1.5 p-2">
            <span className={`block h-px w-6 bg-[#1C1812] transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}/>
            <span className={`block h-px w-6 bg-[#1C1812] transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
            <span className={`block h-px w-6 bg-[#1C1812] transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}/>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#F7F3EC] border-t border-[#E8DFC8] px-6 py-8 flex flex-col gap-6 animate-fade-in">
            <MobileLink href="/shop" onClick={() => setMenuOpen(false)}>Shop</MobileLink>
            <MobileLink href="/about" onClick={() => setMenuOpen(false)}>Uber Uns</MobileLink>
            {user ? (
              <>
                {user.isAdmin ? <MobileLink href="/admin" onClick={() => setMenuOpen(false)}>Admin</MobileLink>
                  : <MobileLink href="/account" onClick={() => setMenuOpen(false)}>Konto</MobileLink>}
                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-left font-sans text-sm tracking-widest uppercase text-[#6B6560]">Abmelden</button>
              </>
            ) : (
              <MobileLink href="/auth/login" onClick={() => setMenuOpen(false)}>Anmelden</MobileLink>
            )}
            <button onClick={() => { setOpen(true); setMenuOpen(false); }} className="text-left font-sans text-sm tracking-widest uppercase flex items-center gap-2">
              Warenkorb
              {count > 0 && <span className="bg-[#C4501A] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="font-sans text-[11px] tracking-[2.5px] uppercase text-[#1C1812] relative after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-[#8B6914] after:transition-all hover:after:w-full">
      {children}
    </Link>
  );
}

function MobileLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="font-display text-2xl italic text-[#1C1812] hover:text-[#8B6914] transition-colors">
      {children}
    </Link>
  );
}
