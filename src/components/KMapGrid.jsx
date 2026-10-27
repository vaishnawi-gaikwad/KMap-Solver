import React, { useState, useRef, useLayoutEffect, useEffect } from 'react';
import { Grid, Eye } from 'lucide-react';

export default function KMapGrid({ solverResult, onToggleMinterm }) {
  const [activeGroupIdx, setActiveGroupIdx] = useState(null);

  if (!solverResult || !solverResult.kmapData) return null;

  const { kmapData, groups, numVars, varNames } = solverResult;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 space-y-4">
      
      {/* Group Legend / Highlight Selectors */}
      {groups && groups.length > 0 && (
        <div className="bg-[#172A27] border border-[#22423D] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2 shadow-md">
          <span className="text-xs font-bold text-[#8BA8A3] uppercase tracking-wider flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-[#4FC3B8]" /> K-Map Groups Legend:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveGroupIdx(null)}
              className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors ${
                activeGroupIdx === null
                  ? 'bg-[#4FC3B8] text-[#07110F]'
                  : 'bg-[#0F2622] text-slate-300 hover:text-white border border-[#22423D]'
              }`}
            >
              Show All Groups
            </button>

            {groups.map((g, idx) => (
              <button
                key={idx}
                onClick={() => setActiveGroupIdx(activeGroupIdx === idx ? null : idx)}
                onMouseEnter={() => setActiveGroupIdx(idx)}
                onMouseLeave={() => setActiveGroupIdx(null)}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                  activeGroupIdx === idx
                    ? 'ring-2 ring-white scale-105 shadow-md'
                    : 'opacity-90 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: g.color?.bg || 'rgba(79,195,184,0.2)',
                  color: g.color?.text || '#4FC3B8',
                  border: `1.5px solid ${g.color?.border || '#4FC3B8'}`
                }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full inline-block"
                  style={{ backgroundColor: g.color?.border }}
                />
                {g.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Karnaugh Map Rendering */}
      <div className="bg-[#172A27] border border-[#22423D] rounded-3xl p-4 sm:p-6 shadow-xl overflow-x-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Grid className="w-5 h-5 text-[#4FC3B8]" />
            <h3 className="text-sm font-bold text-slate-100">
              Karnaugh Map Grid ({numVars} Variables: {varNames.join(', ')})
            </h3>
          </div>
          <span className="text-xs font-mono text-[#8BA8A3]">Click any cell to toggle 0 ↔ 1</span>
        </div>

        {/* Render Single 2D Grid (2, 3, 4 Vars) */}
        {kmapData.type === 'single' && (
          <SingleKMapTable
            rowHeader={kmapData.rowHeader}
            colHeader={kmapData.colHeader}
            rowGray={kmapData.rowGray}
            colGray={kmapData.colGray}
            grid={kmapData.grid}
            activeGroupIdx={activeGroupIdx}
            groups={groups}
            onToggleMinterm={onToggleMinterm}
          />
        )}

        {/* Render 2 Sub-Grids (5 Vars) */}
        {kmapData.type === 'multi-2' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {kmapData.subGrids.map((sub, idx) => (
              <div key={idx} className="bg-[#0F2622] p-4 rounded-2xl border border-[#22423D]">
                <h4 className="text-center text-sm font-extrabold text-[#4FC3B8] font-mono mb-3 bg-[#172A27] py-1.5 rounded-xl border border-[#244742]">
                  Map Section: {sub.title}
                </h4>
                <SingleKMapTable
                  rowHeader={kmapData.rowHeader}
                  colHeader={kmapData.colHeader}
                  rowGray={kmapData.rowGray}
                  colGray={kmapData.colGray}
                  grid={sub.grid}
                  activeGroupIdx={activeGroupIdx}
                  groups={groups}
                  onToggleMinterm={onToggleMinterm}
                />
              </div>
            ))}
          </div>
        )}

        {/* Render 4 Sub-Grids (6 Vars) */}
        {kmapData.type === 'multi-4' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {kmapData.subGrids.map((sub, idx) => (
              <div key={idx} className="bg-[#0F2622] p-4 rounded-2xl border border-[#22423D]">
                <h4 className="text-center text-sm font-extrabold text-[#4FC3B8] font-mono mb-3 bg-[#172A27] py-1.5 rounded-xl border border-[#244742]">
                  Map Section: {sub.title}
                </h4>
                <SingleKMapTable
                  rowHeader={kmapData.rowHeader}
                  colHeader={kmapData.colHeader}
                  rowGray={kmapData.rowGray}
                  colGray={kmapData.colGray}
                  grid={sub.grid}
                  activeGroupIdx={activeGroupIdx}
                  groups={groups}
                  onToggleMinterm={onToggleMinterm}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/**
 * Helper to partition a set of 0-indexed row or col indices into contiguous blocks (handling wrapping)
 */
function partitionContiguousBlocks(indices, size) {
  if (!indices || indices.length === 0) return [];
  const sorted = Array.from(new Set(indices)).sort((a, b) => a - b);

  if (sorted.length === 1 || sorted.length === size) return [sorted];

  // Check if group wraps around edges (contains both index 0 and size - 1)
  const wraps = sorted.includes(0) && sorted.includes(size - 1);

  if (!wraps) {
    const blocks = [];
    let current = [sorted[0]];
    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] === sorted[i - 1] + 1) {
        current.push(sorted[i]);
      } else {
        blocks.push(current);
        current = [sorted[i]];
      }
    }
    blocks.push(current);
    return blocks;
  } else {
    // Find gap index where non-consecutive jump occurs
    let splitIdx = -1;
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i + 1] > sorted[i] + 1) {
        splitIdx = i;
        break;
      }
    }
    if (splitIdx !== -1) {
      const block1 = sorted.slice(0, splitIdx + 1);
      const block2 = sorted.slice(splitIdx + 1);
      return [block1, block2];
    }
    return [sorted];
  }
}

function SingleKMapTable({ rowHeader, colHeader, rowGray, colGray, grid, activeGroupIdx, groups, onToggleMinterm }) {
  const containerRef = useRef(null);
  const cellRefs = useRef({});
  const [outlines, setOutlines] = useState([]);

  // Recalculate group overlay geometry based on DOM cell measurements
  const updateOutlines = () => {
    if (!containerRef.current || !groups || groups.length === 0) {
      setOutlines([]);
      return;
    }

    const containerRect = containerRef.current.getBoundingClientRect();
    const newOutlines = [];

    const numRows = rowGray.length;
    const numCols = colGray.length;

    groups.forEach((group, gIdx) => {
      // Only draw outlines over ON-set cells (output===1), not over don't-care (X) cells
      const gridMinterms = [];
      const cellMap = {};

      grid.forEach(row => {
        row.forEach(cell => {
          if (group.minterms.includes(cell.minterm) && cell.output === 1) {
            gridMinterms.push(cell);
            cellMap[`${cell.rIdx},${cell.cIdx}`] = cell;
          }
        });
      });

      if (gridMinterms.length === 0) return;

      const rIndices = gridMinterms.map(c => c.rIdx);
      const cIndices = gridMinterms.map(c => c.cIdx);

      const rBlocks = partitionContiguousBlocks(rIndices, numRows);
      const cBlocks = partitionContiguousBlocks(cIndices, numCols);

      rBlocks.forEach(rBlock => {
        cBlocks.forEach(cBlock => {
          // Collect cells matching rBlock and cBlock
          const blockCells = [];
          rBlock.forEach(r => {
            cBlock.forEach(c => {
              const cell = cellMap[`${r},${c}`];
              if (cell) blockCells.push(cell);
            });
          });

          if (blockCells.length === 0) return;

          let minTop = Infinity;
          let minLeft = Infinity;
          let maxBottom = -Infinity;
          let maxRight = -Infinity;

          blockCells.forEach(cell => {
            const el = cellRefs.current[cell.minterm];
            if (el) {
              const rect = el.getBoundingClientRect();
              minTop = Math.min(minTop, rect.top - containerRect.top);
              minLeft = Math.min(minLeft, rect.left - containerRect.left);
              maxBottom = Math.max(maxBottom, rect.bottom - containerRect.top);
              maxRight = Math.max(maxRight, rect.right - containerRect.left);
            }
          });

          if (minTop !== Infinity && minLeft !== Infinity) {
            // Apply slight padding inset inside the target cell bounds
            const inset = 3;
            newOutlines.push({
              groupIdx: gIdx,
              text: group.text,
              color: group.color,
              top: minTop + inset,
              left: minLeft + inset,
              width: Math.max(20, (maxRight - minLeft) - 2 * inset),
              height: Math.max(20, (maxBottom - minTop) - 2 * inset)
            });
          }
        });
      });
    });

    setOutlines(newOutlines);
  };

  useLayoutEffect(() => {
    updateOutlines();
  }, [grid, groups, rowGray, colGray]);

  useEffect(() => {
    const handleResize = () => updateOutlines();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [grid, groups]);

  return (
    <div className="relative min-w-[320px] mx-auto select-none" ref={containerRef}>
      
      {/* ABSOLUTE GROUP OVERLAY LAYER (pointer-events-none to preserve cell clicks) */}
      <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
        {outlines.map((out, oIdx) => {
          const isHidden = activeGroupIdx !== null && activeGroupIdx !== out.groupIdx;
          if (isHidden) return null;

          return (
            <div
              key={oIdx}
              className="absolute transition-all duration-200 pointer-events-none"
              style={{
                top: `${out.top}px`,
                left: `${out.left}px`,
                width: `${out.width}px`,
                height: `${out.height}px`,
                border: `3.5px solid ${out.color.border}`,
                backgroundColor: out.color.bg || 'rgba(79, 195, 184, 0.12)',
                borderRadius: '18px',
                boxShadow: `0 0 12px ${out.color.border}50, inset 0 0 10px ${out.color.border}25`
              }}
            >
              {/* Group Label Badge */}
              <span
                className="absolute -top-3.5 right-2 px-2 py-0.5 rounded-full text-[10px] font-mono font-extrabold shadow-md pointer-events-none tracking-wide"
                style={{
                  backgroundColor: out.color.border,
                  color: '#07110F',
                }}
              >
                {out.text}
              </span>
            </div>
          );
        })}
      </div>

      {/* UNDERLYING TABLE GRID */}
      <table className="w-full border-collapse text-center">
        <thead>
          <tr>
            {/* Top Left Header Cell with Variable Axes */}
            <th className="p-3 bg-[#0F2622] border border-[#244742] rounded-tl-2xl text-xs font-bold text-[#4FC3B8]">
              <div className="flex items-center justify-between font-mono text-[11px]">
                <span className="text-[#8BA8A3]">{rowHeader}</span>
                <span className="text-[#244742]">\</span>
                <span className="text-[#4FC3B8]">{colHeader}</span>
              </div>
            </th>

            {/* Column Headers (Gray Code) */}
            {colGray.map((cBits, cIdx) => (
              <th
                key={cIdx}
                className="p-2 sm:p-3 bg-[#0F2622] border border-[#244742] text-xs font-mono font-bold text-[#4FC3B8]"
              >
                {cBits}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rowGray.map((rBits, rIdx) => (
            <tr key={rIdx}>
              {/* Row Header (Gray Code) */}
              <th className="p-2 sm:p-3 bg-[#0F2622] border border-[#244742] text-xs font-mono font-bold text-[#8BA8A3]">
                {rBits}
              </th>

              {/* Grid Cells */}
              {colGray.map((_, cIdx) => {
                const cell = grid[rIdx][cIdx];
                const isOne = cell.output === 1;
                const isDontCare = cell.output === 'X';

                return (
                  <td
                    key={cIdx}
                    ref={(el) => (cellRefs.current[cell.minterm] = el)}
                    onClick={() => {
                      // Don't-care cells cannot be toggled directly (they come from input)
                      if (!isDontCare && onToggleMinterm) onToggleMinterm(cell.minterm);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!isDontCare && onToggleMinterm) onToggleMinterm(cell.minterm);
                      }
                    }}
                    tabIndex={isDontCare ? -1 : 0}
                    role={isDontCare ? undefined : 'button'}
                    aria-label={
                      isDontCare
                        ? `Minterm ${cell.minterm}, don't-care (X)`
                        : `Minterm ${cell.minterm}, value ${cell.output}. Click to toggle.`
                    }
                    className={`relative p-3 sm:p-4 border border-[#22423D] text-sm sm:text-base font-extrabold font-mono transition-colors duration-150 ${
                      isDontCare
                        ? 'bg-amber-950/30 cursor-default'
                        : 'cursor-pointer hover:bg-[#1F3834] active:scale-95 ' + (isOne ? 'bg-[#0F2622]' : 'text-slate-500 bg-[#07110F]/60')
                    }`}
                  >
                    {/* Cell Output Value */}
                    {isDontCare ? (
                      <span className="inline-block font-black text-amber-400 text-base sm:text-lg">X</span>
                    ) : (
                      <span className={isOne ? 'scale-110 inline-block font-black text-[#4FC3B8] text-base sm:text-lg' : 'inline-block text-slate-500'}>
                        {cell.output}
                      </span>
                    )}

                    {/* Minterm Index Label in bottom right */}
                    <span className="absolute bottom-1 right-1.5 text-[9px] font-sans font-normal text-[#8BA8A3] opacity-80">
                      m{cell.minterm}
                    </span>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
