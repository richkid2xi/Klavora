import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Drug, Batch } from '@/mocks/types';

type Step = 'select' | 'quantity' | 'confirm' | 'receipt';

function genRef() {
  return 'TXN-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 900 + 100);
}

function getFEFOBatch(drug: Drug): Batch | null {
  const active = drug.batches.filter(b => b.quantity > 0).sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());
  return active[0] ?? null;
}

const statusClass: Record<string, string> = {
  'In Stock': 'bg-success-50 dark:bg-success-500/10 text-success-500',
  'Low Stock': 'bg-warning-50 dark:bg-warning-500/10 text-warning-500',
  'Out of Stock': 'bg-danger-50 dark:bg-danger-500/10 text-danger-500',
  'Expiring Soon': 'bg-warning-50 dark:bg-warning-500/10 text-warning-500',
};

export default function SellPage() {
  const { drugs, setDrugs, addTransaction, user } = useApp();
  const location = useLocation();
  const preselectedId = (location.state as { drugId?: string } | null)?.drugId;

  const [step, setStep] = useState<Step>(preselectedId ? 'quantity' : 'select');
  const [search, setSearch] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(() => preselectedId ? drugs.find(d => d.id === preselectedId) ?? null : null);
  const [quantity, setQuantity] = useState(1);
  const [receiptRef, setReceiptRef] = useState('');

  const fefoBatch = selectedDrug ? getFEFOBatch(selectedDrug) : null;

  const filtered = useMemo(() =>
    drugs.filter(d =>
      d.name.toLowerCase().includes(search.toLowerCase()) &&
      d.batches.some(b => b.quantity > 0)
    ), [drugs, search]);

  const handleSelectDrug = (drug: Drug) => {
    setSelectedDrug(drug);
    setQuantity(1);
    setStep('quantity');
  };

  const handleConfirm = () => {
    if (!selectedDrug || !fefoBatch || !user) return;
    const ref = genRef();
    setReceiptRef(ref);

    const unitPrice = selectedDrug.unitPrice ?? 0;
    const totalAmount = unitPrice * quantity;
    const stockBefore = selectedDrug.batches.reduce((s, b) => s + b.quantity, 0);
    const updatedDrugs = drugs.map(d => {
      if (d.id !== selectedDrug.id) return d;
      let remaining = quantity;
      const newBatches = d.batches
        .sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime())
        .map(b => {
          if (remaining <= 0 || b.quantity === 0) return b;
          const deduct = Math.min(b.quantity, remaining);
          remaining -= deduct;
          const newQty = b.quantity - deduct;
          return { ...b, quantity: newQty, status: newQty === 0 ? 'Out of Stock' as const : newQty <= 10 ? 'Low Stock' as const : b.status };
        });
      return { ...d, batches: newBatches };
    });

    setDrugs(updatedDrugs);
    addTransaction({
      id: ref,
      type: 'Sale',
      drugId: selectedDrug.id,
      drugName: selectedDrug.name,
      batchId: fefoBatch.id,
      batchExpiry: fefoBatch.expiry,
      quantity,
      unitPrice,
      totalAmount,
      staffId: user.id,
      staffName: user.name,
      timestamp: new Date().toISOString(),
      stockBefore,
      stockAfter: stockBefore - quantity,
      pharmacyId: user.pharmacyId,
    });
    setStep('receipt');
  };

  const handleReset = () => {
    setStep('select');
    setSelectedDrug(null);
    setQuantity(1);
    setSearch('');
    setReceiptRef('');
  };

  // ── SELECT STEP ──────────────────────────────────────────────────────────────
  if (step === 'select') {
    return (
      <div className="p-4 md:p-6 w-full">
        <div className="mb-5">
          <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Sell</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">Select a drug to begin a sale</p>
        </div>

        <div className="relative mb-4">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search drug to sell..."
            autoFocus
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
              <i className="ri-close-line"></i>
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 flex items-center justify-center mx-auto mb-3 rounded-full bg-gray-100 dark:bg-white/5">
              <i className="ri-medicine-bottle-line text-gray-400 text-xl"></i>
            </div>
            <p className="text-sm font-body text-gray-500 dark:text-gray-400">No drugs in stock matching your search</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filtered.map(drug => {
              const total = drug.batches.reduce((s, b) => s + b.quantity, 0);
              const status = total === 0 ? 'Out of Stock' : drug.batches.some(b => b.status === 'Low Stock') ? 'Low Stock' : 'In Stock';
              return (
                <button
                  key={drug.id}
                  onClick={() => handleSelectDrug(drug)}
                  className="text-left flex flex-col p-4 bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark hover:border-primary-500 transition-all cursor-pointer group"
                >
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-heading font-600 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors truncate">{drug.name}</p>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 mt-1 inline-block">{drug.category}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full flex-shrink-0 ${statusClass[status]}`}>{status}</span>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Units</p>
                      <p className="text-2xl font-mono font-600 text-gray-900 dark:text-white">{total}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Price</p>
                      <p className="text-sm font-mono font-600 text-primary-500">GH₵{(drug.unitPrice ?? 0).toFixed(2)}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ── QUANTITY STEP ────────────────────────────────────────────────────────────
  if (step === 'quantity' && selectedDrug && fefoBatch) {
    const maxQty = fefoBatch.quantity;
    const allBatches = selectedDrug.batches.filter(b => b.quantity > 0).sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

    return (
      <div className="p-4 md:p-6 w-full">
        <button onClick={() => setStep('select')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 cursor-pointer transition-colors">
          <i className="ri-arrow-left-line"></i><span className="font-body">Back to drug list</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: drug info + quantity */}
          <div>
            <h1 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-0.5">{selectedDrug.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-5">{selectedDrug.category}</p>

            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4 mb-4">
              <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-3">FEFO Batch (Auto-selected)</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-gray-500 dark:text-gray-400">{fefoBatch.id}</p>
                  <p className="text-sm font-body text-gray-700 dark:text-gray-300 mt-0.5">Exp <span className="font-mono">{fefoBatch.expiry}</span></p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">{fefoBatch.supplier}</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-mono font-600 text-gray-900 dark:text-white">{fefoBatch.quantity}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 font-body">available</p>
                </div>
              </div>
            </div>

            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-4 mb-5">
              <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-3">Quantity</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-11 h-11 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xl font-mono transition-colors cursor-pointer flex items-center justify-center"
                >-</button>
                <input
                  type="number"
                  min={1}
                  max={maxQty}
                  value={quantity}
                  onChange={e => setQuantity(Math.min(maxQty, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="flex-1 h-11 text-center text-2xl font-mono font-600 text-gray-900 dark:text-white bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:border-primary-500"
                />
                <button
                  onClick={() => setQuantity(q => Math.min(maxQty, q + 1))}
                  className="w-11 h-11 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xl font-mono transition-colors cursor-pointer flex items-center justify-center"
                >+</button>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-600 font-body text-center mt-2">Max: <span className="font-mono">{maxQty}</span></p>
              {selectedDrug.unitPrice > 0 && (
                <div className="mt-3 pt-3 border-t border-border-light dark:border-border-dark flex items-center justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-body">Unit Price</span>
                  <span className="text-xs font-mono text-gray-700 dark:text-gray-300">GH₵{selectedDrug.unitPrice.toFixed(2)}</span>
                </div>
              )}
              {selectedDrug.unitPrice > 0 && (
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-sm text-gray-700 dark:text-gray-300 font-body font-medium">Total</span>
                  <span className="text-lg font-mono font-700 text-primary-500">GH₵{(selectedDrug.unitPrice * quantity).toFixed(2)}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setStep('confirm')}
              disabled={quantity < 1 || quantity > maxQty}
              className="w-full h-btn bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
            >
              Continue to Confirm
            </button>
          </div>

          {/* Right: all batches overview */}
          <div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark">
              <div className="p-4 border-b border-border-light dark:border-border-dark">
                <h3 className="text-sm font-heading font-600 text-gray-900 dark:text-white">All Batches</h3>
                <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">Sorted by FEFO (earliest expiry first)</p>
              </div>
              <div className="divide-y divide-border-light dark:divide-border-dark">
                {allBatches.map((b, idx) => (
                  <div key={b.id} className={`p-4 ${idx === 0 ? 'bg-primary-50/50 dark:bg-primary-500/5' : ''}`}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{b.id}</span>
                        {idx === 0 && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-500">FEFO</span>}
                      </div>
                      <span className="text-sm font-mono font-600 text-gray-900 dark:text-white">{b.quantity}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 dark:text-gray-600 font-body">Exp <span className="font-mono">{b.expiry}</span></p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 font-body">{b.supplier}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── CONFIRM STEP ─────────────────────────────────────────────────────────────
  if (step === 'confirm' && selectedDrug && fefoBatch) {
    const remaining = fefoBatch.quantity - quantity;
    const totalBefore = selectedDrug.batches.reduce((s, b) => s + b.quantity, 0);

    return (
      <div className="p-4 md:p-6 w-full">
        <button onClick={() => setStep('quantity')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 cursor-pointer transition-colors">
          <i className="ri-arrow-left-line"></i><span className="font-body">Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h1 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-5">Confirm Sale</h1>

            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5 mb-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Drug</span>
                <span className="text-sm font-heading font-600 text-gray-900 dark:text-white text-right max-w-[60%]">{selectedDrug.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Category</span>
                <span className="text-sm font-body text-gray-700 dark:text-gray-300">{selectedDrug.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Quantity</span>
                <span className="text-sm font-mono font-600 text-gray-900 dark:text-white">{quantity} units</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Batch (FEFO)</span>
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{fefoBatch.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Batch Expiry</span>
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{fefoBatch.expiry}</span>
              </div>
              <div className="border-t border-border-light dark:border-border-dark pt-3 flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Stock Before</span>
                <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{totalBefore}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Remaining After Sale</span>
                <span className={`text-sm font-mono font-600 ${remaining <= 10 ? 'text-warning-500' : 'text-success-500'}`}>{remaining} units</span>
              </div>
              {selectedDrug.unitPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Unit Price</span>
                  <span className="text-sm font-mono text-gray-700 dark:text-gray-300">GH₵{selectedDrug.unitPrice.toFixed(2)}</span>
                </div>
              )}
              {selectedDrug.unitPrice > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Total Amount</span>
                  <span className="text-base font-mono font-700 text-primary-500">GH₵{(selectedDrug.unitPrice * quantity).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Staff</span>
                <span className="text-sm font-body text-gray-700 dark:text-gray-300">{user?.name}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('quantity')} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-400 rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">
                Back
              </button>
              <button onClick={handleConfirm} className="flex-1 h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">
                Confirm Sale
              </button>
            </div>
          </div>

          {/* Right: visual summary */}
          <div className="space-y-4">
            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
              <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-4">Stock Impact</p>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500 font-body">Before</span>
                    <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{totalBefore}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-xs text-gray-500 font-body">After</span>
                    <span className={`text-xs font-mono ${remaining <= 10 ? 'text-warning-500' : 'text-success-500'}`}>{totalBefore - quantity}</span>
                  </div>
                  <div className="h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${remaining <= 10 ? 'bg-warning-500' : 'bg-success-500'}`}
                      style={{ width: `${Math.max(2, ((totalBefore - quantity) / totalBefore) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border-light dark:border-border-dark flex justify-between">
                <span className="text-sm text-gray-500 font-body">Deducting</span>
                <span className="text-sm font-mono font-600 text-danger-500">-{quantity} units</span>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-500/20">
              <p className="text-xs text-primary-500 font-body font-medium">FEFO Compliance</p>
              <p className="text-xs text-primary-500/80 font-body mt-1">
                Deducting from batch expiring <span className="font-mono">{fefoBatch.expiry}</span> — the earliest available batch.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── RECEIPT STEP ─────────────────────────────────────────────────────────────
  if (step === 'receipt' && selectedDrug && fefoBatch) {
    return (
      <div className="p-4 md:p-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6 mb-4">
              <div className="text-center mb-5">
                <div className="w-14 h-14 flex items-center justify-center mx-auto mb-3 rounded-full bg-success-50 dark:bg-success-500/10">
                  <i className="ri-check-line text-success-500 text-2xl"></i>
                </div>
                <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">Sale Complete</h2>
                <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-1">Transaction recorded successfully</p>
              </div>
              <div className="border-t border-dashed border-border-light dark:border-border-dark pt-4 space-y-2.5">
                {[
                  { label: 'Pharmacy', value: user?.pharmacyName, mono: false },
                  { label: 'Ref', value: receiptRef, mono: true },
                  { label: 'Date', value: new Date().toLocaleString(), mono: true },
                  { label: 'Drug', value: selectedDrug.name, mono: false },
                  { label: 'Batch Exp', value: fefoBatch.expiry, mono: true },
                  { label: 'Quantity', value: String(quantity), mono: true },
                  ...(selectedDrug.unitPrice > 0 ? [
                    { label: 'Unit Price', value: `GH₵${selectedDrug.unitPrice.toFixed(2)}`, mono: true },
                    { label: 'Total', value: `GH₵${(selectedDrug.unitPrice * quantity).toFixed(2)}`, mono: true },
                  ] : []),
                  { label: 'Staff', value: user?.name, mono: false },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-xs text-gray-400 dark:text-gray-600 font-body uppercase tracking-widest">{row.label}</span>
                    <span className={`text-xs ${row.mono ? 'font-mono' : 'font-body'} text-gray-700 dark:text-gray-300 text-right max-w-[60%]`}>{row.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => window.print()} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-400 rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">
                <i className="ri-printer-line mr-2"></i>Print
              </button>
              <button onClick={handleReset} className="flex-1 h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">
                New Sale
              </button>
            </div>
          </div>

          {/* Right: quick stats */}
          <div className="space-y-4">
            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
              <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-4">Transaction Summary</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-light dark:bg-bg-dark">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-success-50 dark:bg-success-500/10">
                    <i className="ri-check-line text-success-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs font-body text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-sm font-body font-medium text-success-500">Completed</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-light dark:bg-bg-dark">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10">
                    <i className="ri-shield-check-line text-primary-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs font-body text-gray-500 dark:text-gray-400">FEFO Compliance</p>
                    <p className="text-sm font-body font-medium text-primary-500">Verified</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-bg-light dark:bg-bg-dark">
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-white/5">
                    <i className="ri-user-line text-gray-500 text-sm"></i>
                  </div>
                  <div>
                    <p className="text-xs font-body text-gray-500 dark:text-gray-400">Processed by</p>
                    <p className="text-sm font-body font-medium text-gray-900 dark:text-white">{user?.name}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
