#!/bin/bash

# Unified EduPulse AI - Start All Services Script
# This script starts all backend services and the unified frontend

echo "🚀 Starting EduPulse AI - Unified System"
echo "========================================"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Function to check if port is in use
check_port() {
    lsof -i :$1 > /dev/null 2>&1
    return $?
}

# Kill existing processes on required ports
echo "🧹 Cleaning up existing processes..."
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
lsof -ti:4000 | xargs kill -9 2>/dev/null || true
lsof -ti:5173 | xargs kill -9 2>/dev/null || true

sleep 2

# Start Backend Server
echo ""
echo "📦 Starting Backend Server (Port 5000)..."
cd "$(dirname "$0")/backend"
npm start > /dev/null 2>&1 &
BACKEND_PID=$!
echo "✓ Backend Server started (PID: $BACKEND_PID)"

sleep 2

# Start Roboflow Proxy
echo ""
echo "🤖 Starting Roboflow Proxy (Port 4000)..."
npm run proxy > /dev/null 2>&1 &
PROXY_PID=$!
echo "✓ Roboflow Proxy started (PID: $PROXY_PID)"

sleep 2

# Start Unified Dashboard
echo ""
echo "🎨 Starting Unified Dashboard (Port 5173)..."
cd ../gdg_hack_report
npm run dev &
DASHBOARD_PID=$!
echo "✓ Unified Dashboard started (PID: $DASHBOARD_PID)"

echo ""
echo "========================================"
echo "✅ All services started successfully!"
echo ""
echo "🌐 Access Points:"
echo "   Main Application: http://localhost:5173"
echo "   Backend API:      http://localhost:5000"
echo "   Roboflow Proxy:   http://localhost:4000"
echo ""
echo "📝 Process IDs:"
echo "   Backend:    $BACKEND_PID"
echo "   Proxy:      $PROXY_PID"
echo "   Dashboard:  $DASHBOARD_PID"
echo ""
echo "To stop all services, press Ctrl+C or run:"
echo "   kill $BACKEND_PID $PROXY_PID $DASHBOARD_PID"
echo "========================================"

# Keep script running
wait
