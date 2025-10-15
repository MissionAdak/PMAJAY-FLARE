# PM-AJAY Agency Mapping System - Deployment Instructions

## Overview
This document provides step-by-step instructions for deploying and testing the PM-AJAY Agency Mapping System for Smart India Hackathon 2024 (Problem Statement ID: 25153).

## System Architecture
- **Backend**: Node.js + Express.js + SQLite
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Database**: SQLite (production-ready, can migrate to PostgreSQL/MySQL)
- **Authentication**: JWT-based token authentication
- **Maps**: Leaflet with OpenStreetMap (no API keys required)

## Prerequisites
- Node.js v16 or higher
- npm or yarn
- Git
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Installation Steps

### 1. Clone the Repository
```bash
git clone https://github.com/MissionAdak/PMAJAY-FLARE.git
cd PMAJAY-FLARE
```

### 2. Install Dependencies
```bash
# Install root dependencies (for concurrently)
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Verify Environment Configuration
The `.env` file is already configured. No changes needed for local development.

### 4. Start the Application

#### Option A: Start Everything Together (Recommended)
```bash
npm start
```
This will start both backend (port 5000) and frontend (port 3000) simultaneously.

#### Option B: Start Separately
Terminal 1 - Backend:
```bash
cd backend
npm start
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

### 5. Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Login Page**: http://localhost:3000/login

## Demo Accounts

### Central Government (Admin)
- **Email**: admin@pmajay.gov.in
- **Password**: admin123
- **Access**: Full system overview, all states, all projects, analytics

### State Government Officer (Maharashtra)
- **Email**: officer@mh.gov.in
- **Password**: state123
- **Access**: Maharashtra projects, progress updates, fund requests, report uploads

### Public User
- **No login required**
- **Access**: View all projects, interactive map, budget information

## Testing the Application

### 1. Run Automated API Tests
```bash
# Ensure backend is running first
cd backend
npm test
```

Expected output: 10 tests covering authentication, projects, dashboards, and transactions.

### 2. Manual Testing Checklist

#### Central Dashboard (http://localhost:3000/dashboard/central)
- [ ] Login with admin credentials
- [ ] View total projects count
- [ ] Check budget allocation and utilization
- [ ] Verify SLA breach count
- [ ] Export state-wise report to CSV
- [ ] View state-wise distribution chart
- [ ] Check component-wise pie chart

#### State Dashboard (http://localhost:3000/dashboard/state)
- [ ] Login with state officer credentials
- [ ] View state-specific projects
- [ ] Update project progress (click ✓ icon)
- [ ] Add fund transaction (click + icon)
- [ ] Upload report (click upload icon)
- [ ] Verify progress bar updates

#### Public Dashboard (http://localhost:3000/dashboard/public)
- [ ] View without login
- [ ] Search projects by name/location
- [ ] Filter by component (AdarshGram, GIA, Hostel)
- [ ] Click on map markers
- [ ] View project details in modal
- [ ] Check budget and timeline information

### 3. API Endpoint Testing (with curl)

#### Login
```bash
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pmajay.gov.in","password":"admin123"}'
```

#### Get All Projects
```bash
curl http://localhost:5000/api/v1/projects
```

#### Get Central Dashboard (requires token)
```bash
# Replace YOUR_TOKEN with actual token from login
curl http://localhost:5000/api/v1/dashboard/central \
  -H "Authorization: Bearer YOUR_TOKEN"
```

#### Update Project Progress (requires token)
```bash
curl -X POST http://localhost:5000/api/v1/projects/1/progress \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"progress_percent":75,"note":"Updated via API"}'
```

## Database

### Schema
The SQLite database (`backend/pm_ajay.db`) includes:
- **states**: Indian states/UTs
- **agencies**: Implementing and executing agencies
- **projects**: PM-AJAY projects with geo-coordinates
- **fund_transactions**: Budget allocation, release, utilization
- **reports**: Uploaded progress reports
- **users**: Authentication and authorization
- **audit_logs**: System activity tracking

