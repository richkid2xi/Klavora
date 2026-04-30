import { useState, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { categories as defaultCategories } from '@/mocks/drugs';
import { dosageForms } from '@/mocks/medicineSuggestions';
import type { Drug } from '@/mocks/types';
import MedicineAutocomplete from './components/MedicineAutocomplete';
import CategoryManager from './components/CategoryManager';
import InventoryTable from './components/InventoryTable';

type FormMode = 'add' | 'edit';

interface DrugForm {
  name: string;
  categories: string[];
  dosageForm: string;
  strength: string;
  manufacturer: string;
  unitPrice: string;
  description: string;
  initQty: string;
  initExpiry: string;
  initSupplier: string;
}

const emptyForm: DrugForm = {
  name: '',
  categories: [],
  dosageForm: '',
  strength: '',
  manufacturer: '',
  unitPrice: '',
  description: '',
  initQty: '',
  initExpiry: '',
  initSupplier: '',
};

function genId() {
  return 'drug-' + Date.now().toString(36);
}

export default function AddInventoryPage() {
  const { drugs, setDrugs } = useApp();
  const [allCategories, setAllCategories] = useState<string[]>(defaultCategories);
  const [form, setForm] = useState<DrugForm>(emptyForm);
  const [mode, setMode] = useState<FormMode>('add');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [success, setSuccess] = useState('');
  const [errors, setErrors] = useState<Partial<DrugForm>>({});

  const existingNames = drugs.map(d => d.name);

  const setField = (key: keyof DrugForm, val: string | string[]) => {
    setForm(f => ({ ...f, [key]: val }));
    setErrors(e => ({ ...e, [key]: undefined }));
  };

  const validate = (): boolean => {
    const errs: Partial<DrugForm> = {};
    if (!form.name.trim()) errs.name = 'Medicine name is required';
    else if (mode === 'add' && existingNames.includes(form.name.trim())) errs.name = 'This medicine already exists in inventory';
    if (form.categories.length === 0) errs.categories = 'Select at least one category' as never;
    if (!form.unitPrice || isNaN(Number(form.unitPrice)) || Number(form.unitPrice) <= 0) errs.unitPrice = 'Enter a valid price';
    if (mode === 'add') {
      if (!form.initQty || isNaN(Number(form.initQty)) || Number(form.initQty) < 0) errs.initQty = 'Enter a valid quantity';
      if (!form.initExpiry) errs.initExpiry = 'Expiry date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (mode === 'add') {
      const qty = Number(form.initQty);
      const newDrug: Drug = {
        id: genId(),
        name: form.name.trim(),
        category: form.categories[0],
        categories: form.categories,
        dosageForm: form.dosageForm || '',
        strength: form.strength || '',
        manufacturer: form.manufacturer || '',
        description: form.description || undefined,
        unitPrice: Number(form.unitPrice),
        batches: [{
          id: 'batch-' + Date.now(),
          quantity: qty,
          expiry: form.initExpiry,
          supplier: form.initSupplier || 'Unknown',
          status: qty === 0 ? 'Out of Stock' : qty <= 10 ? 'Low Stock' : 'In Stock',
        }],
      };
      setDrugs([...drugs, newDrug]);
      setSuccess(`"${newDrug.name}" added to inventory successfully!`);
    } else if (editingId) {
      const updated = drugs.map(d => {
        if (d.id !== editingId) return d;
        return {
          ...d,
          name: form.name.trim(),
          category: form.categories[0],
          categories: form.categories,
          dosageForm: form.dosageForm || '',
          strength: form.strength || '',
          manufacturer: form.manufacturer || '',
          description: form.description || undefined,
          unitPrice: Number(form.unitPrice),
        };
      });
      setDrugs(updated);
      setSuccess(`"${form.name.trim()}" updated successfully!`);
    }

    setForm(emptyForm);
    setMode('add');
    setEditingId(null);
    setShowForm(false);
    setTimeout(() => setSuccess(''), 4000);
  };

  const handleEdit = useCallback((drug: Drug) => {
    setForm({
      name: drug.name,
      categories: drug.categories ?? [drug.category],
      dosageForm: drug.dosageForm ?? '',
      strength: drug.strength ?? '',
      manufacturer: drug.manufacturer ?? '',
      unitPrice: String(drug.unitPrice),
      description: drug.description ?? '',
      initQty: '',
      initExpiry: '',
      initSupplier: '',
    });
    setMode('edit');
    setEditingId(drug.id);
    setShowForm(true);
    setErrors({});
  }, []);

  const handleCancel = () => {
    setForm(emptyForm);
    setMode('add');
    setEditingId(null);
    setShowForm(false);
    setErrors({});
  };

  const handleCreateCategory = (cat: string) => {
    setAllCategories(prev => [...prev, cat]);
  };

  return (
    <div className="p-4 md:p-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-heading font-700 text-gray-900 dark:text-white">Add Inventory</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-body mt-0.5">
            Register new medicines and manage categories
          </p>
        </div>
        {!showForm && (
          <button
            type="button"
            onClick={() => { setShowForm(true); setMode('add'); setForm(emptyForm); setErrors({}); }}
            className="flex items-center gap-2 h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
          >
            <i className="ri-add-line text-base"></i>
            Add Medicine
          </button>
        )}
      </div>

      {/* Success toast */}
      {success && (
        <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
          <div className="w-5 h-5 flex items-center justify-center flex-shrink-0">
            <i className="ri-checkbox-circle-line text-emerald-500 text-base"></i>
          </div>
          <p className="text-sm font-body text-emerald-700 dark:text-emerald-400">{success}</p>
        </div>
      )}

      {/* Add / Edit Form */}
      {showForm && (
        <div className="mb-6 bg-surface-light dark:bg-surface-dark rounded-card border border-border-light dark:border-border-dark overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-border-light dark:border-border-dark">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary-50 dark:bg-primary-500/10">
                <i className={`${mode === 'add' ? 'ri-add-circle-line' : 'ri-edit-line'} text-primary-500 text-base`}></i>
              </div>
              <h2 className="text-base font-heading font-600 text-gray-900 dark:text-white">
                {mode === 'add' ? 'New Medicine' : 'Edit Medicine'}
              </h2>
            </div>
            <button type="button" onClick={handleCancel} className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-white/5 cursor-pointer transition-colors">
              <i className="ri-close-line text-base"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-4">
                <h3 className="text-xs font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 font-medium">Medicine Details</h3>

                {/* Name */}
                <div>
                  <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Medicine Name <span className="text-red-500">*</span>
                  </label>
                  <MedicineAutocomplete
                    value={form.name}
                    onChange={(val: string) => setField('name', val)}
                    existingNames={mode === 'add' ? existingNames : existingNames.filter(n => n !== form.name)}
                  />
                  {errors.name && <p className="text-xs text-red-500 font-body mt-1">{errors.name}</p>}
                </div>

                {/* Categories */}
                <div>
                  <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                    Categories <span className="text-red-500">*</span>
                  </label>
                  <CategoryManager
                    allCategories={allCategories}
                    selected={form.categories}
                    onChange={cats => setField('categories', cats)}
                    onCreateCategory={handleCreateCategory}
                  />
                  {errors.categories && <p className="text-xs text-red-500 font-body mt-1">{errors.categories as unknown as string}</p>}
                </div>

                {/* Dosage Form */}
                <div>
                  <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">Dosage Form</label>
                  <select
                    value={form.dosageForm}
                    onChange={e => setField('dosageForm', e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors cursor-pointer"
                  >
                    <option value="">Select form...</option>
                    {dosageForms.map(f => <option key={f} value={f}>{f}</option>)}
                  </select>
                </div>

                {/* Strength + Manufacturer */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">Strength</label>
                    <input
                      type="text"
                      value={form.strength}
                      onChange={e => setField('strength', e.target.value)}
                      placeholder="e.g. 500mg"
                      className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">Unit Price (GH₵) <span className="text-red-500">*</span></label>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      value={form.unitPrice}
                      onChange={e => setField('unitPrice', e.target.value)}
                      placeholder="0.00"
                      className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                    />
                    {errors.unitPrice && <p className="text-xs text-red-500 font-body mt-1">{errors.unitPrice}</p>}
                  </div>
                </div>

                {/* Manufacturer */}
                <div>
                  <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">Manufacturer / Brand</label>
                  <input
                    type="text"
                    value={form.manufacturer}
                    onChange={e => setField('manufacturer', e.target.value)}
                    placeholder="e.g. PharmaCo GH"
                    className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">Description / Notes</label>
                  <textarea
                    value={form.description}
                    onChange={e => setField('description', e.target.value)}
                    placeholder="Optional notes about this medicine..."
                    rows={3}
                    maxLength={500}
                    className="w-full px-3 py-2.5 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors resize-none"
                  />
                  <p className="text-[10px] text-gray-400 font-body text-right mt-0.5">{form.description.length}/500</p>
                </div>
              </div>

              {/* Right column — Initial Batch (add mode only) */}
              <div className="space-y-4">
                {mode === 'add' ? (
                  <>
                    <h3 className="text-xs font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 font-medium">Initial Batch</h3>
                    <div className="p-4 rounded-lg border border-dashed border-border-light dark:border-border-dark bg-gray-50 dark:bg-white/[0.02] space-y-4">
                      <p className="text-xs font-body text-gray-500 dark:text-gray-400">
                        Enter the first batch of stock for this medicine. You can add more batches later via Restock.
                      </p>

                      {/* Initial Quantity */}
                      <div>
                        <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                          Initial Quantity <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setField('initQty', String(Math.max(0, Number(form.initQty) - 1)))}
                            className="w-10 h-10 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-lg font-mono transition-colors cursor-pointer flex items-center justify-center"
                          >-</button>
                          <input
                            type="number"
                            min="0"
                            value={form.initQty}
                            onChange={e => setField('initQty', e.target.value)}
                            placeholder="0"
                            className="flex-1 h-10 text-center text-xl font-mono font-600 text-gray-900 dark:text-white bg-bg-light dark:bg-bg-dark border border-border-light dark:border-border-dark rounded-lg focus:outline-none focus:border-primary-500"
                          />
                          <button
                            type="button"
                            onClick={() => setField('initQty', String(Number(form.initQty) + 1))}
                            className="w-10 h-10 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-lg font-mono transition-colors cursor-pointer flex items-center justify-center"
                          >+</button>
                        </div>
                        {errors.initQty && <p className="text-xs text-red-500 font-body mt-1">{errors.initQty}</p>}
                      </div>

                      {/* Expiry Date */}
                      <div>
                        <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">
                          Expiry Date <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          value={form.initExpiry}
                          onChange={e => setField('initExpiry', e.target.value)}
                          className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-mono text-gray-900 dark:text-white focus:outline-none focus:border-primary-500 transition-colors"
                        />
                        {errors.initExpiry && <p className="text-xs text-red-500 font-body mt-1">{errors.initExpiry}</p>}
                      </div>

                      {/* Supplier */}
                      <div>
                        <label className="block text-xs font-body font-medium text-gray-600 dark:text-gray-400 mb-1.5">Supplier</label>
                        <input
                          type="text"
                          value={form.initSupplier}
                          onChange={e => setField('initSupplier', e.target.value)}
                          placeholder="e.g. PharmaCo GH"
                          className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* Summary preview */}
                    {form.name && form.categories.length > 0 && form.unitPrice && (
                      <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-500/10 border border-primary-100 dark:border-primary-500/20">
                        <p className="text-xs font-body font-medium text-primary-600 dark:text-primary-400 mb-1">Preview</p>
                        <p className="text-sm font-heading font-600 text-gray-900 dark:text-white">{form.name}</p>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {form.categories.map(c => (
                            <span key={c} className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400">{c}</span>
                          ))}
                        </div>
                        <p className="text-xs font-mono text-gray-500 dark:text-gray-400 mt-1">GH₵{Number(form.unitPrice || 0).toFixed(2)} · {form.initQty || 0} units</p>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <h3 className="text-xs font-body uppercase tracking-widest text-gray-400 dark:text-gray-600 font-medium">Edit Info</h3>
                    <div className="p-4 rounded-lg border border-dashed border-border-light dark:border-border-dark bg-gray-50 dark:bg-white/[0.02]">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                          <i className="ri-information-line text-amber-500 text-lg"></i>
                        </div>
                        <div>
                          <p className="text-sm font-body font-medium text-gray-700 dark:text-gray-300">Editing medicine details</p>
                          <p className="text-xs font-body text-gray-500 dark:text-gray-400 mt-0.5">
                            This updates the medicine&apos;s name, categories, dosage form, price and other details. Existing batch stock quantities are not affected.
                          </p>
                          <p className="text-xs font-body text-gray-500 dark:text-gray-400 mt-2">
                            To add more stock, use the <strong className="text-gray-700 dark:text-gray-300">Restock</strong> section.
                          </p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-border-light dark:border-border-dark">
              <button
                type="button"
                onClick={handleCancel}
                className="h-10 px-5 border border-border-light dark:border-border-dark text-gray-600 dark:text-gray-400 hover:border-gray-400 rounded-lg text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm font-medium font-body transition-colors cursor-pointer whitespace-nowrap flex items-center gap-2"
              >
                <i className={`${mode === 'add' ? 'ri-add-line' : 'ri-save-line'} text-base`}></i>
                {mode === 'add' ? 'Add to Inventory' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Inventory Table — hidden while form is open */}
      {!showForm && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-heading font-600 text-gray-900 dark:text-white">
              All Medicines
              <span className="ml-2 text-sm font-mono font-400 text-gray-400 dark:text-gray-600">({drugs.length})</span>
            </h2>
          </div>
          <InventoryTable drugs={drugs} onEdit={handleEdit} />
        </div>
      )}
    </div>
  );
}
