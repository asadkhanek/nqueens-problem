/**
 * Optimized Bitmask Backtracking Algorithm for N-Queens
 * FR-2.2.2: Uses bitwise operations for O(1) conflict checks
 */

/**
 * Solves the N-Queens problem using bitmask optimization
 * @param {number} n - Board size
 * @param {string} mode - 'findFirst', 'findAll', or 'countAll'
 * @param {Function} onProgress - Progress callback
 * @returns {Object} Result object with solutions and/or count
 */
export function solveNQueensBitmask(n, mode = 'findAll', onProgress = null) {
  const solutions = mode === 'countAll' ? null : [];
  let solutionCount = 0;
  let operations = 0;
  
  const board = Array(n).fill(null).map(() => Array(n).fill('.'));
  const allOnes = (1 << n) - 1; // Mask with n bits set to 1
  
  function solve(row, cols, diag1, diag2) {
    if (row === n) {
      solutionCount++;
      
      if (mode !== 'countAll') {
        const solution = board.map(r => r.join(''));
        solutions.push(solution);
      }
      
      if (onProgress && solutionCount % 100 === 0) {
        onProgress({ solutionsFound: solutionCount, operations });
      }
      
      if (mode === 'findFirst') {
        return true;
      }
      
      return false;
    }
    
    // availablePositions has bits set for columns where we can place a queen
    let availablePositions = allOnes & ~(cols | diag1 | diag2);
    
    while (availablePositions) {
      operations++;
      
      // Get rightmost bit (lowest available column)
      const position = availablePositions & -availablePositions;
      
      // Find column number
      const col = Math.log2(position);
      
      // Place queen
      board[row][col] = 'Q';
      
      // Recurse with updated constraints
      // Shift diagonals as we move to next row
      if (solve(
        row + 1,
        cols | position,
        (diag1 | position) << 1,
        (diag2 | position) >> 1
      )) {
        return true;
      }
      
      // Remove queen (backtrack)
      board[row][col] = '.';
      
      // Remove this position from available positions
      availablePositions &= availablePositions - 1;
    }
    
    return false;
  }
  
  solve(0, 0, 0, 0);
  
  const result = {
    solutionCount,
  };
  
  if (mode !== 'countAll') {
    result.solutions = solutions;
  }
  
  return result;
}
