/**
 * Client-side Bitmask Backtracking Algorithm
 * FR-2.2.2: Optimized with bitwise operations
 */

export async function solveNQueensBitmaskLocal(n, mode = 'findAll', onStep = null) {
  const solutions = mode === 'countAll' ? null : [];
  let solutionCount = 0;
  let operations = 0;
  
  const board = Array(n).fill(null).map(() => Array(n).fill('.'));
  const allOnes = (1 << n) - 1;
  
  const solve = async (row, cols, diag1, diag2) => {
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
    
    let availablePositions = allOnes & ~(cols | diag1 | diag2);
    
    while (availablePositions) {
      operations++;
      
      const position = availablePositions & -availablePositions;
      // Find column index from the rightmost set bit
      let col = 0;
      let temp = position;
      while (temp > 1) {
        temp >>= 1;
        col++;
      }
      
      board[row][col] = 'Q';
      
      if (onStep) {
        onStep({
          type: 'place',
          row,
          col,
          board: board.map(r => [...r]),
          operations,
        });
        await new Promise(resolve => setTimeout(resolve, 5));
      }
      
      if (await solve(
        row + 1,
        cols | position,
        (diag1 | position) << 1,
        (diag2 | position) >> 1
      )) {
        return true;
      }
      
      board[row][col] = '.';
      
      if (onStep) {
        onStep({
          type: 'remove',
          row,
          col,
          board: board.map(r => [...r]),
          operations,
        });
        await new Promise(resolve => setTimeout(resolve, 5));
      }
      
      availablePositions &= availablePositions - 1;
    }
    
    return false;
  };
  
  await solve(0, 0, 0, 0);
  
  return {
    solutionCount,
    solutions: mode === 'countAll' ? undefined : solutions,
    operations,
  };
}
