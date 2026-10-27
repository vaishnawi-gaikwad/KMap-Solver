import React from 'react';
import { X, HelpCircle, Terminal, Lightbulb } from 'lucide-react';

export default function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F2622] border border-[#244742] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-[#172A27] hover:bg-[#1F3834] text-slate-400 hover:text-slate-100 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-4 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-[#4FC3B8]/20 border border-[#4FC3B8]/40 flex items-center justify-center text-[#4FC3B8]">
            <HelpCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">Boolean Expression Syntax</h2>
            <p className="text-xs text-[#8BA8A3]">Supported notation & usage tips</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-slate-300">
          
          <div className="bg-[#172A27] rounded-2xl p-4 border border-[#22423D] space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4FC3B8] flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Operators
            </h3>
            
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-[#0F2622] p-2.5 rounded-xl border border-[#22423D]">
                <span className="text-[#4FC3B8] font-bold">OR Operator:</span>
                <p className="mt-1 font-mono text-slate-200">+ (e.g. A + B)</p>
              </div>

              <div className="bg-[#0F2622] p-2.5 rounded-xl border border-[#22423D]">
                <span className="text-[#4FC3B8] font-bold">NOT Operator:</span>
                <p className="mt-1 font-mono text-slate-200">' or ! (e.g. A' or !A)</p>
              </div>

              <div className="bg-[#0F2622] p-2.5 rounded-xl border border-[#22423D]">
                <span className="text-[#4FC3B8] font-bold">AND Operator:</span>
                <p className="mt-1 font-mono text-slate-200">Adjacency/space/`*` (e.g. AB or A*B)</p>
              </div>

              <div className="bg-[#0F2622] p-2.5 rounded-xl border border-[#22423D]">
                <span className="text-[#4FC3B8] font-bold">Parentheses:</span>
                <p className="mt-1 font-mono text-slate-200">( ) for grouping</p>
              </div>
            </div>
          </div>

          <div className="bg-[#172A27] rounded-2xl p-4 border border-[#22423D] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4FC3B8] flex items-center gap-2">
              <Lightbulb className="w-4 h-4" /> Examples
            </h3>
            <ul className="space-y-2 text-xs font-mono">
              <li className="bg-[#0F2622] px-3 py-2 rounded-xl text-slate-200 border border-[#22423D]">
                A'B + AB' <span className="text-[#8BA8A3] font-sans text-[11px] block mt-0.5">XOR logic (2 variables)</span>
              </li>
              <li className="bg-[#0F2622] px-3 py-2 rounded-xl text-slate-200 border border-[#22423D]">
                A'BC + ABC + AB'C <span className="text-[#8BA8A3] font-sans text-[11px] block mt-0.5">3 variables reduction</span>
              </li>
              <li className="bg-[#0F2622] px-3 py-2 rounded-xl text-slate-200 border border-[#22423D]">
                A'B'CD + A'BE + AB'DE <span className="text-[#8BA8A3] font-sans text-[11px] block mt-0.5">5 variables SOP expression</span>
              </li>
            </ul>
          </div>

          <p className="text-xs text-[#8BA8A3]">
            Tip: You can edit variable names in the <strong>Rename Variables</strong> card to match your homework or project requirements!
          </p>

        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#22423D] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#4FC3B8] hover:bg-[#69E3D8] text-[#07110F] font-bold text-xs transition-colors"
          >
            Close Help
          </button>
        </div>

      </div>
    </div>
  );
}
