import React from 'react';
import { X, Cpu, CheckCircle2, Heart } from 'lucide-react';

export default function AboutModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#0F2622] border border-[#244742] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
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
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100">About Karnaugh Map Solver</h2>
            <p className="text-xs text-[#8BA8A3]">v1.0.0 • Modern Engineering Suite</p>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 text-sm text-slate-300">
          <p>
            <strong className="text-[#4FC3B8]">Karnaugh Map Solver</strong> is an advanced, high-performance logic design tool built to parse, minimize, and visualize Boolean functions for 2, 3, 4, 5, and 6 variables.
          </p>

          <div className="bg-[#172A27] rounded-2xl p-4 border border-[#22423D] space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#4FC3B8]">Key Features</h3>
            <ul className="space-y-1.5 text-xs">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4FC3B8]" />
                Full Quine-McCluskey & Prime Implicant reduction engine
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4FC3B8]" />
                Visual 2D & Multi-grid Gray Code K-Maps with term color grouping
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4FC3B8]" />
                Interactive SVG Logic Circuit Diagram generator
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4FC3B8]" />
                Complete Truth Tables with instant CSV export
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#4FC3B8]" />
                Customizable Variable Names & Presets
              </li>
            </ul>
          </div>

          <p className="text-xs text-[#8BA8A3]">
            Designed with a modern Android Material UI aesthetic in dark mode. Powered by React, Vite, and Tailwind CSS.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-[#22423D] flex justify-between items-center text-xs text-[#8BA8A3]">
          <span className="flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Digital Electronics
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#4FC3B8] hover:bg-[#69E3D8] text-[#07110F] font-bold text-xs transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
}
