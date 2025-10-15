import { useCallback } from 'react';
import { solveNQueensLocal } from '../algorithms/backtracking';
import { solveNQueensBitmaskLocal } from '../algorithms/bitmask';

/**
 * Hook for client-side solving (small N values)
 * FR-1.2: Hybrid computational model
 */
export function useLocalSolver() {
  const solve = useCallback(async (n, algorithm, mode, callbacks) => {
    const { onStep, onComplete } = callbacks;
    
    try {
      const solver = algorithm === 'bitmask' 
        ? solveNQueensBitmaskLocal 
        : solveNQueensLocal;
      
      const result = await solver(n, mode, onStep);
      
      if (onComplete) {
        onComplete(result);
      }
      
      return result;
    } catch (error) {
      console.error('Local solver error:', error);
      throw error;
    }
  }, []);
  
  return { solve };
}
