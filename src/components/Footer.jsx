import React from 'react';
import { Cpu, Github } from 'lucide-react';

export default function Footer({ onOpenAbout, onOpenHelp }) {
  return (
    <footer className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-8 mt-6 border-t border-[#22423D]/60 text-slate-400 text-xs">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        
        {/* Left Side Branding */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#172A27] border border-[#4FC3B8]/30 flex items-center justify-center text-[#4FC3B8]">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <span className="font-bold text-slate-200 block">Karnaugh Map Solver</span>
            <span className="text-[#8BA8A3] text-[11px]">Learn • Solve • Simplify</span>
          </div>
        </div>

        {/* Center / Right Links */}
        <div className="flex items-center gap-4 text-[#8BA8A3]">
          <button onClick={onOpenAbout} className="hover:text-[#4FC3B8] transition-colors">
            About
          </button>
          <span>•</span>
          <button onClick={onOpenHelp} className="hover:text-[#4FC3B8] transition-colors">
            Help & Syntax
          </button>
          <span>•</span>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hover:text-[#4FC3B8] transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" /> GitHub
          </a>
          <span>•</span>
          <span className="hover:text-[#4FC3B8] cursor-pointer">Privacy</span>
        </div>

      </div>

      <div className="text-center mt-6 text-[11px] text-slate-600">
        © {new Date().getFullYear()} Karnaugh Map Solver. Built for Digital Electronics & Computer Science Engineering.
      </div>
    </footer>
  );
}
