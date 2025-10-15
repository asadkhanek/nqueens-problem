import './AlgorithmComparison.css';

function AlgorithmComparison({ onClose }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-labelledby="comparison-title"
        aria-modal="true"
      >
        <div className="modal-header">
          <h2 id="comparison-title" className="modal-title">
            Algorithm Comparison
          </h2>
          <button
            onClick={onClose}
            className="modal-close"
            aria-label="Close dialog"
          >
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {/* Backtracking Algorithm (FR-2.2.4) */}
          <div className="algorithm-card">
            <h3 className="algorithm-name">
              <span className="algorithm-icon">🔄</span>
              Backtracking (Recursive)
            </h3>
            
            <div className="algorithm-details">
              <div className="detail-item">
                <strong>Core Concept:</strong>
                <p>
                  Places queens row-by-row, exploring each valid column placement. 
                  When a conflict is detected, the algorithm "backtracks" to try a 
                  different position. Uses sets or arrays to track attacked columns 
                  and diagonals.
                </p>
              </div>
              
              <div className="detail-item">
                <strong>Time Complexity:</strong>
                <p><code>O(N!)</code> - Factorial time complexity</p>
              </div>
              
              <div className="detail-item">
                <strong>Space Complexity:</strong>
                <p><code>O(N)</code> - For recursion stack depth</p>
              </div>
              
              <div className="detail-item">
                <strong>Practical Speed:</strong>
                <p>Moderate. Suitable for interactive visualization up to N ≈ 12</p>
              </div>
              
              <div className="detail-item">
                <strong>Visualization:</strong>
                <p className="highlight-success">
                  ✅ Excellent - Steps are intuitive and map directly to human logic
                </p>
              </div>
              
              <div className="detail-item">
                <strong>Best For:</strong>
                <p>Educational demonstration of the backtracking principle</p>
              </div>
            </div>
          </div>
          
          {/* Bitmask Algorithm */}
          <div className="algorithm-card">
            <h3 className="algorithm-name">
              <span className="algorithm-icon">⚡</span>
              Bitmask Backtracking
            </h3>
            
            <div className="algorithm-details">
              <div className="detail-item">
                <strong>Core Concept:</strong>
                <p>
                  Uses integer bitmasks and bitwise operations (AND, OR, shift) for 
                  constant-time O(1) conflict detection. Each bit represents a column 
                  or diagonal position, enabling extremely fast checks.
                </p>
              </div>
              
              <div className="detail-item">
                <strong>Time Complexity:</strong>
                <p><code>O(N!)</code> - Same asymptotic complexity but with much better constants</p>
              </div>
              
              <div className="detail-item">
                <strong>Space Complexity:</strong>
                <p><code>O(N)</code> - For recursion stack depth</p>
              </div>
              
              <div className="detail-item">
                <strong>Practical Speed:</strong>
                <p className="highlight-success">
                  ⚡ Extremely Fast - Can solve N=15 in seconds, demonstrating 
                  significant optimization
                </p>
              </div>
              
              <div className="detail-item">
                <strong>Visualization:</strong>
                <p className="highlight-warning">
                  ⚠️ Fair - Queen placements visible, but bitwise logic is abstract
                </p>
              </div>
              
              <div className="detail-item">
                <strong>Best For:</strong>
                <p>Performance benchmarking and solving for large N values</p>
              </div>
            </div>
          </div>
          
          {/* Comparison Table */}
          <div className="comparison-table-wrapper">
            <h3 className="section-title">Quick Comparison</h3>
            <table className="comparison-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Backtracking</th>
                  <th>Bitmask</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Speed</td>
                  <td>Moderate</td>
                  <td>Very Fast</td>
                </tr>
                <tr>
                  <td>Educational Value</td>
                  <td>High</td>
                  <td>Medium</td>
                </tr>
                <tr>
                  <td>Visualization Clarity</td>
                  <td>Excellent</td>
                  <td>Good</td>
                </tr>
                <tr>
                  <td>Max Recommended N</td>
                  <td>12</td>
                  <td>15</td>
                </tr>
                <tr>
                  <td>Implementation Complexity</td>
                  <td>Simple</td>
                  <td>Advanced</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="info-box">
            <p>
              💡 <strong>Recommendation:</strong> Start with <strong>Backtracking</strong> to 
              understand the algorithm's logic, then try <strong>Bitmask</strong> to see how 
              low-level optimizations can dramatically improve performance!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AlgorithmComparison;
