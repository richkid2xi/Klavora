import { useState, useRef, useEffect, useCallback } from 'react';
import { medicineSuggestions } from '@/mocks/medicineSuggestions';

interface MedicineAutocompleteProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
}

export default function MedicineAutocomplete({ value, onChange, placeholder = 'e.g. Amoxicillin 500mg' }: MedicineAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const computeSuggestions = useCallback((query: string) => {
    if (!query.trim()) { setSuggestions([]); setOpen(false); return; }
    const q = query.toLowerCase();
    const filtered = medicineSuggestions
      .filter(s => s.toLowerCase().includes(q))
      .slice(0, 8);
    setSuggestions(filtered);
    setOpen(filtered.length > 0);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);
    computeSuggestions(val);
  };

  const handleSelect = (suggestion: string) => {
    onChange(suggestion);
    setSuggestions([]);
    setOpen(false);
    inputRef.current?.blur();
  };

  const highlight = (text: string, query: string) => {
    if (!query.trim()) return text;
    const idx = text.toLowerCase().indexOf(query.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <strong className="text-primary-500 font-semibold">{text.slice(idx, idx + query.length)}</strong>
        {text.slice(idx + query.length)}
      </>
    );
  };

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <i className="ri-capsule-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-base pointer-events-none"></i>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => value.trim() && suggestions.length > 0 && setOpen(true)}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full h-10 pl-9 pr-4 rounded-lg border border-border-light dark:border-border-dark bg-bg-light dark:bg-bg-dark text-sm font-body text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:border-primary-500 transition-colors"
        />
        {value && (
          <button
            type="button"
            onClick={() => { onChange(''); setSuggestions([]); setOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <i className="ri-close-line text-sm"></i>
          </button>
        )}
      </div>

      {open && suggestions.length > 0 && (
        <div className="absolute z-50 top-full left-0 right-0 mt-1 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-lg overflow-hidden">
          <div className="py-1">
            {suggestions.map(s => (
              <button
                key={s}
                type="button"
                onMouseDown={e => e.preventDefault()}
                onClick={() => handleSelect(s)}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer transition-colors text-left"
              >
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <i className="ri-medicine-bottle-line text-gray-400 text-xs"></i>
                </div>
                <span className="text-sm font-body text-gray-700 dark:text-gray-300">
                  {highlight(s, value)}
                </span>
              </button>
            ))}
          </div>
          <div className="px-3 py-1.5 border-t border-border-light dark:border-border-dark">
            <p className="text-[10px] font-body text-gray-400 dark:text-gray-600">Or type a custom name and press Enter</p>
          </div>
        </div>
      )}
    </div>
  );
}
