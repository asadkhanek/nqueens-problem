# Deployment Guide

This project includes automated deployment via GitHub Actions.

## GitHub Pages Deployment (Frontend Only)

### Setup Steps:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add GitHub Actions workflows"
   git remote add origin https://github.com/YOUR_USERNAME/n-queens-visualizer.git
   git push -u origin main
   ```

2. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Navigate to **Settings** → **Pages**
   - Under "Source", select **Deploy from a branch**
   - Select branch: `gh-pages` and folder: `/ (root)`
   - Click **Save**

3. **Update Repository Name** (if different):
   - Edit `frontend/vite.config.js`
   - Change `/n-queens-visualizer/` to your actual repository name in the `base` property

4. **Access Your App**:
   - After the workflow runs, your app will be available at:
   - `https://YOUR_USERNAME.github.io/n-queens-visualizer/`

### What Happens Automatically:
- ✅ Builds frontend on every push to main/master
- ✅ Deploys to GitHub Pages automatically
- ✅ Runs tests and linting
- ✅ Creates Docker images (if Docker Hub credentials provided)

---

## Docker Hub Deployment (Optional)

### Setup Docker Hub Publishing:

1. **Create Docker Hub Account**: https://hub.docker.com/

2. **Add GitHub Secrets**:
   - Go to your repository → **Settings** → **Secrets and variables** → **Actions**
   - Click **New repository secret**
   - Add these secrets:
     - `DOCKER_USERNAME`: Your Docker Hub username
     - `DOCKER_PASSWORD`: Your Docker Hub password or access token

3. **Images Will Be Published**:
   - Frontend: `YOUR_DOCKERHUB_USERNAME/n-queens-frontend:latest`
   - Backend: `YOUR_DOCKERHUB_USERNAME/n-queens-backend:latest`

4. **Use Published Images**:
   ```bash
   docker pull YOUR_DOCKERHUB_USERNAME/n-queens-frontend:latest
   docker pull YOUR_DOCKERHUB_USERNAME/n-queens-backend:latest
   ```

---

## Platform-Specific Deployments

### Vercel (Frontend)

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   cd frontend
   vercel
   ```

3. **Set Environment Variables** (in Vercel dashboard):
   - `VITE_API_URL`: Your backend API URL

### Netlify (Frontend)

1. **Install Netlify CLI**:
   ```bash
   npm i -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   cd frontend
   npm run build
   netlify deploy --prod --dir=dist
   ```

### Render (Full Stack)

1. **Create `render.yaml`** in project root:
   ```yaml
   services:
     - type: web
       name: n-queens-backend
       env: node
       buildCommand: cd backend && npm install
       startCommand: cd backend && npm start
       envVars:
         - key: NODE_ENV
           value: production
         - key: PORT
           value: 3001

     - type: web
       name: n-queens-frontend
       env: static
       buildCommand: cd frontend && npm install && npm run build
       staticPublishPath: frontend/dist
       envVars:
         - key: VITE_API_URL
           sync: false
   ```

2. **Connect to GitHub** and deploy via Render dashboard

### Railway (Full Stack)

1. **Install Railway CLI**:
   ```bash
   npm i -g @railway/cli
   ```

2. **Deploy**:
   ```bash
   railway login
   railway init
   railway up
   ```

### Heroku (Backend)

1. **Create Heroku app**:
   ```bash
   heroku create n-queens-backend
   ```

2. **Deploy**:
   ```bash
   git subtree push --prefix backend heroku main
   ```

---

## Environment Variables

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com
```

### Backend (.env)
```env
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Monitoring Deployments

### GitHub Actions Status:
- Go to your repository → **Actions** tab
- View workflow runs and logs
- Badge: Add to README.md:
  ```markdown
  ![Deploy Status](https://github.com/YOUR_USERNAME/n-queens-visualizer/workflows/Deploy%20N-Queens%20Visualizer/badge.svg)
  ```

### Deployment URLs:
- **GitHub Pages**: `https://YOUR_USERNAME.github.io/n-queens-visualizer/`
- **Vercel**: Auto-generated URL (e.g., `n-queens.vercel.app`)
- **Netlify**: Auto-generated URL (e.g., `n-queens.netlify.app`)

---

## Troubleshooting

### Build Fails:
- Check Node.js version (requires 18+)
- Verify all dependencies are in package.json
- Check GitHub Actions logs for specific errors

### GitHub Pages 404:
- Ensure `base` in `vite.config.js` matches your repository name
- Wait 2-3 minutes after deployment
- Clear browser cache

### API Connection Issues:
- Update `VITE_API_URL` environment variable
- Check CORS settings in backend
- Verify backend is deployed and accessible

---

## Quick Deployment Checklist

- [ ] Repository pushed to GitHub
- [ ] GitHub Pages enabled in repository settings
- [ ] Update repository name in `vite.config.js` if needed
- [ ] (Optional) Add Docker Hub credentials for container publishing
- [ ] Verify deployment at GitHub Pages URL
- [ ] Test functionality (solving, visualization, playback)

---

For more details, see:
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
