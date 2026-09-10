
import React from 'react';
import { Search, X } from 'lucide-react';

function SearchBar({ value, onChange, placeholder = "Search..." }) {
  return (
    <div className="relative w-full min-w-50">

      <Search 
        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
        size={16} 
      />
      
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
      />

      {value && (
        <button 
          onClick={() => onChange("")}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}

export default SearchBar;