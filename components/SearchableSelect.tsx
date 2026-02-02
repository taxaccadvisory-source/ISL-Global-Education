
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from '../constants';

interface SearchableSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  label: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({ options, value, onChange, placeholder, label }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{label}</label>
      <div 
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl border transition-all cursor-pointer bg-white ${
          isOpen ? 'border-blue-500 ring-2 ring-blue-50' : 'border-slate-200 hover:border-slate-300'
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`text-sm truncate ${value === 'All' ? 'text-slate-400' : 'text-slate-700 font-medium'}`}>
          {value === 'All' ? placeholder : value}
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 border-b border-slate-50 bg-slate-50">
            <div className="relative">
              <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                autoFocus
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            <button
              className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-blue-50 ${value === 'All' ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
              onClick={() => handleSelect('All')}
            >
              All {label}s
            </button>
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => (
                <button
                  key={option}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors hover:bg-blue-50 ${value === option ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-600'}`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-xs text-slate-400 text-center italic">No matches found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableSelect;
