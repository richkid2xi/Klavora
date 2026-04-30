import { useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 768);
  useEffect(() => {
    const handler = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return isDesktop;
}

export default function AppShell() {
  const { user, sidebarCollapsed } = useApp();
  const navigate = useNavigate();
  const isDesktop = useIsDesktop();

  useEffect(() => {
    if (!user) navigate('/');
  }, [user, navigate]);

  if (!user) return null;

  const marginLeft = isDesktop ? (sidebarCollapsed ? 64 : 240) : 0;

  return (
    <div className="min-h-screen bg-bg-light dark:bg-bg-dark transition-colors duration-200">
      {/* Sidebar - desktop only */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main
        className="transition-all duration-200 min-h-screen pb-16 md:pb-0"
        style={{ marginLeft }}
      >
        <Outlet />
      </main>

      {/* Bottom nav - mobile only */}
      <BottomNav />
    </div>
  );
}
