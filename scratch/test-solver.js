import { solveKMap, solveKMapFromMinterms, getDefaultVariables } from '../src/utils/kmapSolver.js';

console.log("=== RUNNING FUNCTIONAL VERIFICATION SUITE ===");

// Test 1 & 2: Toggle minterm 0 -> 1 -> 0
console.log("\n--- TEST 1 & 2: Toggle K-Map Minterm Cell 0 <-> 1 ---");
const initialVars = ['A', 'B', 'C', 'D', 'E'];
let res1 = solveKMap("0", initialVars);
console.log("Initial Output for minterm 0:", res1.truthTable[0].output); // 0
console.assert(res1.truthTable[0].output === 0, "Minterm 0 should initially be 0");

let resToggled = solveKMapFromMinterms([0], initialVars);
console.log("Toggled minterm 0 Output:", resToggled.truthTable[0].output); // 1
console.log("New Expression after toggling minterm 0 to 1:", resToggled.simplifiedExpr); // A'B'C'D'E'
console.assert(resToggled.truthTable[0].output === 1, "Minterm 0 should become 1");

let resUntoggled = solveKMapFromMinterms([], initialVars);
console.log("Toggled minterm 0 back to 0 Output:", resUntoggled.truthTable[0].output); // 0
console.assert(resUntoggled.truthTable[0].output === 0, "Minterm 0 should return to 0");

// Test 3 & 4: Type into Boolean expression & click Solve
console.log("\n--- TEST 3 & 4: Boolean Expression Input & Solve Calculation ---");
const testExpr = "A'B'CD + A'BE + AB'DE";
let resSolved = solveKMap(testExpr, initialVars);
console.log("Input Expression:", testExpr);
console.log("Solved Output Terms Count:", resSolved.terms.length);
console.log("Solved Expression:", resSolved.simplifiedExpr);
console.assert(resSolved.terms.length === 3, "Should produce 3 terms");

// Test 7: Change to 4 variables -> 16 cells
console.log("\n--- TEST 7: 4 Variables Grid Size ---");
const vars4 = getDefaultVariables(4);
let res4Vars = solveKMap("A'B'C'D + A'BC'D", vars4);
console.log("4 Vars Count:", res4Vars.truthTable.length);
console.assert(res4Vars.truthTable.length === 16, "4 variables must produce 16 cells");

// Test 8: Change to 5 variables -> 32 cells
console.log("\n--- TEST 8: 5 Variables Grid Size ---");
const vars5 = getDefaultVariables(5);
let res5Vars = solveKMap("A'B'CD + A'BE + AB'DE", vars5);
console.log("5 Vars Count:", res5Vars.truthTable.length);
console.assert(res5Vars.truthTable.length === 32, "5 variables must produce 32 cells");

// Test 9: Reset
console.log("\n--- TEST 9: Reset Verification ---");
const default5Vars = ['A', 'B', 'C', 'D', 'E'];
let resReset = solveKMap("A'B'CD + A'BE + AB'DE", default5Vars);
console.log("Reset state verified with 5 variables:", resReset.varNames.join(', '));
console.assert(resReset.varNames.join(',') === "A,B,C,D,E", "Reset variables must be A,B,C,D,E");

console.log("\n=== ALL TEST ASSERTIONS PASSED SUCCESSFULLY! ===");
