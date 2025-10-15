import { useState, useCallback } from 'react';
import axios from 'axios';

/**
 * Hook for API-based solving (large N values)
 * FR-3.3: Asynchronous API polling
 */
export function useApiSolver() {
  const [jobId, setJobId] = useState(null);
  const [polling, setPolling] = useState(false);
  
  const API_BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';
  
  const solve = useCallback(async (n, algorithm, mode, callbacks) => {
    const { onProgress, onComplete, onError } = callbacks;
    
    try {
      // Initiate solve job
      const initiateResponse = await axios.post(`${API_BASE_URL}/solve`, {
        n,
        algorithm,
        mode,
      });
      
      const newJobId = initiateResponse.data.jobId;
      setJobId(newJobId);
      
      // Start polling
      setPolling(true);
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(`${API_BASE_URL}/solve/${newJobId}`);
          const jobData = statusResponse.data;
          
          if (jobData.status === 'processing' && onProgress) {
            onProgress(jobData.progress);
          } else if (jobData.status === 'completed') {
            clearInterval(pollInterval);
            setPolling(false);
            if (onComplete) {
              onComplete(jobData.result);
            }
          } else if (jobData.status === 'failed') {
            clearInterval(pollInterval);
            setPolling(false);
            if (onError) {
              onError(jobData.error);
            }
          }
        } catch (error) {
          clearInterval(pollInterval);
          setPolling(false);
          if (onError) {
            onError(error.message);
          }
        }
      }, 1000); // Poll every 1 second
      
      // Cleanup function
      return () => {
        clearInterval(pollInterval);
        setPolling(false);
      };
    } catch (error) {
      setPolling(false);
      if (onError) {
        onError(error.response?.data?.error?.message || error.message);
      }
      throw error;
    }
  }, [API_BASE_URL]);
  
  return { solve, jobId, polling };
}
