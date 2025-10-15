/**
 * Classic Recursive Backtracking Algorithm for N-Queens
 * FR-2.2.1: Instrumented for visualization
 */

/**
 * Solves the N-Queens problem using backtracking
 * @param {number} n - Board size
 * @param {string} mode - 'findFirst', 'findAll', or 'countAll'
 * @param {Function} onProgress - Progress callback
 * @returns {Object} Result object with solutions and/or count
 */
export function solveNQueens(n, mode = 'findAll', onProgress = null) {
  const solutions = mode === 'countAll' ? null : [];
  let solutionCount = 0;
  let operations = 0;
  
  // Track attacked columns and diagonals
  const cols = new Set();
  const diag1 = new Set(); // row - col
  const diag2 = new Set(); // row + col
  
  const board = Array(n).fill(null).map(() => Array(n).fill('.'));
  
  function isSafe(row, col) {
    operations++;
    return !cols.has(col) && 
           !diag1.has(row - col) && 
           !diag2.has(row + col);
  }
  
  function placeQueen(row, col) {
    board[row][col] = 'Q';
    cols.add(col);
    diag1.add(row - col);
    diag2.add(row + col);
  }
  
  function removeQueen(row, col) {
    board[row][col] = '.';
    cols.delete(col);
    diag1.delete(row - col);
    diag2.delete(row + col);
  }
  
  function backtrack(row) {
    if (row === n) {
      // Found a solution
      solutionCount++;
      
      if (mode !== 'countAll') {
        const solution = board.map(r => r.join(''));
        solutions.push(solution);
      }
      
      // Report progress
      if (onProgress && solutionCount % 10 === 0) {
        onProgress({ solutionsFound: solutionCount, operations });
      }
      
      // Stop if finding first solution only
      if (mode === 'findFirst') {
        return true;
      }
      
      return false;
    }
    
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        placeQueen(row, col);
        
        if (backtrack(row + 1)) {
          return true; // Found first solution
        }
        
        removeQueen(row, col);
      }
    }
    
    return false;
  }
  
  backtrack(0);
  
  const result = {
    solutionCount,
  };
  
  if (mode !== 'countAll') {
    result.solutions = solutions;
  }
  
  return result;
}
