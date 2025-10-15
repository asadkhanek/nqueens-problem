# API Documentation - N-Queens Solver & Visualizer

## Base URL

**Development:** `http://localhost:3001/api/v1`
**Production:** `https://your-domain.com/api/v1`

## Authentication

Currently, the API is public and does not require authentication.

## Rate Limiting

- **Limit:** 10 requests per minute per IP address
- **Headers:**
  - `RateLimit-Limit`: Maximum requests allowed in window
  - `RateLimit-Remaining`: Requests remaining in current window
  - `RateLimit-Reset`: Time when the rate limit resets (Unix timestamp)

**Rate Limit Error Response:**
```json
{
  "error": {
    "code": 429,
    "message": "Too many requests from this IP, please try again after a minute."
  }
}
```

## Endpoints

### 1. Initiate Solve Job

Submits a new request to solve the N-Queens problem.

**Endpoint:** `POST /solve`

**Request Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "n": 8,
  "algorithm": "backtracking",
  "mode": "findAll"
}
```

**Parameters:**

| Field | Type | Required | Description | Valid Values |
|-------|------|----------|-------------|--------------|
| n | integer | Yes | Board size (N×N) | 1-15 |
| algorithm | string | Yes | Algorithm to use | "backtracking", "bitmask" |
| mode | string | Yes | Solution mode | "findFirst", "findAll", "countAll" |

**Success Response (202 Accepted):**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
}
```

**Error Responses:**

**400 Bad Request** - Invalid input:
```json
{
  "error": {
    "code": 400,
    "message": "Validation Error: 'n' must be an integer between 1 and 15."
  }
}
```

**Example cURL:**
```bash
curl -X POST http://localhost:3001/api/v1/solve \
  -H "Content-Type: application/json" \
  -d '{
    "n": 8,
    "algorithm": "backtracking",
    "mode": "findAll"
  }'
```

**Example JavaScript (axios):**
```javascript
const response = await axios.post('/api/v1/solve', {
  n: 8,
  algorithm: 'backtracking',
  mode: 'findAll'
});
const jobId = response.data.jobId;
```

---

### 2. Get Job Status and Results

Retrieves the current status and results of a solve job.

**Endpoint:** `GET /solve/:jobId`

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| jobId | string | UUID of the solve job |

**Success Response (200 OK):**

**While Processing:**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "status": "processing",
  "progress": {
    "solutionsFound": 5,
    "operations": 15032
  }
}
```

**Upon Completion (Find All mode):**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "status": "completed",
  "result": {
    "solutions": [
      [".Q..", "...Q", "Q...", "..Q."],
      ["..Q.", "Q...", "...Q", ".Q.."]
    ],
    "solutionCount": 2
  }
}
```

**Upon Completion (Count All mode):**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "status": "completed",
  "result": {
    "solutionCount": 92
  }
}
```

**Upon Failure:**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8",
  "status": "failed",
  "error": "Job execution timeout exceeded"
}
```

**Error Responses:**

**404 Not Found** - Job doesn't exist:
```json
{
  "error": {
    "code": 404,
    "message": "Job with ID 'invalid-id' not found."
  }
}
```

**Example cURL:**
```bash
curl http://localhost:3001/api/v1/solve/a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8
```

**Example JavaScript (polling):**
```javascript
async function pollJobStatus(jobId) {
  const pollInterval = setInterval(async () => {
    const response = await axios.get(`/api/v1/solve/${jobId}`);
    
    if (response.data.status === 'processing') {
      console.log('Progress:', response.data.progress);
    } else if (response.data.status === 'completed') {
      clearInterval(pollInterval);
      console.log('Result:', response.data.result);
    } else if (response.data.status === 'failed') {
      clearInterval(pollInterval);
      console.error('Error:', response.data.error);
    }
  }, 1000); // Poll every 1 second
}
```

---

### 3. Health Check

Checks if the API server is running.

**Endpoint:** `GET /health`

**Success Response (200 OK):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Example cURL:**
```bash
curl http://localhost:3001/health
```

---

## Data Models

### Solution Format

