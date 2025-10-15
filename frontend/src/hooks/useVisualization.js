import { useState, useCallback, useRef } from 'react';

/**
 * Hook for managing visualization state and playback
 * FR-2.1.3: Real-time algorithm visualization
 */
export function useVisualization(n) {
  const [board, setBoard] = useState(() => 
    Array(n).fill(null).map(() => Array(n).fill('.'))
  );
  const [solutions, setSolutions] = useState([]);
  const [currentSolutionIndex, setCurrentSolutionIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [logs, setLogs] = useState([]);
  const [stats, setStats] = useState({
    solutionsFound: 0,
    operations: 0,
    elapsedTime: '0.00s',
    status: 'idle',
  });
  const [attackedSquares, setAttackedSquares] = useState(new Set());
  
  const animationFrameRef = useRef(null);
  const stepsRef = useRef([]);
  const currentStepRef = useRef(0);
  
  // Add log entry
  const addLog = useCallback((message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  }, []);
  
  // Store step for playback
  const addStep = useCallback((step) => {
    stepsRef.current.push(step);
  }, []);
  
  // Update board state
  const updateBoard = useCallback((newBoard) => {
    setBoard(newBoard.map(row => [...row]));
  }, []);
  
  // Calculate attacked squares
  const calculateAttackedSquares = useCallback((currentBoard) => {
    const attacked = new Set();
    
    for (let row = 0; row < n; row++) {
      for (let col = 0; col < n; col++) {
        if (currentBoard[row][col] === 'Q') {
          // Mark row
          for (let c = 0; c < n; c++) {
            if (c !== col) attacked.add(`${row},${c}`);
          }
          // Mark column
          for (let r = 0; r < n; r++) {
            if (r !== row) attacked.add(`${r},${col}`);
          }
          // Mark diagonals
          for (let i = 1; i < n; i++) {
            if (row + i < n && col + i < n) attacked.add(`${row + i},${col + i}`);
            if (row + i < n && col - i >= 0) attacked.add(`${row + i},${col - i}`);
            if (row - i >= 0 && col + i < n) attacked.add(`${row - i},${col + i}`);
            if (row - i >= 0 && col - i >= 0) attacked.add(`${row - i},${col - i}`);
          }
        }
      }
    }
    
    setAttackedSquares(attacked);
  }, [n]);
  
  // Play visualization
  const play = useCallback(() => {
    if (stepsRef.current.length === 0) {
      addLog('No visualization data available. Please solve first.', 'warning');
      return;
    }
    setIsPlaying(true);
    setIsPaused(false);
    addLog('Visualization started', 'info');
    
    // Start playback animation
    const playStep = () => {
      if (currentStepRef.current < stepsRef.current.length) {
        const step = stepsRef.current[currentStepRef.current];
        if (step.board) {
          updateBoard(step.board);
          calculateAttackedSquares(step.board);
        }
        currentStepRef.current++;
        animationFrameRef.current = setTimeout(playStep, 100);
      } else {
        setIsPlaying(false);
        addLog('Playback completed', 'success');
      }
    };
    playStep();
  }, [addLog, updateBoard, calculateAttackedSquares]);
  
  // Pause visualization
  const pause = useCallback(() => {
    if (animationFrameRef.current) {
      clearTimeout(animationFrameRef.current);
    }
    setIsPlaying(false);
    setIsPaused(true);
    addLog('Visualization paused', 'info');
  }, [addLog]);
  
  // Reset visualization
  const reset = useCallback(() => {
    setBoard(Array(n).fill(null).map(() => Array(n).fill('.')));
    setSolutions([]);
    setCurrentSolutionIndex(0);
    setIsPlaying(false);
    setIsPaused(false);
    setLogs([]);
    setStats({
      solutionsFound: 0,
      operations: 0,
      elapsedTime: '0.00s',
      status: 'idle',
    });
    setAttackedSquares(new Set());
    stepsRef.current = [];
    currentStepRef.current = 0;
    addLog('Visualization reset', 'info');
  }, [n, addLog]);
  
  // Step forward
  const stepForward = useCallback(() => {
    if (stepsRef.current.length === 0) {
      addLog('No visualization data available. Please solve first.', 'warning');
      return;
    }
    if (currentStepRef.current < stepsRef.current.length) {
      const step = stepsRef.current[currentStepRef.current];
      if (step.board) {
        updateBoard(step.board);
        calculateAttackedSquares(step.board);
        addLog(`Step ${currentStepRef.current + 1} of ${stepsRef.current.length}: ${step.type} at (${step.row + 1}, ${step.col + 1})`, 'info');
      }
      currentStepRef.current++;
    } else {
      addLog('Already at last step', 'warning');
    }
  }, [addLog, updateBoard, calculateAttackedSquares]);
  
  return {
    board,
    solutions,
    currentSolutionIndex,
    isPlaying,
    isPaused,
    logs,
    stats,
    attackedSquares,
    setBoard: updateBoard,
    setSolutions,
    setCurrentSolutionIndex,
    setStats,
    addLog,
    addStep,
    calculateAttackedSquares,
    play,
    pause,
    reset,
    stepForward,
  };
}
