import React from 'react';
import { Cpu, Zap } from 'lucide-react';

export default function LogicCircuit({ solverResult }) {
  if (!solverResult || !solverResult.terms) return null;

  const { terms, varNames, simplifiedExpr } = solverResult;

  // Handle trivial cases (0 or 1)
  if (simplifiedExpr === '0' || simplifiedExpr === '1') {
    return (
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2">
        <div className="bg-[#172A27] border border-[#22423D] rounded-3xl p-8 text-center text-slate-300 shadow-xl">
          <Cpu className="w-12 h-12 text-[#4FC3B8] mx-auto mb-3" />
          <h3 className="text-lg font-bold">Constant Logic Output</h3>
          <p className="text-sm text-[#8BA8A3] mt-1 font-mono">
            Output F is tied directly to VCC / GND constant: <strong className="text-[#4FC3B8]">{simplifiedExpr}</strong>
          </p>
        </div>
      </div>
    );
  }

  // Parse literals for each product term
  // e.g. term binary '01-1' -> var[0]=0 (A'), var[1]=1 (B), var[3]=1 (D)
  const gateData = terms.map((termObj, tIdx) => {
    const literals = [];
    const binMask = termObj.binary;
    if (binMask) {
      for (let i = 0; i < binMask.length; i++) {
        if (binMask[i] === '1') {
          literals.push({ varName: varNames[i], negated: false, varIdx: i });
        } else if (binMask[i] === '0') {
          literals.push({ varName: varNames[i], negated: true, varIdx: i });
        }
      }
    }
    return {
      termText: termObj.text,
      color: termObj.color,
      literals
    };
  });

  // Calculate SVG dimensions
  const numInputs = varNames.length;
  const numAndGates = gateData.length;
  
  const width = 850;
  const height = Math.max(450, Math.max(numInputs * 50 + 60, numAndGates * 90 + 100));

  // Y coordinates for inputs
  const inputSpacing = Math.min(60, (height - 100) / Math.max(1, numInputs));
  const inputStartY = 60;
  const inputYMap = {};
  varNames.forEach((v, idx) => {
    inputYMap[v] = inputStartY + idx * inputSpacing;
  });

  // Y coordinates for AND gates
  const andSpacing = Math.min(80, (height - 120) / Math.max(1, numAndGates));
  const andStartY = 70;
  const andYMap = gateData.map((_, idx) => andStartY + idx * andSpacing);

  // OR Gate position
  const orX = 660;
  const orY = height / 2;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 py-2 space-y-3">
      
      {/* Header */}
      <div className="bg-[#172A27] border border-[#22423D] rounded-2xl p-4 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#0F2622] border border-[#4FC3B8]/30 flex items-center justify-center text-[#4FC3B8]">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">
              Logic Circuit Diagram (SVG Schematic)
            </h3>
            <p className="text-xs text-[#8BA8A3]">
              {numInputs} Inputs • {numAndGates} AND Gate{numAndGates === 1 ? '' : 's'} • {numAndGates > 1 ? '1 OR Gate' : 'Direct Output'}
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-[#4FC3B8] bg-[#0F2622] px-3 py-1.5 rounded-xl border border-[#244742] hidden sm:block">
          Interactive Gate View
        </span>
      </div>

      {/* SVG Canvas Container */}
      <div className="bg-[#0F2622] border border-[#244742] rounded-3xl p-4 sm:p-6 shadow-2xl overflow-x-auto select-none">
        <div className="min-w-[700px] flex justify-center">
          
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-4xl h-auto drop-shadow-lg">
            
            <defs>
              <linearGradient id="gateGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#172A27" />
                <stop offset="100%" stopColor="#0B1A18" />
              </linearGradient>
            </defs>

            {/* Background Grid Pattern */}
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#22423D" strokeWidth="0.5" strokeOpacity="0.4" />
            </pattern>
            <rect width={width} height={height} fill="url(#gridPattern)" rx="16" />

            {/* 1. INPUT RAILS & NOT BUBBLE RAILS */}
            {varNames.map((vName, idx) => {
              const y = inputYMap[vName];
              const railX = 60 + idx * 30;

              return (
                <g key={vName}>
                  {/* Input Label Box */}
                  <rect x="10" y={y - 14} width="36" height="28" rx="8" fill="#172A27" stroke="#4FC3B8" strokeWidth="1.5" />
                  <text x="28" y={y + 4} fill="#4FC3B8" fontSize="13" fontWeight="bold" textAnchor="middle" fontFamily="monospace">
                    {vName}
                  </text>

                  {/* Horizontal Input Bus Wire */}
                  <line x1="46" y1={y} x2={railX} y2={y} stroke="#4FC3B8" strokeWidth="2" />
                  
                  {/* Vertical Rail Wire */}
                  <line x1={railX} y1={y} x2={railX} y2={height - 40} stroke="#4FC3B8" strokeWidth="1.5" strokeOpacity="0.6" strokeDasharray="3 3" />
                  <circle cx={railX} cy={y} r="3" fill="#4FC3B8" />
                </g>
              );
            })}

            {/* 2. AND GATES & CONNECTIONS */}
            {gateData.map((gate, gIdx) => {
              const andX = 400;
              const andY = andYMap[gIdx];
              const strokeColor = gate.color?.border || '#4FC3B8';

              return (
                <g key={gIdx}>
                  {/* Wire Connections from Input Rails to AND Gate Inputs */}
                  {gate.literals.map((lit, lIdx) => {
                    const railX = 60 + lit.varIdx * 30;
                    const inputY = inputYMap[lit.varName];
                    const targetY = andY - 15 + lIdx * (30 / Math.max(1, gate.literals.length - 1));
                    
                    return (
                      <g key={lIdx}>
                        {/* Wire path from rail to gate input */}
                        <path
                          d={`M ${railX} ${inputY} C ${railX + 60} ${inputY}, ${andX - 60} ${targetY}, ${andX} ${targetY}`}
                          fill="none"
                          stroke={lit.negated ? '#F472B6' : strokeColor}
                          strokeWidth="1.5"
                          strokeOpacity="0.8"
                        />
                        <circle cx={railX} cy={inputY} r="3" fill={strokeColor} />

                        {/* NOT Bubble if literal is negated */}
                        {lit.negated && (
                          <circle cx={andX - 8} cy={targetY} r="4" fill="#07110F" stroke="#F472B6" strokeWidth="1.5" />
                        )}
                      </g>
                    );
                  })}

                  {/* AND Gate D-Shape Body */}
                  <path
                    d={`M ${andX} ${andY - 24} L ${andX + 24} ${andY - 24} A 24 24 0 0 1 ${andX + 24} ${andY + 24} L ${andX} ${andY + 24} Z`}
                    fill="url(#gateGrad)"
                    stroke={strokeColor}
                    strokeWidth="2"
                  />
                  <text x={andX + 16} y={andY + 4} fill={strokeColor} fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">
                    AND
                  </text>

                  {/* Term Label above gate */}
                  <text x={andX + 20} y={andY - 28} fill={strokeColor} fontSize="11" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
                    {gate.termText}
                  </text>

                  {/* Output Wire to OR Gate */}
                  {numAndGates > 1 ? (
                    <path
                      d={`M ${andX + 48} ${andY} C ${andX + 100} ${andY}, ${orX - 80} ${orY - 40 + gIdx * (80 / Math.max(1, numAndGates - 1))}, ${orX} ${orY - 40 + gIdx * (80 / Math.max(1, numAndGates - 1))}`}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2"
                    />
                  ) : (
                    /* Single Gate Direct Output */
                    <g>
                      <line x1={andX + 48} y1={andY} x2={width - 80} y2={andY} stroke={strokeColor} strokeWidth="2.5" />
                      <circle cx={width - 80} cy={andY} r="4" fill={strokeColor} />
                      <text x={width - 65} y={andY + 4} fill="#4FC3B8" fontSize="15" fontWeight="extrabold" fontFamily="monospace">
                        F
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* 3. MAIN OR GATE (If > 1 term) */}
            {numAndGates > 1 && (
              <g>
                {/* Curved OR Gate Body */}
                <path
                  d={`M ${orX} ${orY - 45} C ${orX + 20} ${orY - 45}, ${orX + 40} ${orY - 20}, ${orX + 65} ${orY} C ${orX + 40} ${orY + 20}, ${orX + 20} ${orY + 45}, ${orX} ${orY + 45} C ${orX + 15} ${orY + 20}, ${orX + 15} ${orY - 20}, ${orX} ${orY - 45} Z`}
                  fill="url(#gateGrad)"
                  stroke="#4FC3B8"
                  strokeWidth="2.5"
                />
                <text x={orX + 25} y={orY + 4} fill="#4FC3B8" fontSize="11" fontWeight="extrabold" textAnchor="middle">
                  OR
                </text>

                {/* Final Output Wire */}
                <line x1={orX + 65} y1={orY} x2={width - 90} y2={orY} stroke="#4FC3B8" strokeWidth="3" />
                
                {/* Output Node Pill */}
                <rect x={width - 90} y={orY - 16} width="50" height="32" rx="10" fill="#4FC3B8" stroke="#69E3D8" strokeWidth="1.5" />
                <text x={width - 65} y={orY + 5} fill="#07110F" fontSize="14" fontWeight="extrabold" textAnchor="middle" fontFamily="monospace">
                  F
                </text>
              </g>
            )}

          </svg>

        </div>
      </div>

    </div>
  );
}