A solution is represented as an array of strings, where each string represents a row on the chessboard:
- `'Q'` indicates a queen
- `'.'` indicates an empty square

**Example for N=4:**
```json
[
  ".Q..",
  "...Q",
  "Q...",
  "..Q."
]
```

This represents:
```
. Q . .
. . . Q
Q . . .
. . Q .
```

### Job Status Values

| Status | Description |
|--------|-------------|
| processing | Job is currently being executed |
| completed | Job finished successfully |
| failed | Job failed due to error or timeout |

### Error Response Format

All errors follow this consistent format:

```json
{
  "error": {
    "code": 400,
    "message": "Human-readable error message"
  }
}
```

In development mode, errors may also include a `stack` field with the stack trace.

## HTTP Status Codes

| Code | Meaning | When Used |
|------|---------|-----------|
| 200 | OK | Successful GET request |
| 202 | Accepted | Job successfully initiated |
| 400 | Bad Request | Invalid request parameters |
| 404 | Not Found | Job ID doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

## Algorithm Details

### Backtracking Algorithm

**Characteristics:**
- Explores solution space recursively
- Backtracks when conflict detected
- Time Complexity: O(N!)
- Space Complexity: O(N)
- Best for: Educational purposes, N ≤ 12

### Bitmask Algorithm

**Characteristics:**
- Uses bitwise operations for conflict detection
- O(1) conflict checking
- Time Complexity: O(N!) with better constants
- Space Complexity: O(N)
- Best for: Performance, N ≤ 15

## Solution Modes

### findFirst

Returns as soon as the first valid solution is found.

**Use Case:** Quick verification that a solution exists

**Result:**
```json
{
  "solutions": [["solution"]],
  "solutionCount": 1
}
```

### findAll

Finds and returns all unique solutions.

**Use Case:** Educational exploration, small N values

**Result:**
```json
{
  "solutions": [["sol1"], ["sol2"], ...],
  "solutionCount": 92
}
```

### countAll

Counts all solutions without storing them.

**Use Case:** Performance benchmarking, large N values

**Result:**
```json
{
  "solutionCount": 92
}
```

## Timeouts and Limits

- **Maximum N value:** 15
- **Job timeout:** 120 seconds (2 minutes)
- **Jobs older than 5 minutes are automatically cleaned up**

## Best Practices

1. **Polling Frequency:** Poll every 1-2 seconds, not more frequently
2. **Error Handling:** Always handle 404, 429, and 500 errors
3. **Mode Selection:**
   - Use `findFirst` for quick checks
   - Use `countAll` for large N (faster than `findAll`)
   - Use `findAll` only when you need actual solutions
4. **N Value Selection:**
   - N ≤ 10: Use client-side solving for instant results
   - N > 10: Use API to prevent UI freeze

## Example Complete Workflow

```javascript
async function solveNQueens(n, algorithm, mode) {
  try {
    // 1. Initiate job
    const initiateResponse = await axios.post('/api/v1/solve', {
      n,
      algorithm,
      mode
    });
    
    const jobId = initiateResponse.data.jobId;
    console.log('Job started:', jobId);
    
    // 2. Poll for results
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await axios.get(`/api/v1/solve/${jobId}`);
          
          if (statusResponse.data.status === 'completed') {
            clearInterval(pollInterval);
            resolve(statusResponse.data.result);
          } else if (statusResponse.data.status === 'failed') {
            clearInterval(pollInterval);
            reject(new Error(statusResponse.data.error));
          } else {
            console.log('Progress:', statusResponse.data.progress);
          }
        } catch (error) {
          clearInterval(pollInterval);
          reject(error);
        }
      }, 1000);
    });
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
    throw error;
  }
}

// Usage
const result = await solveNQueens(8, 'backtracking', 'findAll');
console.log('Solutions:', result.solutions);
console.log('Count:', result.solutionCount);
```

## Versioning

The API is currently at version 1 (v1). All endpoints are prefixed with `/api/v1/`.

Future versions will be introduced with new prefixes (e.g., `/api/v2/`) while maintaining backward compatibility with v1.
