import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import type { Transaction } from '@/mocks/types';

const typeBadgeClass: Record<string, string> = {
  Sale: 'bg-primary-50 dark:bg-primary-500/10 text-primary-500',
  Restock: 'bg-success-50 dark:bg-success-500/10 text-success-500',
  Reversal: 'bg-warning-50 dark:bg-warning-500/10 text-warning-500',
  Reconciliation: 'bg-purple-50 dark:bg-purple-500/10 text-purple-500',
};

export default function AuditLogPage() {
  const { transactions } = useApp();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<Transaction['type'] | 'All'>('All');
  const [staffFilter, setStaffFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const staffNames = useMemo(() => {
    const names = new Set(transactions.map(t => t.staffName));
    return Array.from(names).sort();
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const matchType = typeFilter === 'All' || t.type === typeFilter;
      const matchStaff = !staffFilter || t.staffName === staffFilter;
      const matchSearch = !search || t.drugName.toLowerCase().includes(search.toLowerCase()) || t.id.toLowerCase().includes(search.toLowerCase());
      const matchFrom = !dateFrom || new Date(t.timestamp) >= new Date(dateFrom);
      const matchTo = !dateTo || new Date(t.timestamp) <= new Date(dateTo + 'T23:59:59');
      return matchType && matchStaff && matchSearch && matchFrom && matchTo;
    });
  }, [transactions, typeFilter, staffFilter, search, dateFrom, dateTo]);

  const grouped = useMemo(() => {
    const map: Record<string, typeof filtered> = {};
    filtered.forEach(t => {
      const date = t.timestamp.slice(0, 10);
      if (!map[date]) map[date] = [];
      map[date].push(t);
    });
    return Object.entries(map).sort((a, b) => b[0].localeCompare(a[0]));
  }, [filtered]);

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="mb-5">
        <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Audit Log</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">
          <span className="font-mono">{filtered.length}</span> entries
        </p>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="relative col-span-2 md:col-span-1">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm"></i>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search drug or ref..."
            className="w-full h-9 pl-8 pr-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs font-body text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value as Transaction['type'] | 'All')}
          className="h-9 px-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs font-body text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
        >
          <option value="All">All Types</option>
          <option value="Sale">Sale</option>
          <option value="Restock">Restock</option>
          <option value="Reversal">Reversal</option>
          <option value="Reconciliation">Reconciliation</option>
        </select>
        <select
          value={staffFilter}
          onChange={e => setStaffFilter(e.target.value)}
          className="h-9 px-3 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs font-body text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
        >
          <option value="">All Staff</option>
          {staffNames.map(n => <option key={n} value={n}>{n}</option>)}
        </select>
        <div className="flex gap-2 col-span-2 md:col-span-1">
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="flex-1 h-9 px-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="flex-1 h-9 px-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-xs font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors" />
        </div>
      </div>

      {grouped.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 rounded-full bg-gray-100 dark:bg-white/5">
            <i className="ri-file-list-3-line text-gray-400 text-xl"></i>
          </div>
          <p className="text-sm font-body text-gray-500 dark:text-gray-400">No entries match your filters</p>
        </div>
      ) : (
        <div className="space-y-6">
          {grouped.map(([date, entries]) => (
            <div key={date}>
              <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-2">
                {new Date(date).toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark divide-y divide-border-light dark:divide-border-dark">
                {entries.map(tx => (
                  <div key={tx.id} className="p-4">
                    <div className="flex flex-wrap items-start gap-3">
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${typeBadgeClass[tx.type]}`}>{tx.type}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
                          <p className="text-sm font-body font-medium text-gray-900 dark:text-white">{tx.drugName}</p>
                          <span className="text-xs font-mono text-gray-400 dark:text-gray-600">{tx.id}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-0.5">
                          <span className="text-xs font-body text-gray-500 dark:text-gray-400">{tx.staffName}</span>
                          <span className="text-xs font-mono text-gray-400 dark:text-gray-600">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                          {tx.reversalReason && (
                            <span className="text-xs font-body text-warning-500">{tx.reversalReason}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="text-right">
                          <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Before</p>
                          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{tx.stockBefore}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Qty</p>
                          <p className={`text-sm font-mono font-600 ${tx.quantity < 0 ? 'text-danger-500' : tx.type === 'Sale' ? 'text-primary-500' : 'text-success-500'}`}>
                            {tx.type === 'Sale' ? '-' : tx.quantity > 0 ? '+' : ''}{Math.abs(tx.quantity)}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">After</p>
                          <p className="text-sm font-mono text-gray-700 dark:text-gray-300">{tx.stockAfter}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
