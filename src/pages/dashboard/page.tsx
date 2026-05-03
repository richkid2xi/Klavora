import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Drug, Batch, Transaction } from '@/mocks/types';

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function daysUntil(dateStr: string) {
  const diff = new Date(dateStr).getTime() - Date.now();
  return Math.ceil(diff / 86400000);
}

const typeBadgeClass: Record<string, string> = {
  Sale: 'bg-primary-50 dark:bg-primary-500/10 text-primary-500',
  Restock: 'bg-success-50 dark:bg-success-500/10 text-success-500',
  Reversal: 'bg-warning-50 dark:bg-warning-500/10 text-warning-500',
  Reconciliation: 'bg-purple-50 dark:bg-purple-500/10 text-purple-500',
};

interface LowStockAlert { drug: Drug; batch: Batch }
interface ExpiringAlert { drug: Drug; batch: Batch; days: number }

function AlertTabs({ lowStock, expiring, onRestock }: {
  lowStock: LowStockAlert[];
  expiring: ExpiringAlert[];
  onRestock: () => void;
}) {
  const [tab, setTab] = useState<'low' | 'expiring'>('low');

  return (
    <div>
      <div className="flex border-b border-border-light dark:border-border-dark">
        <button
          onClick={() => setTab('low')}
          className={`px-4 py-2.5 text-sm font-body font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 -mb-px
            ${tab === 'low' ? 'border-warning-500 text-warning-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Low Stock <span className="ml-1 font-mono text-xs">{lowStock.length}</span>
        </button>
        <button
          onClick={() => setTab('expiring')}
          className={`px-4 py-2.5 text-sm font-body font-medium transition-colors cursor-pointer whitespace-nowrap border-b-2 -mb-px
            ${tab === 'expiring' ? 'border-danger-500 text-danger-500' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
        >
          Expiring Soon <span className="ml-1 font-mono text-xs">{expiring.length}</span>
        </button>
      </div>
      <div className="divide-y divide-border-light dark:divide-border-dark max-h-[340px] overflow-y-auto">
        {tab === 'low' ? (
          lowStock.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-600 font-body">All drugs are well stocked</div>
          ) : lowStock.map(({ drug, batch }) => (
            <div key={batch.id} className="flex items-center justify-between px-4 py-3 gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-gray-900 dark:text-white truncate">{drug.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 font-body">
                  <span className="font-mono">{batch.quantity}</span> units · Exp <span className="font-mono">{batch.expiry}</span>
                </p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${batch.status === 'Out of Stock' ? 'bg-danger-50 dark:bg-danger-500/10 text-danger-500' : 'bg-warning-50 dark:bg-warning-500/10 text-warning-500'}`}>
                {batch.status}
              </span>
              <button onClick={onRestock} className="text-xs font-body font-medium text-primary-500 hover:text-primary-600 cursor-pointer whitespace-nowrap transition-colors">
                Restock
              </button>
            </div>
          ))
        ) : (
          expiring.length === 0 ? (
            <div className="p-8 text-center text-sm text-gray-400 dark:text-gray-600 font-body">No batches expiring within 30 days</div>
          ) : expiring.map(({ drug, batch, days }) => (
            <div key={batch.id} className="flex items-center justify-between px-4 py-3 gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-body font-medium text-gray-900 dark:text-white truncate">{drug.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-600 font-body">
                  <span className="font-mono">{batch.quantity}</span> units · Exp <span className="font-mono">{batch.expiry}</span>
                </p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${days <= 7 ? 'bg-danger-50 dark:bg-danger-500/10 text-danger-500' : 'bg-warning-50 dark:bg-warning-500/10 text-warning-500'}`}>
                {days}d left
              </span>
              <button onClick={onRestock} className="text-xs font-body font-medium text-primary-500 hover:text-primary-600 cursor-pointer whitespace-nowrap transition-colors">
                Restock
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function ActivityItem({ tx }: { tx: Transaction }) {
  return (
    <div className="px-4 py-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className={`text-[10px] font-mono font-500 px-1.5 py-0.5 rounded-full ${typeBadgeClass[tx.type]}`}>{tx.type}</span>
          </div>
          <p className="text-sm font-body text-gray-900 dark:text-white truncate">{tx.drugName}</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 font-body">
            <span className="font-mono">{tx.quantity > 0 ? '+' : ''}{tx.quantity}</span> units · {tx.staffName}
          </p>
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-600 font-body whitespace-nowrap flex-shrink-0">{timeAgo(tx.timestamp)}</span>
      </div>
    </div>
  );
}

function SubscriptionBanner() {
  const RENEWAL_DAYS = 14; // mock: 14 days until renewal
  const [dismissed, setDismissed] = useState(() => {
    return sessionStorage.getItem('klavora-sub-dismissed') === 'true';
  });

  const handleDismiss = () => {
    sessionStorage.setItem('klavora-sub-dismissed', 'true');
    setDismissed(true);
  };

  if (dismissed) return null;

  const colorCls = RENEWAL_DAYS > 30
    ? 'bg-success-50 dark:bg-success-500/10 border-success-500/30 text-success-600 dark:text-success-400'
    : RENEWAL_DAYS > 7
    ? 'bg-warning-50 dark:bg-warning-500/10 border-warning-500/30 text-warning-600 dark:text-warning-400'
    : 'bg-danger-50 dark:bg-danger-500/10 border-danger-500/30 text-danger-600 dark:text-danger-400';

  const iconCls = RENEWAL_DAYS > 30 ? 'ri-shield-check-line text-success-500' : RENEWAL_DAYS > 7 ? 'ri-time-line text-warning-500' : 'ri-alarm-warning-line text-danger-500';

  return (
    <div className={`flex items-center justify-between gap-3 px-4 py-3 rounded-lg border mb-5 ${colorCls}`}>
      <div className="flex items-center gap-3">
        <i className={`${iconCls} text-base flex-shrink-0`}></i>
        <p className="text-sm font-body">
          Your next payment is in{' '}
          <span className="font-mono font-600">{RENEWAL_DAYS} days</span>.{' '}
          Renew via MoMo.
        </p>
      </div>
      <button
        onClick={handleDismiss}
        className="flex-shrink-0 text-xs font-body font-medium underline cursor-pointer hover:no-underline transition-all whitespace-nowrap"
      >
        Dismiss
      </button>
    </div>
  );
}

export default function DashboardPage() {
  const { drugs, transactions, user } = useApp();
  const navigate = useNavigate();

  const stats = useMemo(() => {
    const totalDrugs = drugs.length;
    const totalUnits = drugs.reduce((sum, d) => sum + d.batches.reduce((s, b) => s + b.quantity, 0), 0);
    const lowStock = drugs.filter(d => d.batches.some(b => b.status === 'Low Stock' || b.status === 'Out of Stock'));
    const expiringSoon = drugs.filter(d => d.batches.some(b => {
      const days = daysUntil(b.expiry);
      return days <= 30 && days > 0 && b.quantity > 0;
    }));
    return { totalDrugs, totalUnits, lowStock, expiringSoon };
  }, [drugs]);

  const lowStockAlerts = useMemo(() =>
    drugs.flatMap(d =>
      d.batches
        .filter(b => b.status === 'Low Stock' || b.status === 'Out of Stock')
        .map(b => ({ drug: d, batch: b }))
    ), [drugs]);

  const expiringAlerts = useMemo(() =>
    drugs.flatMap(d =>
      d.batches
        .filter(b => { const days = daysUntil(b.expiry); return days <= 30 && days > 0 && b.quantity > 0; })
        .map(b => ({ drug: d, batch: b, days: daysUntil(b.expiry) }))
    ).sort((a, b) => a.days - b.days), [drugs]);

  return (
    <div className="p-4 md:p-6 w-full">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">
          {user?.pharmacyName} · <span className="font-mono">{new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </p>
      </div>

      {/* Subscription banner */}
      {user?.role === 'owner' && <SubscriptionBanner />}

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        {[
          { label: 'Total Drugs', value: stats.totalDrugs, sub: 'Drug types tracked', icon: 'ri-medicine-bottle-line', color: 'primary' },
          { label: 'Total Units', value: stats.totalUnits.toLocaleString(), sub: 'Units in stock', icon: 'ri-stack-line', color: 'success' },
          { label: 'Low Stock', value: stats.lowStock.length, sub: 'Drugs need restocking', icon: 'ri-alert-line', color: 'warning', valueColor: 'text-warning-500' },
          { label: 'Expiring Soon', value: stats.expiringSoon.length, sub: 'Batches within 30 days', icon: 'ri-time-line', color: 'danger', valueColor: 'text-danger-500' },
        ].map(card => (
          <div key={card.label} className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">{card.label}</span>
              <div className={`w-8 h-8 flex items-center justify-center rounded-lg bg-${card.color}-50 dark:bg-${card.color}-500/10`}>
                <i className={`${card.icon} text-${card.color}-500 text-base`}></i>
              </div>
            </div>
            <p className={`text-3xl font-mono font-600 ${card.valueColor ?? 'text-gray-900 dark:text-white'}`}>{card.value}</p>
            <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-1">{card.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <h2 className="text-sm font-heading font-600 text-gray-900 dark:text-white">Alerts</h2>
          </div>
          <AlertTabs lowStock={lowStockAlerts} expiring={expiringAlerts} onRestock={() => navigate('/restock')} />
        </div>

        <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
          <div className="p-4 border-b border-border-light dark:border-border-dark">
            <h2 className="text-sm font-heading font-600 text-gray-900 dark:text-white">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border-light dark:divide-border-dark overflow-y-auto max-h-[420px]">
            {transactions.slice(0, 12).map(tx => (
              <ActivityItem key={tx.id} tx={tx} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
