import React, { useState } from 'react';
import { HelpCircle, ChevronDown, BookOpen, Binary, Grid, Cpu, Layers } from 'lucide-react';

export default function HowItWorks() {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    {
      icon: Binary,
      title: '1. Truth Table Generation',
      description: 'A truth table systematically lists all 2ⁿ possible input binary state combinations for n variables. Each row evaluates the Boolean expression to produce a output state of 0 (FALSE) or 1 (TRUE).'
    },
    {
      icon: Grid,
      title: '2. Gray Code Karnaugh Map Layout',
      description: 'Karnaugh Maps arrange truth table minterms into a 2D matrix using Gray code ordering (00, 01, 11, 10) where adjacent cells differ by exactly 1 bit. This spatial arrangement allows visual pattern matching of Boolean adjacencies.'
    },
    {
      icon: Layers,
      title: '3. Implicant Grouping Rules',
      description: 'Adjacent 1s are enclosed in rectangular groups with sizes of powers of 2 (1, 2, 4, 8, 16, 32). Larger groups eliminate more variables, resulting in simpler product terms according to the Quine-McCluskey & Petrick algorithms.'
    },
    {
      icon: Cpu,
      title: '4. Logic Circuit Synthesis',
      description: 'The simplified Sum of Products (SOP) boolean expression is directly mapped to hardware gates: inverted literals pass through NOT gates, product terms are processed by AND gates, and terms are combined by a central OR gate.'
    }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-4">
      <div className="bg-[#172A27] border border-[#22423D] rounded-3xl overflow-hidden shadow-lg transition-all">
        
        {/* Toggle Button Header */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 sm:p-5 flex items-center justify-between text-left hover:bg-[#1F3834] transition-colors focus:outline-none"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F2622] border border-[#4FC3B8]/30 flex items-center justify-center text-[#4FC3B8]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                How Karnaugh Map Simplification Works
              </h3>
              <p className="text-xs text-[#8BA8A3]">
                Learn the core concepts of Boolean reduction & logic synthesis
              </p>
            </div>
          </div>

          <ChevronDown
            className={`w-5 h-5 text-[#4FC3B8] transition-transform duration-300 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="p-4 sm:p-6 border-t border-[#22423D] bg-[#0F2622]/60 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
            {sections.map((sec, idx) => {
              const Icon = sec.icon;
              return (
                <div
                  key={idx}
                  className="bg-[#172A27] p-4 rounded-2xl border border-[#22423D] space-y-2 hover:border-[#4FC3B8]/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 text-[#4FC3B8]">
                    <Icon className="w-4 h-4" />
                    <h4 className="text-xs font-bold uppercase tracking-wider">{sec.title}</h4>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {sec.description}
                  </p>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
