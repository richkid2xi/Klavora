import { useState, useMemo } from 'react';
import type { Drug } from '@/mocks/types';
import MedicineAutocomplete from './MedicineAutocomplete';

const PAGE_SIZE = 10;

interface InventoryTableProps {
  drugs: Drug[];
  onEdit: (drug: Drug) => void;
}

const statusColors: Record<string, string> = {
  'In Stock': 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600',
  'Low Stock': 'bg-amber-50 dark:bg-amber-500/10 text-amber-600',
  'Expiring Soon': 'bg-amber-50 dark:bg-amber-500/10 text-amber-600',
  'Out of Stock': 'bg-red-50 dark:bg-red-500/10 text-red-500',
};

function getDrugStatus(drug: Drug): string {
  const total = drug.batches.reduce((s, b) => s + b.quantity, 0);
  if (total === 0) return 'Out of Stock';
  if (drug.batches.some(b => b.status === 'Low Stock')) return 'Low Stock';
  const soon = drug.batches.some(b => {
    const d = Math.ceil((new Date(b.expiry).getTime() - Date.now()) / 86400000);
    return d <= 30 && d > 0 && b.quantity > 0;
  });
  if (soon) return 'Expiring Soon';
  return 'In Stock';
}

export default function InventoryTable({ drugs, onEdit }: InventoryTableProps) {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [catFilter, setCatFilter] = useState('All');

  const allCats = useMemo(() => {
    const cats = new Set<string>();
    drugs.forEach(d => (d.categories ?? [d.category]).forEach(c => cats.add(c)));
    return ['All', ...Array.from(cats).sort()];
  }, [drugs]);

  const filtered = useMemo(() => {
    return drugs.filter(d => {
      const matchSearch = d.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = catFilter === 'All' || (d.categories ?? [d.category]).includes(catFilter);
      return matchSearch && matchCat;
    });
  }, [drugs, search, catFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSearch = (val: string) => { setSearch(val); setPage(1); };
  const handleCat = (cat: string) => { setCatFilter(cat); setPage(1); };

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark overflow-hidden">
      {/* Table header */}
      <div className="p-4 border-b border-border-light dark:border-border-dark">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 md:min-w-[400px]">
            <MedicineAutocomplete
              value={search}
              onChange={handleSearch}
              placeholder="Search inventory..."
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-0.5 scrollbar-hide">
            {allCats.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => handleCat(cat)}
                className={`flex-shrink-0 px-3 h-10 rounded-lg text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap
                  ${catFilter === cat
                    ? 'bg-primary-500 text-white'
                    : 'border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark bg-gray-50 dark:bg-white/[0.02]">
              <th className="text-left px-4 py-3 text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600">Medicine</th>
              <th className="text-left px-4 py-3 text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 hidden sm:table-cell">Categories</th>
              <th className="text-left px-4 py-3 text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 hidden md:table-cell">Form</th>
              <th className="text-right px-4 py-3 text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600">Qty</th>
              <th className="text-right px-4 py-3 text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 hidden lg:table-cell">Price</th>
              <th className="text-center px-4 py-3 text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600">Status</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-light dark:divide-border-dark">
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-12">
                  <div className="w-10 h-10 flex items-center justify-center mx-auto mb-2 rounded-full bg-gray-100 dark:bg-white/5">
                    <i className="ri-medicine-bottle-line text-gray-400 text-lg"></i>
                  </div>
                  <p className="text-sm font-body text-gray-500 dark:text-gray-400">No medicines found</p>
                </td>
              </tr>
            ) : (
              paginated.map(drug => {
                const total = drug.batches.reduce((s, b) => s + b.quantity, 0);
                const status = getDrugStatus(drug);
                const cats = drug.categories ?? [drug.category];
                return (
                  <tr key={drug.id} className="hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-heading font-600 text-gray-900 dark:text-white">{drug.name}</p>
                      {drug.manufacturer && (
                        <p className="text-xs font-body text-gray-400 dark:text-gray-600 mt-0.5">{drug.manufacturer}</p>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {cats.slice(0, 2).map(c => (
                          <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">{c}</span>
                        ))}
                        {cats.length > 2 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400">+{cats.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-xs font-body text-gray-500 dark:text-gray-400">{drug.dosageForm ?? '-'}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="text-sm font-mono font-600 text-gray-900 dark:text-white">{total}</span>
                    </td>
                    <td className="px-4 py-3 text-right hidden lg:table-cell">
                      <span className="text-sm font-mono text-gray-700 dark:text-gray-300">GH₵{drug.unitPrice.toFixed(2)}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${statusColors[status]}`}>{status}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        type="button"
                        onClick={() => onEdit(drug)}
                        className="w-7 h-7 flex items-center justify-center rounded-md text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/10 transition-colors cursor-pointer"
                      >
                        <i className="ri-edit-line text-sm"></i>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border-light dark:border-border-dark">
          <p className="text-xs font-body text-gray-400 dark:text-gray-600">
            Showing <span className="font-mono text-gray-700 dark:text-gray-300">{(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)}</span> of <span className="font-mono text-gray-700 dark:text-gray-300">{filtered.length}</span>
          </p>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-left-s-line text-sm"></i>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
              .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === '...' ? (
                  <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-xs text-gray-400">…</span>
                ) : (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-mono cursor-pointer transition-colors
                      ${currentPage === p
                        ? 'bg-primary-500 text-white'
                        : 'border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500'
                      }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              type="button"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border-light dark:border-border-dark text-gray-500 dark:text-gray-400 hover:border-primary-500 hover:text-primary-500 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <i className="ri-arrow-right-s-line text-sm"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
