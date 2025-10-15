/**
 * JobManager - Manages solve job lifecycle
 * Implements job storage, status tracking, and timeout handling
 */
export class JobManager {
  constructor() {
    this.jobs = new Map();
    this.jobTimeout = parseInt(process.env.JOB_TIMEOUT_MS) || 120000; // 2 minutes
  }
  
  /**
   * Creates a new job
   */
  createJob(jobId, params) {
    const job = {
      jobId,
      status: 'processing',
      params,
      progress: {
        solutionsFound: 0,
        operations: 0,
      },
      createdAt: Date.now(),
    };
    
    this.jobs.set(jobId, job);
    
    // Set timeout
    setTimeout(() => {
      const currentJob = this.jobs.get(jobId);
      if (currentJob && currentJob.status === 'processing') {
        this.failJob(jobId, 'Job execution timeout exceeded');
      }
    }, this.jobTimeout);
    
    // Clean up old jobs (keep for 5 minutes after completion)
    this.cleanupOldJobs();
    
    return job;
  }
  
  /**
   * Gets a job by ID
   */
  getJob(jobId) {
    return this.jobs.get(jobId);
  }
  
  /**
   * Updates job progress
   */
  updateJobProgress(jobId, progress) {
    const job = this.jobs.get(jobId);
    if (job && job.status === 'processing') {
      job.progress = { ...job.progress, ...progress };
    }
  }
  
  /**
   * Marks job as completed
   */
  completeJob(jobId, result) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = 'completed';
      job.result = result;
      job.completedAt = Date.now();
    }
  }
  
  /**
   * Marks job as failed
   */
  failJob(jobId, errorMessage) {
    const job = this.jobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.error = errorMessage;
      job.completedAt = Date.now();
    }
  }
  
  /**
   * Removes jobs older than 5 minutes
   */
  cleanupOldJobs() {
    const now = Date.now();
    const maxAge = 5 * 60 * 1000; // 5 minutes
    
    for (const [jobId, job] of this.jobs.entries()) {
      if (job.completedAt && now - job.completedAt > maxAge) {
        this.jobs.delete(jobId);
      }
    }
  }
}