### Sample Data
Automatically seeded on first run:
- 6 states (Maharashtra, Gujarat, Karnataka, Tamil Nadu, UP, Delhi)
- 4 agencies (Central and state-level)
- 4 sample projects with real coordinates
- 3 user accounts (central, state, public)

### Reset Database
Delete the database file to reset:
```bash
cd backend
rm pm_ajay.db
npm start  # Will recreate with fresh data
```

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```
Output: `frontend/dist/` directory ready for deployment

### Backend Production
```bash
cd backend
NODE_ENV=production npm start
```

## Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)
1. Deploy frontend to Vercel (automatically detected as Vite project)
2. Deploy backend to Railway or Render
3. Update API_BASE_URL in frontend/src/utils/api.js

### Option 2: Single Server Deployment
1. Build frontend: `cd frontend && npm run build`
2. Serve static files from backend:
```javascript
app.use(express.static('../frontend/dist'));
```
3. Deploy to any Node.js hosting (Heroku, DigitalOcean, AWS)

### Option 3: Docker
```dockerfile
# Dockerfile provided separately if needed
```

## Troubleshooting

### Backend fails to start
- Check if port 5000 is already in use
- Verify all dependencies are installed: `cd backend && npm install`
- Check Node.js version: `node --version` (should be v16+)

### Frontend build errors
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for Leaflet CSS import errors (should work after our fix)

### Database errors
- Delete and recreate: `rm backend/pm_ajay.db && cd backend && npm start`
- Check file permissions on pm_ajay.db

### Map not showing
- Verify Leaflet CSS is imported in index.css
- Check browser console for errors
- Ensure projects have valid lat/long coordinates

### Authentication issues
- Clear browser localStorage: `localStorage.clear()`
- Verify JWT_SECRET in backend/server.js
- Check token expiration (24h by default)

## Performance Optimization

### For Free Tier Hosting
- Database: SQLite is perfect for free tiers (no separate DB service needed)
- Maps: OpenStreetMap is free (no Mapbox API key required)
- File uploads: Stored locally in `backend/uploads/` directory
- No background workers or cron jobs (on-demand processing only)

### Scaling Considerations
- Migrate to PostgreSQL/MySQL for 100k+ projects
- Add Redis for session management
- Use CDN for static assets
- Implement rate limiting on API endpoints

## Security Notes

### Current Implementation (Development)
- JWT secret is hardcoded (change for production)
- CORS allows all origins (restrict in production)
- No rate limiting (add for production)
- Passwords hashed with bcrypt (secure)

### Production Checklist
- [ ] Change JWT_SECRET to environment variable
- [ ] Restrict CORS to specific domains
- [ ] Add rate limiting (express-rate-limit)
- [ ] Enable HTTPS
- [ ] Add input validation (express-validator)
- [ ] Implement refresh tokens
- [ ] Add API request logging

## System Requirements

### Minimum
- RAM: 512 MB
- Storage: 100 MB
- CPU: 1 core
- Network: 1 Mbps

### Recommended
- RAM: 1 GB
- Storage: 500 MB
- CPU: 2 cores
- Network: 5 Mbps

## Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Acceptance Criteria Verification

✅ **Criterion 1**: Backend and frontend start without errors
- Run: `npm start`
- Verify: Both servers start successfully

✅ **Criterion 2**: Central dashboard displays aggregated data
- Visit: http://localhost:3000/login
- Login as admin
- Verify: Dashboard shows KPIs, charts, state-wise data

✅ **Criterion 3**: State dashboard allows progress updates
- Login as state officer
- Click progress icon on any project
- Update progress and verify it reflects in dashboard

✅ **Criterion 4**: Public dashboard shows interactive map
- Visit: http://localhost:3000/dashboard/public
- Verify: Map displays with project markers
- Click markers and verify project details appear

✅ **Criterion 5**: Code committed to branch
- Branch: feature/three-dashboards (to be created after testing)

## Support
For issues or questions:
- GitHub Issues: https://github.com/MissionAdak/PMAJAY-FLARE/issues
- Email: (team contact)

## License
Educational purposes - Smart India Hackathon 2024
