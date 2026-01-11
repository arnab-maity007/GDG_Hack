# EduPulse AI - Smart Attendance & Classroom Monitoring System

<div align="center">


![EduPulse AI](https://img.shields.io/badge/EduPulse-AI-blue?style=for-the-badge&logo=graduation-cap)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)

**🎓 Intelligent Education Management System for Indian Schools (Class 1-10)**

[Live Demo](https://gdg-hack-lovat.vercel.app/classroom) | [Documentation](#features) | [Setup Guide](#quick-start)

</div>

---

## 🌟 Overview

EduPulse AI is a comprehensive classroom monitoring and smart attendance system designed specifically for Indian schools. It provides **offline-first** capabilities for facial recognition attendance, teacher topic monitoring, and student engagement tracking.

### 🎯 Problem Statement
Indian schools lack transparency in classroom analytics. There's no way to:
- Track if teachers are teaching the assigned curriculum
- Monitor student attention and engagement levels
- Predict student interests and future career paths
- Mark attendance automatically without manual effort

### 💡 Solution
EduPulse AI addresses all these challenges with a **100% offline-capable** system that works even in areas with poor internet connectivity.

---

## ✨ Features

### 📷 1. Facial Recognition Attendance
- **Automatic face detection** using classroom cameras
- **Works completely offline** - no internet required
- **Privacy-first design** - data stored locally
- Syncs to cloud when internet is available

### 🎤 2. Teacher Topic Monitoring
- **Real-time speech recognition** (works offline via Web Speech API)
- Validates if teacher is teaching the assigned curriculum topic
- Generates **on-topic percentage** and session reports
- Provides **improvement suggestions** and performance grades

### 🧠 3. Student Attentiveness Tracking
- **ML-powered behavior detection** (attentive, engaged, distracted)
- Tracks hand raises and participation
- Real-time engagement scoring
- **Future capability prediction** based on 6-12 months of data

### 📊 4. Multi-Role Dashboards
- **Admin Dashboard**: School-wide analytics and teacher oversight
- **Teacher Dashboard**: Current lecture analytics and performance trends
- **Student Dashboard**: Personal progress tracking and goals

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- Git installed
- Modern browser (Chrome/Edge recommended for speech recognition)

### Installation

```bash
# Clone the repository
git clone https://github.com/arnab-maity007/Attendance-app.git
cd Attendance-app

# Install all dependencies
npm run install:all

# Start development server
npm run dev
```

The application will be available at:
- **Frontend Dashboard**: http://localhost:5173
- **Backend API**: http://localhost:5000

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | admin123 |
| Teacher | sarah.johnson@school.edu | teacher123 |
| Student | alex@student.edu | student123 |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     EduPulse AI System                       │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │   Camera    │  │ Microphone  │  │   Behavior Sensor   │  │
│  │   Input     │  │   Input     │  │   (ML Detection)    │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│  ┌──────▼──────┐  ┌──────▼──────┐  ┌──────────▼──────────┐  │
│  │   Face      │  │   Speech    │  │   Student           │  │
│  │ Recognition │  │ Recognition │  │ Attentiveness       │  │
│  │  Service    │  │  Service    │  │    Service          │  │
│  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
│         │                │                     │             │
│         └────────────────┼─────────────────────┘             │
│                          │                                   │
│                   ┌──────▼──────┐                            │
│                   │  IndexedDB  │  (Offline Storage)         │
│                   │   + Local   │                            │
│                   │   Storage   │                            │
│                   └──────┬──────┘                            │
│                          │                                   │
│                   ┌──────▼──────┐                            │
│                   │   Backend   │  (Express.js API)          │
│                   │    API      │  (Sync when online)        │
│                   └─────────────┘                            │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
Attendance-app/
├── gdg_hack_report/          # Main React Frontend (Vite)
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   │   ├── admin/        # Admin dashboard pages
│   │   │   ├── teacher/      # Teacher dashboard pages
│   │   │   └── student/      # Student dashboard pages
│   │   ├── services/         # Business logic services
│   │   │   ├── AttendanceService.js
│   │   │   ├── TeacherMonitoringService.js
│   │   │   ├── StudentAttentivenessService.js
│   │   │   └── LiveDataService.js
│   │   ├── context/          # React Context providers
│   │   └── utils/            # Utility functions
│   └── public/               # Static assets
├── backend/                  # Express.js Backend
│   └── server.js             # API endpoints
├── frontend/                 # Original React app (legacy)
└── ML/                       # Machine Learning models
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/test` | Health check |
| GET | `/api/students` | List all students |
| POST | `/api/attendance` | Record attendance |
| GET | `/api/attendance` | Get attendance records |
| POST | `/api/teacher-sessions` | Record teacher session |
| POST | `/api/student-behavior` | Record behavior data |
| GET | `/api/alerts` | Get system alerts |
| GET | `/api/analytics/summary` | Get analytics summary |
| GET | `/api/analytics/trends` | Get trend data |
| GET | `/api/students/:id/future-capabilities` | Career predictions |

---

## 🛠️ Technology Stack

### Frontend
- **React 18** - UI framework
- **Vite 5** - Build tool
- **TailwindCSS** - Styling
- **Recharts** - Charts and visualizations
- **Lucide React** - Icons
- **React Router v6** - Navigation

### Backend
- **Node.js** - Runtime
- **Express.js** - API framework
- **MongoDB** (optional) - Database

### AI/ML Services
- **face-api.js** - Facial recognition
- **Web Speech API** - Speech recognition (offline)
- **Custom ML models** - Behavior detection

### Offline Capabilities
- **IndexedDB** - Client-side database
- **LocalStorage** - Quick data access
- **Service Workers** - Offline caching (PWA)

---

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Configure build settings:
   - **Root Directory**: `gdg_hack_report`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Deploy!

### Deploy Backend to Railway/Render

1. Connect repository
2. Set root directory to `backend`
3. Configure environment variables
4. Deploy!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**NOT LIKE US**

- Arnab Maity - ML and backend developer
- Mayank Jha - Full Stack developer
- Sahil - Full Stack Developer
- Umang - ML and Devops

---

## 🙏 Acknowledgments

- Google Developer Groups for hosting the hackathon
- React and Vite teams for amazing frameworks
- Open source community for various libraries

---

<div align="center">


[⬆ Back to Top](#edupulse-ai---smart-attendance--classroom-monitoring-system)

</div>
