import './Header.css';

function Header() {
  return (
    <header className="header" role="banner">
      <div className="header-content">
        <h1 className="header-title">
          <span className="header-icon" aria-hidden="true">♕</span>
          N-Queens Solver & Visualizer
        </h1>
        <p className="header-subtitle">
          Interactive algorithm visualization for the classic N-Queens problem
        </p>
      </div>
    </header>
  );
}

export default Header;
