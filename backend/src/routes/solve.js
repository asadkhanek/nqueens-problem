import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { validateSolveRequest } from '../middleware/validator.js';
import { JobManager } from '../jobs/JobManager.js';
import { solveNQueens } from '../solvers/backtracking.js';
import { solveNQueensBitmask } from '../solvers/bitmask.js';

const router = express.Router();
const jobManager = new JobManager();

/**
 * POST /api/v1/solve
 * Initiates a new N-Queens solve job
 */
router.post('/', validateSolveRequest, async (req, res) => {
  try {
    const { n, algorithm, mode } = req.body;
    const jobId = uuidv4();
    
    // Create job
    const job = jobManager.createJob(jobId, { n, algorithm, mode });
    
    // Start solving asynchronously
    setImmediate(() => {
      try {
        const solver = algorithm === 'bitmask' ? solveNQueensBitmask : solveNQueens;
        const result = solver(n, mode, (progress) => {
          jobManager.updateJobProgress(jobId, progress);
        });
        
        jobManager.completeJob(jobId, result);
      } catch (error) {
        jobManager.failJob(jobId, error.message);
      }
    });
    
    res.status(202).json({ jobId });
  } catch (error) {
    res.status(500).json({
      error: {
        code: 500,
        message: 'Failed to initiate solve job',
      },
    });
  }
});

/**
 * GET /api/v1/solve/:jobId
 * Retrieves the status and results of a solve job
 */
router.get('/:jobId', (req, res) => {
  const { jobId } = req.params;
  
  const job = jobManager.getJob(jobId);
  
  if (!job) {
    return res.status(404).json({
      error: {
        code: 404,
        message: `Job with ID '${jobId}' not found.`,
      },
    });
  }
  
  const response = {
    jobId: job.jobId,
    status: job.status,
  };
  
  if (job.status === 'processing') {
    response.progress = job.progress;
  } else if (job.status === 'completed') {
    response.result = job.result;
  } else if (job.status === 'failed') {
    response.error = job.error;
  }
  
  res.status(200).json(response);
});

export default router;
