import { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import ControlPanel from './components/ControlPanel';
import Chessboard from './components/Chessboard';
import InfoPanel from './components/InfoPanel';
import AlgorithmComparison from './components/AlgorithmComparison';
import OnboardingTour from './components/OnboardingTour';
import { useVisualization } from './hooks/useVisualization';
import { useLocalSolver } from './hooks/useLocalSolver';
import { useApiSolver } from './hooks/useApiSolver';
import './App.css';

function App() {
  const [n, setN] = useState(8);
  const [algorithm, setAlgorithm] = useState('backtracking');
  const [mode, setMode] = useState('findAll');
  const [speed, setSpeed] = useState(50);
  const [showComparison, setShowComparison] = useState(false);
  const [showTour, setShowTour] = useState(() => {
    return localStorage.getItem('tourCompleted') !== 'true';
  });
  
  const {
    board,
    solutions,
    currentSolutionIndex,
    isPlaying,
    isPaused,
    logs,
    stats,
    attackedSquares,
    setCurrentSolutionIndex,
    setBoard,
    setSolutions,
    setStats,
    addLog,
    addStep,
    calculateAttackedSquares,
    play,
    pause,
    reset,
    stepForward,
  } = useVisualization(n);
  
  const localSolver = useLocalSolver();
  const apiSolver = useApiSolver();
  
  const handleSolve = useCallback(async () => {
    reset();
    addLog('Starting N-Queens solver...', 'info');
    addLog(`Board size: ${n}×${n}`, 'info');
    addLog(`Algorithm: ${algorithm}`, 'info');
    addLog(`Mode: ${mode}`, 'info');
    
    setStats({
      solutionsFound: 0,
      operations: 0,
      elapsedTime: '0.00s',
      status: 'running',
    });
    
    const startTime = Date.now();
    
    // Use local solver for small n, API for large n (FR-1.2)
    const useLocal = n <= 10;
    
    if (useLocal) {
      addLog('Using client-side solver', 'info');
      
      await localSolver.solve(n, algorithm, mode, {
        onStep: (step) => {
          // Store step for playback
          addStep(step);
          
          // Update visualization with step
          if (step.type === 'place') {
            setBoard(step.board);
            calculateAttackedSquares(step.board);
            addLog(`Placing queen at row ${step.row + 1}, column ${step.col + 1}`, 'info');
          } else if (step.type === 'remove') {
            setBoard(step.board);
            calculateAttackedSquares(step.board);
            addLog(`Backtracking: removing queen from row ${step.row + 1}, column ${step.col + 1}`, 'warning');
          } else if (step.type === 'solution') {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
            addLog(`Solution #${step.solutionCount} found!`, 'success');
            setStats({
              solutionsFound: step.solutionCount,
              operations: step.operations,
              elapsedTime: `${elapsed}s`,
              status: 'running',
            });
          }
        },
        onComplete: (result) => {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          setSolutions(result.solutions || []);
          setStats({
            solutionsFound: result.solutionCount,
            operations: result.operations || 0,
            elapsedTime: `${elapsed}s`,
            status: 'completed',
          });
          addLog(`Completed! Found ${result.solutionCount} solution(s)`, 'success');
          addLog(`Total time: ${elapsed}s`, 'success');
        },
      });
    } else {
      addLog('Using server-side API solver', 'info');
      
      await apiSolver.solve(n, algorithm, mode, {
        onProgress: (progress) => {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          setStats({
            solutionsFound: progress.solutionsFound,
            operations: progress.operations,
            elapsedTime: `${elapsed}s`,
            status: 'running',
          });
          addLog(`Progress: ${progress.solutionsFound} solutions found`, 'info');
        },
        onComplete: (result) => {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
          setSolutions(result.solutions || []);
          setStats({
            solutionsFound: result.solutionCount,
            operations: result.operations || 0,
            elapsedTime: `${elapsed}s`,
            status: 'completed',
          });
          addLog(`Completed! Found ${result.solutionCount} solution(s)`, 'success');
          addLog(`Total time: ${elapsed}s`, 'success');
        },
        onError: (error) => {
          addLog(`Error: ${error}`, 'error');
          setStats(prev => ({ ...prev, status: 'error' }));
        },
      });
    }
  }, [n, algorithm, mode, reset, localSolver, apiSolver, addLog, addStep, setBoard, setSolutions, setStats, calculateAttackedSquares]);
  
  const handleTourComplete = () => {
    localStorage.setItem('tourCompleted', 'true');
    setShowTour(false);
  };
  
  // Handle solution navigation - convert solution string to board array
  useEffect(() => {
    if (solutions.length > 0 && currentSolutionIndex >= 0 && currentSolutionIndex < solutions.length) {
      const currentSolution = solutions[currentSolutionIndex];
      
      // Convert solution string array to 2D board array
      // Solution format: [".Q..", "...Q", "Q...", "..Q."]
      const newBoard = Array(n).fill(null).map(() => Array(n).fill('.'));
      
      currentSolution.forEach((row, rowIndex) => {
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
          if (row[colIndex] === 'Q') {
            newBoard[rowIndex][colIndex] = 'Q';
          }
        }
      });
      
      setBoard(newBoard);
      
      // Clear attacked squares when viewing solutions (solutions have no conflicts)
      calculateAttackedSquares(newBoard);
      
      addLog(`Viewing solution ${currentSolutionIndex + 1} of ${solutions.length}`, 'info');
    }
  }, [currentSolutionIndex, solutions, n, setBoard, calculateAttackedSquares, addLog]);
  
  return (
    <div className="app">
      <Header />
      
      <main className="main-content">
        <div className="layout">
          {/* Control Panel */}
          <aside className="sidebar sidebar-left">
            <ControlPanel
              n={n}
              algorithm={algorithm}
              mode={mode}
              speed={speed}
              isPlaying={isPlaying}
              isPaused={isPaused}
              onNChange={setN}
              onAlgorithmChange={setAlgorithm}
              onModeChange={setMode}
              onSpeedChange={setSpeed}
              onSolve={handleSolve}
              onPlay={play}
              onPause={pause}
              onReset={reset}
              onStepForward={stepForward}
              onShowComparison={() => setShowComparison(true)}
            />
          </aside>
          
          {/* Chessboard */}
          <section className="board-container" aria-label="Chessboard">
            <Chessboard
              n={n}
              board={board}
              attackedSquares={attackedSquares}
              solutions={solutions}
              currentSolutionIndex={currentSolutionIndex}
              onSolutionChange={setCurrentSolutionIndex}
            />
          </section>
          
          {/* Info Panel */}
          <aside className="sidebar sidebar-right">
            <InfoPanel
              logs={logs}
              stats={stats}
              solutions={solutions}
              currentSolutionIndex={currentSolutionIndex}
            />
          </aside>
        </div>
      </main>
      
      {/* Algorithm Comparison Modal */}
      {showComparison && (
        <AlgorithmComparison onClose={() => setShowComparison(false)} />
      )}
      
      {/* Onboarding Tour */}
      {showTour && (
        <OnboardingTour onComplete={handleTourComplete} />
      )}
    </div>
  );
}

export default App;
