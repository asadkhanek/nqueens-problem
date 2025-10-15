import { useRef, useEffect } from 'react';
import './InfoPanel.css';

function InfoPanel({ logs = [], stats = {}, solutions = [], currentSolutionIndex = 0 }) {
  const logContainerRef = useRef(null);
  
  // Auto-scroll logs to bottom (FR-2.1.5)
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [logs]);
  
  return (
    <div className="info-panel" role="region" aria-label="Information panel">
      <h2 className="panel-title">Information</h2>
      
      {/* Statistics (FR-2.1.5.2) */}
      <div className="stats-section">
        <h3 className="section-title">Statistics</h3>
        <div className="stats-grid">
          <div className="stat-item">
            <span className="stat-label">Solutions Found:</span>
            <span className="stat-value" aria-live="polite">
              {stats.solutionsFound || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Operations:</span>
            <span className="stat-value" aria-live="polite">
              {stats.operations?.toLocaleString() || 0}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Elapsed Time:</span>
            <span className="stat-value" aria-live="polite">
              {stats.elapsedTime || '0.00s'}
            </span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Status:</span>
            <span className={`stat-value status-${stats.status || 'idle'}`} aria-live="polite">
              {stats.status || 'Idle'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="divider"></div>
      
      {/* Activity Log (FR-2.1.5.1) */}
      <div className="log-section">
        <h3 className="section-title">Activity Log</h3>
        <div 
          ref={logContainerRef}
          className="log-container" 
          role="log" 
          aria-live="polite"
          aria-atomic="false"
        >
          {logs.length === 0 ? (
            <div className="log-entry log-empty">
              No activity yet. Click "Solve" to begin.
            </div>
          ) : (
            logs.map((log, index) => (
              <div 
                key={index} 
                className={`log-entry log-${log.type || 'info'}`}
              >
                <span className="log-timestamp">{log.timestamp}</span>
                <span className="log-message">{log.message}</span>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="divider"></div>
      
      {/* Current Solution Display (FR-2.1.4) */}
      {solutions.length > 0 && (
        <div className="solution-section">
          <h3 className="section-title">
            Current Solution ({currentSolutionIndex + 1}/{solutions.length})
          </h3>
          <div className="solution-board">
            {solutions[currentSolutionIndex]?.map((row, idx) => (
              <div key={idx} className="solution-row">
                <code>{row}</code>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Algorithm Info */}
      <div className="info-box info-help">
        <h3 className="info-title">💡 Tip</h3>
        <p className="info-text">
          Watch the board as the algorithm tries different queen placements. 
          Red squares show positions under attack. The algorithm backtracks 
          when it reaches a dead end.
        </p>
      </div>
    </div>
  );
}

export default InfoPanel;
