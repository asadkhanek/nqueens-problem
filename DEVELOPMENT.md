# N-Queens Solver & Visualizer - Development Guide

## Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Docker and Docker Compose (optional, for containerized deployment)

### Quick Start

1. **Clone and Navigate to Project:**
   ```bash
   cd "queens prblemsa"
   ```

2. **Install Dependencies:**
   ```powershell
   # Install root dependencies
   npm install

   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ..\backend
   npm install

   cd ..
   ```

3. **Configure Environment:**
   ```powershell
   # Backend environment
   cd backend
   Copy-Item .env.example .env
   cd ..
   ```

4. **Run in Development Mode:**
   ```powershell
   # From root directory - runs both frontend and backend
   npm run dev
   ```

   Or run separately:
   ```powershell
   # Terminal 1 - Backend
   cd backend
   npm run dev

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

5. **Access the Application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Health Check: http://localhost:3001/health

## Project Structure

```
n-queens-visualizer/
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/    # React components
│   │   │   ├── Header.jsx
│   │   │   ├── Chessboard.jsx
│   │   │   ├── ControlPanel.jsx
│   │   │   ├── InfoPanel.jsx
│   │   │   ├── OnboardingTour.jsx
│   │   │   └── AlgorithmComparison.jsx
│   │   ├── algorithms/    # Client-side solvers
│   │   │   ├── backtracking.js
│   │   │   └── bitmask.js
│   │   ├── hooks/         # Custom React hooks
│   │   │   ├── useVisualization.js
│   │   │   ├── useLocalSolver.js
│   │   │   └── useApiSolver.js
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Global styles
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── routes/        # API routes
│   │   │   └── solve.js
│   │   ├── solvers/       # Algorithm implementations
│   │   │   ├── backtracking.js
│   │   │   └── bitmask.js
│   │   ├── middleware/    # Express middleware
│   │   │   ├── rateLimiter.js
│   │   │   ├── errorHandler.js
│   │   │   └── validator.js
│   │   ├── jobs/          # Job management
│   │   │   └── JobManager.js
│   │   └── index.js       # Server entry point
│   ├── Dockerfile
│   ├── .env.example
│   └── package.json
├── docker-compose.yml     # Docker orchestration
├── package.json           # Root package.json
└── README.md
```

## Development Workflow

### Frontend Development

The frontend is a React SPA built with Vite. Key features:

- **Hot Module Replacement (HMR):** Changes reflect instantly
- **Component-based architecture:** Reusable UI components
- **Custom hooks:** Encapsulated logic for visualization, solving, and API calls
- **Accessibility:** WCAG 2.1 AA compliant with ARIA attributes

#### Key Components:

1. **Chessboard:** Renders the N×N board with queens and attack visualization
2. **ControlPanel:** User inputs for N, algorithm, mode, and playback controls
3. **InfoPanel:** Statistics, activity logs, and solution display
4. **OnboardingTour:** First-time user guidance
5. **AlgorithmComparison:** Educational modal explaining algorithms

### Backend Development

The backend is a RESTful API built with Express.js:

- **Stateless design:** Each request is self-contained
- **Asynchronous job processing:** Long-running solves don't block
- **Rate limiting:** Protection against abuse (10 req/min per IP)
- **Input validation:** Strict validation prevents invalid requests

#### API Endpoints:

1. **POST /api/v1/solve** - Initiate solve job
2. **GET /api/v1/solve/:jobId** - Poll job status/results
3. **GET /health** - Health check

### Testing the Application

#### Manual Testing:

1. **Small Board (N=4-8):**
   - Should solve instantly on client-side
   - Watch step-by-step visualization
   - Test playback controls

2. **Medium Board (N=10-12):**
   - May use client or server depending on threshold
   - Verify solutions are correct
   - Check performance metrics

3. **Large Board (N=13-15):**
   - Should delegate to backend API
   - Poll for progress
   - Verify timeout handling (120s max)

4. **Accessibility:**
   - Navigate using keyboard only (Tab, Enter, Space, Arrows)
   - Test with screen reader
   - Verify focus indicators are visible
   - Check color contrast ratios

5. **Responsive Design:**
   - Test on desktop, tablet, and mobile viewports
   - Verify layout reflows correctly
   - Check touch interactions on mobile

#### Security Testing:

1. **Input Validation:**
   ```bash
   # Invalid N value
   curl -X POST http://localhost:3001/api/v1/solve \
     -H "Content-Type: application/json" \
     -d '{"n": 20, "algorithm": "backtracking", "mode": "findAll"}'
   # Should return 400 Bad Request
   ```

2. **Rate Limiting:**
   ```bash
   # Send >10 requests within 1 minute
   # Should return 429 Too Many Requests
   ```

## Docker Deployment

### Build and Run with Docker Compose:

```powershell
# Build images
docker-compose build

# Start services
docker-compose up

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost
- Backend API: http://localhost:3001

### Individual Docker Builds:

```powershell
# Backend
cd backend
docker build -t nqueens-backend .
docker run -p 3001:3001 nqueens-backend

# Frontend
cd frontend
docker build -t nqueens-frontend .
docker run -p 80:80 nqueens-frontend
```

## Environment Variables

### Backend (.env):

```
NODE_ENV=development|production
PORT=3001
CORS_ORIGIN=http://localhost:5173
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX_REQUESTS=10
MAX_N_VALUE=15
JOB_TIMEOUT_MS=120000
```

### Frontend:

Set `VITE_API_URL` for custom backend URL:
```
VITE_API_URL=http://localhost:3001
```

## Production Deployment

### Recommended Platforms:

1. **Render:**
   - Create Web Service for backend (Node.js)
   - Create Static Site for frontend
   - Set environment variables in dashboard

2. **AWS Elastic Beanstalk:**
   - Deploy Docker Compose configuration
   - Configure load balancer and auto-scaling
   - Set environment variables in EB console

3. **Heroku:**
   - Deploy as two separate apps
   - Use Heroku Postgres if adding database features
   - Configure environment variables via CLI

### Production Checklist:

- [ ] Set `NODE_ENV=production`
- [ ] Configure proper CORS origins
- [ ] Enable HTTPS (TLS/SSL certificates)
- [ ] Set up monitoring and logging
- [ ] Configure CDN for static assets
- [ ] Enable compression (gzip/brotli)
- [ ] Set up error tracking (e.g., Sentry)
- [ ] Configure backup and disaster recovery

## Performance Optimization

### Frontend:

- Code splitting with React.lazy()
- Image optimization
- Minimize bundle size
- Enable service workers for offline support

### Backend:

- Implement caching for common solve requests
- Add worker threads for CPU-intensive tasks
- Use cluster mode for multi-core systems
- Optimize algorithm implementations

## Troubleshooting

### Common Issues:

1. **Frontend can't connect to backend:**
   - Check backend is running on port 3001
   - Verify CORS configuration
   - Check firewall settings

2. **Slow visualization:**
   - Reduce animation speed
   - Use smaller N value
   - Check browser performance

3. **API timeout:**
   - N value too large (>15)
   - Increase JOB_TIMEOUT_MS
   - Use "Count All" mode instead of "Find All"

4. **Rate limit errors:**
   - Wait 1 minute between requests
   - Increase RATE_LIMIT_MAX_REQUESTS for development

## Contributing

### Code Style:

- Use ESLint for linting
- Follow React best practices
- Write descriptive commit messages
- Add comments for complex logic

### Accessibility Guidelines:

- All interactive elements must be keyboard accessible
- Maintain 4.5:1 contrast ratio for text
- Use semantic HTML
- Provide ARIA labels for screen readers

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or contributions, please refer to the project repository.
