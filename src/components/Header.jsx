import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, Info, HelpCircle, RotateCcw } from 'lucide-react';

export default function Header({ onOpenAbout, onOpenHelp, onReset }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full max-w-6xl mx-auto px-2 sm:px-4 pt-3 pb-2">
      <div className="relative flex items-center justify-between h-20 sm:h-24 px-4 sm:px-8 bg-[#0F2622] border border-[#22423D] rounded-full shadow-lg shadow-[#07110F]/80">
        
        {/* Left Side: K-Map Logo & Title */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Logo SVG */}
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-[#172A27] to-[#0B1A18] border border-[#4FC3B8]/40 flex items-center justify-center p-2 shadow-inner group">
            <svg viewBox="0 0 40 40" className="w-full h-full text-[#4FC3B8] transition-transform duration-300 group-hover:scale-110">
              <rect x="4" y="4" width="14" height="14" rx="3" fill="#4FC3B8" fillOpacity="0.8" stroke="#4FC3B8" strokeWidth="1.5" />
              <rect x="22" y="4" width="14" height="14" rx="3" fill="#172A27" stroke="#4FC3B8" strokeWidth="1.5" />
              <rect x="4" y="22" width="14" height="14" rx="3" fill="#172A27" stroke="#4FC3B8" strokeWidth="1.5" />
              <rect x="22" y="22" width="14" height="14" rx="3" fill="#4FC3B8" fillOpacity="0.8" stroke="#4FC3B8" strokeWidth="1.5" />
              <circle cx="11" cy="11" r="2" fill="#07110F" />
              <circle cx="29" cy="29" r="2" fill="#07110F" />
            </svg>
          </div>

          <div>
            <h1 className="text-lg sm:text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
              Karnaugh Map <span className="text-[#4FC3B8] font-bold">Solver</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#8BA8A3] hidden sm:block">
              Boolean Expression Simplifier & Logic Circuit Generator
            </p>
          </div>
        </div>

        {/* Right Side: Three-Dot Menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#172A27] hover:bg-[#1F3834] border border-[#22423D] flex items-center justify-center text-slate-200 hover:text-[#4FC3B8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#4FC3B8]/50"
            aria-label="Options menu"
          >
            <MoreVertical className="w-5 h-5" />
          </button>

          {/* Menu Dropdown */}
          {menuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-[#0F2622] border border-[#244742] rounded-2xl shadow-2xl z-50 py-2 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => { setMenuOpen(false); onOpenAbout(); }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-[#172A27] hover:text-[#4FC3B8] flex items-center gap-3 transition-colors"
              >
                <Info className="w-4 h-4 text-[#4FC3B8]" />
                About
              </button>
              
              <button
                onClick={() => { setMenuOpen(false); onOpenHelp(); }}
                className="w-full px-4 py-2.5 text-left text-sm text-slate-200 hover:bg-[#172A27] hover:text-[#4FC3B8] flex items-center gap-3 transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-[#4FC3B8]" />
                Help & Syntax
              </button>

              <hr className="my-1 border-[#22423D]" />

              <button
                onClick={() => { setMenuOpen(false); onReset(); }}
                className="w-full px-4 py-2.5 text-left text-sm text-rose-400 hover:bg-rose-950/40 flex items-center gap-3 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                Reset Solver
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
