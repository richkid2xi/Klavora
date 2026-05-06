import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';

type Period = '7d' | '30d';

export default function InsightsPage() {
  const { transactions, drugs } = useApp();
  const [period, setPeriod] = useState<Period>('7d');

  const cutoff = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - (period === '7d' ? 7 : 30));
    return d;
  }, [period]);

  const filtered = useMemo(() =>
    transactions.filter(t => new Date(t.timestamp) >= cutoff), [transactions, cutoff]);

  const sales = filtered.filter(t => t.type === 'Sale');

  const topSelling = useMemo(() => {
    const map: Record<string, { name: string; qty: number }> = {};
    sales.forEach(t => {
      if (!map[t.drugId]) map[t.drugId] = { name: t.drugName, qty: 0 };
      map[t.drugId].qty += t.quantity;
    });
    return Object.values(map).sort((a, b) => b.qty - a.qty).slice(0, 8);
  }, [sales]);

  const slowMovers = useMemo(() => {
    const soldIds = new Set(sales.map(t => t.drugId));
    return drugs.filter(d => !soldIds.has(d.id)).map(d => ({
      name: d.name,
      qty: d.batches.reduce((s, b) => s + b.quantity, 0),
    })).slice(0, 8);
  }, [sales, drugs]);

  const staffActivity = useMemo(() => {
    const map: Record<string, { name: string; count: number }> = {};
    filtered.forEach(t => {
      if (!map[t.staffId]) map[t.staffId] = { name: t.staffName, count: 0 };
      map[t.staffId].count++;
    });
    return Object.values(map).sort((a, b) => b.count - a.count);
  }, [filtered]);

  const hourlyData = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => ({ hour: i, count: 0 }));
    sales.forEach(t => {
      const h = new Date(t.timestamp).getHours();
      hours[h].count++;
    });
    return hours.filter(h => h.hour >= 6 && h.hour <= 22);
  }, [sales]);

  const maxHourly = Math.max(...hourlyData.map(h => h.count), 1);
  const maxSelling = Math.max(...topSelling.map(d => d.qty), 1);
  const maxStaff = Math.max(...staffActivity.map(s => s.count), 1);

  const summaryStats = [
    { label: 'Total Sales', value: sales.length, color: 'text-primary-500', icon: 'ri-shopping-bag-line', bg: 'bg-primary-50 dark:bg-primary-500/10' },
    { label: 'Units Sold', value: sales.reduce((s, t) => s + t.quantity, 0), color: 'text-success-500', icon: 'ri-stack-line', bg: 'bg-success-50 dark:bg-success-500/10' },
    { label: 'Restocks', value: filtered.filter(t => t.type === 'Restock').length, color: 'text-warning-500', icon: 'ri-refresh-line', bg: 'bg-warning-50 dark:bg-warning-500/10' },
    { label: 'Active Staff', value: staffActivity.length, color: 'text-purple-500', icon: 'ri-team-line', bg: 'bg-purple-50 dark:bg-purple-500/10' },
  ];

  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Insights</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">
            <span className="font-mono">{sales.length}</span> sales in the last {period === '7d' ? '7 days' : '30 days'}
          </p>
        </div>
        <div className="flex bg-gray-100 dark:bg-surface-dark rounded-lg p-1 border border-border-light dark:border-border-dark">
          {(['7d', '30d'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 h-8 rounded-md text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap
                ${period === p ? 'bg-white dark:bg-bg-dark text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
            >
              {p === '7d' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        {summaryStats.map(s => (
          <div key={s.label} className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">{s.label}</span>
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${s.bg}`}>
                <i className={`${s.icon} ${s.color} text-base`}></i>
              </div>
            </div>
            <p className={`text-3xl font-mono font-600 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Main grid: Top Selling + Slow Movers + Busiest Hours */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        {/* Top Selling */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
          <h2 className="text-sm font-heading font-600 text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <i className="ri-bar-chart-line text-primary-500"></i> Top Selling Drugs
          </h2>
          {topSelling.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600 font-body py-4 text-center">No sales in this period</p>
          ) : (
            <div className="space-y-3">
              {topSelling.map((drug, idx) => (
                <div key={drug.name} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-600 w-4 flex-shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-xs font-body text-gray-700 dark:text-gray-300 truncate">{drug.name}</p>
                      <span className="text-xs font-mono font-600 text-gray-900 dark:text-white ml-2 flex-shrink-0">{drug.qty}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary-500 rounded-full transition-all duration-500"
                        style={{ width: `${(drug.qty / maxSelling) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Slow Movers */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
          <h2 className="text-sm font-heading font-600 text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <i className="ri-time-line text-warning-500"></i> Slow Movers
          </h2>
          {slowMovers.length === 0 ? (
            <p className="text-sm text-gray-400 dark:text-gray-600 font-body py-4 text-center">All drugs sold in this period</p>
          ) : (
            <div className="space-y-3">
              {slowMovers.map((drug, idx) => (
                <div key={drug.name} className="flex items-center gap-3">
                  <span className="text-xs font-mono text-gray-400 dark:text-gray-600 w-4 flex-shrink-0">{idx + 1}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-body text-gray-700 dark:text-gray-300 truncate">{drug.name}</p>
                      <span className="text-xs font-mono text-warning-500 ml-2 flex-shrink-0">{drug.qty} units</span>
                    </div>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 font-body mt-0.5">No sales this period</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Busiest Hours */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
          <h2 className="text-sm font-heading font-600 text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <i className="ri-bar-chart-2-line text-success-500"></i> Busiest Hours
          </h2>
          <div className="flex items-end gap-0.5 h-28 mb-2">
            {hourlyData.map(h => (
              <div key={h.hour} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-primary-500/15 dark:bg-primary-500/15 rounded-sm transition-all duration-500 relative group"
                  style={{ height: `${Math.max(4, (h.count / maxHourly) * 96)}px` }}
                >
                  {h.count > 0 && (
                    <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] font-mono text-primary-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-white dark:bg-surface-dark px-1 rounded z-10">
                      {h.count}
                    </div>
                  )}
                  <div
                    className="w-full bg-primary-500 rounded-sm absolute bottom-0"
                    style={{ height: `${(h.count / maxHourly) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between">
            {[6, 9, 12, 15, 18, 21].map(h => (
              <span key={h} className="text-[9px] font-mono text-gray-400 dark:text-gray-600">{h}h</span>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Activity - full width */}
      <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
        <h2 className="text-sm font-heading font-600 text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <i className="ri-team-line text-purple-500"></i> Staff Activity
        </h2>
        {staffActivity.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-gray-600 font-body py-4 text-center">No activity in this period</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {staffActivity.map(s => (
              <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark">
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-500/20 flex-shrink-0">
                  <i className="ri-user-line text-purple-500 text-sm"></i>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-body font-medium text-gray-700 dark:text-gray-300 truncate">{s.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${(s.count / maxStaff) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-gray-900 dark:text-white flex-shrink-0">{s.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
