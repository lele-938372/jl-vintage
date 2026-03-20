'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthProvider';

export default function VerifyPage() {
  const [codes, setCodes] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputs = useRef<HTMLInputElement[]>([]);
  const router = useRouter();
  const params = useSearchParams();
  const { refresh } = useAuth();

  const userId = params.get('userId') || '';
  const devCode = params.get('devCode') || '';

  useEffect(() => {
    if (devCode) setCodes(devCode.split(''));
  }, [devCode]);

  const handleChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newCodes = [...codes];
    newCodes[i] = val.slice(-1);
    setCodes(newCodes);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = codes.join('');
    if (code.length !== 6) return;
    setError('');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });
      const d = await r.json();
      if (!r.ok) { setError(d.error); return; }
      await refresh();
      router.push('/account');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-8 py-16">
      <div className="w-full max-w-sm text-center">
        <Link href="/" className="font-display text-2xl font-black tracking-widest text-[#1C1812] block mb-12">JL VINTAGE</Link>
        <div className="w-12 h-12 bg-[#1C1812] rounded-full flex items-center justify-center mx-auto mb-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F7F3EC" strokeWidth="1.5"><path d="M3 8l9-5 9 5-9 5-9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>
        </div>
        <h1 className="font-display text-4xl font-bold italic mb-3">Code bestatigen</h1>
        <p className="font-body text-[#6B6560] mb-10">Wir haben einen 6-stelligen Code an deine E-Mail gesendet.</p>
        {devCode && (
          <div className="bg-[#8B6914]/10 border border-[#8B6914]/30 px-4 py-3 mb-6">
            <p className="font-sans text-[11px] text-[#8B6914] tracking-wide">Dev-Modus: Code bereits eingetragen ({devCode})</p>
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex gap-3 justify-center mb-8">
            {codes.map((c, i) => (
              <input
                key={i}
                ref={el => { if (el) inputs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                value={c}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                maxLength={1}
                className="w-11 h-14 text-center text-xl font-display font-bold bg-transparent border-b-2 border-[#E8DFC8] focus:border-[#1C1812] outline-none transition-colors"
              />
            ))}
          </div>
          {error && <p className="font-sans text-sm text-[#C4501A] bg-[#C4501A]/10 px-4 py-3 mb-6">{error}</p>}
          <button type="submit" disabled={loading || codes.join('').length < 6} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Wird uberpruft...' : 'Bestatigen'}
          </button>
        </form>
      </div>
    </div>
  );
}
