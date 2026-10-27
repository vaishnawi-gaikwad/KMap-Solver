import React from 'react';
import { Edit3 } from 'lucide-react';

export default function VariableRename({ varNames, onChangeVarName }) {
  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2">
      <div className="bg-[#172A27] border border-[#22423D] rounded-3xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg">
        
        {/* Left Section */}
        <div className="flex items-center gap-3 w-full sm:w-auto text-left">
          <div className="w-10 h-10 rounded-2xl bg-[#0F2622] border border-[#4FC3B8]/30 flex items-center justify-center text-[#4FC3B8] shrink-0">
            <Edit3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 tracking-tight">Rename Variables</h3>
            <p className="text-xs text-[#8BA8A3]">Click any box below to customize input labels</p>
          </div>
        </div>

        {/* Right Section: Variable Inputs */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-end w-full sm:w-auto">
          {varNames.map((name, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <input
                type="text"
                maxLength={3}
                value={name}
                onChange={(e) => onChangeVarName(idx, e.target.value)}
                className="w-11 h-11 sm:w-13 sm:h-13 bg-[#0F2622] border border-[#244742] focus:border-[#4FC3B8] rounded-2xl text-center text-sm sm:text-base font-bold text-[#4FC3B8] uppercase transition-all shadow-inner focus:outline-none focus:ring-2 focus:ring-[#4FC3B8]/40"
              />
              <span className="text-[10px] text-[#8BA8A3] mt-1 font-mono">Var {idx + 1}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
