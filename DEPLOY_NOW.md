# 🚀 Deploy EduPulse AI to Vercel

## One-Click Deployment

The easiest way to deploy EduPulse AI is through Vercel's GitHub integration:

### Step 1: Go to Vercel
1. Visit [vercel.com](https://vercel.com)
2. Sign up or log in with your GitHub account

### Step 2: Import Project
1. Click **"Add New..."** → **"Project"**
2. Select **"Import Git Repository"**
3. Find and select: `arnab-maity007/Attendance-app`
4. Click **Import**

### Step 3: Configure Project
Use these settings:
- **Root Directory**: `gdg_hack_report`
- **Framework Preset**: Vite
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

### Step 4: Deploy!
Click **"Deploy"** and wait 1-2 minutes.

---

## Your Deployment URLs

After deployment, you'll get:
- **Production URL**: `https://attendance-app-[unique-id].vercel.app`
- **Preview URLs** for each branch

## Expected URLs (Example)
- Main App: `https://attendance-app-edupulse.vercel.app`
- Live Monitor: `https://attendance-app-edupulse.vercel.app/classroom`
- Admin Dashboard: `https://attendance-app-edupulse.vercel.app/admin`

---

## Alternative: CLI Deployment

If you prefer command line:

```bash
# Install Vercel CLI
npm install -g vercel

# Navigate to frontend folder
cd gdg_hack_report

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

---

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@school.edu | admin123 |
| Teacher | sarah.johnson@school.edu | teacher123 |
| Student | alex@student.edu | student123 |

---

## Features Available

✅ **Main Landing Page** (`/`)
- Overview of the system
- Live stats counter
- Navigation to all features

✅ **Live Classroom Monitor** (`/classroom`)
- Facial attendance scanning (simulated)
- Teacher voice monitoring (works offline!)
- Student engagement tracking
- Real-time session summary

✅ **Admin Dashboard** (`/admin`)
- School-wide analytics
- Teacher oversight
- Alert management

✅ **Teacher Dashboard** (`/teacher`)
- Current lecture analytics
- Performance trends

✅ **Student Dashboard** (`/student`)
- Personal progress
- Future capability predictions

---

## GitHub Repository

🔗 **https://github.com/arnab-maity007/Attendance-app**

All code has been pushed and is ready for deployment!
