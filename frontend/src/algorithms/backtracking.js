/**
 * Client-side Backtracking Algorithm
 * FR-2.2.1: Instrumented for real-time visualization
 */

export async function solveNQueensLocal(n, mode = 'findAll', onStep = null) {
  const solutions = mode === 'countAll' ? null : [];
  let solutionCount = 0;
  let operations = 0;
  
  const cols = new Set();
  const diag1 = new Set();
  const diag2 = new Set();
  const board = Array(n).fill(null).map(() => Array(n).fill('.'));
  
  const isSafe = (row, col) => {
    operations++;
    return !cols.has(col) && 
           !diag1.has(row - col) && 
           !diag2.has(row + col);
  };
  
  const placeQueen = (row, col) => {
    board[row][col] = 'Q';
    cols.add(col);
    diag1.add(row - col);
    diag2.add(row + col);
    
    if (onStep) {
      onStep({
        type: 'place',
        row,
        col,
        board: board.map(r => [...r]),
        operations,
      });
    }
  };
  
  const removeQueen = (row, col) => {
    board[row][col] = '.';
    cols.delete(col);
    diag1.delete(row - col);
    diag2.delete(row + col);
    
    if (onStep) {
      onStep({
        type: 'remove',
        row,
        col,
        board: board.map(r => [...r]),
        operations,
      });
    }
  };
  
  const backtrack = async (row) => {
    if (row === n) {
      solutionCount++;
      
      if (mode !== 'countAll') {
        const solution = board.map(r => r.join(''));
        solutions.push(solution);
      }
      
      if (onStep) {
        onStep({
          type: 'solution',
          solutionCount,
          operations,
        });
      }
      
      if (mode === 'findFirst') {
        return true;
      }
      
      return false;
    }
    
    for (let col = 0; col < n; col++) {
      if (isSafe(row, col)) {
        placeQueen(row, col);
        
        // Small delay for visualization
        if (onStep) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
        
        if (await backtrack(row + 1)) {
          return true;
        }
        
        removeQueen(row, col);
        
        if (onStep) {
          await new Promise(resolve => setTimeout(resolve, 10));
        }
      }
    }
    
    return false;
  };
  
  await backtrack(0);
  
  return {
    solutionCount,
    solutions: mode === 'countAll' ? undefined : solutions,
    operations,
  };
}
