/**
 * Karnaugh Map Solver Utility
 * Supports 2, 3, 4, 5, and 6 variable Boolean expressions.
 * Extended with Don't-Care conditions support.
 */

// Color palette for K-Map group outlines and highlights
export const GROUP_COLORS = [
  { border: '#4FC3B8', bg: 'rgba(79, 195, 184, 0.25)', text: '#4FC3B8', label: 'Teal' },
  { border: '#10B981', bg: 'rgba(16, 185, 129, 0.25)', text: '#34D399', label: 'Emerald' },
  { border: '#F59E0B', bg: 'rgba(245, 158, 11, 0.25)', text: '#FBBF24', label: 'Amber' },
  { border: '#EC4899', bg: 'rgba(236, 72, 153, 0.25)', text: '#F472B6', label: 'Pink' },
  { border: '#8B5CF6', bg: 'rgba(139, 92, 246, 0.25)', text: '#A78BFA', label: 'Violet' },
  { border: '#3B82F6', bg: 'rgba(59, 130, 246, 0.25)', text: '#60A5FA', label: 'Blue' },
  { border: '#F97316', bg: 'rgba(249, 115, 22, 0.25)', text: '#FB923C', label: 'Orange' },
  { border: '#84CC16', bg: 'rgba(132, 204, 22, 0.25)', text: '#A3E635', label: 'Lime' },
];

/**
 * Default Variable Names according to count
 */
export function getDefaultVariables(count) {
  const defaults = ['A', 'B', 'C', 'D', 'E', 'F'];
  return defaults.slice(0, count);
}

/**
 * Gray Code generators for 1, 2, or 3 bits
 */
export function getGrayCode(bits) {
  if (bits === 1) return ['0', '1'];
  if (bits === 2) return ['00', '01', '11', '10'];
  if (bits === 3) return ['000', '001', '011', '010', '110', '111', '101', '100'];
  return ['0', '1'];
}

/**
 * Evaluate a single boolean product term or expression for a given minterm binary object
 */
function evaluateExpressionForState(exprStr, varNames, stateMap) {
  if (!exprStr || !exprStr.trim()) return 0;
  
  let cleaned = exprStr.replace(/\s+/g, '');
  if (cleaned === '0') return 0;
  if (cleaned === '1') return 1;

  // Split by '+' for Sum of Products (SOP) OR operations
  const terms = cleaned.split('+');
  
  for (let term of terms) {
    if (!term) continue;
    let termVal = 1;
    let i = 0;
    
    // Evaluate literals in term
    while (i < term.length) {
      if (term[i] === '(' || term[i] === ')') {
        i++;
        continue;
      }
      
      // Match variable name (support multi-char if needed, or single char from varNames)
      let foundVar = null;
      // Sort varNames by length descending to match longer names first if any
      const sortedVars = [...varNames].sort((a, b) => b.length - a.length);
      for (let v of sortedVars) {
        if (term.substring(i).startsWith(v)) {
          foundVar = v;
          break;
        }
      }
      
      if (foundVar) {
        i += foundVar.length;
        let isNegated = false;
        if (i < term.length && (term[i] === "'" || term[i] === '!' || term[i] === '~')) {
          isNegated = true;
          i++;
        }
        let bitVal = stateMap[foundVar] ?? 0;
        if (isNegated) bitVal = 1 - bitVal;
        
        termVal = termVal & bitVal;
      } else {
        // Unknown char or operator
        i++;
      }
    }
    
    if (termVal === 1) return 1; // OR logic: if any term is true, return 1
  }
  
  return 0;
}

/**
 * Validate Boolean Expression Syntax
 */
