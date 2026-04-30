import { NavLink } from 'react-router-dom';
import { useApp } from '@/context/AppContext';

const staffItems = [
  { path: '/sell', label: 'Sell', icon: 'ri-shopping-bag-line' },
  { path: '/inventory', label: 'Inventory', icon: 'ri-medicine-bottle-line' },
  { path: '/restock', label: 'Restock', icon: 'ri-add-box-line' },
];

const ownerItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'ri-dashboard-line' },
  { path: '/inventory', label: 'Inventory', icon: 'ri-medicine-bottle-line' },
  { path: '/sell', label: 'Sell', icon: 'ri-shopping-bag-line' },
  { path: '/restock', label: 'Restock', icon: 'ri-add-box-line' },
  { path: '/insights', label: 'More', icon: 'ri-more-line' },
];

export default function BottomNav() {
  const { user } = useApp();
  const items = user?.role === 'owner' ? ownerItems : staffItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface-light dark:bg-surface-dark border-t border-border-light dark:border-border-dark flex md:hidden">
      {items.map(item => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors cursor-pointer
            ${isActive ? 'text-primary-500' : 'text-gray-400 dark:text-gray-600'}`
          }
        >
          <div className="w-6 h-6 flex items-center justify-center">
            <i className={`${item.icon} text-xl`}></i>
          </div>
          <span className="text-[10px] font-body">{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
