import { useState } from 'react';
import './OnboardingTour.css';

const tourSteps = [
  {
    target: '#board-size-control',
    title: 'Choose Board Size',
    content: 'Use the slider or input field to set the size of the chessboard (N×N). Start with N=4 or N=8 for best learning experience.',
  },
  {
    target: '#algorithm-control',
    title: 'Select Algorithm',
    content: 'Choose between Backtracking (great for learning) or Bitmask Optimization (faster for large boards). Click "Compare Algorithms" to learn more.',
  },
  {
    target: '#solve-button',
    title: 'Start Solving',
    content: 'Click "Solve" to begin the algorithm. Watch the board as queens are placed and removed during backtracking.',
  },
  {
    target: '#playback-controls',
    title: 'Control Playback',
    content: 'Use these controls to play, pause, step through, or reset the visualization. Perfect for studying each decision carefully.',
  },
  {
    target: '#speed-control',
    title: 'Adjust Speed',
    content: 'Control how fast the visualization runs. Slow it down to understand each step, or speed it up to quickly find solutions.',
  },
];

function OnboardingTour({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  
  const step = tourSteps[currentStep];
  
  // Calculate position based on target element
  const updatePosition = () => {
    if (step.target) {
      const element = document.querySelector(step.target);
      if (element) {
        const rect = element.getBoundingClientRect();
        setPosition({
          top: rect.bottom + window.scrollY + 10,
          left: rect.left + window.scrollX,
        });
      }
    }
  };
  
  // Update position when step changes
  useState(() => {
    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [currentStep]);
  
  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    onComplete();
  };
  
  return (
    <>
      {/* Overlay */}
      <div className="tour-overlay" aria-hidden="true" />
      
      {/* Spotlight on target element */}
      <div className="tour-spotlight" aria-hidden="true" />
      
      {/* Tour tooltip (FR-2.3.1) */}
      <div
        className="tour-tooltip"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
        }}
        role="dialog"
        aria-labelledby="tour-title"
        aria-describedby="tour-content"
      >
        <div className="tour-header">
          <h3 id="tour-title" className="tour-title">
            {step.title}
          </h3>
          <span className="tour-progress" aria-label={`Step ${currentStep + 1} of ${tourSteps.length}`}>
            {currentStep + 1} / {tourSteps.length}
          </span>
        </div>
        
        <p id="tour-content" className="tour-content">
          {step.content}
        </p>
        
        <div className="tour-actions">
          <button
            onClick={handleSkip}
            className="tour-button tour-button-secondary"
          >
            Skip Tour
          </button>
          
          <div className="tour-navigation">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="tour-button tour-button-secondary"
              >
                ← Previous
              </button>
            )}
            <button
              onClick={handleNext}
              className="tour-button tour-button-primary"
            >
              {currentStep < tourSteps.length - 1 ? 'Next →' : 'Get Started!'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default OnboardingTour;
