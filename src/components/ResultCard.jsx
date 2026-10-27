import React, { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';

export default function ResultCard({ solverResult, onCopyExpr }) {
  const [copied, setCopied] = useState(false);

  if (!solverResult || solverResult.error) return null;

  const { simplifiedExpr, terms } = solverResult;

  const handleCopy = () => {
    navigator.clipboard.writeText(simplifiedExpr);
    setCopied(true);
    if (onCopyExpr) onCopyExpr();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 animate-in fade-in duration-300">
      
      {/* Header labels */}
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-[#8BA8A3]">Sum of Products</span>
        <span className="text-xs font-semibold text-[#4FC3B8]">Simplified Result</span>
      </div>

      {/* Large Dark Teal Result Card */}
      <div className="bg-[#0F2622] border-2 border-[#244742] rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden group">
        
        {/* Glowing Background Accent */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#4FC3B8]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          
          {/* Main Equation Area */}
          <div className="space-y-1.5 flex-1 select-all" onClick={handleCopy}>
            <span className="text-xs text-[#8BA8A3] font-medium block">Simplified Function Σ =</span>
            
            <div className="flex flex-wrap items-center gap-2 text-xl sm:text-3xl font-extrabold font-mono tracking-wide text-slate-100">
              <span className="text-[#4FC3B8]">F =</span>
              
              {terms && terms.length > 0 ? (
                terms.map((t, idx) => (
                  <React.Fragment key={idx}>
                    <span
                      className="px-2.5 py-1 rounded-xl transition-transform hover:scale-105 inline-block"
                      style={{
                        backgroundColor: t.color?.bg || 'rgba(79, 195, 184, 0.2)',
                        color: t.color?.text || '#4FC3B8',
                        border: `1.5px solid ${t.color?.border || '#4FC3B8'}`
                      }}
                      title={`Group ${idx + 1}: ${t.binary || ''}`}
                    >
                      {t.text}
                    </span>
                    {idx < terms.length - 1 && <span className="text-slate-400 font-sans">+</span>}
                  </React.Fragment>
                ))
              ) : (
                <span className="text-slate-300">{simplifiedExpr}</span>
              )}
            </div>
          </div>

          {/* Copy Button */}
          <div className="shrink-0 flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-5 py-3 rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md focus:outline-none ${
                copied
                  ? 'bg-emerald-500 text-slate-950 border border-emerald-400'
                  : 'bg-[#172A27] hover:bg-[#1F3834] text-[#4FC3B8] border border-[#244742] hover:border-[#4FC3B8]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copy Result
                </>
              )}
            </button>
          </div>

        </div>

        {/* Long-press / Click Tip */}
        <div className="mt-4 pt-3 border-t border-[#22423D] flex items-center justify-between text-[11px] text-[#8BA8A3]">
          <span className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-[#4FC3B8]" />
            Tip: You can click or long-press the expression to copy it.
          </span>
          <span className="font-mono text-[10px] text-[#4FC3B8]">
            {terms?.length || 0} Product Term{terms?.length === 1 ? '' : 's'}
          </span>
        </div>

      </div>
    </div>
  );
}
