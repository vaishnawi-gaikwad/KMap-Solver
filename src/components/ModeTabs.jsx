import React from 'react';
import { Binary, Table2, Cpu } from 'lucide-react';

export default function ModeTabs({ activeTab, onChangeTab }) {
  const tabs = [
    { id: 'expression', label: 'Boolean Expression', icon: Binary },
    { id: 'truthtable', label: 'Truth Table', icon: Table2 },
    { id: 'circuit', label: 'Logic Circuit', icon: Cpu },
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2">
      <div className="bg-[#172A27]/80 backdrop-blur p-1 rounded-2xl border border-[#22423D] flex items-center justify-around gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 sm:py-3 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none ${
                isSelected
                  ? 'bg-[#0F2622] text-[#4FC3B8] shadow-lg border border-[#4FC3B8]/30'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-[#0F2622]/40'
              }`}
            >
              <Icon className={`w-4 h-4 ${isSelected ? 'text-[#4FC3B8]' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