export function validateExpression(exprStr, varNames) {
  if (!exprStr || !exprStr.trim()) return { valid: true, error: null };

  const str = exprStr.trim();
  // Check balanced parentheses
  let depth = 0;
  for (let char of str) {
    if (char === '(') depth++;
    if (char === ')') depth--;
    if (depth < 0) return { valid: false, error: "Unmatched closing parenthesis ')'" };
  }
  if (depth !== 0) return { valid: false, error: "Unmatched opening parenthesis '('" };

  // Check for unknown characters / variables
  // Allowed: varNames, +, ', !, ~, *, &, |, spaces, (, )
  const allowedChars = new Set(['+', "'", '!', '~', '*', '&', '|', ' ', '(', ')', '0', '1']);
  for (let v of varNames) {
    for (let c of v) allowedChars.add(c);
  }

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (!allowedChars.has(char)) {
      return { valid: false, error: `Invalid character or unrecognised variable '${char}'` };
    }
  }

  return { valid: true, error: null };
}

/**
 * Parse and validate a comma-separated string of don't-care minterm indices.
 * Returns { dontCares: number[], error: string|null }
 */
export function parseDontCares(rawInput, numVars, mintermsTrue) {
  if (!rawInput || !rawInput.trim()) return { dontCares: [], error: null };

  const maxMinterm = Math.pow(2, numVars) - 1;
  const parts = rawInput.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const dontCares = [];
  const onSet = new Set(mintermsTrue);

  for (const part of parts) {
    if (!/^\d+$/.test(part)) {
      return { dontCares: [], error: `"${part}" is not a valid integer minterm index.` };
    }
    const num = parseInt(part, 10);
    if (num < 0 || num > maxMinterm) {
      return { dontCares: [], error: `Minterm ${num} is out of range (0–${maxMinterm}) for ${numVars} variables.` };
    }
    if (onSet.has(num)) {
      return { dontCares: [], error: `Minterm ${num} is already in the ON-set. It cannot also be a don't-care.` };
    }
    if (dontCares.includes(num)) {
      return { dontCares: [], error: `Minterm ${num} is listed more than once in the don't-care input.` };
    }
    dontCares.push(num);
  }

  return { dontCares: dontCares.sort((a, b) => a - b), error: null };
}

/**
 * Solve Boolean Expression & Build Full K-Map + Truth Table Output
 */
export function solveKMap(rawExpr, varNames, dontCares = []) {
  const numVars = varNames.length;
  const numMinterms = Math.pow(2, numVars);

  const validation = validateExpression(rawExpr, varNames);
  if (!validation.valid) {
    return { error: validation.error };
  }

  // 1. Generate Truth Table
  const truthTable = [];
  const mintermsTrue = [];
  const dontCareSet = new Set(dontCares);

  for (let m = 0; m < numMinterms; m++) {
    // Convert m to binary array of length numVars
    const binStr = m.toString(2).padStart(numVars, '0');
    const stateMap = {};
    for (let i = 0; i < numVars; i++) {
      stateMap[varNames[i]] = parseInt(binStr[i], 10);
    }

    let output;
    if (dontCareSet.has(m)) {
      output = 'X'; // don't-care
    } else {
      output = evaluateExpressionForState(rawExpr, varNames, stateMap);
    }

    truthTable.push({
      index: m,
      binary: binStr,
      stateMap,
      output
    });

    if (output === 1) {
      mintermsTrue.push(m);
    }
  }

  // 2. Perform Quine-McCluskey Reduction (with don't-cares)
  const solverResult = simplifyQuineMcCluskey(mintermsTrue, dontCares, numVars, varNames);

  // 3. Construct K-Map Structure based on Variable Count
  const kmapData = buildKMapStructure(numVars, varNames, truthTable, solverResult.groups);

  return {
    error: null,
    numVars,
    varNames,
    truthTable,
    mintermsTrue,
    dontCares,
    simplifiedExpr: solverResult.simplifiedExpr,
    terms: solverResult.terms,
    groups: solverResult.groups,
    kmapData
  };
}

/**
 * Solve K-Map directly from an array of true minterm indices
 */
