import { useState } from 'react';
import { useApp } from '@/context/AppContext';

import OnboardingTour from '@/components/feature/OnboardingTour';

type SettingsTab = 'reversal' | 'reconciliation' | 'preferences' | 'account';
type PlanModal = 'renew' | 'cancel' | 'upgrade' | 'downgrade' | 'delete' | null;

export default function SettingsPage() {
  const { user, drugs, setDrugs, addTransaction, subscriptionPlan, setSubscriptionPlan } = useApp();
  const [showTourLocal, setShowTourLocal] = useState(false);
  const [tab, setTab] = useState<SettingsTab>('reversal');
  const [planModal, setPlanModal] = useState<PlanModal>(null);
  const [planActionDone, setPlanActionDone] = useState<string | null>(null);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  // Reversal state
  const [revDrugId, setRevDrugId] = useState('');
  const [revBatchId, setRevBatchId] = useState('');
  const [revQty, setRevQty] = useState(1);
  const [revReason, setRevReason] = useState<string>('Entry Error');
  const [revNote, setRevNote] = useState('');
  const [revConfirm, setRevConfirm] = useState(false);
  const [revDone, setRevDone] = useState(false);

  // Reconciliation state
  const [physCounts, setPhysCounts] = useState<Record<string, number>>({});
  const [recConfirm, setRecConfirm] = useState(false);
  const [recDone, setRecDone] = useState(false);

  // Preferences state
  const [autoCreateBatch, setAutoCreateBatch] = useState(() => {
    return localStorage.getItem('klavora-auto-batch') === 'true';
  });
  const [prefSaved, setPrefSaved] = useState(false);

  const handleSavePreferences = () => {
    localStorage.setItem('klavora-auto-batch', autoCreateBatch.toString());
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2500);
  };

  if (user?.role !== 'owner') {
    return <div className="p-6 text-sm text-gray-400 font-body">Owner access only.</div>;
  }

  const revDrug = drugs.find(d => d.id === revDrugId);
  const revBatch = revDrug?.batches.find(b => b.id === revBatchId);

  const handleReversal = () => {
    if (!revDrug || !revBatch || !user) return;
    const stockBefore = revDrug.batches.reduce((s, b) => s + b.quantity, 0);
    const updated = drugs.map(d => {
      if (d.id !== revDrugId) return d;
      return {
        ...d,
        batches: d.batches.map(b => {
          if (b.id !== revBatchId) return b;
          const newQty = b.quantity + revQty;
          return { ...b, quantity: newQty, status: newQty <= 10 ? 'Low Stock' as const : 'In Stock' as const };
        }),
      };
    });
    setDrugs(updated);
    addTransaction({
      id: 'REV-' + Date.now(),
      type: 'Reversal',
      drugId: revDrugId,
      drugName: revDrug.name,
      batchId: revBatchId,
      batchExpiry: revBatch.expiry,
      quantity: revQty,
      staffId: user.id,
      staffName: user.name,
      timestamp: new Date().toISOString(),
      stockBefore,
      stockAfter: stockBefore + revQty,
      reversalReason: revReason,
      pharmacyId: user.pharmacyId,
    });
    setRevConfirm(false);
    setRevDone(true);
  };

  const handleReconciliation = () => {
    if (!user) return;
    const updated = drugs.map(d => {
      const physTotal = physCounts[d.id];
      if (physTotal === undefined) return d;
      const sysTotal = d.batches.reduce((s, b) => s + b.quantity, 0);
      const diff = physTotal - sysTotal;
      if (diff === 0) return d;
      addTransaction({
        id: 'REC-' + Date.now() + '-' + d.id,
        type: 'Reconciliation',
        drugId: d.id,
        drugName: d.name,
        batchId: d.batches[0]?.id ?? '',
        batchExpiry: d.batches[0]?.expiry ?? '',
        quantity: diff,
        staffId: user.id,
        staffName: user.name,
        timestamp: new Date().toISOString(),
        stockBefore: sysTotal,
        stockAfter: physTotal,
        pharmacyId: user.pharmacyId,
      });
      let toDistribute = physTotal;
      const newBatches = d.batches.map((b, i) => {
        if (i === 0) {
          const q = Math.max(0, toDistribute);
          toDistribute = 0;
          return { ...b, quantity: q, status: q <= 10 ? 'Low Stock' as const : 'In Stock' as const };
        }
        return b;
      });
      return { ...d, batches: newBatches };
    });
    setDrugs(updated);
    setRecConfirm(false);
    setRecDone(true);
  };

  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Settings</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">Owner-only operations</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left sidebar nav */}
        <div className="lg:col-span-1">
          <nav className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark overflow-hidden">
            <div className="p-3 border-b border-border-light dark:border-border-dark">
              <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Operations</p>
            </div>
            {[
              { key: 'preferences', label: 'Inventory Preferences', icon: 'ri-settings-4-line', color: 'text-primary-500', desc: 'Configure inventory behaviour' },
              { key: 'account', label: 'Account & Plan', icon: 'ri-vip-crown-line', color: 'text-amber-500', desc: 'Subscription and pharmacy info' },
              { key: 'reversal', label: 'Stock Reversal', icon: 'ri-arrow-go-back-line', color: 'text-warning-500', desc: 'Adjust stock for errors or returns' },
              { key: 'reconciliation', label: 'Reconciliation', icon: 'ri-scales-line', color: 'text-purple-500', desc: 'Match system to physical count' },
            ].map(item => (
              <button
                key={item.key}
                onClick={() => setTab(item.key as SettingsTab)}
                className={`w-full text-left p-4 border-b border-border-light dark:border-border-dark last:border-0 transition-all cursor-pointer
                  ${tab === item.key
                    ? 'bg-bg-light dark:bg-bg-dark border-l-2 border-l-primary-500'
                    : 'hover:bg-bg-light dark:hover:bg-bg-dark'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-lg ${tab === item.key ? 'bg-primary-50 dark:bg-primary-500/10' : 'bg-gray-100 dark:bg-white/5'}`}>
                    <i className={`${item.icon} ${tab === item.key ? 'text-primary-500' : item.color} text-sm`}></i>
                  </div>
                  <div>
                    <p className={`text-sm font-body font-medium ${tab === item.key ? 'text-primary-500' : 'text-gray-700 dark:text-gray-300'}`}>{item.label}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-600 font-body mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </nav>

          {/* Info card */}
          <div className="mt-4 p-4 bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
            <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-2">Note</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-body leading-relaxed">
              All operations in this section are permanently logged in the Audit Log and cannot be undone. Double confirmation is required before any changes are applied.
            </p>
          </div>
        </div>

        {/* Right content area */}
        <div className="lg:col-span-3">
          {tab === 'account' && (
            <div className="space-y-4">
              {/* Current plan card */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
                <div className="p-5 border-b border-border-light dark:border-border-dark">
                  <div className="flex items-center gap-2">
                    <i className="ri-vip-crown-line text-amber-500"></i>
                    <h2 className="text-base font-heading font-600 text-gray-900 dark:text-white">Account &amp; Plan</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-1">Manage your subscription and pharmacy account.</p>
                </div>
                <div className="p-5 space-y-4">
                  {/* Plan status */}
                  {planActionDone && (
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-success-50 dark:bg-success-500/10 border border-success-500/20">
                      <i className="ri-checkbox-circle-line text-success-500"></i>
                      <p className="text-sm font-body text-success-600 dark:text-success-400">{planActionDone}</p>
                    </div>
                  )}

                  <div className={`p-4 rounded-lg border ${subscriptionPlan === 'premium' ? 'bg-amber-50 dark:bg-amber-500/10 border-amber-400/30' : 'bg-bg-light dark:bg-bg-dark border-border-light dark:border-border-dark'}`}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${subscriptionPlan === 'premium' ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`}>
                          <i className={`ri-vip-crown-line text-lg ${subscriptionPlan === 'premium' ? 'text-white' : 'text-gray-500'}`}></i>
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium text-gray-900 dark:text-white capitalize">{subscriptionPlan} Plan</p>
                          <p className="text-xs text-gray-400 dark:text-gray-600 font-body">
                            {subscriptionPlan === 'premium' ? 'GH₵400/month · All features unlocked' : 'GH₵150/month · Core features'}
                          </p>
                        </div>
                      </div>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${subscriptionPlan === 'premium' ? 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400' : 'bg-gray-100 dark:bg-white/5 text-gray-500'}`}>Active</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-amber-200/50 dark:border-white/10 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 font-body">
                      <i className="ri-calendar-line"></i>
                      <span>Next renewal: <span className="font-mono">May 24, 2026</span></span>
                    </div>
                  </div>

                  {/* Plan actions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Renew */}
                    <button
                      onClick={() => setPlanModal('renew')}
                      className="flex items-center gap-3 p-4 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-500/5 transition-all cursor-pointer text-left group"
                    >
                      <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 flex-shrink-0">
                        <i className="ri-refresh-line text-primary-500"></i>
                      </div>
                      <div>
                        <p className="text-sm font-body font-medium text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">Renew Plan</p>
                        <p className="text-xs text-gray-400 dark:text-gray-600 font-body">Pay via MoMo to extend</p>
                      </div>
                    </button>

                    {/* Upgrade / Downgrade */}
                    {subscriptionPlan === 'starter' ? (
                      <button
                        onClick={() => setPlanModal('upgrade')}
                        className="flex items-center gap-3 p-4 rounded-lg border border-amber-300/50 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/5 hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all cursor-pointer text-left group"
                      >
                        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-500/20 flex-shrink-0">
                          <i className="ri-arrow-up-circle-line text-amber-500"></i>
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium text-amber-700 dark:text-amber-400">Upgrade to Premium</p>
                          <p className="text-xs text-amber-600/70 dark:text-amber-500/60 font-body">GH₵400/month · All features</p>
                        </div>
                      </button>
                    ) : (
                      <button
                        onClick={() => setPlanModal('downgrade')}
                        className="flex items-center gap-3 p-4 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-warning-500 hover:bg-warning-50 dark:hover:bg-warning-500/5 transition-all cursor-pointer text-left group"
                      >
                        <div className="w-9 h-9 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5 flex-shrink-0">
                          <i className="ri-arrow-down-circle-line text-gray-500"></i>
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium text-gray-700 dark:text-gray-300 group-hover:text-warning-500 transition-colors">Downgrade to Starter</p>
                          <p className="text-xs text-gray-400 dark:text-gray-600 font-body">GH₵150/month · Core features</p>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Pharmacy info */}
                  <div className="p-4 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark space-y-3">
                    <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Pharmacy Details</p>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 font-body">Name</span>
                      <span className="text-xs font-body text-gray-900 dark:text-white">{user?.pharmacyName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 font-body">Owner</span>
                      <span className="text-xs font-body text-gray-900 dark:text-white">{user?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs text-gray-500 font-body">Account ID</span>
                      <span className="text-xs font-mono text-gray-400 dark:text-gray-600">{user?.pharmacyId}</span>
                    </div>
                  </div>

                  {/* Relaunch tour */}
                  <div className="p-4 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-body font-medium text-gray-900 dark:text-white mb-0.5">Onboarding Tour</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 font-body">Relaunch the guided tour to explore all features.</p>
                    </div>
                    <button
                      onClick={() => { localStorage.removeItem('klavora-tour-done'); setShowTourLocal(true); }}
                      className="h-btn px-4 border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-body cursor-pointer whitespace-nowrap hover:border-amber-500 hover:text-amber-500 transition-colors flex-shrink-0"
                    >
                      <i className="ri-compass-3-line mr-1.5"></i>Relaunch Tour
                    </button>
                  </div>
                </div>
              </div>

              {/* Danger zone */}
              <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-danger-500/20">
                <div className="p-5 border-b border-danger-500/20">
                  <div className="flex items-center gap-2">
                    <i className="ri-error-warning-line text-danger-500"></i>
                    <h2 className="text-base font-heading font-600 text-gray-900 dark:text-white">Danger Zone</h2>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-1">Irreversible actions. Proceed with caution.</p>
                </div>
                <div className="p-5 space-y-3">
                  {/* Cancel plan */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark">
                    <div>
                      <p className="text-sm font-body font-medium text-gray-900 dark:text-white">Cancel Subscription</p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 font-body">Your plan will remain active until the end of the billing period. No refunds are issued.</p>
                    </div>
                    <button
                      onClick={() => setPlanModal('cancel')}
                      className="h-8 px-4 flex-shrink-0 border border-danger-500/40 text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-500/10 rounded-lg text-xs font-body font-medium cursor-pointer whitespace-nowrap transition-colors"
                    >
                      Cancel Plan
                    </button>
                  </div>

                  {/* Delete account */}
                  <div className="flex items-center justify-between gap-4 p-4 rounded-lg bg-danger-50 dark:bg-danger-500/5 border border-danger-500/20">
                    <div>
                      <p className="text-sm font-body font-medium text-danger-600 dark:text-danger-400">Delete Account</p>
                      <p className="text-xs text-danger-500/70 dark:text-danger-400/60 font-body">Permanently deletes all data. You must contact us first — we will review and approve the request.</p>
                    </div>
                    <button
                      onClick={() => setPlanModal('delete')}
                      className="h-8 px-4 flex-shrink-0 bg-danger-500 hover:bg-danger-600 text-white rounded-lg text-xs font-body font-medium cursor-pointer whitespace-nowrap transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {tab === 'preferences' && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
              <div className="p-5 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                  <i className="ri-settings-4-line text-primary-500"></i>
                  <h2 className="text-base font-heading font-600 text-gray-900 dark:text-white">Inventory Preferences</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-1">Configure how inventory and restocking behaves.</p>
              </div>
              <div className="p-5 space-y-5">
                <div className="flex items-start justify-between gap-4 p-4 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark">
                  <div className="flex-1">
                    <p className="text-sm font-body font-medium text-gray-900 dark:text-white mb-0.5">Auto-create new batch on restock</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-body leading-relaxed">
                      When enabled, the restock flow skips the question asking if this is a new delivery and automatically creates a new batch every time. Double confirmation still applies.
                    </p>
                  </div>
                  <button
                    onClick={() => setAutoCreateBatch(v => !v)}
                    className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors cursor-pointer ${autoCreateBatch ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform ${autoCreateBatch ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  {prefSaved && (
                    <span className="flex items-center gap-1.5 text-sm text-success-500 font-body">
                      <i className="ri-check-line"></i>Preferences saved
                    </span>
                  )}
                  {!prefSaved && <span />}
                  <button
                    onClick={handleSavePreferences}
                    className="h-btn px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}

          {tab === 'reversal' && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
              <div className="p-5 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                  <i className="ri-arrow-go-back-line text-warning-500"></i>
                  <h2 className="text-base font-heading font-600 text-gray-900 dark:text-white">Stock Reversal</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-1">Reverse stock for entry errors, customer returns, or damaged goods.</p>
              </div>

              <div className="p-5">
                {/* Amber warning */}
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-50 dark:bg-warning-500/10 border border-warning-500/30 mb-6">
                  <i className="ri-alert-line text-warning-500 text-base flex-shrink-0 mt-0.5"></i>
                  <p className="text-sm text-warning-500 font-body">Stock reversals adjust inventory and are permanently logged. Use only for entry errors, returns, or damaged stock.</p>
                </div>

                {revDone ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4 rounded-full bg-warning-50 dark:bg-warning-500/10">
                      <i className="ri-check-line text-warning-500 text-2xl"></i>
                    </div>
                    <p className="text-base font-heading font-600 text-gray-900 dark:text-white mb-1">Reversal Complete</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">The reversal has been logged in the Audit Log.</p>
                    <button
                      onClick={() => { setRevDone(false); setRevDrugId(''); setRevBatchId(''); setRevQty(1); setRevNote(''); }}
                      className="h-btn px-6 border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-body cursor-pointer whitespace-nowrap hover:border-warning-500 hover:text-warning-500 transition-colors"
                    >
                      New Reversal
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Drug</label>
                        <select
                          value={revDrugId}
                          onChange={e => { setRevDrugId(e.target.value); setRevBatchId(''); }}
                          className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
                        >
                          <option value="">Select drug...</option>
                          {drugs.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                        </select>
                      </div>

                      {revDrug && (
                        <div>
                          <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Batch</label>
                          <select
                            value={revBatchId}
                            onChange={e => setRevBatchId(e.target.value)}
                            className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
                          >
                            <option value="">Select batch...</option>
                            {revDrug.batches.map(b => (
                              <option key={b.id} value={b.id}>{b.id} — Exp {b.expiry} ({b.quantity} units)</option>
                            ))}
                          </select>
                        </div>
                      )}

                      <div>
                        <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Quantity to Reverse</label>
                        <input
                          type="number"
                          min={1}
                          value={revQty}
                          onChange={e => setRevQty(Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Reason</label>
                        <select
                          value={revReason}
                          onChange={e => setRevReason(e.target.value)}
                          className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
                        >
                          <option>Entry Error</option>
                          <option>Customer Return</option>
                          <option>Damaged Stock</option>
                          <option>Other</option>
                        </select>
                      </div>

                      {revReason === 'Other' && (
                        <div>
                          <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Note</label>
                          <textarea
                            value={revNote}
                            onChange={e => setRevNote(e.target.value)}
                            rows={3}
                            maxLength={500}
                            placeholder="Describe the reason..."
                            className="w-full px-3 py-2 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                          />
                        </div>
                      )}

                      {/* Preview card */}
                      {revDrug && revBatch && (
                        <div className="p-4 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark">
                          <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-2">Preview</p>
                          <div className="space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500 font-body">Drug</span>
                              <span className="text-xs font-body text-gray-900 dark:text-white">{revDrug.name}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500 font-body">Current Stock</span>
                              <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{revBatch.quantity}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-xs text-gray-500 font-body">After Reversal</span>
                              <span className="text-xs font-mono font-600 text-warning-500">{revBatch.quantity + revQty}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <button
                        onClick={() => setRevConfirm(true)}
                        disabled={!revDrugId || !revBatchId}
                        className="w-full h-btn bg-warning-500 hover:bg-warning-600 disabled:opacity-40 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
                      >
                        Review Reversal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {tab === 'reconciliation' && (
            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
              <div className="p-5 border-b border-border-light dark:border-border-dark">
                <div className="flex items-center gap-2">
                  <i className="ri-scales-line text-purple-500"></i>
                  <h2 className="text-base font-heading font-600 text-gray-900 dark:text-white">Stock Reconciliation</h2>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-1">Enter physical counts to reconcile system stock with actual inventory.</p>
              </div>

              <div className="p-5">
                <div className="flex items-start gap-3 p-4 rounded-lg bg-warning-50 dark:bg-warning-500/10 border border-warning-500/30 mb-5">
                  <i className="ri-alert-line text-warning-500 text-base flex-shrink-0 mt-0.5"></i>
                  <p className="text-sm text-warning-500 font-body">Enter physical counts. Discrepancies will be logged and stock adjusted automatically.</p>
                </div>

                {recDone ? (
                  <div className="text-center py-12">
                    <div className="w-14 h-14 flex items-center justify-center mx-auto mb-4 rounded-full bg-purple-50 dark:bg-purple-500/10">
                      <i className="ri-check-line text-purple-500 text-2xl"></i>
                    </div>
                    <p className="text-base font-heading font-600 text-gray-900 dark:text-white mb-1">Reconciliation Saved</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">Report has been logged in the Audit Log.</p>
                    <button
                      onClick={() => { setRecDone(false); setPhysCounts({}); }}
                      className="h-btn px-6 border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-body cursor-pointer whitespace-nowrap hover:border-purple-500 hover:text-purple-500 transition-colors"
                    >
                      New Reconciliation
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="rounded-lg border border-border-light dark:border-border-dark overflow-hidden mb-4">
                      <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-bg-light dark:bg-bg-dark border-b border-border-light dark:border-border-dark">
                        <span className="col-span-5 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Drug</span>
                        <span className="col-span-2 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">System</span>
                        <span className="col-span-3 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Physical Count</span>
                        <span className="col-span-2 text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Diff</span>
                      </div>
                      <div className="divide-y divide-border-light dark:divide-border-dark max-h-[480px] overflow-y-auto">
                        {drugs.map(d => {
                          const sysQty = d.batches.reduce((s, b) => s + b.quantity, 0);
                          const phys = physCounts[d.id] ?? sysQty;
                          const disc = phys - sysQty;
                          return (
                            <div key={d.id} className="grid grid-cols-12 gap-2 px-4 py-2.5 items-center hover:bg-bg-light dark:hover:bg-bg-dark transition-colors">
                              <div className="col-span-5">
                                <p className="text-sm font-body text-gray-700 dark:text-gray-300 truncate">{d.name}</p>
                                <p className="text-[10px] text-gray-400 dark:text-gray-600 font-body">{d.category}</p>
                              </div>
                              <p className="col-span-2 text-sm font-mono text-gray-900 dark:text-white">{sysQty}</p>
                              <div className="col-span-3">
                                <input
                                  type="number"
                                  min={0}
                                  value={physCounts[d.id] ?? sysQty}
                                  onChange={e => setPhysCounts(prev => ({ ...prev, [d.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                                  className="h-8 px-2 rounded border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 w-full"
                                />
                              </div>
                              <p className={`col-span-2 text-sm font-mono font-600 ${disc > 0 ? 'text-success-500' : disc < 0 ? 'text-danger-500' : 'text-gray-400 dark:text-gray-600'}`}>
                                {disc > 0 ? '+' : ''}{disc}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Summary bar */}
                    <div className="flex items-center gap-6 p-4 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark mb-4">
                      <div>
                        <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Total System</p>
                        <p className="text-lg font-mono font-600 text-gray-900 dark:text-white">
                          {drugs.reduce((s, d) => s + d.batches.reduce((ss, b) => ss + b.quantity, 0), 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Total Physical</p>
                        <p className="text-lg font-mono font-600 text-gray-900 dark:text-white">
                          {drugs.reduce((s, d) => {
                            const sys = d.batches.reduce((ss, b) => ss + b.quantity, 0);
                            return s + (physCounts[d.id] ?? sys);
                          }, 0)}
                        </p>
                      </div>
                      <div>
                        <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Net Discrepancy</p>
                        <p className={`text-lg font-mono font-600 ${(() => {
                          const diff = drugs.reduce((s, d) => {
                            const sys = d.batches.reduce((ss, b) => ss + b.quantity, 0);
                            return s + ((physCounts[d.id] ?? sys) - sys);
                          }, 0);
                          return diff > 0 ? 'text-success-500' : diff < 0 ? 'text-danger-500' : 'text-gray-400 dark:text-gray-600';
                        })()}`}>
                          {(() => {
                            const diff = drugs.reduce((s, d) => {
                              const sys = d.batches.reduce((ss, b) => ss + b.quantity, 0);
                              return s + ((physCounts[d.id] ?? sys) - sys);
                            }, 0);
                            return (diff > 0 ? '+' : '') + diff;
                          })()}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setRecConfirm(true)}
                      className="w-full h-btn bg-purple-500 hover:bg-purple-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
                    >
                      Save Reconciliation Report
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reversal confirm modal */}
      {revConfirm && revDrug && revBatch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setRevConfirm(false)}>
          <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-alert-line text-warning-500"></i>
              <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">Confirm Reversal</h2>
            </div>
            <div className="space-y-2 mb-5">
              <div className="flex justify-between"><span className="text-sm text-gray-500 font-body">Drug</span><span className="text-sm font-body text-gray-900 dark:text-white">{revDrug.name}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500 font-body">Batch</span><span className="text-sm font-mono text-gray-700 dark:text-gray-300">{revBatch.id}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500 font-body">Quantity</span><span className="text-sm font-mono font-600 text-warning-500">+{revQty}</span></div>
              <div className="flex justify-between"><span className="text-sm text-gray-500 font-body">Reason</span><span className="text-sm font-body text-gray-700 dark:text-gray-300">{revReason}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setRevConfirm(false)} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={handleReversal} className="flex-1 h-btn bg-warning-500 hover:bg-warning-600 text-white rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding tour relaunch */}
      {showTourLocal && <OnboardingTour onClose={() => setShowTourLocal(false)} />}

      {/* Plan action modals */}
      {planModal === 'renew' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setPlanModal(null)}>
          <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-refresh-line text-primary-500"></i>
              <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">Renew Plan</h2>
            </div>
            <div className="p-4 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 font-body">Plan</span>
                <span className="text-sm font-body font-medium text-gray-900 dark:text-white capitalize">{subscriptionPlan}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 font-body">Amount</span>
                <span className="text-sm font-mono font-700 text-primary-500">{subscriptionPlan === 'premium' ? 'GH₵400.00' : 'GH₵150.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 font-body">Method</span>
                <span className="text-sm font-body text-gray-700 dark:text-gray-300">Mobile Money (MoMo)</span>
              </div>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 font-body mb-5">You will receive a MoMo prompt on your registered number to complete payment.</p>
            <div className="flex gap-3">
              <button onClick={() => setPlanModal(null)} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => { setPlanModal(null); setPlanActionDone('Renewal initiated. Check your phone for the MoMo prompt.'); setTimeout(() => setPlanActionDone(null), 5000); }} className="flex-1 h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Pay via MoMo</button>
            </div>
          </div>
        </div>
      )}

      {planModal === 'upgrade' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setPlanModal(null)}>
          <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-arrow-up-circle-line text-amber-500"></i>
              <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">Upgrade to Premium</h2>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-400/30 mb-4">
              <p className="text-sm font-body font-medium text-amber-700 dark:text-amber-400 mb-2">What you unlock:</p>
              <ul className="space-y-1.5">
                {['Unlimited staff PINs', 'Full audit log with reversal &amp; reconciliation', 'Insights tab with top sellers', 'Staff activity analytics', 'Priority support'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-400 font-body">
                    <i className="ri-check-line text-amber-500 flex-shrink-0"></i>
                    <span dangerouslySetInnerHTML={{ __html: f }} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-between mb-5">
              <span className="text-sm text-gray-500 font-body">New monthly amount</span>
              <span className="text-base font-mono font-700 text-amber-500">GH₵400.00</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPlanModal(null)} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={() => { setSubscriptionPlan('premium'); setPlanModal(null); setPlanActionDone('Plan upgraded to Premium! All features are now unlocked.'); setTimeout(() => setPlanActionDone(null), 5000); }} className="flex-1 h-btn bg-amber-500 hover:bg-amber-600 text-white rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Upgrade Now</button>
            </div>
          </div>
        </div>
      )}

      {planModal === 'downgrade' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setPlanModal(null)}>
          <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-alert-line text-warning-500"></i>
              <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">Downgrade to Starter</h2>
            </div>
            <div className="p-4 rounded-lg bg-warning-50 dark:bg-warning-500/10 border border-warning-500/30 mb-4">
              <p className="text-sm font-body font-medium text-warning-600 dark:text-warning-400 mb-2">You will lose access to:</p>
              <ul className="space-y-1.5">
                {['Insights tab', 'Full audit log', 'Staff activity analytics', 'Priority support', 'Unlimited staff PINs (capped at 5)'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-warning-600 dark:text-warning-400 font-body">
                    <i className="ri-close-line text-warning-500 flex-shrink-0"></i>{f}
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-xs text-gray-400 dark:text-gray-600 font-body mb-5">Downgrade takes effect at the end of your current billing period. New monthly amount: <span className="font-mono font-600">GH₵150.00</span>.</p>
            <div className="flex gap-3">
              <button onClick={() => setPlanModal(null)} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Keep Premium</button>
              <button onClick={() => { setSubscriptionPlan('starter'); setPlanModal(null); setPlanActionDone('Plan downgraded to Starter. Takes effect at end of billing period.'); setTimeout(() => setPlanActionDone(null), 5000); }} className="flex-1 h-btn bg-warning-500 hover:bg-warning-600 text-white rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Confirm Downgrade</button>
            </div>
          </div>
        </div>
      )}

      {planModal === 'cancel' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setPlanModal(null)}>
          <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-error-warning-line text-danger-500"></i>
              <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">Cancel Subscription</h2>
            </div>
            <div className="p-4 rounded-lg bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 mb-4 space-y-2">
              <p className="text-sm font-body text-danger-600 dark:text-danger-400">Before you cancel, please note:</p>
              <ul className="space-y-1.5 mt-2">
                {['No refunds will be issued', 'Access continues until May 24, 2026', 'All data is retained for 30 days after cancellation', 'You can resubscribe at any time'].map(f => (
                  <li key={f} className="flex items-center gap-2 text-xs text-danger-500/80 dark:text-danger-400/80 font-body">
                    <i className="ri-information-line flex-shrink-0"></i>{f}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setPlanModal(null)} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Keep Plan</button>
              <button onClick={() => { setPlanModal(null); setPlanActionDone('Subscription cancelled. Access continues until May 24, 2026.'); setTimeout(() => setPlanActionDone(null), 6000); }} className="flex-1 h-btn bg-danger-500 hover:bg-danger-600 text-white rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

      {planModal === 'delete' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setPlanModal(null)}>
          <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <i className="ri-delete-bin-line text-danger-500"></i>
              <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">Delete Account</h2>
            </div>
            <div className="p-4 rounded-lg bg-danger-50 dark:bg-danger-500/10 border border-danger-500/20 mb-4">
              <p className="text-sm font-body text-danger-600 dark:text-danger-400 leading-relaxed">
                Account deletion is <strong>permanent and irreversible</strong>. All inventory, transactions, staff records, and audit logs will be permanently erased.
              </p>
              <p className="text-sm font-body text-danger-600 dark:text-danger-400 mt-2 leading-relaxed">
                You must <strong>contact us first</strong> at <span className="font-mono">support@klavora.app</span>. We will review and approve your request before deletion proceeds.
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">Type <span className="font-mono font-600">DELETE</span> to confirm you understand</label>
              <input
                type="text"
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE here"
                className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-danger-500 transition-colors"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setPlanModal(null); setDeleteConfirmText(''); }} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Cancel</button>
              <button
                disabled={deleteConfirmText !== 'DELETE'}
                onClick={() => { setPlanModal(null); setDeleteConfirmText(''); setPlanActionDone('Request received. Our team will contact you within 24 hours to process your account deletion.'); setTimeout(() => setPlanActionDone(null), 8000); }}
                className="flex-1 h-btn bg-danger-500 hover:bg-danger-600 disabled:opacity-40 text-white rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap"
              >
                Request Deletion
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reconciliation confirm modal */}
      {recConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setRecConfirm(false)}>
          <div className="w-full max-w-sm bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white mb-2">Confirm Reconciliation?</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">Stock will be adjusted to match physical counts and logged permanently.</p>
            <div className="flex gap-3">
              <button onClick={() => setRecConfirm(false)} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Cancel</button>
              <button onClick={handleReconciliation} className="flex-1 h-btn bg-purple-500 hover:bg-purple-600 text-white rounded-btn text-sm font-medium font-body cursor-pointer whitespace-nowrap">Confirm</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
