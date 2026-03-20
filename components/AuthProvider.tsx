'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface User { id: string; email: string; name: string; isAdmin?: boolean; }
interface AuthCtx { user: User | null; loading: boolean; refresh: () => void; logout: () => void; }
const Ctx = createContext<AuthCtx>({ user: null, loading: true, refresh: () => {}, logout: () => {} });

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/auth/me');
      const d = await r.json();
      setUser(d.user);
    } catch { setUser(null); } finally { setLoading(false); }
  }, []);
  const logout = useCallback(async () => {
    await fetch('/api/auth/me', { method: 'DELETE' });
    setUser(null);
  }, []);
  useEffect(() => { refresh(); }, [refresh]);
  return <Ctx.Provider value={{ user, loading, refresh, logout }}>{children}</Ctx.Provider>;
}
export const useAuth = () => useContext(Ctx);
