import { createContext, useContext, useMemo, useState } from 'react';
import { api, type UserRole } from '../lib/api';

type Mode = 'login' | 'register';

interface AuthContextValue {
  token: string | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  mode: Mode;
  setMode: (mode: Mode) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);
const TOKEN_KEY = 'sesd_token';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [mode, setMode] = useState<Mode>('login');

  const decodeRole = (t: string | null): UserRole | null => {
    if (!t) return null;
    try {
      return JSON.parse(atob(t.split('.')[1])).role as UserRole;
    } catch {
      return null;
    }
  };

  const saveToken = (nextToken: string) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const data = await api.login({ email, password });
    saveToken(data.accessToken);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'STUDENT',
  ): Promise<void> => {
    const data = await api.register({ name, email, password, role });
    saveToken(data.accessToken);
  };

  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      userRole: decodeRole(token),
      mode,
      setMode,
      login,
      register,
      logout,
    }),
    [mode, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
