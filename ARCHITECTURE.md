# EduPulse AI - System Architecture

## 🏗️ Unified Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                               │
│                                                                 │
│              http://localhost:5173                              │
│                  (Single Entry Point)                           │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│               VITE DEV SERVER (Port 5173)                       │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              React Application (SPA)                      │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │          MainLanding (/)                           │  │  │
│  │  │  ┌──────────────┐      ┌──────────────────┐       │  │  │
│  │  │  │  Dashboard   │      │  Classroom       │       │  │  │
│  │  │  │  Analytics   │      │  Monitor         │       │  │  │
│  │  │  │  (/login)    │      │  (/classroom)    │       │  │  │
│  │  │  └──────────────┘      └──────────────────┘       │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  │                                                           │  │
│  │  ┌──────────────────┐  ┌────────────────────────────┐   │  │
│  │  │ Admin Dashboard  │  │  ClassroomMonitor         │   │  │
│  │  │ (/admin/*)       │  │  - Teacher Validation     │   │  │
│  │  ├──────────────────┤  │  - Student Detection      │   │  │
│  │  │ Teacher Portal   │  │  - Live Feedback          │   │  │
│  │  │ (/teacher/*)     │  └────────────────────────────┘   │  │
│  │  ├──────────────────┤                                   │  │
│  │  │ Student Portal   │                                   │  │
│  │  │ (/student/*)     │                                   │  │
│  │  └──────────────────┘                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│              Vite Proxy Configuration                           │
│  ┌─────────────────────┐      ┌───────────────────────┐        │
│  │  /api → :5000       │      │  /roboflow → :4000    │        │
│  └─────────────────────┘      └───────────────────────┘        │
└────────────┬────────────────────────────┬───────────────────────┘
             │                            │
             ▼                            ▼
┌────────────────────────┐   ┌───────────────────────────┐
│  Backend API Server    │   │  Roboflow Proxy Server    │
│  (Port 5000)           │   │  (Port 4000)              │
│                        │   │                           │
│  - User Management     │   │  - AI Object Detection    │
│  - Analytics Data      │   │  - Image Processing       │
│  - Reports API         │   │  - Roboflow API Bridge    │
│  - Authentication      │   │                           │
└────────────────────────┘   └───────────────────────────┘
```

## 🔄 Request Flow

### Dashboard Access Flow
```
User visits http://localhost:5173
    ↓
Vite serves React app
    ↓
User clicks "EduPulse AI Dashboard"
    ↓
Navigates to /login (client-side routing)
    ↓
User logs in with role selection
    ↓
React Router directs to appropriate dashboard
    ↓
Dashboard makes API calls to /api/*
    ↓
Vite proxy forwards to localhost:5000
    ↓
Backend API responds with data
    ↓
Dashboard displays analytics
```

### Classroom Monitor Flow
```
User visits http://localhost:5173
    ↓
Vite serves React app
    ↓
User clicks "Live Classroom Monitor"
    ↓
Navigates to /classroom (client-side routing)
    ↓
User starts teacher validation
    ↓
App captures audio/video
    ↓
Makes request to /roboflow/*
    ↓
Vite proxy forwards to localhost:4000
    ↓
Roboflow proxy processes with AI
    ↓
Returns detection results
    ↓
Classroom Monitor displays live feedback
```

## 📦 Component Structure

```
gdg_hack_report/src/
│
├── App.jsx                      # Main app with unified routing
│   ├── Route: /                 # MainLanding component
│   ├── Route: /login            # LoginPage component
│   ├── Route: /classroom        # ClassroomMonitor component
│   ├── Route: /admin/*          # Admin routes
│   ├── Route: /teacher/*        # Teacher routes
│   └── Route: /student/*        # Student routes
│
├── pages/
│   ├── MainLanding.jsx          # NEW: Unified entry page
│   ├── ClassroomMonitor.jsx     # NEW: Integrated from frontend
│   ├── LoginPage.jsx            # Dashboard authentication
│   ├── admin/                   # Admin dashboard pages
│   ├── teacher/                 # Teacher dashboard pages
│   └── student/                 # Student dashboard pages
│
├── components/
│   ├── Sidebar.jsx              # Navigation sidebar
│   ├── StatCard.jsx             # Dashboard cards
│   ├── AlertBox.jsx             # Alert components
│   └── ProtectedRoute.jsx       # Route protection
│
└── context/
    └── AuthContext.jsx          # Authentication state
```

## 🌐 Network Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    External Services                        │
│                                                             │
│  ┌──────────────────┐       ┌──────────────────────┐      │
│  │  Roboflow API    │       │  MongoDB Atlas       │      │
│  │  (AI/ML Models)  │       │  (Optional Database) │      │
│  └──────────────────┘       └──────────────────────┘      │
└─────────────┬───────────────────────┬───────────────────────┘
              │                       │
              ▼                       ▼
┌─────────────────────────────────────────────────────────────┐
│              Local Development Environment                  │
│                                                             │
│  Backend Services:        Frontend Application:            │
│  • Port 5000 (API)        • Port 5173 (Vite + React)       │
│  • Port 4000 (Proxy)      • Unified Entry Point            │
│                           • Client-side Routing            │
│                           • Proxy to Backend               │
└─────────────────────────────────────────────────────────────┘
```

## 🔑 Key Integration Points

### 1. Vite Proxy (vite.config.js)
```javascript
proxy: {
  '/api': {
    target: 'http://localhost:5000',
    changeOrigin: true,
  },
  '/roboflow': {
    target: 'http://localhost:4000',
    changeOrigin: true,
  }
}
```

### 2. React Router (App.jsx)
```javascript
<Routes>
  <Route path="/" element={<MainLanding />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/classroom" element={<ClassroomMonitor />} />
  <Route path="/admin/*" element={<AdminPortal />} />
  <Route path="/teacher/*" element={<TeacherPortal />} />
  <Route path="/student/*" element={<StudentPortal />} />
</Routes>
```

### 3. Backend Services
```javascript
// Backend API (server.js)
app.listen(5000)

// Roboflow Proxy (roboflow-proxy.js)
app.listen(4000)
```

## 🎯 Deployment Strategy

### Current (Development)
- 3 Node.js processes running locally
- Single browser entry point (http://localhost:5173)
- Vite dev server with HMR (Hot Module Replacement)

### Production (Future)
```
┌─────────────────────────────────────────┐
│            Nginx Reverse Proxy          │
│         (Single Public Domain)          │
└────────┬──────────────────┬─────────────┘
         │                  │
    ┌────▼─────┐      ┌────▼─────┐
    │ Frontend │      │ Backend  │
    │ (Static) │      │ (API)    │
    └──────────┘      └──────────┘
```

## 📊 Data Flow Example

### Teacher Validation Sequence
```
1. User clicks "Start Voice Validation" in ClassroomMonitor
2. Browser captures audio via Web API
3. Audio sent to /roboflow/validate endpoint
4. Vite proxy forwards to localhost:4000
5. Roboflow proxy processes with ML model
6. Returns similarity score and validation result
7. ClassroomMonitor updates UI with results
8. Data can be saved to backend via /api/save-validation
9. Vite proxy forwards to localhost:5000
10. Backend stores in database and responds
11. UI confirms save success
```

## 🔒 Security Considerations

- Demo authentication (replace with real auth in production)
- API endpoints should be protected with authentication
- CORS configured for local development
- Environment variables for API keys
- Proxy hides internal service ports from browser

## 🚀 Performance Optimizations

- Vite's fast HMR for development
- React lazy loading for code splitting
- Efficient re-renders with React hooks
- Optimized bundling for production build
- Service worker ready for PWA capabilities

---

**This unified architecture provides a seamless, professional experience while maintaining modularity and scalability.**
