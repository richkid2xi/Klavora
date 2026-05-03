import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import HelpSupportModal from '@/components/feature/HelpSupportModal';
import UpgradeModal from '@/components/feature/UpgradeModal';
import OnboardingTour from '@/components/feature/OnboardingTour';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  ownerOnly?: boolean;
  premiumOnly?: boolean;
}

const allNavItems: NavItem[] = [
  { path: '/dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
  { path: '/inventory', label: 'Inventory', icon: 'ri-medicine-bottle-line' },
  { path: '/sell', label: 'Sell', icon: 'ri-shopping-bag-line' },
  { path: '/restock', label: 'Restock', icon: 'ri-add-box-line' },
  { path: '/add-inventory', label: 'Add Inventory', icon: 'ri-inbox-archive-line', ownerOnly: true },
  { path: '/audit-log', label: 'Audit Log', icon: 'ri-file-list-3-line', ownerOnly: true, premiumOnly: true },
  { path: '/sales-metrics', label: 'Sales Metrics', icon: 'ri-line-chart-line', ownerOnly: true },
  { path: '/staff', label: 'Staff', icon: 'ri-team-line', ownerOnly: true },
  { path: '/settings', label: 'Settings', icon: 'ri-settings-3-line', ownerOnly: true },
];

export default function Sidebar() {
  const { user, logout, theme, toggleTheme, sidebarCollapsed, setSidebarCollapsed, subscriptionPlan, showTour, setShowTour } = useApp();
  const navigate = useNavigate();
  const [showHelp, setShowHelp] = useState(false);
  const [upgradeFeature, setUpgradeFeature] = useState<string | null>(null);

  const navItems = user?.role === 'owner'
    ? allNavItems
    : allNavItems.filter(item => !item.ownerOnly);

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isLocked = (item: NavItem) => item.premiumOnly && subscriptionPlan === 'starter';

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-full z-40 flex flex-col bg-surface-light dark:bg-surface-dark border-r border-border-light dark:border-border-dark transition-all duration-200 ${sidebarCollapsed ? 'w-16' : 'w-sidebar'}`}
      >
        {/* Logo */}
        <div className={`flex items-center h-16 border-b border-border-light dark:border-border-dark flex-shrink-0 ${sidebarCollapsed ? 'justify-center px-0' : 'px-5 gap-2.5'}`}>
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center flex-shrink-0">
            <i className="ri-medicine-bottle-line text-white text-base"></i>
          </div>
          {!sidebarCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-heading font-700 text-base text-gray-900 dark:text-white tracking-tight leading-tight truncate">Klavora</span>
              {user?.pharmacyName && (
                <span className="text-[10px] text-gray-500 dark:text-gray-400 font-body truncate leading-tight mt-0.5">{user.pharmacyName}</span>
              )}
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-3">
          {navItems.map(item => {
            const locked = isLocked(item);
            if (locked) {
              return (
                <button
                  key={item.path}
                  data-tour={item.path.replace('/', '')}
                  onClick={() => setUpgradeFeature(item.label)}
                  className={`relative flex items-center h-10 mx-2 rounded-lg transition-all duration-150 cursor-pointer group w-[calc(100%-16px)]
                    ${sidebarCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
                    text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5`}
                >
                  <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 relative">
                    <i className={`${item.icon} text-base`}></i>
                  </div>
                  {!sidebarCollapsed && (
                    <span className="text-sm font-medium font-body whitespace-nowrap flex-1 text-left">{item.label}</span>
                  )}
                  {!sidebarCollapsed && (
                    <div className="flex items-center gap-1">
                      <i className="ri-lock-line text-[10px] text-gray-400 dark:text-gray-600"></i>
                      <span className="text-[9px] font-body font-600 text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-1.5 py-0.5 rounded-full whitespace-nowrap">Premium</span>
                    </div>
                  )}
                  {sidebarCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                      {item.label} — Premium
                    </div>
                  )}
                </button>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                data-tour={item.path.replace('/', '')}
                className={({ isActive }) =>
                  `relative flex items-center h-10 mx-2 rounded-lg transition-all duration-150 cursor-pointer group
                  ${sidebarCollapsed ? 'justify-center px-0' : 'px-3 gap-3'}
                  ${isActive
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-500'
                    : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary-500 rounded-r-full -ml-2"></span>
                    )}
                    <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
                      <i className={`${item.icon} text-base`}></i>
                    </div>
                    {!sidebarCollapsed && (
                      <span className="text-sm font-medium font-body whitespace-nowrap">{item.label}</span>
                    )}
                    {sidebarCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                        {item.label}
                      </div>
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom section */}
        <div className="border-t border-border-light dark:border-border-dark py-3 flex-shrink-0">
          {/* Subscription badge */}
          {!sidebarCollapsed && user?.role === 'owner' && (
            <div className="mx-2 mb-2 px-3 py-2 rounded-lg bg-bg-light dark:bg-bg-dark">
              <p className="text-xs font-medium text-gray-900 dark:text-white font-body truncate">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">{user.role}</p>
                <span className={`text-[9px] font-body font-600 px-1.5 py-0.5 rounded-full whitespace-nowrap ${subscriptionPlan === 'premium' ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10' : 'text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-white/5'}`}>
                  {subscriptionPlan === 'premium' ? '★ Premium' : 'Starter'}
                </span>
              </div>
            </div>
          )}
          {!sidebarCollapsed && user?.role !== 'owner' && user && (
            <div className="mx-2 mb-2 px-3 py-2 rounded-lg bg-bg-light dark:bg-bg-dark">
              <p className="text-xs font-medium text-gray-900 dark:text-white font-body truncate">{user.name}</p>
              <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">{user.role}</p>
            </div>
          )}

          {/* Help & Support */}
          <button
            onClick={() => setShowHelp(true)}
            className={`flex items-center h-10 mx-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer group
              ${sidebarCollapsed ? 'justify-center px-0 w-12' : 'px-3 gap-3 w-[calc(100%-16px)]'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className="ri-customer-service-2-line text-base"></i>
            </div>
            {!sidebarCollapsed && <span className="text-sm font-body whitespace-nowrap">Help &amp; Support</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                Help &amp; Support
              </div>
            )}
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`flex items-center h-10 mx-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-all cursor-pointer group
              ${sidebarCollapsed ? 'justify-center px-0 w-12' : 'px-3 gap-3 w-[calc(100%-16px)]'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className={`${theme === 'light' ? 'ri-moon-line' : 'ri-sun-line'} text-base`}></i>
            </div>
            {!sidebarCollapsed && <span className="text-sm font-body">{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </div>
            )}
          </button>

          {/* Logout */}
          <button
            onClick={() => setShowLogoutModal(true)}
            className={`flex items-center h-10 mx-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-danger-50 dark:hover:bg-danger-500/10 hover:text-danger-500 transition-all cursor-pointer group
              ${sidebarCollapsed ? 'justify-center px-0 w-12' : 'px-3 gap-3 w-[calc(100%-16px)]'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className="ri-logout-box-line text-base"></i>
            </div>
            {!sidebarCollapsed && <span className="text-sm font-body whitespace-nowrap">Sign Out</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                Sign Out
              </div>
            )}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`flex items-center h-10 mx-2 rounded-lg text-gray-400 dark:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-600 dark:hover:text-gray-400 transition-all cursor-pointer group
              ${sidebarCollapsed ? 'justify-center px-0 w-12' : 'px-3 gap-3 w-[calc(100%-16px)]'}`}
          >
            <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
              <i className={`${sidebarCollapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'} text-base`}></i>
            </div>
            {!sidebarCollapsed && <span className="text-sm font-body whitespace-nowrap">Collapse</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap transition-opacity z-50">
                {sidebarCollapsed ? 'Expand' : 'Collapse'}
              </div>
            )}
          </button>
        </div>
      </aside>

      {showHelp && <HelpSupportModal onClose={() => setShowHelp(false)} />}
      {upgradeFeature && <UpgradeModal featureName={upgradeFeature} onClose={() => setUpgradeFeature(null)} />}
      {showTour && <OnboardingTour onClose={() => setShowTour(false)} />}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface-light dark:bg-surface-dark w-full max-w-sm rounded-card border border-border-light dark:border-border-dark shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-danger-50 dark:bg-danger-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-logout-box-line text-2xl text-danger-500"></i>
              </div>
              <h3 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-2">Sign Out?</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-8">
                Are you sure you want to sign out of Klavora? You will need your credentials to log back in.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowLogoutModal(false)}
                  className="flex-1 h-btn bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-white/10 rounded-btn text-sm font-medium font-body transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleLogout}
                  className="flex-1 h-btn bg-danger-500 hover:bg-danger-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
