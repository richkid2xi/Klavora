import { useNavigate } from 'react-router-dom';
import type { Drug } from '@/mocks/types';

function daysUntil(dateStr: string) {
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
}

const statusClass: Record<string, string> = {
  'In Stock': 'bg-success-50 dark:bg-success-500/10 text-success-500',
  'Low Stock': 'bg-warning-50 dark:bg-warning-500/10 text-warning-500',
  'Expiring Soon': 'bg-warning-50 dark:bg-warning-500/10 text-warning-500',
  'Out of Stock': 'bg-danger-50 dark:bg-danger-500/10 text-danger-500',
};

export default function DrugDetail({ drug, onClose }: { drug: Drug; onClose: () => void }) {
  const navigate = useNavigate();
  const totalQty = drug.batches.reduce((s, b) => s + b.quantity, 0);
  const sortedBatches = [...drug.batches].sort((a, b) => new Date(a.expiry).getTime() - new Date(b.expiry).getTime());

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/40 p-0 md:p-4" onClick={onClose}>
      <div
        className="w-full md:max-w-lg bg-surface-light dark:bg-surface-dark rounded-t-2xl md:rounded-card border border-border-light dark:border-border-dark max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-border-light dark:border-border-dark sticky top-0 bg-surface-light dark:bg-surface-dark z-10">
          <div>
            <h2 className="text-base font-heading font-700 text-gray-900 dark:text-white">{drug.name}</h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-500">{drug.category}</span>
              <span className="text-xs text-gray-400 dark:text-gray-600 font-body">GHS <span className="font-mono">{drug.unitPrice.toFixed(2)}</span>/unit</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 cursor-pointer transition-colors">
            <i className="ri-close-line text-lg"></i>
          </button>
        </div>

        {/* Total */}
        <div className="px-5 py-3 bg-bg-light dark:bg-bg-dark border-b border-border-light dark:border-border-dark">
          <div className="flex items-center justify-between">
            <span className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body">Total Stock</span>
            <span className="text-xl font-mono font-600 text-gray-900 dark:text-white">{totalQty}</span>
          </div>
        </div>

        {/* Batches */}
        <div className="p-5">
          <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-3">Active Batches (FEFO Order)</p>
          <div className="space-y-3">
            {sortedBatches.map((batch, idx) => {
              const days = daysUntil(batch.expiry);
              return (
                <div key={batch.id} className="rounded-lg border border-border-light dark:border-border-dark p-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        {idx === 0 && batch.quantity > 0 && (
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-500">FEFO Next</span>
                        )}
                        <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${statusClass[batch.status]}`}>{batch.status}</span>
                      </div>
                    </div>
                    <span className="text-xs text-gray-400 dark:text-gray-600 font-mono flex-shrink-0">{batch.id}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-0.5">Quantity</p>
                      <p className="text-lg font-mono font-600 text-gray-900 dark:text-white">{batch.quantity}</p>
                    </div>
                    <div>
                      <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-0.5">Expiry</p>
                      <p className={`text-sm font-mono font-500 ${days <= 7 ? 'text-danger-500' : days <= 30 ? 'text-warning-500' : 'text-gray-900 dark:text-white'}`}>
                        {batch.expiry}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-600 font-body">{days > 0 ? `${days} days` : 'Expired'}</p>
                    </div>
                    <div>
                      <p className="text-label uppercase tracking-widest text-gray-400 dark:text-gray-600 font-body mb-0.5">Supplier</p>
                      <p className="text-sm font-body text-gray-700 dark:text-gray-300">{batch.supplier}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          <button
            onClick={() => navigate('/sell', { state: { drugId: drug.id } })}
            className="flex-1 h-btn bg-primary-500 hover:bg-primary-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-shopping-bag-line mr-2"></i>Sell
          </button>
          <button
            onClick={() => navigate('/restock', { state: { drugId: drug.id } })}
            className="flex-1 h-btn bg-success-500 hover:bg-success-600 text-white rounded-btn text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-box-line mr-2"></i>Restock
          </button>
        </div>
      </div>
    </div>
  );
}
