import './ControlPanel.css';

function ControlPanel({
  n,
  algorithm,
  mode,
  speed,
  isPlaying,
  isPaused,
  onNChange,
  onAlgorithmChange,
  onModeChange,
  onSpeedChange,
  onSolve,
  onPlay,
  onPause,
  onReset,
  onStepForward,
  onShowComparison,
}) {
  return (
    <div className="control-panel" role="region" aria-label="Control panel">
      <h2 className="panel-title">Controls</h2>
      
      {/* Board Size Input (FR-2.1.2.1) */}
      <div className="control-group" id="board-size-control">
        <label htmlFor="board-size-slider" className="control-label">
          Board Size (N): <strong>{n}</strong>
        </label>
        <input
          id="board-size-slider"
          type="range"
          min="1"
          max="15"
          value={n}
          onChange={(e) => onNChange(parseInt(e.target.value))}
          className="slider"
          aria-valuemin="1"
          aria-valuemax="15"
          aria-valuenow={n}
          aria-label={`Board size: ${n} by ${n}`}
        />
        <input
          type="number"
          min="1"
          max="15"
          value={n}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if (value >= 1 && value <= 15) {
              onNChange(value);
            }
          }}
          className="number-input"
          aria-label="Board size number input"
        />
      </div>
      
      {/* Algorithm Selection (FR-2.1.2.2) */}
      <div className="control-group" id="algorithm-control">
        <label htmlFor="algorithm-select" className="control-label">
          Algorithm
        </label>
        <select
          id="algorithm-select"
          value={algorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          className="select"
          aria-label="Select algorithm"
        >
          <option value="backtracking">Backtracking</option>
          <option value="bitmask">Bitmask Optimization</option>
        </select>
        <button
          onClick={onShowComparison}
          className="link-button"
          aria-label="Show algorithm comparison"
        >
          Compare Algorithms
        </button>
      </div>
      
      {/* Solution Mode */}
      <div className="control-group">
        <label htmlFor="mode-select" className="control-label">
          Solution Mode
        </label>
        <select
          id="mode-select"
          value={mode}
          onChange={(e) => onModeChange(e.target.value)}
          className="select"
          aria-label="Select solution mode"
        >
          <option value="findFirst">Find First Solution</option>
          <option value="findAll">Find All Solutions</option>
          <option value="countAll">Count All Solutions</option>
        </select>
      </div>
      
      {/* Speed Control (FR-2.1.2.4) */}
      <div className="control-group" id="speed-control">
        <label htmlFor="speed-slider" className="control-label">
          Animation Speed
        </label>
        <input
          id="speed-slider"
          type="range"
          min="1"
          max="100"
          value={speed}
          onChange={(e) => onSpeedChange(parseInt(e.target.value))}
          className="slider"
          aria-valuemin="1"
          aria-valuemax="100"
          aria-valuenow={speed}
          aria-label={`Animation speed: ${speed}%`}
        />
        <div className="speed-labels">
          <span className="speed-label">Slow</span>
          <span className="speed-label">Fast</span>
        </div>
      </div>
      
      <div className="divider"></div>
      
      {/* Action Button */}
      <button
        onClick={onSolve}
        className="button button-primary button-large"
        disabled={isPlaying}
        id="solve-button"
      >
        {isPlaying ? 'Solving...' : 'Solve'}
      </button>
      
      {/* Playback Controls (FR-2.1.2.3) */}
      <div className="playback-controls" id="playback-controls">
        <button
          onClick={onPlay}
          disabled={isPlaying}
          className="button button-icon"
          aria-label="Play visualization"
          title="Play"
        >
          ▶
        </button>
        <button
          onClick={onPause}
          disabled={!isPlaying}
          className="button button-icon"
          aria-label="Pause visualization"
          title="Pause"
        >
          ⏸
        </button>
        <button
          onClick={onStepForward}
          disabled={isPlaying}
          className="button button-icon"
          aria-label="Step forward"
          title="Step Forward"
        >
          ⏭
        </button>
        <button
          onClick={onReset}
          className="button button-icon button-danger"
          aria-label="Reset board"
          title="Reset"
        >
          ⏹
        </button>
      </div>
      
      <div className="divider"></div>
      
      {/* Problem Description (FR-2.3.2.1) */}
      <div className="info-box">
        <h3 className="info-title">The N-Queens Problem</h3>
        <p className="info-text">
          Place <strong>N</strong> chess queens on an <strong>N×N</strong> chessboard 
          so that no two queens threaten each other. Queens can attack any piece 
          on the same row, column, or diagonal.
        </p>
      </div>
    </div>
  );
}

export default ControlPanel;
