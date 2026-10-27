import React from 'react';
import { Lightbulb, Trash2, Sparkles, Dices, Layers, AlertCircle, HelpCircle } from 'lucide-react';

export default function BooleanInput({
  expression,
  setExpression,
  onSolve,
  onClear,
  onPresetSelect,
  onRandomExpr,
  error,
  varNames,
  dontCareInput,
  setDontCareInput,
  dontCareError,
}) {
  const exampleHint = varNames.length >= 5
    ? `${varNames[0]}'${varNames[1]}'${varNames[2]}${varNames[3]} + ${varNames[0]}'${varNames[1]}${varNames[4]} + ${varNames[0]}${varNames[1]}'${varNames[3]}${varNames[4]}`
    : varNames.length === 4
    ? `${varNames[0]}'${varNames[1]}'${varNames[2]}${varNames[3]} + ${varNames[0]}'${varNames[1]}${varNames[3]}`
    : `${varNames[0]}'${varNames[1]} + ${varNames[0]}${varNames[1]}'`;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 space-y-3">
      
      {/* Dark Green Instruction Card */}
      <div className="bg-[#172A27] border border-[#22423D] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 text-xs sm:text-sm text-slate-200 shadow-md">
        <span className="text-xl">💡</span>
        <p className="flex-1">
          Enter the Boolean expression <strong className="text-[#4FC3B8]">(Sum of Products)</strong> to solve. You can use <code className="bg-[#0F2622] px-1.5 py-0.5 rounded text-[#4FC3B8] font-mono">'</code> for NOT, <code className="bg-[#0F2622] px-1.5 py-0.5 rounded text-[#4FC3B8] font-mono">+</code> for OR, and variable juxtaposition for AND.
        </p>
      </div>

      {/* Main Floating Label Input Container */}
      <div className="bg-[#172A27] border border-[#22423D] rounded-3xl p-4 sm:p-6 shadow-xl space-y-4">
        {/* Boolean Expression Input */}
        <div className="relative">
          <input
            type="text"
            id="boolean-input"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSolve(); }}
            placeholder=" "
            className="peer w-full h-16 sm:h-18 px-5 pt-5 pb-2 bg-[#0F2622] border-2 border-[#244742] focus:border-[#4FC3B8] rounded-2xl text-base sm:text-lg font-mono font-bold text-slate-100 placeholder-transparent transition-all focus:outline-none focus:ring-4 focus:ring-[#4FC3B8]/20 pr-14"
          />
          <label
            htmlFor="boolean-input"
            className="absolute left-5 top-2 text-xs font-bold text-[#8BA8A3] peer-placeholder-shown:text-base peer-placeholder-shown:top-5 peer-placeholder-shown:text-slate-400 peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#4FC3B8] transition-all pointer-events-none"
          >
            Boolean Expression
          </label>

          {/* Clear Button */}
          {expression && (
            <button
              onClick={onClear}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-[#172A27] hover:bg-[#22423D] text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors focus:outline-none"
              title="Clear input"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Input Hint */}
        <p className="text-xs text-[#8BA8A3] font-mono flex items-center gap-1">
          <span>Example:</span>
          <button
            onClick={() => setExpression(exampleHint)}
            className="text-[#4FC3B8] hover:underline cursor-pointer"
          >
            {exampleHint}
          </button>
        </p>

        {/* Error Notice */}
        {error && (
          <div className="bg-rose-950/50 border border-rose-800/60 rounded-2xl p-3 flex items-center gap-3 text-xs text-rose-200 animate-in fade-in duration-200">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <strong className="block font-bold">Invalid Boolean Expression</strong>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* ─── Don't-Care Minterms Input ─── */}
        <div className="border-t border-[#22423D] pt-4 space-y-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8BA8A3]">Don't-Care Conditions (optional)</span>
            <span
              title="Don't-care minterms (X) can be used by the solver if they help produce a simpler expression. Enter minterm indices separated by commas."
              className="text-[#4FC3B8] cursor-help"
            >
              <HelpCircle className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              id="dontcare-input"
              value={dontCareInput}
              onChange={(e) => setDontCareInput(e.target.value)}
              placeholder=" "
              className={`peer w-full h-14 px-5 pt-5 pb-2 bg-[#0F2622] border-2 ${dontCareError ? 'border-amber-600/70' : 'border-[#244742]'} focus:border-[#F59E0B] rounded-2xl text-sm font-mono font-bold text-amber-200 placeholder-transparent transition-all focus:outline-none focus:ring-4 focus:ring-[#F59E0B]/15 pr-14`}
            />
            <label
              htmlFor="dontcare-input"
              className="absolute left-5 top-1.5 text-xs font-bold text-[#8BA8A3] peer-placeholder-shown:text-sm peer-placeholder-shown:top-4 peer-placeholder-shown:text-slate-500 peer-focus:top-1.5 peer-focus:text-xs peer-focus:text-[#F59E0B] transition-all pointer-events-none"
            >
              Don't-Care Minterms (e.g. 3, 5, 12)
            </label>

            {/* Clear don't-care */}
            {dontCareInput && (
              <button
                onClick={() => setDontCareInput('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-[#172A27] hover:bg-[#22423D] text-slate-400 hover:text-amber-400 flex items-center justify-center transition-colors focus:outline-none"
                title="Clear don't-cares"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Don't-Care Error */}
          {dontCareError && (
            <div className="bg-amber-950/40 border border-amber-700/50 rounded-2xl p-3 flex items-center gap-3 text-xs text-amber-200 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{dontCareError}</span>
            </div>
          )}

          {/* Don't-Care hint */}
          {!dontCareError && (
            <p className="text-[11px] text-[#8BA8A3]">
              Cells marked <span className="font-mono font-bold text-amber-400">X</span> are treated as don't-cares — the solver may use them to form larger groups for a simpler result.
            </p>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          
          {/* Preset & Random Helper Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onPresetSelect}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#0F2622] hover:bg-[#172A27] border border-[#244742] text-slate-300 hover:text-[#4FC3B8] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Layers className="w-4 h-4 text-[#4FC3B8]" />
              Presets / Examples
            </button>

            <button
              onClick={onRandomExpr}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-[#0F2622] hover:bg-[#172A27] border border-[#244742] text-slate-300 hover:text-[#4FC3B8] text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Dices className="w-4 h-4 text-[#4FC3B8]" />
              Random
            </button>
          </div>

          {/* Main SOLVE Button */}
          <button
            onClick={onSolve}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#4FC3B8] hover:bg-[#69E3D8] active:scale-95 text-[#07110F] font-extrabold text-sm sm:text-base flex items-center justify-center gap-2 shadow-lg shadow-[#4FC3B8]/20 transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-[#07110F]" />
            Solve Expression
          </button>

        </div>

      </div>
    </div>
  );
}