export function solveKMapFromMinterms(minterms, varNames, dontCares = []) {
  const numVars = varNames.length;
  const numMinterms = Math.pow(2, numVars);
  const dontCareSet = new Set(dontCares);

  const truthTable = [];
  const mintermsTrue = Array.from(new Set(minterms)).sort((a, b) => a - b);

  for (let m = 0; m < numMinterms; m++) {
    const binStr = m.toString(2).padStart(numVars, '0');
    const stateMap = {};
    for (let i = 0; i < numVars; i++) {
      stateMap[varNames[i]] = parseInt(binStr[i], 10);
    }
    let output;
    if (dontCareSet.has(m)) {
      output = 'X';
    } else {
      output = mintermsTrue.includes(m) ? 1 : 0;
    }
    truthTable.push({
      index: m,
      binary: binStr,
      stateMap,
      output
    });
  }

  const solverResult = simplifyQuineMcCluskey(mintermsTrue, dontCares, numVars, varNames);
  const kmapData = buildKMapStructure(numVars, varNames, truthTable, solverResult.groups);

  return {
    error: null,
    numVars,
    varNames,
    truthTable,
    mintermsTrue,
    dontCares,
    simplifiedExpr: solverResult.simplifiedExpr,
    terms: solverResult.terms,
    groups: solverResult.groups,
    kmapData
  };
}


/**
 * Quine-McCluskey Algorithm Implementation (with Don't-Care support)
 *
 * Don't-cares are included in the merging phase so they can expand prime implicants,
 * but they are NOT required to be covered in the final selection step.
 */
function simplifyQuineMcCluskey(minterms, dontCares, numVars, varNames) {
  if (minterms.length === 0) {
    return { simplifiedExpr: '0', terms: [], groups: [] };
  }

  // All ON-set + don't-care minterms together for merging
  const allForMerging = Array.from(new Set([...minterms, ...dontCares])).sort((a, b) => a - b);

  if (minterms.length === Math.pow(2, numVars)) {
    return { simplifiedExpr: '1', terms: [{ text: '1', color: GROUP_COLORS[0] }], groups: [{ minterms: allForMerging, mask: '-'.repeat(numVars), text: '1', color: GROUP_COLORS[0] }] };
  }

  // Step A: Convert all (ON + DC) minterms to initial binary terms
  let currentTerms = allForMerging.map(m => ({
    binary: m.toString(2).padStart(numVars, '0'),
    minterms: [m],
    used: false
  }));

  const primeImplicants = [];

  // Step B: Merge terms that differ by 1 bit
  while (currentTerms.length > 0) {
    const nextTerms = [];
    const mergedMap = new Map();

    for (let i = 0; i < currentTerms.length; i++) {
      for (let j = i + 1; j < currentTerms.length; j++) {
        const t1 = currentTerms[i];
        const t2 = currentTerms[j];

        const diff = getBitDifference(t1.binary, t2.binary);
        if (diff.count === 1) {
          t1.used = true;
          t2.used = true;

          const mergedBin = replaceAt(t1.binary, diff.index, '-');
          const combinedMinterms = Array.from(new Set([...t1.minterms, ...t2.minterms])).sort((a, b) => a - b);
          const key = mergedBin;

          if (!mergedMap.has(key)) {
            const newObj = { binary: mergedBin, minterms: combinedMinterms, used: false };
            mergedMap.set(key, newObj);
            nextTerms.push(newObj);
          }
        }
      }
    }

    // Collect terms that couldn't be merged (Prime Implicants)
    for (let term of currentTerms) {
      if (!term.used) {
        // Prevent duplicate prime implicants
        if (!primeImplicants.some(p => p.binary === term.binary)) {
          primeImplicants.push(term);
        }
      }
    }

    currentTerms = nextTerms;
  }

  // Step C: Select minimal cover — only for ON-set minterms (not don't-cares)
  const selectedPrimes = selectMinimalCover(primeImplicants, minterms);

  // Step D: Format Simplified Expression & Assign Colors
  const terms = [];
  const groups = [];

  selectedPrimes.forEach((pi, idx) => {
    const color = GROUP_COLORS[idx % GROUP_COLORS.length];
    const termText = formatTerm(pi.binary, varNames);
    terms.push({ text: termText, color, binary: pi.binary });
    // Only include ON-set minterms in group for K-Map highlighting (exclude don't-cares from highlighting)
    const dontCareSet = new Set(dontCares);
    const onSetMintermsInGroup = pi.minterms.filter(m => !dontCareSet.has(m));
    groups.push({
      binary: pi.binary,
      minterms: pi.minterms,         // all (for implicant display)
      onSetMinterms: onSetMintermsInGroup, // ON-set only (for K-Map cell outline)
      text: termText,
      color
    });
  });

  const simplifiedExpr = terms.map(t => t.text).join(' + ');

  return { simplifiedExpr, terms, groups };
}

