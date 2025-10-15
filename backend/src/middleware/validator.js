const MAX_N = parseInt(process.env.MAX_N_VALUE) || 15;
const MIN_N = 1;

const VALID_ALGORITHMS = ['backtracking', 'bitmask'];
const VALID_MODES = ['findFirst', 'findAll', 'countAll'];

/**
 * Validates the solve request body
 * FR-4.2.2: Input validation and sanitization
 */
export const validateSolveRequest = (req, res, next) => {
  const { n, algorithm, mode } = req.body;
  
  // Validate n
  if (n === undefined || n === null) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `Validation Error: 'n' is required.`,
      },
    });
  }
  
  if (!Number.isInteger(n)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `Validation Error: 'n' must be an integer.`,
      },
    });
  }
  
  if (n < MIN_N || n > MAX_N) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `Validation Error: 'n' must be an integer between ${MIN_N} and ${MAX_N}.`,
      },
    });
  }
  
  // Validate algorithm
  if (!algorithm) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `Validation Error: 'algorithm' is required.`,
      },
    });
  }
  
  if (!VALID_ALGORITHMS.includes(algorithm)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `Validation Error: 'algorithm' must be one of: ${VALID_ALGORITHMS.join(', ')}.`,
      },
    });
  }
  
  // Validate mode
  if (!mode) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `Validation Error: 'mode' is required.`,
      },
    });
  }
  
  if (!VALID_MODES.includes(mode)) {
    return res.status(400).json({
      error: {
        code: 400,
        message: `Validation Error: 'mode' must be one of: ${VALID_MODES.join(', ')}.`,
      },
    });
  }
  
  next();
};
