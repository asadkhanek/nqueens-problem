# N-Queens Solver & Visualizer

An interactive, educational web application for solving and visualizing the classic N-Queens problem with real-time algorithm visualization.

## Features

- **Interactive Chessboard**: Dynamic N×N board with responsive design
- **Multiple Algorithms**: 
  - Classic Recursive Backtracking (educational)
  - Optimized Bitmask Backtracking (performance)
- **Real-time Visualization**: Step-by-step animation of algorithm execution
- **Educational Tools**: 
  - Interactive onboarding tour
  - Contextual explanations
  - Algorithm comparison
  - Detailed logging panel
- **Accessibility**: WCAG 2.1 AA compliant
- **Security**: OWASP Top 10 mitigations, rate limiting
- **Performance**: Hybrid client/server computation model

## Architecture

- **Frontend**: React SPA with real-time visualization
- **Backend**: Node.js/Express REST API with asynchronous job processing
- **Deployment**: Docker containerization ready

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (for containerized deployment)

### Development Mode

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend in development mode
npm run dev
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:3001`.

### Production Mode with Docker

```bash
# Build and start containers
npm run docker:up

# Stop containers
npm run docker:down
```

The application will be available at `http://localhost`.

## Project Structure

```
.
├── frontend/          # React SPA
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── algorithms/   # Client-side solvers
│   │   ├── hooks/        # Custom React hooks
│   │   └── utils/        # Utility functions
│   └── package.json
├── backend/           # Express API server
│   ├── src/
│   │   ├── routes/       # API routes
│   │   ├── solvers/      # Algorithm implementations
│   │   ├── middleware/   # Express middleware
│   │   └── jobs/         # Job management
│   └── package.json
└── docker-compose.yml
```

## API Documentation

### POST /api/v1/solve
Initiates a new solve job.

**Request Body:**
```json
{
  "n": 8,
  "algorithm": "backtracking",
  "mode": "findAll"
}
```

**Response (202 Accepted):**
```json
{
  "jobId": "a1b2c3d4-e5f6-7890-g1h2-i3j4k5l6m7n8"
}
```

### GET /api/v1/solve/:jobId
Retrieves job status and results.

**Response (200 OK):**
```json
{
  "jobId": "...",
  "status": "completed",
  "result": {
    "solutions": [["..Q.", "Q...", "...Q", ".Q.."]],
    "solutionCount": 1
  }
}
```

## License

MIT
