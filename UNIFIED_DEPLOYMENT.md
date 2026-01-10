# EduPulse AI - Unified System

## 🎯 Overview

EduPulse AI is now a **unified, integrated platform** that combines three powerful educational tools into one seamless experience:

1. **📊 EduPulse AI Dashboard** - Comprehensive analytics for admins, teachers, and students
2. **📹 Live Classroom Monitor** - Real-time teacher validation and student engagement tracking
3. **🔧 Backend Services** - API and AI proxy for seamless integration

## ✨ Key Features

### Unified Experience
- **Single Entry Point**: Access all features from one main application
- **Seamless Navigation**: Switch between classroom monitoring and analytics dashboards
- **Integrated Backend**: All services work together seamlessly

### Dashboard Module (EduPulse AI)
- **Admin Portal**: School-wide oversight, teacher rankings, alerts
- **Teacher Portal**: Class analytics, student engagement, interest tracking
- **Student Portal**: Personal dashboard, interest radar, career predictions

### Classroom Monitor Module
- **Voice Validation**: AI-powered teacher topic validation
- **Visual Detection**: Real-time student engagement monitoring
- **Live Feedback**: Instant results and insights

## 🚀 Quick Start

### Option 1: Automated Script (Recommended)
```bash
./start-unified.sh
```

This will start all services automatically and open the application at http://localhost:5173

### Option 2: Manual Start

#### Step 1: Start Backend Services
```bash
# Terminal 1 - Backend Server
cd backend
npm start

# Terminal 2 - Roboflow Proxy
cd backend
npm run proxy
```

#### Step 2: Start Unified Dashboard
```bash
# Terminal 3 - Unified Application
cd gdg_hack_report
npm run dev
```

## 🌐 Application Structure

### Main Entry Point: http://localhost:5173

```
┌─────────────────────────────────────┐
│     EduPulse AI Main Landing        │
│                                     │
│  ┌──────────────┐  ┌──────────────┐│
│  │   Dashboard  │  │  Classroom   ││
│  │   Analytics  │  │   Monitor    ││
│  └──────────────┘  └──────────────┘│
└─────────────────────────────────────┘
```

### Navigation Flow

1. **Main Landing** (`/`)
   - Choose between Dashboard or Classroom Monitor
   - Beautiful, professional interface

2. **Dashboard** (`/login` → `/admin`, `/teacher`, `/student`)
   - Login with any name and select role
   - Access role-specific features and analytics

3. **Classroom Monitor** (`/classroom`)
   - Live teacher validation
   - Student engagement detection
   - Real-time AI analysis

## 🔐 Demo Credentials

The dashboard uses demo authentication. Use any name with these roles:

### Administrator
- **Name**: Any name (e.g., "Principal Smith")
- **Role**: Administrator
- **Access**: Full system overview, teacher oversight, alerts

### Teacher
- **Name**: Any name (e.g., "Dr. Johnson")  
- **Role**: Teacher
- **Access**: Class analytics, student performance tracking

### Student
- **Name**: Any name (e.g., "Alex Thompson")
- **Role**: Student
- **Access**: Personal dashboard, interest tracking, progress

## 📡 Backend Services

### Backend API Server (Port 5000)
- **Purpose**: Main Express.js API for data management
- **Endpoints**: User data, analytics, reports
- **Status**: Auto-starts with unified app

### Roboflow Proxy (Port 4000)
- **Purpose**: Proxy for Roboflow AI object detection
- **Usage**: Powers classroom visual detection
- **Status**: Auto-starts with unified app

## 🏗️ Project Structure

```
GDG_Hack/
├── backend/                    # Backend services
│   ├── server.js              # Main API server
│   └── roboflow-proxy.js      # AI proxy
│
├── gdg_hack_report/           # Unified Frontend Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── MainLanding.jsx        # Main entry page
│   │   │   ├── ClassroomMonitor.jsx   # Integrated classroom
│   │   │   ├── LoginPage.jsx          # Dashboard login
│   │   │   ├── admin/                 # Admin dashboards
│   │   │   ├── teacher/               # Teacher dashboards
│   │   │   └── student/               # Student dashboards
│   │   ├── components/        # Shared components
│   │   └── context/          # Auth and state management
│   └── vite.config.js        # Proxy configuration
│
├── start-unified.sh          # Unified startup script
└── UNIFIED_DEPLOYMENT.md     # This file
```

## 🔄 How Integration Works

### 1. Single Port Access
- All features accessible through port 5173
- Vite proxy forwards API requests to backend services
- Seamless communication between frontend and backend

### 2. Unified Navigation
- Main landing page serves as entry point
- React Router handles all navigation
- No need to switch between ports

### 3. Backend Integration
- Vite proxies `/api` requests to port 5000
- Vite proxies `/roboflow` requests to port 4000
- Frontend makes requests as if everything is on the same port

## 📊 Technology Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router v6
- **Styling**: TailwindCSS
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **AI/ML**: Roboflow API integration

## 🎨 Key Features by Module

### Dashboard Features
- ✅ Role-based access control
- ✅ Real-time analytics and metrics
- ✅ Interactive charts and visualizations
- ✅ 75% performance logic implementation
- ✅ Alert system for performance monitoring
- ✅ Teacher rankings and oversight
- ✅ Student interest tracking
- ✅ Career path predictions

### Classroom Monitor Features
- ✅ Voice-to-text transcription
- ✅ AI-powered topic validation
- ✅ Similarity score calculation
- ✅ Video-based engagement detection
- ✅ Real-time feedback
- ✅ Roboflow AI integration

## 🚀 Deployment Options

### Development (Current)
```bash
./start-unified.sh
# Access: http://localhost:5173
```

### Production Build
```bash
# Build the unified app
cd gdg_hack_report
npm run build

# Preview production build
npm run preview
```

### Docker Deployment (Future)
The structure supports containerization:
```dockerfile
# All services can be containerized
- Backend container
- Proxy container  
- Frontend container (Nginx)
```

## 📝 Development Notes

### Adding New Features
1. Backend changes go in `/backend`
2. Frontend pages go in `/gdg_hack_report/src/pages`
3. Shared components in `/gdg_hack_report/src/components`

### Proxy Configuration
Edit `gdg_hack_report/vite.config.js` to add new backend routes:
```javascript
proxy: {
  '/api': 'http://localhost:5000',
  '/roboflow': 'http://localhost:4000',
  // Add more as needed
}
```

### Routing
Add new routes in `gdg_hack_report/src/App.jsx`:
```javascript
<Route path="/new-feature" element={<NewFeature />} />
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:5000 | xargs kill -9
lsof -ti:4000 | xargs kill -9  
lsof -ti:5173 | xargs kill -9
```

### Backend Not Responding
```bash
# Restart backend services
cd backend
npm start
npm run proxy
```

### Frontend Build Issues
```bash
cd gdg_hack_report
rm -rf node_modules
npm install
npm run dev
```

## 📚 Additional Resources

- [Original HOW_TO_RUN.md](./HOW_TO_RUN.md) - Original multi-port setup
- [Dashboard QUICKSTART.md](./gdg_hack_report/QUICKSTART.md) - Dashboard features
- [Dashboard LOGIN_GUIDE.md](./gdg_hack_report/LOGIN_GUIDE.md) - Authentication guide

## 🎉 Success!

Your EduPulse AI platform is now unified and ready to use!

**Main Access Point**: http://localhost:5173

From there, you can:
- Navigate to Dashboard for analytics
- Access Classroom Monitor for live tracking
- All backend services work seamlessly in the background

---

**Built for GDG Hackathon 2026** | Powered by AI & Modern Web Technologies
