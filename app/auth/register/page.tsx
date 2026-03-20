'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) { setError('Passwort muss mindestens 6 Zeichen haben.'); return; }
    setLoading(true);
    try {
      const r = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error); return; }
      let url = `/auth/verify?userId=${d.userId}`;
      if (d.devCode) url += `&devCode=${d.devCode}`;
      router.push(url);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 relative overflow-hidden">
        <img src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800" alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#1C1812]/50" />
        <div className="absolute bottom-12 left-12">
          <p className="font-display text-4xl italic text-white font-bold leading-tight">Werde Teil<br />der Community.</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <Link href="/" className="font-display text-2xl font-black tracking-widest text-[#1C1812] block mb-12">JL VINTAGE</Link>
          <h1 className="font-display text-4xl font-bold italic mb-2">Konto erstellen</h1>
          <p className="font-body text-[#6B6560] mb-10">Bereits registriert? <Link href="/auth/login" className="text-[#8B6914] hover:underline">Jetzt anmelden</Link></p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="font-sans text-[10px] tracking-[3px] uppercase text-[#6B6560] block mb-2">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="input-vintage" placeholder="Dein Name" required />
            </div>
            <div>
              <label className="font-sans text-[10px] tracking-[3px] uppercase text-[#6B6560] block mb-2">E-Mail</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-vintage" placeholder="deine@email.de" required />
            </div>
            <div>
              <label className="font-sans text-[10px] tracking-[3px] uppercase text-[#6B6560] block mb-2">Passwort</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-vintage" placeholder="Mindestens 6 Zeichen" required />
            </div>
            {error && <p className="font-sans text-sm text-[#C4501A] bg-[#C4501A]/10 px-4 py-3">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
              {loading ? 'Wird angelegt...' : 'Konto erstellen'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
