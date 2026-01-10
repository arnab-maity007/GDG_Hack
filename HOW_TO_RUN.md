# How to Run the Complete Project

This guide will walk you through starting all services for the GDG Hackathon project.

## Prerequisites

- Node.js installed (v14 or higher)
- npm installed
- All dependencies installed (run `npm install` in each directory if needed)

## Project Structure

The project consists of 4 services that need to be running:

1. **Backend Server** (port 5000) - Main Express API
2. **Roboflow Proxy** (port 4000) - Proxy for Roboflow ML API
3. **Frontend** (port 3000) - React app with video/camera processing
4. **Dashboard** (port 5173) - Vite React dashboard application

## Step-by-Step Instructions

### Option 1: Manual Start (Recommended for Development)

Open **4 separate terminal/PowerShell windows** and run each service:

#### Terminal 1: Backend Server
```bash
cd backend
npm start
```
**What you'll see:**
- Server running on port 5000
- Console showing server status

#### Terminal 2: Roboflow Proxy
```bash
cd backend
npm run proxy
```
**What you'll see:**
- Proxy listening on port 4000
- Console showing proxy status

#### Terminal 3: Frontend
```bash
cd frontend
npm start
```
**What you'll see:**
- Compiling React app...
- Opens automatically at http://localhost:3000
- May take 30-60 seconds to compile initially

#### Terminal 4: Dashboard
```bash
cd gdg_hack_report
npm run dev
```
**What you'll see:**
- Vite dev server starting
- Opens automatically at http://localhost:5173

### Option 2: Quick Start Script (Windows PowerShell)

Create a file `start-all.ps1` in the project root:

```powershell
# Start all services
Write-Host "Starting all services..."

# Backend Server
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm start"

Start-Sleep -Seconds 2

# Roboflow Proxy
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run proxy"

Start-Sleep -Seconds 2

# Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm start"

Start-Sleep -Seconds 2

# Dashboard
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\gdg_hack_report'; npm run dev"

Write-Host "All services starting in separate windows..."
Write-Host "Wait 30-60 seconds for everything to be ready."
```

Run it with:
```powershell
.\start-all.ps1
```

## Verification

After starting all services, verify they're running:

### Check All Services

Visit these URLs in your browser:

1. **Backend Server**: http://localhost:5000/api/test
   - Should show: `{"message":"Backend is working!"}`

2. **Roboflow Proxy**: http://localhost:4000/roboflow
   - Should show: JSON with status "running"

3. **Frontend**: http://localhost:3000
   - Should show: Teacher Validation Module with video upload

4. **Dashboard**: http://localhost:5173
   - Should show: Login page or dashboard

### Quick Test Command

Run this in PowerShell to check all services:
```powershell
Write-Host "Backend (5000):" ; try { Invoke-WebRequest -Uri "http://localhost:5000/api/test" -UseBasicParsing -TimeoutSec 2 | Out-Null ; Write-Host "  [OK]" } catch { Write-Host "  [X]" }
Write-Host "Proxy (4000):" ; try { Invoke-WebRequest -Uri "http://localhost:4000/roboflow" -UseBasicParsing -TimeoutSec 2 | Out-Null ; Write-Host "  [OK]" } catch { Write-Host "  [X]" }
Write-Host "Frontend (3000):" ; try { Invoke-WebRequest -Uri "http://localhost:3000" -UseBasicParsing -TimeoutSec 3 | Out-Null ; Write-Host "  [OK]" } catch { Write-Host "  [X]" }
Write-Host "Dashboard (5173):" ; try { Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing -TimeoutSec 2 | Out-Null ; Write-Host "  [OK]" } catch { Write-Host "  [X]" }
```

## Using the Application

### 1. Video/Camera Processing

1. Go to http://localhost:3000
2. **Option A - Upload Video:**
   - Click "Choose File" and select a video file
   - Wait for video to load and start playing
   - Click "Start Capture"

3. **Option B - Use Camera:**
   - Click "Start Camera" button
   - Allow camera permissions when prompted
   - Wait for camera feed to appear
   - Click "Start Capture"

4. **View Predictions:**
   - Check browser console (F12) for detailed responses
   - Visit http://localhost:4000/roboflow to see latest predictions
   - Predictions will appear on canvas below video (if detected)

### 2. Dashboard Application

1. Go to http://localhost:5173
2. Login with demo credentials (see LOGIN_GUIDE.md in gdg_hack_report folder)
3. Navigate through admin/teacher/student dashboards

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| Backend Server | 5000 | http://localhost:5000 |
| Roboflow Proxy | 4000 | http://localhost:4000 |
| Frontend | 3000 | http://localhost:3000 |
| Dashboard | 5173 | http://localhost:5173 |

## Environment Variables

Make sure `backend/.env` file exists with:
```
PORT=4000
SERVER_PORT=5000
ROBOFLOW_API_KEY=your_api_key_here
```

## Troubleshooting

### Services Won't Start

1. **Check if ports are in use:**
   ```powershell
   Get-NetTCPConnection -LocalPort 3000,4000,5000,5173 -ErrorAction SilentlyContinue
   ```
   If ports are busy, close other applications or change ports

2. **Check dependencies:**
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   cd ../gdg_hack_report && npm install
   ```

3. **Check for errors in terminal windows**
   - Read error messages carefully
   - Check if .env file exists and has correct values

### Common Issues

- **"Cannot GET /roboflow"**: Roboflow proxy not running - start it in Terminal 2
- **"Please upload a video or start camera first!"**: Make sure video is playing or camera is active before clicking Start Capture
- **Frontend won't compile**: Delete `frontend/node_modules` and `frontend/package-lock.json`, then run `npm install` again
- **Port already in use**: Close other applications using those ports or change port numbers

### Stopping Services

- **Manual**: Press `Ctrl+C` in each terminal window
- **Windows**: Close the PowerShell windows
- **Force stop**: Use Task Manager to kill node processes

## Quick Reference

### Start All Services
```bash
# Terminal 1
cd backend && npm start

# Terminal 2  
cd backend && npm run proxy

# Terminal 3
cd frontend && npm start

# Terminal 4
cd gdg_hack_report && npm run dev
```

### Stop All Services
- Press `Ctrl+C` in each terminal
- Or close all PowerShell windows

### Check Status
Visit:
- http://localhost:5000/api/test
- http://localhost:4000/roboflow
- http://localhost:3000
- http://localhost:5173

## Need Help?

1. Check console logs in each terminal window
2. Open browser DevTools (F12) and check Console tab
3. Verify all services are running on correct ports
4. Make sure .env file is configured correctly
