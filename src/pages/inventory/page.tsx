import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { categories } from '@/mocks/drugs';
import type { Drug } from '@/mocks/types';
import DrugDetail from './components/DrugDetail';

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

const statusClass: Record<string, string> = {
  'In Stock': 'bg-success-50 dark:bg-success-500/10 text-success-500',
  'Low Stock': 'bg-warning-50 dark:bg-warning-500/10 text-warning-500',
  'Expiring Soon': 'bg-warning-50 dark:bg-warning-500/10 text-warning-500',
  'Out of Stock': 'bg-danger-50 dark:bg-danger-500/10 text-danger-500',
};

function getDrugStatus(drug: Drug): string {
  const batches = drug.batches;
  const total = batches.reduce((s, b) => s + b.quantity, 0);
  if (total === 0) return 'Out of Stock';
  if (batches.some(b => b.status === 'Low Stock')) return 'Low Stock';
  if (batches.some(b => { const d = daysUntil(b.expiry); return d <= 30 && d > 0 && b.quantity > 0; })) return 'Expiring Soon';
  return 'In Stock';
}

function getNearestExpiry(drug: Drug): string {
  const active = drug.batches.filter(b => b.quantity > 0);
  if (active.length === 0) return drug.batches[0]?.expiry ?? '-';
  return active.sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime())[0].expiry;
}

export default function InventoryPage() {
  const { drugs } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(null);

  const filtered = useMemo(() => {
    return drugs.filter(d => {
      const matchCat = category === 'All' || d.category === category;
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [drugs, search, category]);

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">
            <span className="font-mono">{drugs.length}</span> drugs tracked
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg"></i>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search medicines..."
          className="w-full h-12 pl-11 pr-4 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-base font-body text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors shadow-sm"
        />
        {search && (
          <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
            <i className="ri-close-line text-lg"></i>
          </button>
        )}
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`flex-shrink-0 px-3 h-8 rounded-full text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap
              ${category === cat
                ? 'bg-primary-500 text-white'
                : 'bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500'
              }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Drug list */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 rounded-full bg-gray-100 dark:bg-white/5">
            <i className="ri-medicine-bottle-line text-gray-400 text-xl"></i>
          </div>
          <p className="text-sm font-body text-gray-500 dark:text-gray-400">No drugs found</p>
          <p className="text-xs font-body text-gray-400 dark:text-gray-600 mt-1">Try a different search or category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(drug => {
            const status = getDrugStatus(drug);
            const totalQty = drug.batches.reduce((s, b) => s + b.quantity, 0);
            const nearestExpiry = getNearestExpiry(drug);
            const days = daysUntil(nearestExpiry);
            return (
              <button
                key={drug.id}
                onClick={() => setSelectedDrug(drug)}
                className="text-left bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4 hover:border-primary-500 transition-all cursor-pointer group"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-heading font-600 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors truncate">{drug.name}</p>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 mt-1 inline-block">{drug.category}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${statusClass[status]}`}>{status}</span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Total Qty</p>
                    <p className="text-2xl font-mono font-600 text-gray-900 dark:text-white">{totalQty}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Nearest Expiry</p>
                    <p className={`text-xs font-mono ${days <= 7 ? 'text-danger-500' : days <= 30 ? 'text-warning-500' : 'text-gray-600 dark:text-gray-400'}`}>{nearestExpiry}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedDrug && (
        <DrugDetail drug={selectedDrug} onClose={() => setSelectedDrug(null)} />
      )}
    </div>
  );
}
