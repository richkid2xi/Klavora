import { useState, useRef, useEffect } from 'react';

interface CategoryManagerProps {
  allCategories: string[];
  selected: string[];
  onChange: (cats: string[]) => void;
  onCreateCategory: (cat: string) => void;
}

export default function CategoryManager({ allCategories, selected, onChange, onCreateCategory }: CategoryManagerProps) {
  const [open, setOpen] = useState(false);
  const [newCat, setNewCat] = useState('');
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const toggle = (cat: string) => {
    if (selected.includes(cat)) {
      onChange(selected.filter(c => c !== cat));
    } else {
      onChange([...selected, cat]);
    }
  };

  const handleCreate = () => {
    const trimmed = newCat.trim();
    if (!trimmed || allCategories.includes(trimmed)) return;
    onCreateCategory(trimmed);
    onChange([...selected, trimmed]);
    setNewCat('');
  };

  const availableCats = allCategories.filter(c => c !== 'All');

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full h-10 px-3 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-left flex items-center justify-between cursor-pointer hover:border-primary-500 transition-colors"
      >
        <span className={selected.length === 0 ? 'text-gray-400 dark:text-gray-600' : 'text-gray-900 dark:text-white'}>
          {selected.length === 0 ? 'Select categories...' : selected.join(', ')}
        </span>
        {open ? <i className="ri-arrow-up-s-line text-gray-400 text-base"></i> : <i className="ri-arrow-down-s-line text-gray-400 text-base"></i>}
      </button>

      {/* Selected tags */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selected.map(cat => (
            <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary-50 dark:bg-primary-500/10 text-primary-500 text-xs font-body">
              {cat}
              <button
                type="button"
                onClick={() => toggle(cat)}
                className="hover:text-primary-700 cursor-pointer"
              >
                <i className="ri-close-line text-xs"></i>
              </button>
            </span>
          ))}
        </div>
      )}

      {open && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
          {/* Create new */}
          <div className="p-2 border-b border-border-light dark:border-border-dark">
            <div className="flex gap-2">
              <input
                type="text"
                value={newCat}
                onChange={e => setNewCat(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreate())}
                placeholder="Create new category..."
                className="flex-1 h-8 px-2.5 rounded-md border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-xs font-body text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-primary-500"
              />
              <button
                type="button"
                onClick={handleCreate}
                disabled={!newCat.trim() || allCategories.includes(newCat.trim())}
                className="h-8 px-3 bg-primary-500 hover:bg-primary-600 disabled:opacity-40 text-white text-xs rounded-md font-body cursor-pointer whitespace-nowrap transition-colors"
              >
                Add
              </button>
            </div>
          </div>
          {/* Existing categories */}
          <div className="max-h-48 overflow-y-auto py-1">
            {availableCats.length === 0 && (
              <p className="text-xs text-gray-400 px-3 py-2 font-body">No categories yet. Create one above.</p>
            )}
            {availableCats.map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => toggle(cat)}
                className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors"
              >
                <span className="text-sm font-body text-gray-700 dark:text-gray-300">{cat}</span>
                {selected.includes(cat) && (
                  <i className="ri-check-line text-primary-500 text-sm"></i>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
