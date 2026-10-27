import React from 'react';
import { Table2, Download } from 'lucide-react';

export default function TruthTable({ solverResult, onToggleMinterm }) {
  if (!solverResult || !solverResult.truthTable) return null;

  const { truthTable, varNames, numVars, mintermsTrue, dontCares = [] } = solverResult;
  const dontCareSet = new Set(dontCares);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    // Header
    csvContent += "Minterm," + varNames.join(",") + ",Output\n";
    // Rows
    truthTable.forEach((row) => {
      const varValues = varNames.map(v => row.stateMap[v]).join(",");
      const outputVal = dontCareSet.has(row.index) ? 'X' : row.output;
      csvContent += `m${row.index},${varValues},${outputVal}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `kmap_truth_table_${numVars}vars.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 space-y-3">
      
      {/* Top Bar */}
      <div className="bg-[#172A27] border border-[#22423D] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0F2622] border border-[#4FC3B8]/30 flex items-center justify-center text-[#4FC3B8]">
            <Table2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Full Truth Table ({Math.pow(2, numVars)} Combinations)
            </h3>
            <p className="text-xs text-[#8BA8A3]">
              Active Minterms (Output = 1): <strong className="text-[#4FC3B8]">{mintermsTrue.length}</strong>
              {dontCares.length > 0 && (
                <> • Don't-Cares (X): <strong className="text-amber-400">{dontCares.length}</strong></>
              )}
              {' '}• Click any output pill to toggle 0 ↔ 1
            </p>
          </div>
        </div>

        {/* CSV Export Button */}
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-xl bg-[#0F2622] hover:bg-[#22423D] border border-[#244742] text-[#4FC3B8] hover:text-[#69E3D8] text-xs font-semibold flex items-center gap-2 transition-colors focus:outline-none"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-[#172A27] border border-[#22423D] rounded-3xl overflow-hidden shadow-xl">
        <div className="max-h-[550px] overflow-y-auto overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead className="bg-[#0F2622] text-[#4FC3B8] uppercase font-mono sticky top-0 z-10 border-b border-[#244742]">
              <tr>
                <th className="p-3.5 text-center font-bold">Minterm</th>
                {varNames.map((name, idx) => (
                  <th key={idx} className="p-3.5 text-center font-bold">{name}</th>
                ))}
                <th className="p-3.5 text-center font-bold text-slate-100 bg-[#172A27] border-l border-[#244742]">
                  Output (F)
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-[#22423D] font-mono">
              {truthTable.map((row) => {
                const isDontCare = dontCareSet.has(row.index);
                const isOne = row.output === 1;
                return (
                  <tr
                    key={row.index}
                    onClick={() => {
                      // Don't-care rows cannot be toggled via row click
                      if (!isDontCare && onToggleMinterm) onToggleMinterm(row.index);
                    }}
                    className={`transition-colors ${
                      isDontCare
                        ? 'bg-amber-950/20 text-amber-300/70 cursor-default'
                        : isOne
                        ? 'bg-[#4FC3B8]/15 hover:bg-[#4FC3B8]/25 text-slate-100 font-bold cursor-pointer'
                        : 'hover:bg-[#0F2622]/80 text-slate-400 cursor-pointer'
                    }`}
                  >
                    {/* Minterm decimal index */}
                    <td className="p-3 text-center text-[#8BA8A3]">
                      m{row.index}
                    </td>

                    {/* Variable binary values */}
                    {varNames.map((name, idx) => (
                      <td key={idx} className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded ${
                          isDontCare
                            ? 'text-amber-300/60'
                            : row.stateMap[name] === 1 ? 'text-[#4FC3B8]' : 'text-slate-500'
                        }`}>
                          {row.stateMap[name]}
                        </span>
                      </td>
                    ))}

                    {/* Output State */}
                    <td className="p-3 text-center font-extrabold border-l border-[#244742]">
                      {isDontCare ? (
                        <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-amber-900/50 text-amber-400 border border-amber-700/50">
                          X
                        </span>
                      ) : (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onToggleMinterm) onToggleMinterm(row.index);
                          }}
                          className={`px-3.5 py-1 rounded-full text-xs font-bold transition-transform active:scale-95 cursor-pointer ${
                            isOne
                              ? 'bg-[#4FC3B8] text-[#07110F] shadow-[0_0_10px_rgba(79,195,184,0.4)] hover:bg-[#69E3D8]'
                              : 'bg-[#0F2622] text-slate-400 border border-[#22423D] hover:border-[#4FC3B8] hover:text-[#4FC3B8]'
                          }`}
                        >
                          {row.output}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
