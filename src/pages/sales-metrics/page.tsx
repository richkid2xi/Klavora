import { useMemo, useState } from 'react';
import { useApp } from '@/context/AppContext';
import type { Transaction } from '@/mocks/types';

type Period = 'today' | '7days' | '30days';

function formatGHS(amount: number) {
  return `GH₵${amount.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function getDateRange(period: Period): { start: Date; end: Date } {
  const now = new Date();
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const start = new Date(now);
  if (period === 'today') {
    start.setHours(0, 0, 0, 0);
  } else if (period === '7days') {
    start.setDate(start.getDate() - 6);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(start.getDate() - 29);
    start.setHours(0, 0, 0, 0);
  }
  return { start, end };
}


interface DailyStat {
  label: string;
  date: string;
  revenue: number;
  units: number;
  transactions: number;
}

function buildDailyStats(sales: Transaction[], period: Period): DailyStat[] {
  const { start } = getDateRange(period);
  const map = new Map<string, DailyStat>();

  if (period === 'today') {
    // Group by hour
    for (let h = 0; h < 24; h++) {
      const d = new Date();
      d.setHours(h, 0, 0, 0);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${String(h).padStart(2, '0')}`;
      const label = `${String(h).padStart(2, '0')}:00`;
      map.set(key, { label, date: key, revenue: 0, units: 0, transactions: 0 });
    }
    sales.forEach(tx => {
      const d = new Date(tx.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}-${String(d.getHours()).padStart(2, '0')}`;
      const existing = map.get(key);
      if (existing) {
        existing.revenue += tx.totalAmount ?? 0;
        existing.units += tx.quantity;
        existing.transactions += 1;
      }
    });
  } else {
    const days = period === '7days' ? 7 : 30;
    for (let i = 0; i < days; i++) {
      const d = new Date(start);
      d.setDate(d.getDate() + i);
      const key = d.toISOString().slice(0, 10);
      const label = d.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' });
      map.set(key, { label, date: key, revenue: 0, units: 0, transactions: 0 });
    }
    sales.forEach(tx => {
      const key = tx.timestamp.slice(0, 10);
      const existing = map.get(key);
      if (existing) {
        existing.revenue += tx.totalAmount ?? 0;
        existing.units += tx.quantity;
        existing.transactions += 1;
      }
    });
  }

  return Array.from(map.values());
}

function MiniBarChart({ data, valueKey, color }: { data: DailyStat[]; valueKey: 'revenue' | 'units'; color: string }) {
  const values = data.map(d => d[valueKey]);
  const max = Math.max(...values, 1);
  const visibleData = data.filter((_, i) => {
    if (data.length <= 10) return true;
    if (data.length <= 20) return i % 2 === 0 || i === data.length - 1;
    return i % Math.ceil(data.length / 12) === 0 || i === data.length - 1;
  });

  return (
    <div className="flex items-end gap-0.5 h-20 w-full">
      {visibleData.map((d, i) => {
        const pct = max > 0 ? (d[valueKey] / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-0.5 group relative">
            <div
              className={`w-full rounded-sm transition-all ${color} opacity-80 group-hover:opacity-100`}
              style={{ height: `${Math.max(pct, 2)}%` }}
            />
            {/* Tooltip */}
            <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-mono px-1.5 py-0.5 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
              {d.label}: {valueKey === 'revenue' ? formatGHS(d[valueKey]) : `${d[valueKey]} units`}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TopDrugsTable({ sales }: { sales: Transaction[] }) {
  const topDrugs = useMemo(() => {
    const map = new Map<string, { name: string; units: number; revenue: number; txCount: number }>();
    sales.forEach(tx => {
      const existing = map.get(tx.drugId);
      if (existing) {
        existing.units += tx.quantity;
        existing.revenue += tx.totalAmount ?? 0;
        existing.txCount += 1;
      } else {
        map.set(tx.drugId, { name: tx.drugName, units: tx.quantity, revenue: tx.totalAmount ?? 0, txCount: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue).slice(0, 8);
  }, [sales]);

  if (topDrugs.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-600 font-body text-center py-8">No sales in this period</p>;
  }

  const maxRevenue = topDrugs[0]?.revenue ?? 1;

  return (
    <div className="space-y-2">
      {topDrugs.map((drug, i) => (
        <div key={drug.name} className="flex items-center gap-3">
          <span className="text-xs font-mono text-gray-400 dark:text-gray-600 w-4 flex-shrink-0">{i + 1}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-0.5">
              <p className="text-xs font-body text-gray-700 dark:text-gray-300 truncate">{drug.name}</p>
              <span className="text-xs font-mono font-600 text-gray-900 dark:text-white ml-2 flex-shrink-0">{formatGHS(drug.revenue)}</span>
            </div>
            <div className="h-1.5 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-500 rounded-full"
                style={{ width: `${(drug.revenue / maxRevenue) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-body mt-0.5">{drug.units} units · {drug.txCount} transactions</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function StaffLeaderboard({ sales }: { sales: Transaction[] }) {
  const staffStats = useMemo(() => {
    const map = new Map<string, { name: string; revenue: number; units: number; txCount: number }>();
    sales.forEach(tx => {
      const existing = map.get(tx.staffId);
      if (existing) {
        existing.revenue += tx.totalAmount ?? 0;
        existing.units += tx.quantity;
        existing.txCount += 1;
      } else {
        map.set(tx.staffId, { name: tx.staffName, revenue: tx.totalAmount ?? 0, units: tx.quantity, txCount: 1 });
      }
    });
    return Array.from(map.values()).sort((a, b) => b.revenue - a.revenue);
  }, [sales]);

  if (staffStats.length === 0) {
    return <p className="text-sm text-gray-400 dark:text-gray-600 font-body text-center py-8">No sales in this period</p>;
  }

  const colors = ['text-amber-500', 'text-gray-400', 'text-amber-700', 'text-gray-500'];
  const medals = ['ri-medal-line', 'ri-medal-2-line', 'ri-award-line'];

  return (
    <div className="space-y-2">
      {staffStats.map((s, i) => (
        <div key={s.name} className="flex items-center gap-3 p-3 rounded-lg bg-bg-light dark:bg-bg-dark">
          <div className={`w-7 h-7 flex items-center justify-center flex-shrink-0 ${colors[i] ?? 'text-gray-400'}`}>
            {i < 3 ? <i className={`${medals[i]} text-base`}></i> : <span className="text-xs font-mono">{i + 1}</span>}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-body font-medium text-gray-900 dark:text-white truncate">{s.name}</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-600 font-body">{s.units} units · {s.txCount} sales</p>
          </div>
          <span className="text-sm font-mono font-600 text-primary-500 flex-shrink-0">{formatGHS(s.revenue)}</span>
        </div>
      ))}
    </div>
  );
}

export default function SalesMetricsPage() {
  const { transactions, user } = useApp();
  const [period, setPeriod] = useState<Period>('7days');

  const { start, end } = useMemo(() => getDateRange(period), [period]);

  const periodSales = useMemo(() =>
    transactions.filter(tx =>
      tx.type === 'Sale' &&
      new Date(tx.timestamp) >= start &&
      new Date(tx.timestamp) <= end
    ), [transactions, start, end]);

  const metrics = useMemo(() => {
    const totalRevenue = periodSales.reduce((s, tx) => s + (tx.totalAmount ?? 0), 0);
    const totalUnits = periodSales.reduce((s, tx) => s + tx.quantity, 0);
    const totalTransactions = periodSales.length;
    const avgOrderValue = totalTransactions > 0 ? totalRevenue / totalTransactions : 0;
    return { totalRevenue, totalUnits, totalTransactions, avgOrderValue };
  }, [periodSales]);

  const dailyStats = useMemo(() => buildDailyStats(periodSales, period), [periodSales, period]);

  const periodLabel = period === 'today' ? 'Today' : period === '7days' ? 'Last 7 Days' : 'Last 30 Days';

  if (user?.role !== 'owner') {
    return <div className="p-6 text-sm text-gray-400 font-body">Owner access only.</div>;
  }

  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Sales Metrics</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">Revenue and performance overview</p>
        </div>
        {/* Period selector */}
        <div className="flex items-center gap-1 p-1 bg-surface-light dark:bg-surface-dark rounded-lg border border-border-light dark:border-border-dark">
          {(['today', '7days', '30days'] as Period[]).map(p => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all cursor-pointer whitespace-nowrap
                ${period === p
                  ? 'bg-primary-500 text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
            >
              {p === 'today' ? 'Today' : p === '7days' ? '7 Days' : '30 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          {
            label: 'Total Revenue',
            value: formatGHS(metrics.totalRevenue),
            sub: periodLabel,
            icon: 'ri-money-cny-circle-line',
            color: 'primary',
            valueColor: 'text-primary-500',
          },
          {
            label: 'Units Sold',
            value: metrics.totalUnits.toLocaleString(),
            sub: 'Dispensed',
            icon: 'ri-stack-line',
            color: 'success',
            valueColor: 'text-success-500',
          },
          {
            label: 'Transactions',
            value: metrics.totalTransactions.toLocaleString(),
            sub: 'Sales recorded',
            icon: 'ri-receipt-line',
            color: 'warning',
            valueColor: 'text-gray-900 dark:text-white',
          },
          {
            label: 'Avg Order Value',
            value: formatGHS(metrics.avgOrderValue),
            sub: 'Per transaction',
            icon: 'ri-bar-chart-line',
            color: 'danger',
            valueColor: 'text-gray-900 dark:text-white',
          },
        ].map(card => (
          <div key={card.label} className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">{card.label}</span>
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-${card.color}-50 dark:bg-${card.color}-500/10`}>
                <i className={`${card.icon} text-${card.color}-500 text-base`}></i>
              </div>
            </div>
            <p className={`text-2xl font-mono font-600 ${card.valueColor}`}>{card.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Revenue chart */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-heading font-600 text-gray-900 dark:text-white">Revenue</h3>
              <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">{periodLabel}</p>
            </div>
            <span className="text-lg font-mono font-700 text-primary-500">{formatGHS(metrics.totalRevenue)}</span>
          </div>
          <MiniBarChart data={dailyStats} valueKey="revenue" color="bg-primary-500" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-600 font-body">{dailyStats[0]?.label}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-600 font-body">{dailyStats[dailyStats.length - 1]?.label}</span>
          </div>
        </div>

        {/* Units chart */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-heading font-600 text-gray-900 dark:text-white">Units Sold</h3>
              <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">{periodLabel}</p>
            </div>
            <span className="text-lg font-mono font-700 text-success-500">{metrics.totalUnits.toLocaleString()}</span>
          </div>
          <MiniBarChart data={dailyStats} valueKey="units" color="bg-success-500" />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-gray-400 dark:text-gray-600 font-body">{dailyStats[0]?.label}</span>
            <span className="text-[10px] text-gray-400 dark:text-gray-600 font-body">{dailyStats[dailyStats.length - 1]?.label}</span>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top drugs */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <h3 className="text-sm font-heading font-600 text-gray-900 dark:text-white">Top Selling Drugs</h3>
            <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">By revenue · {periodLabel}</p>
          </div>
          <div className="p-4">
            <TopDrugsTable sales={periodSales} />
          </div>
        </div>

        {/* Staff leaderboard */}
        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <h3 className="text-sm font-heading font-600 text-gray-900 dark:text-white">Staff Performance</h3>
            <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">Revenue by staff · {periodLabel}</p>
          </div>
          <div className="p-4">
            <StaffLeaderboard sales={periodSales} />
          </div>
        </div>
      </div>

      {/* Recent sales table */}
      <div className="mt-4 bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
        <div className="p-4 border-b border-border-light dark:border-border-dark">
          <h3 className="text-sm font-heading font-600 text-gray-900 dark:text-white">Recent Sales</h3>
          <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">{periodSales.length} transactions · {periodLabel}</p>
        </div>
        {periodSales.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 rounded-full bg-gray-100 dark:bg-white/5">
              <i className="ri-receipt-line text-gray-400 text-xl"></i>
            </div>
            <p className="text-sm font-body text-gray-500 dark:text-gray-400">No sales recorded in this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark">
                  <th className="text-left px-4 py-2.5 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Drug</th>
                  <th className="text-left px-4 py-2.5 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Staff</th>
                  <th className="text-right px-4 py-2.5 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Qty</th>
                  <th className="text-right px-4 py-2.5 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Unit Price</th>
                  <th className="text-right px-4 py-2.5 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Total</th>
                  <th className="text-right px-4 py-2.5 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light dark:divide-border-dark">
                {periodSales.slice(0, 20).map(tx => (
                  <tr key={tx.id} className="hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
                    <td className="px-4 py-3">
                      <p className="text-sm font-body text-gray-900 dark:text-white">{tx.drugName}</p>
                      <p className="text-[10px] font-mono text-gray-400 dark:text-gray-600">{tx.id}</p>
                    </td>
                    <td className="px-4 py-3 text-sm font-body text-gray-600 dark:text-gray-400">{tx.staffName}</td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-gray-900 dark:text-white">{tx.quantity}</td>
                    <td className="px-4 py-3 text-right text-sm font-mono text-gray-600 dark:text-gray-400">
                      {tx.unitPrice ? formatGHS(tx.unitPrice) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-mono font-600 text-primary-500">
                      {tx.totalAmount ? formatGHS(tx.totalAmount) : '—'}
                    </td>
                    <td className="px-4 py-3 text-right text-xs font-mono text-gray-400 dark:text-gray-600 whitespace-nowrap">
                      {new Date(tx.timestamp).toLocaleString('en-GH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
