import { motion } from 'framer-motion';
import './Chessboard.css';

function Chessboard({ 
  n, 
  board, 
  attackedSquares = new Set(), 
  solutions = [],
  currentSolutionIndex = 0,
  onSolutionChange 
}) {
  const renderSquare = (row, col) => {
    const isLight = (row + col) % 2 === 0;
    const hasQueen = board[row] && board[row][col] === 'Q';
    const isAttacked = attackedSquares.has(`${row},${col}`);
    
    const squareClass = `
      square 
      ${isLight ? 'square-light' : 'square-dark'}
      ${hasQueen ? 'has-queen' : ''}
      ${isAttacked ? 'attacked' : ''}
    `.trim();
    
    return (
      <motion.div
        key={`${row}-${col}`}
        className={squareClass}
        initial={false}
        animate={{
          backgroundColor: isAttacked 
            ? 'var(--color-attack)' 
            : undefined
        }}
        transition={{ duration: 0.2 }}
        role="gridcell"
        aria-label={`Row ${row + 1}, Column ${col + 1}${hasQueen ? ', Queen' : ''}${isAttacked ? ', Under attack' : ''}`}
      >
        {hasQueen && (
          <motion.div
            className="queen"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20 
            }}
            aria-hidden="true"
          >
            ♕
          </motion.div>
        )}
      </motion.div>
    );
  };
  
  return (
    <div className="chessboard-wrapper">
      <div 
        className="chessboard"
        style={{
          gridTemplateColumns: `repeat(${n}, 1fr)`,
          gridTemplateRows: `repeat(${n}, 1fr)`,
        }}
        role="grid"
        aria-label={`${n} by ${n} chessboard`}
      >
        {Array(n).fill(null).map((_, row) =>
          Array(n).fill(null).map((_, col) => renderSquare(row, col))
        )}
      </div>
      
      {solutions.length > 0 && (
        <div className="solution-navigation" role="region" aria-label="Solution navigation">
          <button
            className="nav-button"
            onClick={() => onSolutionChange(Math.max(0, currentSolutionIndex - 1))}
            disabled={currentSolutionIndex === 0}
            aria-label="Previous solution"
          >
            ←
          </button>
          <span className="solution-counter" aria-live="polite">
            Solution {currentSolutionIndex + 1} of {solutions.length}
          </span>
          <button
            className="nav-button"
            onClick={() => onSolutionChange(Math.min(solutions.length - 1, currentSolutionIndex + 1))}
            disabled={currentSolutionIndex === solutions.length - 1}
            aria-label="Next solution"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}

export default Chessboard;
