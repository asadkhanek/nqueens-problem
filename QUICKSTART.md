# Quick Start Guide

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies

Open PowerShell in the project directory and run:

```powershell
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..\frontend
npm install

cd ..
```

### Step 2: Start the Application

You can either run both services together or separately.

**Option A: Run Both Together (Recommended)**

From the root directory:

```powershell
npm install
npm run dev
```

**Option B: Run Separately**

Terminal 1 (Backend):
```powershell
cd backend
npm run dev
```

Terminal 2 (Frontend):
```powershell
cd frontend
npm run dev
```

### Step 3: Open the Application

Once both services are running, open your browser to:

**http://localhost:5173**

## 🎯 First Time Using the App?

1. **Start Simple**: Try N=4 or N=8 first
2. **Follow the Tour**: An interactive guide will show you around
3. **Watch the Visualization**: See how the algorithm places queens and backtracks
4. **Try Both Algorithms**: Compare Backtracking vs Bitmask performance

## 📋 What You'll See

- **Left Panel**: Controls for board size, algorithm, speed, and playback
- **Center**: Interactive chessboard with real-time visualization
- **Right Panel**: Statistics, activity logs, and solution display

## 🔧 Troubleshooting

**Backend won't start?**
- Make sure nothing is using port 3001
- Check that Node.js 18+ is installed

**Frontend won't start?**
- Make sure nothing is using port 5173
- Clear browser cache and try again

**Can't see visualizations?**
- Click the "Solve" button to start
- Use the playback controls to play/pause

## 📚 Learn More

- **README.md**: Overview and features
- **DEVELOPMENT.md**: Detailed development guide
- **API_DOCUMENTATION.md**: Complete API reference

## 🐳 Want to Use Docker?

```powershell
docker-compose up
```

Then visit **http://localhost**

---

**Enjoy exploring the N-Queens problem!** 👑
