import { useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import type { Drug } from '@/mocks/types';

type Step = 'select' | 'mode' | 'form' | 'confirm' | 'done';

function genRef() {
  return 'RST-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 900 + 100);
}

export default function RestockPage() {
  const { drugs, setDrugs, addTransaction, user } = useApp();
  const location = useLocation();
  const preselectedId = (location.state as { drugId?: string } | null)?.drugId;

  const [step, setStep] = useState<Step>(preselectedId ? 'mode' : 'select');
  const [search, setSearch] = useState('');
  const [selectedDrug, setSelectedDrug] = useState<Drug | null>(() => preselectedId ? drugs.find(d => d.id === preselectedId) ?? null : null);
  const [isNewBatch, setIsNewBatch] = useState<boolean | null>(null);
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [newExpiry, setNewExpiry] = useState('');
  const [newSupplier, setNewSupplier] = useState('');
  const [ref, setRef] = useState('');

  const filtered = useMemo(() =>
    drugs.filter(d => d.name.toLowerCase().includes(search.toLowerCase())), [drugs, search]);

  const handleSelectDrug = (drug: Drug) => {
    setSelectedDrug(drug);
    setStep('mode');
  };

  const handleConfirm = () => {
    if (!selectedDrug || !user) return;
    const newRef = genRef();
    setRef(newRef);

    const stockBefore = selectedDrug.batches.reduce((s, b) => s + b.quantity, 0);
    let batchId = selectedBatchId;
    let batchExpiry = '';

    const updatedDrugs = drugs.map(d => {
      if (d.id !== selectedDrug.id) return d;
      if (isNewBatch) {
        const newId = 'batch-' + Date.now();
        batchId = newId;
        batchExpiry = newExpiry;
        const newBatch = {
          id: newId,
          quantity,
          expiry: newExpiry,
          supplier: newSupplier || 'Unknown',
          status: quantity <= 10 ? 'Low Stock' as const : 'In Stock' as const,
        };
        return { ...d, batches: [...d.batches, newBatch] };
      } else {
        const existing = d.batches.find(b => b.id === selectedBatchId);
        batchExpiry = existing?.expiry ?? '';
        return {
          ...d,
          batches: d.batches.map(b => {
            if (b.id !== selectedBatchId) return b;
            const newQty = b.quantity + quantity;
            return { ...b, quantity: newQty, status: newQty <= 10 ? 'Low Stock' as const : 'In Stock' as const };
          }),
        };
      }
    });

    setDrugs(updatedDrugs);
    addTransaction({
      id: newRef,
      type: 'Restock',
      drugId: selectedDrug.id,
      drugName: selectedDrug.name,
      batchId,
      batchExpiry,
      quantity,
      staffId: user.id,
      staffName: user.name,
      timestamp: new Date().toISOString(),
      stockBefore,
      stockAfter: stockBefore + quantity,
      pharmacyId: user.pharmacyId,
    });
    setStep('done');
  };

  const handleReset = () => {
    setStep('select');
    setSelectedDrug(null);
    setIsNewBatch(null);
    setSelectedBatchId('');
    setQuantity(1);
    setNewExpiry('');
    setNewSupplier('');
    setRef('');
    setSearch('');
  };

  if (step === 'select') {
    return (
      <div className="p-4 md:p-6 w-full">
        <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white mb-5">Restock</h1>
        <div className="relative mb-4">
          <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base"></i>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search drug to restock..."
            autoFocus
            className="w-full h-10 pl-9 pr-4 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map(drug => {
            const total = drug.batches.reduce((s, b) => s + b.quantity, 0);
            return (
              <button
                key={drug.id}
                onClick={() => handleSelectDrug(drug)}
                className="w-full text-left flex flex-col p-4 bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark hover:border-success-500 transition-all cursor-pointer group"
              >
                <div>
                  <p className="text-sm font-heading font-600 text-gray-900 dark:text-white group-hover:text-success-500 transition-colors">{drug.name}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 font-body mt-0.5">{drug.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-mono font-600 text-gray-900 dark:text-white">{total}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-600 font-body">in stock</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (selectedDrug && step !== 'done') {
    const totalStock = selectedDrug.batches.reduce((s, b) => s + b.quantity, 0);

    return (
      <div className="p-4 md:p-6 w-full">
        <button onClick={handleReset} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6 cursor-pointer transition-colors">
          <i className="ri-arrow-left-line"></i><span className="font-body">Change Medicine</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Main Content Area */}
          <div className="lg:col-span-2">
            {step === 'mode' && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6">
                <h2 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-1">Restock Mode</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-6">Is this a new delivery with a different expiry date?</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => { setIsNewBatch(true); setStep('form'); }}
                    className="p-4 text-left bg-bg-light dark:bg-bg-dark rounded-xl border border-border-light dark:border-border-dark hover:border-success-500 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-success-50 dark:bg-success-500/10 mb-3">
                      <i className="ri-add-circle-line text-success-500 text-lg"></i>
                    </div>
                    <p className="text-sm font-heading font-600 text-gray-900 dark:text-white group-hover:text-success-500 transition-colors">New Batch</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600 font-body mt-1">Different expiry date or supplier</p>
                  </button>
                  <button
                    onClick={() => { setIsNewBatch(false); setStep('form'); }}
                    className="p-4 text-left bg-bg-light dark:bg-bg-dark rounded-xl border border-border-light dark:border-border-dark hover:border-primary-500 transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 mb-3">
                      <i className="ri-add-line text-primary-500 text-lg"></i>
                    </div>
                    <p className="text-sm font-heading font-600 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">Existing Batch</p>
                    <p className="text-[11px] text-gray-400 dark:text-gray-600 font-body mt-1">Top up current stock levels</p>
                  </button>
                </div>
              </div>
            )}

            {step === 'form' && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading font-700 text-gray-900 dark:text-white">
                    {isNewBatch ? 'New Batch Details' : 'Batch Selection & Quantity'}
                  </h2>
                  <button onClick={() => setStep('mode')} className="text-xs text-primary-500 hover:underline">Change mode</button>
                </div>

                <div className="space-y-5">
                  {!isNewBatch && (
                    <div>
                      <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-body">Select Batch to Restock</label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {selectedDrug.batches.map(b => (
                          <button
                            key={b.id}
                            onClick={() => setSelectedBatchId(b.id)}
                            className={`text-left p-3 rounded-lg border transition-all cursor-pointer
                              ${selectedBatchId === b.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10 shadow-sm' : 'border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-primary-500'}`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] font-mono text-gray-400 uppercase">Batch #{b.id.slice(-4)}</span>
                              <span className="text-xs font-mono font-600 text-gray-900 dark:text-white">{b.quantity} in stock</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 font-body mt-0.5">Exp <span className="font-mono">{b.expiry}</span></p>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {isNewBatch && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Expiry Date</label>
                        <input
                          type="date"
                          value={newExpiry}
                          onChange={e => setNewExpiry(e.target.value)}
                          className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Supplier</label>
                        <input
                          type="text"
                          value={newSupplier}
                          onChange={e => setNewSupplier(e.target.value)}
                          placeholder="e.g. PharmaCo Ghana"
                          className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      </div>
                    </div>
                  )}

                  <div className="pt-2">
                    <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-2 font-body">Quantity to Add</label>
                    <div className="flex items-center gap-4 max-w-xs">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 rounded-xl border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xl font-mono transition-colors flex items-center justify-center">-</button>
                      <input
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="flex-1 h-12 text-center text-2xl font-mono font-700 text-gray-900 dark:text-white bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-xl focus:outline-none focus:border-primary-500"
                      />
                      <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 rounded-xl border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xl font-mono transition-colors flex items-center justify-center">+</button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setStep('confirm')}
                  disabled={isNewBatch ? (!newExpiry || quantity < 1) : (!selectedBatchId || quantity < 1)}
                  className="w-full h-12 mt-8 bg-success-500 hover:bg-success-600 disabled:opacity-40 text-white rounded-xl text-sm font-medium font-body transition-colors flex items-center justify-center gap-2"
                >
                  Review Restock <i className="ri-arrow-right-line"></i>
                </button>
              </div>
            )}

            {step === 'confirm' && (
              <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-6">
                <h2 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-6">Confirm Restock</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between py-2 border-b border-border-light dark:border-border-dark">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Restock Type</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{isNewBatch ? 'New Batch' : 'Existing Batch'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-border-light dark:border-border-dark">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Added Quantity</span>
                    <span className="text-sm font-mono font-700 text-success-500">+{quantity} units</span>
                  </div>
                  {isNewBatch ? (
                    <>
                      <div className="flex justify-between py-2 border-b border-border-light dark:border-border-dark">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Expiry Date</span>
                        <span className="text-sm font-mono text-gray-900 dark:text-white">{newExpiry}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b border-border-light dark:border-border-dark">
                        <span className="text-sm text-gray-500 dark:text-gray-400">Supplier</span>
                        <span className="text-sm text-gray-900 dark:text-white">{newSupplier || 'Unknown'}</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between py-2 border-b border-border-light dark:border-border-dark">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Selected Batch</span>
                      <span className="text-sm font-mono text-gray-900 dark:text-white">#{selectedBatchId.slice(-6)}</span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-500 dark:text-gray-400">New Total Stock</span>
                    <span className="text-sm font-mono font-700 text-primary-500">{totalStock + quantity} units</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button onClick={() => setStep('form')} className="flex-1 h-11 border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">Back</button>
                  <button onClick={handleConfirm} className="flex-1 h-11 bg-success-500 hover:bg-success-600 text-white rounded-lg text-sm font-medium transition-colors">Confirm & Complete</button>
                </div>
              </div>
            )}
          </div>

          {/* Sticky Drug Info Panel */}
          <div className="hidden lg:block sticky top-6">
            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark overflow-hidden">
              <div className="p-5 border-b border-border-light dark:border-border-dark bg-gray-50/50 dark:bg-white/[0.02]">
                <p className="text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-1">Selected Medicine</p>
                <h3 className="text-lg font-heading font-700 text-gray-900 dark:text-white leading-tight">{selectedDrug.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{selectedDrug.category}</p>
              </div>
              <div className="p-5 space-y-5">
                <div>
                  <p className="text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">Inventory Summary</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Total in Stock</span>
                    <span className="text-base font-mono font-700 text-gray-900 dark:text-white">{totalStock}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Active Batches</span>
                    <span className="text-sm font-mono text-gray-900 dark:text-white">{selectedDrug.batches.filter(b => b.quantity > 0).length}</span>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">Current Batches</p>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {selectedDrug.batches.map(b => (
                      <div key={b.id} className="p-2.5 rounded-lg bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-gray-400">#{b.id.slice(-6)}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${b.quantity <= 10 ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-500' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500'}`}>
                            {b.quantity}
                          </span>
                        </div>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1">Expires: <span className="font-mono">{b.expiry}</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 rounded-xl bg-primary-50 dark:bg-primary-500/10 border border-primary-500/20">
              <div className="flex gap-3">
                <i className="ri-information-line text-primary-500 text-lg"></i>
                <p className="text-[11px] text-primary-700 dark:text-primary-400 leading-normal font-body">
                  Make sure you are restocking the correct medicine. Check the manufacturer and dosage form in the inventory list if unsure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'done') {
    return (
      <div className="p-4 md:p-6 max-w-md flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-16 h-16 flex items-center justify-center mx-auto mb-4 rounded-full bg-success-50 dark:bg-success-500/10">
          <i className="ri-check-line text-success-500 text-3xl"></i>
        </div>
        <h2 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-1">Restock Complete</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-2">{selectedDrug?.name}</p>
        <p className="text-xs font-mono text-gray-400 dark:text-gray-600 mb-6">{ref}</p>
        <button onClick={handleReset} className="h-btn px-6 bg-success-500 hover:bg-success-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">
          Restock Another
        </button>
      </div>
    );
  }

  return null;
}
