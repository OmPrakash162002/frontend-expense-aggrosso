'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import { getToken, setToken, clearToken } from '@/lib/auth-storage';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On first load, restore the session from the saved token
  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    api.me().then((r) => setUser(r.user)).catch(() => clearToken()).finally(() => setLoading(false));
  }, []);

  // api.js fires this when the server says the token is no longer valid
  useEffect(() => {
    const expired = () => setUser(null);
    window.addEventListener('auth:expired', expired);
    return () => window.removeEventListener('auth:expired', expired);
  }, []);

  const finish = useCallback((r) => { setToken(r.token); setUser(r.user); }, []);
    const login = useCallback(async (email, password, portal) => finish(await api.login(email, password, portal)), [finish]);
  const register = useCallback(async (name, email, password) => finish(await api.register(name, email, password)), [finish]);
  const logout = useCallback(() => { clearToken(); setUser(null); }, []);

  const value = useMemo(() => ({ user, loading, login, register, logout }), [user, loading, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
