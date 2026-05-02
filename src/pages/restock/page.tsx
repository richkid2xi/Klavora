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

  const renderDrugDetails = () => {
    if (!selectedDrug) return null;
    const total = selectedDrug.batches.reduce((s, b) => s + b.quantity, 0);
    return (
      <div className="w-full lg:w-80 flex-shrink-0">
        <div className="sticky top-24 bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5">
          <h3 className="text-xs font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 font-medium mb-4">Selected Medicine</h3>
          <p className="text-base font-heading font-600 text-gray-900 dark:text-white mb-1">{selectedDrug.name}</p>
          {selectedDrug.manufacturer && (
            <p className="text-xs text-gray-500 dark:text-gray-400 font-body mb-4">{selectedDrug.manufacturer}</p>
          )}
          
          <div className="space-y-3 pt-3 border-t border-border-light dark:border-border-dark">
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-body">Category</span>
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{selectedDrug.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-body">Form</span>
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300">{selectedDrug.dosageForm || '-'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-body">Price</span>
              <span className="text-xs font-mono text-gray-700 dark:text-gray-300">GH₵{selectedDrug.unitPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center pt-3 mt-3 border-t border-border-light dark:border-border-dark">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-body">Current Stock</span>
              <span className="text-base font-mono font-600 text-gray-900 dark:text-white">{total}</span>
            </div>
          </div>
        </div>
      </div>
    );
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

  if (step === 'mode' && selectedDrug) {
    return (
      <div className="p-4 md:p-6 w-full max-w-5xl">
        <button onClick={() => setStep('select')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 cursor-pointer transition-colors w-fit">
          <i className="ri-arrow-left-line"></i><span className="font-body">Back</span>
        </button>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <div className="flex-1 w-full">
            <h1 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-1">Restock Type</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-body mb-6">Is this a new delivery with a different expiry date?</p>
            <div className="space-y-3">
              <button
                onClick={() => { setIsNewBatch(true); setStep('form'); }}
                className="w-full p-4 text-left bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark hover:border-success-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-success-50 dark:bg-success-500/10 flex-shrink-0">
                    <i className="ri-add-circle-line text-success-500 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm font-heading font-600 text-gray-900 dark:text-white group-hover:text-success-500 transition-colors">Yes — New Batch</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-body">New delivery with different expiry date</p>
                  </div>
                </div>
              </button>
              <button
                onClick={() => { setIsNewBatch(false); setStep('form'); }}
                className="w-full p-4 text-left bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark hover:border-primary-500 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10 flex-shrink-0">
                    <i className="ri-add-line text-primary-500 text-lg"></i>
                  </div>
                  <div>
                    <p className="text-sm font-heading font-600 text-gray-900 dark:text-white group-hover:text-primary-500 transition-colors">No — Add to Existing Batch</p>
                    <p className="text-xs text-gray-400 dark:text-gray-600 font-body">Top up an existing batch</p>
                  </div>
                </div>
              </button>
            </div>
          </div>
          {renderDrugDetails()}
        </div>
      </div>
    );
  }

  if (step === 'form' && selectedDrug) {
    const canProceed = isNewBatch
      ? quantity > 0 && newExpiry !== ''
      : quantity > 0 && selectedBatchId !== '';

    return (
      <div className="p-4 md:p-6 w-full max-w-5xl">
        <button onClick={() => setStep('mode')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 cursor-pointer transition-colors w-fit">
          <i className="ri-arrow-left-line"></i><span className="font-body">Back</span>
        </button>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <div className="flex-1 w-full">
            <h1 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-5">
              {isNewBatch ? 'New Batch Details' : 'Add to Existing Batch'}
            </h1>

            <div className="space-y-4">
              {!isNewBatch && (
                <div>
                  <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Select Batch</label>
                  <div className="space-y-2">
                    {selectedDrug.batches.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBatchId(b.id)}
                        className={`w-full text-left p-3 rounded-lg border transition-all cursor-pointer
                          ${selectedBatchId === b.id ? 'border-primary-500 bg-primary-50 dark:bg-primary-500/10' : 'border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark hover:border-primary-500'}`}
                      >
                        <div className="flex justify-between">
                          <span className="text-xs font-mono text-gray-500 dark:text-gray-400">{b.id}</span>
                          <span className="text-xs font-mono text-gray-900 dark:text-white">{b.quantity} units</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-body mt-0.5">Exp <span className="font-mono">{b.expiry}</span> · {b.supplier}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {isNewBatch && (
                <>
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
                    <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Supplier (optional)</label>
                    <input
                      type="text"
                      value={newSupplier}
                      onChange={e => setNewSupplier(e.target.value)}
                      placeholder="Supplier name"
                      className="w-full h-btn px-3 rounded-btn border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block text-label uppercase tracking-widest text-gray-500 dark:text-gray-400 mb-1.5 font-body">Quantity to Add</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-11 h-11 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xl font-mono transition-colors cursor-pointer flex items-center justify-center">-</button>
                  <input
                    type="number"
                    min={1}
                    value={quantity}
                    onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-1 h-11 text-center text-2xl font-mono font-600 text-gray-900 dark:text-white bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:border-primary-500"
                  />
                  <button onClick={() => setQuantity(q => q + 1)} className="w-11 h-11 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-xl font-mono transition-colors cursor-pointer flex items-center justify-center">+</button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep('confirm')}
              disabled={!canProceed}
              className="w-full h-btn mt-6 bg-success-500 hover:bg-success-600 disabled:opacity-40 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
            >
              Review Restock
            </button>
          </div>
          {renderDrugDetails()}
        </div>
      </div>
    );
  }

  if (step === 'confirm' && selectedDrug) {
    const existingBatch = !isNewBatch ? selectedDrug.batches.find(b => b.id === selectedBatchId) : null;
    return (
      <div className="p-4 md:p-6 w-full max-w-5xl">
        <button onClick={() => setStep('form')} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-5 cursor-pointer transition-colors w-fit">
          <i className="ri-arrow-left-line"></i><span className="font-body">Back</span>
        </button>
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
          <div className="flex-1 w-full">
            <h1 className="text-xl font-heading font-700 text-gray-900 dark:text-white mb-5">Confirm Restock</h1>

            <div className="bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark p-5 mb-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Drug</span>
                <span className="text-sm font-heading font-600 text-gray-900 dark:text-white text-right max-w-[60%]">{selectedDrug.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Type</span>
                <span className="text-sm font-body text-gray-700 dark:text-gray-300">{isNewBatch ? 'New Batch' : 'Add to Existing'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Quantity</span>
                <span className="text-sm font-mono font-600 text-success-500">+{quantity} units</span>
              </div>
              {isNewBatch && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Expiry</span>
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{newExpiry}</span>
                  </div>
                  {newSupplier && (
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Supplier</span>
                      <span className="text-sm font-body text-gray-700 dark:text-gray-300">{newSupplier}</span>
                    </div>
                  )}
                </>
              )}
              {existingBatch && (
                <>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Batch</span>
                    <span className="text-sm font-mono text-gray-700 dark:text-gray-300">{existingBatch.id}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-body">New Total</span>
                    <span className="text-sm font-mono font-600 text-success-500">{existingBatch.quantity + quantity} units</span>
                  </div>
                </>
              )}
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400 font-body">Staff</span>
                <span className="text-sm font-body text-gray-700 dark:text-gray-300">{user?.name}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep('form')} className="flex-1 h-btn border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-400 rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">
                Back
              </button>
              <button onClick={handleConfirm} className="flex-1 h-btn bg-success-500 hover:bg-success-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap">
                Confirm Restock
              </button>
            </div>
          </div>
          {renderDrugDetails()}
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
