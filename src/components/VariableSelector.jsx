import React from 'react';

export default function VariableSelector({ numVars, onChangeNumVars }) {
  const options = [
    { count: 2, label: '2 Variables' },
    { count: 3, label: '3 Variables' },
    { count: 4, label: '4 Variables' },
    { count: 5, label: '5 Variables' },
    { count: 6, label: '6 Variables' },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2">
      <div className="bg-[#0F2622] p-1.5 rounded-full border border-[#22423D] shadow-inner overflow-x-auto no-scrollbar flex items-center justify-between sm:justify-center gap-1 sm:gap-2">
        {options.map((opt) => {
          const isSelected = numVars === opt.count;
          return (
            <button
              key={opt.count}
              onClick={() => onChangeNumVars(opt.count)}
              className={`relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap focus:outline-none ${
                isSelected
                  ? 'text-[#4FC3B8] bg-[#172A27] shadow-md border border-[#4FC3B8]/30'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-[#172A27]/50 border border-transparent'
              }`}
            >
              {opt.label}
              
              {/* Animated Underline / Indicator */}
              {isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#4FC3B8] rounded-full shadow-[0_0_8px_#4FC3B8]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