function getBitDifference(b1, b2) {
  let count = 0;
  let index = -1;
  for (let i = 0; i < b1.length; i++) {
    if (b1[i] !== b2[i]) {
      count++;
      index = i;
    }
  }
  return { count, index };
}

function replaceAt(str, index, replacement) {
  return str.substring(0, index) + replacement + str.substring(index + 1);
}

/**
 * Select minimal prime implicant cover for minterms
 */
function selectMinimalCover(primes, minterms) {
  if (primes.length === 0) return [];
  
  const uncovered = new Set(minterms);
  const selected = [];

  // 1. Find essential prime implicants
  for (let m of minterms) {
    const covering = primes.filter(p => p.minterms.includes(m));
    if (covering.length === 1) {
      const essential = covering[0];
      if (!selected.includes(essential)) {
        selected.push(essential);
        essential.minterms.forEach(min => uncovered.delete(min));
      }
    }
  }

  // 2. Greedy cover for remaining minterms
  while (uncovered.size > 0) {
    let bestPrime = null;
    let maxCoverage = -1;

    for (let p of primes) {
      if (selected.includes(p)) continue;
      const count = p.minterms.filter(m => uncovered.has(m)).length;
      if (count > maxCoverage) {
        maxCoverage = count;
        bestPrime = p;
      }
    }

    if (!bestPrime || maxCoverage === 0) break;
    selected.push(bestPrime);
    bestPrime.minterms.forEach(m => uncovered.delete(m));
  }

  return selected;
}

/**
 * Format Binary Implicant string (e.g. '01-1') into Variable Notation (e.g. A'BCD)
 */
function formatTerm(binMask, varNames) {
  let res = '';
  for (let i = 0; i < binMask.length; i++) {
    if (binMask[i] === '1') {
      res += varNames[i];
    } else if (binMask[i] === '0') {
      res += varNames[i] + "'";
    }
  }
  return res || '1';
}

/**
 * Build K-Map Grid structure according to Variable Count (2, 3, 4, 5, 6)
 */
