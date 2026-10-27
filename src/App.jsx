import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import VariableSelector from './components/VariableSelector';
import ModeTabs from './components/ModeTabs';
import VariableRename from './components/VariableRename';
import BooleanInput from './components/BooleanInput';
import ResultCard from './components/ResultCard';
import KMapGrid from './components/KMapGrid';
import TruthTable from './components/TruthTable';
import LogicCircuit from './components/LogicCircuit';
import HowItWorks from './components/HowItWorks';
import Footer from './components/Footer';
import AboutModal from './components/AboutModal';
import HelpModal from './components/HelpModal';
import PracticeMode from './components/PracticeMode';

import { getDefaultVariables, solveKMap, solveKMapFromMinterms, parseDontCares } from './utils/kmapSolver';
import { BookOpen } from 'lucide-react';
import TestHistory from './components/TestHistory';
import LearnFromRoots from './components/LearnFromRoots';

export default function App() {
  // Application State
  const [numVars, setNumVars] = useState(5);
  const [varNames, setVarNames] = useState(['A', 'B', 'C', 'D', 'E']);
  const [expression, setExpression] = useState("A'B'CD + A'BE + AB'DE");
  const [activeTab, setActiveTab] = useState('expression');

  // Don't-care state
  const [dontCareInput, setDontCareInput] = useState('');

  // Modals & Popups
  const [aboutOpen, setAboutOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [presetOpen, setPresetOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [practiceOpen, setPracticeOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [learnOpen, setLearnOpen] = useState(false);

  // Preset Expressions
  const presetsByVar = {
    2: ["A'B + AB'", "AB + A'B'", "A + B'"],
    3: ["A'BC + ABC + AB'C", "A'B'C' + A'BC + AB'C'", "AB + BC + AC"],
    4: ["A'B'C'D + A'B'CD + A'BC'D + A'BCD", "A'B'CD + A'BCD + ABC'D + AB'CD", "AB'C'D' + AB'CD' + ABCD"],
    5: ["A'B'CD + A'BE + AB'DE", "A'B'C'D'E + A'B'C'DE + AB'C'D'E", "A'BCD + A'B'DE + BC'D'E"],
    6: ["A'B'C'D'E'F + A'B'C'DEF + ABCDEF", "A'B'C'D'E' + ABCDEF + A'BC'D'E'F'", "A'B'CD'E'F + ABC'D'EF'"]
  };

  // Solve Expression (memoized for optimal performance)
  // First compute mintermsTrue for don't-care validation, then full solve
  const solverResult = useMemo(() => {
    // Preliminary solve to get mintermsTrue for don't-care validation
    const preliminary = solveKMap(expression, varNames, []);
    if (preliminary.error) return { error: preliminary.error };

    const numVarsLocal = varNames.length;
    const { dontCares, error: dcError } = parseDontCares(dontCareInput, numVarsLocal, preliminary.mintermsTrue);

    if (dcError) {
      // Return solver result without don't-cares but attach dcError separately
      return { ...preliminary, dontCares: [], dontCareError: dcError };
    }

    // Full solve with validated don't-cares
    return solveKMap(expression, varNames, dontCares);
  }, [expression, varNames, dontCareInput]);

  // Extract don't-care error from the result
  const dontCareError = solverResult?.dontCareError || null;

  // Handle Variable Count change
  const handleChangeNumVars = (count) => {
    setNumVars(count);
    const newVars = getDefaultVariables(count);
    setVarNames(newVars);
    setDontCareInput(''); // reset don't-cares on variable count change
    
    // Set a default expression tailored to new variable count
    if (count === 2) setExpression(`${newVars[0]}'${newVars[1]} + ${newVars[0]}${newVars[1]}'`);
    else if (count === 3) setExpression(`${newVars[0]}'${newVars[1]}${newVars[2]} + ${newVars[0]}${newVars[1]}'${newVars[2]}`);
    else if (count === 4) setExpression(`${newVars[0]}'${newVars[1]}'${newVars[2]}${newVars[3]} + ${newVars[0]}'${newVars[1]}${newVars[3]}`);
    else if (count === 5) setExpression(`${newVars[0]}'${newVars[1]}'${newVars[2]}${newVars[3]} + ${newVars[0]}'${newVars[1]}${newVars[4]} + ${newVars[0]}${newVars[1]}'${newVars[3]}${newVars[4]}`);
    else if (count === 6) setExpression(`${newVars[0]}'${newVars[1]}'${newVars[2]}'${newVars[3]}'${newVars[4]}'${newVars[5]} + ${newVars[0]}${newVars[1]}${newVars[2]}${newVars[3]}${newVars[4]}${newVars[5]}`);
  };

  // Handle Variable Rename
  const handleChangeVarName = (idx, newName) => {
    const cleaned = newName.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const updated = [...varNames];
    updated[idx] = cleaned || getDefaultVariables(numVars)[idx];
    setVarNames(updated);
  };

  // Toggle Cell Minterm Output (0 <-> 1) directly on K-Map or Truth Table
  const handleToggleMinterm = (mintermIdx) => {
    // Don't toggle don't-care cells via the K-Map/Truth Table
    if ((solverResult.dontCares || []).includes(mintermIdx)) return;

    const currentMinterms = solverResult.mintermsTrue || [];
    let updatedMinterms;
    if (currentMinterms.includes(mintermIdx)) {
      updatedMinterms = currentMinterms.filter(m => m !== mintermIdx);
    } else {
      updatedMinterms = [...currentMinterms, mintermIdx].sort((a, b) => a - b);
    }

    const currentDontCares = solverResult.dontCares || [];
    const solvedFromMinterms = solveKMapFromMinterms(updatedMinterms, varNames, currentDontCares);
    setExpression(solvedFromMinterms.simplifiedExpr);
  };

  // Explicit Solve Button Trigger
  const handleSolve = () => {
    if (solverResult.error) {
      showToast(`Error: ${solverResult.error}`);
    } else if (dontCareError) {
      showToast(`Don't-care error: ${dontCareError}`);
    } else {
      showToast("Expression solved successfully!");
    }
  };

  // Reset Everything
  const handleReset = () => {
    setNumVars(5);
    setVarNames(['A', 'B', 'C', 'D', 'E']);
    setExpression("A'B'CD + A'BE + AB'DE");
    setActiveTab('expression');
    setDontCareInput('');
    showToast("Solver has been reset to defaults");
  };

  // Random Expression Generator
  const handleRandomExpression = () => {
    const mintermsCount = Math.min(6, Math.max(2, Math.floor(Math.pow(2, numVars) * 0.3)));
    const generatedTerms = [];

    for (let i = 0; i < mintermsCount; i++) {
      let term = '';
      const numLiterals = Math.floor(Math.random() * (numVars - 1)) + 2;
      const selectedIndices = [...Array(numVars).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, numLiterals)
        .sort((a, b) => a - b);

      for (let idx of selectedIndices) {
        term += varNames[idx];
        if (Math.random() > 0.5) term += "'";
      }
      if (term && !generatedTerms.includes(term)) {
        generatedTerms.push(term);
      }
    }

    const newExpr = generatedTerms.join(' + ') || `${varNames[0]}'${varNames[1]}`;
    setExpression(newExpr);
    showToast("Generated random Boolean expression");
  };

  // Toast notification helper
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#07110F] text-slate-100 flex flex-col font-sans pb-10">
      
      {/* Header Bar */}
      <Header
        onOpenAbout={() => setAboutOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
        onReset={handleReset}
      />

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-2 sm:px-4 space-y-4 pt-2">
        
        
{/* Learn from Roots Button */}
<div className="w-full max-w-6xl mx-auto px-2 sm:px-4 mt-4">
  <button
    onClick={() => setLearnOpen(true)}
    className="w-full flex items-center justify-center gap-3 rounded-2xl bg-[#172A27] hover:bg-[#22423D] border border-[#4FC3B8]/50 px-5 py-4 text-[#4FC3B8] font-extrabold text-base sm:text-lg shadow-lg transition-all cursor-pointer"
  >
    <BookOpen className="w-6 h-6" />
    Learn from Roots
  </button>
</div>

        {/* Variable Count Selector (2 to 6) */}
        <VariableSelector
          numVars={numVars}
          onChangeNumVars={handleChangeNumVars}
        />

        {/* View Mode Navigation Tabs */}
        <ModeTabs
          activeTab={activeTab}
          onChangeTab={setActiveTab}
        />

        {/* View Tab 1: BOOLEAN EXPRESSION (Default) */}
        {activeTab === 'expression' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Variable Renaming Card */}
            <VariableRename
              varNames={varNames}
              onChangeVarName={handleChangeVarName}
            />

            {/* Boolean Expression Input Card (includes don't-care input) */}
            <BooleanInput
              expression={expression}
              setExpression={setExpression}
              onSolve={handleSolve}
              onClear={() => setExpression('')}
              onPresetSelect={() => setPresetOpen(true)}
              onRandomExpr={handleRandomExpression}
              error={solverResult.error}
              varNames={varNames}
              dontCareInput={dontCareInput}
              setDontCareInput={setDontCareInput}
              dontCareError={dontCareError}
            />

            {/* Result Card: Simplified Expression */}
            {!solverResult.error && !dontCareError && (
              <ResultCard
                solverResult={solverResult}
                onCopyExpr={() => showToast("Expression copied to clipboard!")}
              />
            )}

            {/* K-Map Grid Visualization */}
            {!solverResult.error && !dontCareError && (
              <KMapGrid
                solverResult={solverResult}
                onToggleMinterm={handleToggleMinterm}
              />
            )}

            {/* How It Works Educational Section */}
            <HowItWorks />
          </div>
        )}

        {/* View Tab 2: TRUTH TABLE */}
        {activeTab === 'truthtable' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <TruthTable
              solverResult={solverResult}
              onToggleMinterm={handleToggleMinterm}
            />
          </div>
        )}

        {/* View Tab 3: LOGIC CIRCUIT */}
        {activeTab === 'circuit' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <LogicCircuit solverResult={solverResult} />
          </div>
        )}

      </main>

            {/* ── Practice Test Button ─────────────────────────────────────────────── */}
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 mt-8">
        <div className="bg-[#172A27] border border-[#22423D] rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#4FC3B8]/10 border border-[#4FC3B8]/30 flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-[#4FC3B8]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-100">K-Map Practice Test</h3>
              <p className="text-xs text-[#8BA8A3] mt-0.5">Test your K-map knowledge with 20 MCQ questions across Easy, Medium, and Hard difficulty levels.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <button
              onClick={() => setPracticeOpen(true)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#4FC3B8] hover:bg-[#69E3D8] active:scale-95 text-[#07110F] font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#4FC3B8]/20 transition-all cursor-pointer shrink-0"
            >
              <BookOpen className="w-5 h-5" />
              Practice
            </button>

            <button
              onClick={() => setHistoryOpen(true)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#172A27] hover:bg-[#22423D] border border-[#4FC3B8]/40 text-[#4FC3B8] font-extrabold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
            >
              My Test History
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer
        onOpenAbout={() => setAboutOpen(true)}
        onOpenHelp={() => setHelpOpen(true)}
      />

      {/* About Modal */}
      <AboutModal
        isOpen={aboutOpen}
        onClose={() => setAboutOpen(false)}
      />

      {/* Help Modal */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
      />

      {/* Presets Modal */}
      {presetOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#0F2622] border border-[#244742] rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              Preset Expressions ({numVars} Variables)
            </h3>
            <div className="space-y-2">
              {(presetsByVar[numVars] || presetsByVar[5]).map((preset, pIdx) => (
                <button
                  key={pIdx}
                  onClick={() => {
                    setExpression(preset);
                    setPresetOpen(false);
                  }}
                  className="w-full p-3 rounded-2xl bg-[#172A27] hover:bg-[#1F3834] border border-[#22423D] hover:border-[#4FC3B8] text-left text-xs sm:text-sm font-mono text-[#4FC3B8] transition-colors"
                >
                  {preset}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPresetOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#172A27] text-slate-300 hover:text-white text-xs font-bold border border-[#22423D]"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Practice Mode Overlay */}
      {practiceOpen && (
        <PracticeMode onClose={() => setPracticeOpen(false)} />
      )}

      
{/* Learn from Roots Page */}
{learnOpen && (
  <div className="fixed inset-0 z-50 overflow-y-auto bg-[#07110F]">
    <LearnFromRoots onBack={() => setLearnOpen(false)} />
  </div>
)}

      {/* Test History Overlay */}
{historyOpen && (
  <TestHistory onClose={() => setHistoryOpen(false)} />
)}

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4FC3B8] text-[#07110F] font-extrabold px-5 py-3 rounded-2xl shadow-2xl text-xs sm:text-sm animate-in slide-in-from-bottom duration-200 flex items-center gap-2 border border-white/20">
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
