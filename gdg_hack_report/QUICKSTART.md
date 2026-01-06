# EduPulse AI - Quick Start Guide

## 🎯 Setup Instructions

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start Development Server
```bash
npm run dev
```

This will open `http://localhost:3000` in your browser.

## 🔐 Demo Credentials

The app uses a simple demo authentication system. Use any name and select a role:

### Admin User
- **Name**: Any name (e.g., "Principal Smith")
- **Role**: Administrator
- **Access**: School-wide dashboard, teacher oversight, alerts

### Teacher User
- **Name**: Any name (e.g., "Dr. Johnson")
- **Role**: Teacher
- **Access**: Class analytics, student performance, engagement tracking

### Student User
- **Name**: Any name (e.g., "Alex Thompson")
- **Role**: Student
- **Access**: Personal dashboard, interest tracking, career predictions

## 📊 Exploring the Application

### 1. Login Page Features
- Clean, professional interface
- Role selection with descriptions
- Real-time validation
- Demo tip for first-time users

### 2. Admin Portal
**Path**: `/admin`
- **Dashboard**: Overview of all metrics
- **Teacher Oversight**: Rankings, performance tracking
- **System Report**: School efficiency, trends
- **Alerts**: Performance alerts with severity levels

### 3. Teacher Portal
**Path**: `/teacher`
- **Dashboard**: Current lecture metrics
- **Class Analytics**: Focus distribution (On-Topic vs Off-Topic)
- **Student Interests**: Engagement heatmap
- **Engagement Tracker**: Individual student capability

### 4. Student Portal
**Path**: `/student`
- **Dashboard**: Attendance & engagement progress
- **Interest Radar**: Multi-subject interest visualization
- **Future Capability**: Career path recommendations
- **Progress Tracker**: Academic performance trends

## 💡 Key Features Demonstrated

### 75% Logic Implementation
- **Teachers**: Classified as "Exemplary" if ≥75% on-topic
- **Students**: Marked "Active" if ≥75% present and engaged
- **Alerts**: Automatic flags for below-threshold performance

### Mock Data Highlights
- 3 teachers with varying performance levels
- 5 students with different engagement profiles
- Realistic engagement metrics and attendance records
- Career compatibility predictions

### UI/UX Excellence
- Responsive design (mobile, tablet, desktop)
- Professional color scheme (Blues, Greens, Slates)
- Interactive charts (Recharts)
- Smooth navigation and transitions
- Loading states and feedback

## 🛠️ Customization Guide

### Change Color Scheme
Edit `tailwind.config.js`:
```javascript
extend: {
  colors: {
    'edu-blue': '#1e40af',
    'edu-green': '#059669',
    // Add your colors here
  },
}
```

### Modify Mock Data
Edit `src/utils/mockData.js` to:
- Add/remove teachers and students
- Change performance metrics
- Update interest levels
- Modify alert thresholds

### Add New Pages
1. Create component in appropriate folder (`src/pages/admin|teacher|student/`)
2. Add route in `App.jsx`
3. Update sidebar navigation in `Sidebar.jsx`

## 📈 Performance Metrics Guide

### Teacher Metrics
- **On-Topic %**: Percentage of lecture focused on main topic
- **Curriculum Coverage**: Percentage of curriculum objectives met
- **Average Engagement**: Student engagement level during class

### Student Metrics
- **Attendance %**: Days present vs total class days
- **Engagement %**: Active participation level
- **Interest Levels**: Subject-specific engagement (0-100%)
- **Future Capability**: Career compatibility scores

## 🔄 Workflow Examples

### Admin Workflow
1. Log in as Admin
2. View dashboard for school overview
3. Check teacher rankings
4. Review system report for trends
5. Manage alerts for performance issues

### Teacher Workflow
1. Log in as Teacher
2. View current class analytics
3. Check student interest heatmap
4. Track individual engagement levels
5. Plan improvements based on data

### Student Workflow
1. Log in as Student
2. Check personal dashboard
3. View interest radar for self-awareness
4. Explore future capability predictions
5. Track progress over time

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill the process using port 3000
# Windows: netstat -ano | findstr :3000
# Then use: taskkill /PID <PID> /F
```

### Dependencies Not Installing
```bash
# Clear npm cache
npm cache clean --force

# Reinstall
npm install
```

### Build Errors
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
npm run dev
```

## 📚 Learning Resources

- [React Docs](https://react.dev)
- [React Router](https://reactrouter.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Recharts](https://recharts.org)
- [Lucide Icons](https://lucide.dev)

## ✅ Checklist for Deployment

- [ ] Replace mock data with real API calls
- [ ] Implement backend authentication
- [ ] Add environment variables
- [ ] Optimize bundle size
- [ ] Add error boundaries
- [ ] Implement error logging
- [ ] Add loading states
- [ ] Optimize performance
- [ ] Test on multiple browsers
- [ ] Add unit tests

---

**Happy Coding! 🚀**
