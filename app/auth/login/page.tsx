'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { refresh } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const d = await r.json();
      if (!r.ok) {
        if (d.needsVerification) {
          router.push(`/auth/verify?userId=${d.userId}`);
          return;
        }
        setError(d.error);
      } else {
        await refresh();
        router.push(d.isAdmin ? '/admin' : '/account');
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left visual */}
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1C1812]/50" />
        <div className="absolute bottom-12 left-12">
          <p className="font-sans text-[10px] tracking-[4px] uppercase text-[#8B6914] mb-3">JL VINTAGE</p>
          <p className="font-display text-4xl italic text-white font-bold leading-tight">Willkommen<br />zuruck.</p>
        </div>
      </div>

      {/* Right form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-display text-2xl font-black tracking-widest text-[#1C1812] block mb-12">JL VINTAGE</Link>
          <h1 className="font-display text-4xl font-bold italic mb-2">Anmelden</h1>
          <p className="font-body text-[#6B6560] mb-10">Noch kein Konto? <Link href="/auth/register" className="text-[#8B6914] hover:underline">Jetzt registrieren</Link></p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-sans text-[10px] tracking-[3px] uppercase text-[#6B6560] block mb-2">E-Mail</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} className="input-vintage" placeholder="deine@email.de" required />
            </div>
            <div>
              <label className="font-sans text-[10px] tracking-[3px] uppercase text-[#6B6560] block mb-2">Passwort</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-vintage" placeholder="••••••••" required />
            </div>
            {error && <p className="font-sans text-sm text-[#C4501A] bg-[#C4501A]/10 px-4 py-3">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Wird geladen...' : 'Anmelden'}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-[#E8DFC8]">
            <p className="font-sans text-[11px] tracking-[2px] uppercase text-[#6B6560] text-center">Admin-Login: Email = JLVINTAGEONTOP</p>
          </div>
        </div>
      </div>
    </div>
  );
}