function buildKMapStructure(numVars, varNames, truthTable, groups) {
  // Map index to output lookup
  const ttMap = {};
  truthTable.forEach(row => {
    ttMap[row.index] = row;
  });

  if (numVars === 2) {
    // 2 Vars: A (Row 0,1), B (Col 0,1)
    const rowVars = [varNames[0]];
    const colVars = [varNames[1]];
    const rowGray = getGrayCode(1);
    const colGray = getGrayCode(1);
    const grid = createKMapSubGrid(rowGray, colGray, (rBits, cBits) => {
      const bin = rBits + cBits;
      const mIdx = parseInt(bin, 2);
      return attachCellMeta(ttMap[mIdx], groups);
    });

    return {
      type: 'single',
      rowHeader: rowVars.join(''),
      colHeader: colVars.join(''),
      rowGray,
      colGray,
      grid
    };
  }

  if (numVars === 3) {
    // 3 Vars: A (Row 0,1), BC (Col 00, 01, 11, 10)
    const rowVars = [varNames[0]];
    const colVars = [varNames[1], varNames[2]];
    const rowGray = getGrayCode(1);
    const colGray = getGrayCode(2);
    const grid = createKMapSubGrid(rowGray, colGray, (rBits, cBits) => {
      const bin = rBits + cBits;
      const mIdx = parseInt(bin, 2);
      return attachCellMeta(ttMap[mIdx], groups);
    });

    return {
      type: 'single',
      rowHeader: rowVars.join(''),
      colHeader: colVars.join(''),
      rowGray,
      colGray,
      grid
    };
  }

  if (numVars === 4) {
    // 4 Vars: AB (Row 00, 01, 11, 10), CD (Col 00, 01, 11, 10)
    const rowVars = [varNames[0], varNames[1]];
    const colVars = [varNames[2], varNames[3]];
    const rowGray = getGrayCode(2);
    const colGray = getGrayCode(2);
    const grid = createKMapSubGrid(rowGray, colGray, (rBits, cBits) => {
      const bin = rBits + cBits;
      const mIdx = parseInt(bin, 2);
      return attachCellMeta(ttMap[mIdx], groups);
    });

    return {
      type: 'single',
      rowHeader: rowVars.join(''),
      colHeader: colVars.join(''),
      rowGray,
      colGray,
      grid
    };
  }

  if (numVars === 5) {
    // 5 Vars: 2 sub-grids of 4x4 (Split by var 0: e.g. A=0 and A=1)
    // Row vars: B, C | Col vars: D, E
    const splitVar = varNames[0];
    const rowVars = [varNames[1], varNames[2]];
    const colVars = [varNames[3], varNames[4]];
    const rowGray = getGrayCode(2);
    const colGray = getGrayCode(2);

    const subGrids = [0, 1].map(splitVal => {
      const grid = createKMapSubGrid(rowGray, colGray, (rBits, cBits) => {
        const bin = splitVal.toString() + rBits + cBits;
        const mIdx = parseInt(bin, 2);
        return attachCellMeta(ttMap[mIdx], groups);
      });
      return {
        title: `${splitVar} = ${splitVal}`,
        splitVal,
        grid
      };
    });

    return {
      type: 'multi-2',
      splitVar,
      rowHeader: rowVars.join(''),
      colHeader: colVars.join(''),
      rowGray,
      colGray,
      subGrids
    };
  }

  if (numVars === 6) {
    // 6 Vars: 4 sub-grids of 4x4 (Split by var 0,1: AB=00, 01, 11, 10)
    const splitVars = [varNames[0], varNames[1]];
    const rowVars = [varNames[2], varNames[3]];
    const colVars = [varNames[4], varNames[5]];
    const rowGray = getGrayCode(2);
    const colGray = getGrayCode(2);
    const splitGray = getGrayCode(2);

    const subGrids = splitGray.map(splitValStr => {
      const grid = createKMapSubGrid(rowGray, colGray, (rBits, cBits) => {
        const bin = splitValStr + rBits + cBits;
        const mIdx = parseInt(bin, 2);
        return attachCellMeta(ttMap[mIdx], groups);
      });
      return {
        title: `${splitVars.join('')} = ${splitValStr}`,
        splitVal: splitValStr,
        grid
      };
    });

    return {
      type: 'multi-4',
      splitVars: splitVars.join(''),
      rowHeader: rowVars.join(''),
      colHeader: colVars.join(''),
      rowGray,
      colGray,
      subGrids
    };
  }
}

function createKMapSubGrid(rowGray, colGray, getCellDataFn) {
  return rowGray.map((rBits, rIdx) => {
    return colGray.map((cBits, cIdx) => {
      return {
        rIdx,
        cIdx,
        rBits,
        cBits,
        ...getCellDataFn(rBits, cBits)
      };
    });
  });
}

function attachCellMeta(cellRow, groups) {
  if (!cellRow) return { minterm: 0, binary: '0', output: 0, cellGroups: [] };
  const minterm = cellRow.index;
  const output = cellRow.output; // may be 0, 1, or 'X'
  // Only highlight ON-set cells (output===1) with group colors
  const cellGroups = output === 1
    ? groups.filter(g => (g.onSetMinterms || g.minterms).includes(minterm))
    : [];
  return {
    minterm,
    binary: cellRow.binary,
    output,
    cellGroups
  };
}
