# PM-AJAY Agency Mapping System - Setup Guide

## 🚀 Quick Start (Recommended)

### Option 1: Using the Startup Scripts

**For Windows:**
```bash
# Double-click start.bat or run in Command Prompt
start.bat
```

**For Mac/Linux:**
```bash
# Make the script executable and run
chmod +x start.sh
./start.sh
```

### Option 2: Manual Setup

1. **Install all dependencies:**
```bash
npm run install-all
```

2. **Start both servers:**
```bash
npm run dev
```

### Option 3: Individual Setup

**Backend (Terminal 1):**
```bash
cd backend
npm install
npm start
```

**Frontend (Terminal 2):**
```bash
cd frontend
npm install
npm run dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm (comes with Node.js)

## 🔧 Troubleshooting

### Port Already in Use
If you get "port already in use" errors:

**For Backend (Port 5000):**
```bash
# Kill process using port 5000
npx kill-port 5000
```

**For Frontend (Port 3000):**
```bash
# Kill process using port 3000
npx kill-port 3000
```

### Database Issues
If you encounter database errors:
1. Delete `backend/pm_ajay.db` file
2. Restart the backend server
3. The database will be recreated with sample data

### Dependencies Issues
If you have dependency conflicts:
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## 📱 Testing the Application

### 1. Home Page
- Navigate to http://localhost:3000
- Verify hero section loads with animations
- Check responsive design on different screen sizes

### 2. Agency Mapping
- Click "Agencies" in navigation
- Test adding new agencies
- Test editing and deleting agencies
- Test search and filter functionality

### 3. Fund Tracker
- Click "Fund Tracker" in navigation
- View fund allocation and utilization
- Test adding new fund records
- Check progress bars and charts

### 4. Communication Hub
- Click "Communication" in navigation
- Create new tasks between agencies
- Test task status updates
- Check priority and deadline features

### 5. Reports Dashboard
- Click "Reports" in navigation
- View various charts and metrics
- Check data visualization
- Verify real-time updates

## 🎯 Key Features to Test

### ✅ Agency Management
- [ ] Add new agency
- [ ] Edit existing agency
- [ ] Delete agency
- [ ] Search agencies
- [ ] Filter by type

### ✅ Fund Tracking
- [ ] Add fund record
- [ ] Update fund utilization
- [ ] View progress bars
- [ ] Filter by status
- [ ] Currency formatting

### ✅ Communication Hub
- [ ] Create task
- [ ] Assign to agency
- [ ] Update task status
- [ ] Set priority levels
- [ ] Check overdue tasks

### ✅ Reports Dashboard
- [ ] View key metrics
- [ ] Interactive charts
- [ ] Data visualization
- [ ] Performance summaries

## 🔍 API Testing

You can test the API endpoints directly:

### Get All Agencies
```bash
curl http://localhost:5000/api/agencies
```

### Get Dashboard Stats
```bash
curl http://localhost:5000/api/dashboard/stats
```

### Create New Agency
```bash
curl -X POST http://localhost:5000/api/agencies \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Agency","type":"Implementing","location":"Test City","role":"Test Role","contact":"test@example.com"}'
```

## 📊 Sample Data

The application comes with pre-loaded sample data:

### Agencies (4 records)
- Ministry of Rural Development
- State Rural Development Department - Maharashtra
- District Collector - Pune
- NGO - Rural Development Society

### Funds (3 records)
- Rural Housing (Maharashtra) - ₹50M allocated, ₹25M used
- Rural Infrastructure (Gujarat) - ₹75M allocated, ₹45M used
- Skill Development (Karnataka) - ₹30M allocated, ₹15M used

### Tasks (2 records)
- Complete Phase 1 Infrastructure (Pending)
- Submit Progress Report (Completed)

## 🎨 Design Features

### Responsive Design
- Mobile-first approach
- Breakpoints: 320px, 768px, 1024px
- Touch-friendly interface

### Animations
- Framer Motion animations
- Hover effects
- Page transitions
- Loading states

### Color Scheme
- Primary: #0057A3 (Government Blue)
- Secondary: #E6F3FF (Light Blue)
- Success: #10B981 (Green)
- Warning: #F59E0B (Yellow)
- Error: #EF4444 (Red)

## 🚀 Production Deployment

For production deployment:

1. **Build the frontend:**
```bash
cd frontend
npm run build
```

2. **Serve static files:**
```bash
# Serve the dist folder with a static server
npx serve -s dist
```

3. **Database considerations:**
- Consider using PostgreSQL or MySQL for production
- Add proper authentication and authorization
- Implement data validation and sanitization

## 📞 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure ports 3000 and 5000 are available
4. Check the README files in backend/ and frontend/ directories

## 🎉 Success!

Once everything is running, you should see:
- A modern, responsive PM-AJAY website
- Working navigation between all pages
- Functional CRUD operations
- Interactive charts and visualizations
- Task-based communication system
- Real-time data updates

**Enjoy exploring the PM-AJAY Agency Mapping System!** 🚀
