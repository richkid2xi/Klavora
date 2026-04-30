import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

export function MainLayout({ children }: { children: React.ReactNode }) {
  const { user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const toggleTheme = () => {
    setIsDark(d => {
      const next = !d;
      if (next) document.documentElement.classList.add('dark');
      else document.documentElement.classList.remove('dark');
      return next;
    });
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: 'ri-dashboard-line' },
    { path: '/inventory', label: 'Inventory', icon: 'ri-medicine-bottle-line' },
    { path: '/sell', label: 'Sell', icon: 'ri-shopping-cart-2-line' },
    { path: '/restock', label: 'Restock', icon: 'ri-add-box-line' },
    { path: '/insights', label: 'Insights', icon: 'ri-bar-chart-2-line' },
  ];

  const handleNav = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full p-4">
      <div className="flex items-center gap-3 mb-8 px-2">
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0 text-white">
          <i className="ri-capsule-line text-lg"></i>
        </div>
        <span className="text-lg font-heading font-800 tracking-tight text-gray-900 dark:text-white">Klavora</span>
      </div>

      <div className="flex-1 space-y-1">
        {navItems.map(item => {
          const active = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
          return (
            <button
              key={item.path}
              onClick={() => handleNav(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer
                ${active ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-500' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'}`}
            >
              <i className={`${item.icon} text-lg`}></i>
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-auto border-t border-border-light dark:border-border-dark pt-4 space-y-1">
        <div className="px-3 py-2.5 mb-2 bg-gray-50 dark:bg-surface-dark rounded-lg">
          <p className="text-sm font-heading font-600 text-gray-900 dark:text-white truncate">{user?.name}</p>
          <p className="text-xs font-mono uppercase tracking-widest text-gray-400 mt-0.5">{user?.role}</p>
        </div>
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <i className={`${isDark ? 'ri-sun-line' : 'ri-moon-line'} text-lg`}></i>
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button
          onClick={() => alert('Logged out!')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
        >
          <i className="ri-logout-box-r-line text-lg"></i>
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen w-full bg-bg-light dark:bg-bg-dark overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark h-full">
        {sidebarContent}
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)}></div>
      )}

      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 w-64 bg-surface-light dark:bg-surface-dark z-50 transform transition-transform md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {sidebarContent}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden h-16 flex items-center px-4 bg-surface-light dark:bg-surface-dark border-b border-border-light dark:border-border-dark flex-shrink-0">
          <button onClick={() => setIsMobileMenuOpen(true)} className="p-1 -ml-1 mr-3 text-gray-500 hover:text-gray-900 dark:hover:text-white cursor-pointer">
            <i className="ri-menu-2-line text-2xl"></i>
          </button>
          <span className="text-lg font-heading font-800 tracking-tight text-gray-900 dark:text-white">Klavora</span>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
