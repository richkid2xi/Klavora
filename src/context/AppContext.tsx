import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { AuthUser, Drug, Transaction } from '@/mocks/types';
import { drugsData } from '@/mocks/drugs';
import { transactionsData } from '@/mocks/transactions';
import { staffMembers } from '@/mocks/staff';

export type Theme = 'light' | 'dark';
export type SubscriptionPlan = 'starter' | 'premium';

interface AppContextType {
  theme: Theme;
  toggleTheme: () => void;
  user: AuthUser | null;
  login: (u: AuthUser) => void;
  logout: () => void;
  drugs: Drug[];
  setDrugs: (d: Drug[]) => void;
  transactions: Transaction[];
  addTransaction: (t: Transaction) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
  subscriptionPlan: SubscriptionPlan;
  setSubscriptionPlan: (p: SubscriptionPlan) => void;
  showTour: boolean;
  setShowTour: (v: boolean) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => {
    const s = localStorage.getItem('klavora-theme');
    if (s === 'dark' || s === 'light') return s;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const s = localStorage.getItem('klavora-auth'); return s ? JSON.parse(s) : null; } catch { return null; }
  });

  const [drugs, setDrugsState] = useState<Drug[]>(drugsData);
  const [transactions, setTransactions] = useState<Transaction[]>(transactionsData);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [subscriptionPlan, setSubscriptionPlanState] = useState<SubscriptionPlan>(() => {
    const s = localStorage.getItem('klavora-plan');
    return (s === 'starter' || s === 'premium') ? s : 'premium';
  });
  const [showTour, setShowTour] = useState(false);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('klavora-theme', next);
      if (next === 'dark') document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  }, []);

  // Apply theme on mount
  useState(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  });

  const login = useCallback((u: AuthUser) => {
    setUser(u);
    localStorage.setItem('klavora-auth', JSON.stringify(u));
    // Show tour on first login
    const tourDone = localStorage.getItem('klavora-tour-done');
    if (!tourDone) setShowTour(true);
  }, []);

  const setSubscriptionPlan = useCallback((p: SubscriptionPlan) => {
    setSubscriptionPlanState(p);
    localStorage.setItem('klavora-plan', p);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('klavora-auth');
  }, []);

  const setDrugs = useCallback((d: Drug[]) => setDrugsState(d), []);

  const addTransaction = useCallback((t: Transaction) => {
    setTransactions(prev => [t, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{ theme, toggleTheme, user, login, logout, drugs, setDrugs, transactions, addTransaction, sidebarCollapsed, setSidebarCollapsed, subscriptionPlan, setSubscriptionPlan, showTour, setShowTour }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { staffMembers };
