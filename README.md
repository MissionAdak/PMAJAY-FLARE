# PM-AJAY Agency Mapping System

A comprehensive platform for mapping and managing implementing and executing agencies across PM-AJAY components. Built for Smart India Hackathon 2024 (Problem Statement ID: 25153).

## Problem Statement
**Mapping of Implementing and Executing Agencies across PM-AJAY components**

This system provides three role-based dashboards for Central Government, State Government, and Public/Citizens to streamline PM-AJAY implementation and monitoring.

## Features

### Three Role-Based Dashboards

#### 1. Central Government Dashboard (Admin)
- Overview of all projects across states
- Fund flow monitoring with KPIs
- State-wise comparison charts
- SLA breach detection and alerts
- Export functionality for reports (CSV)
- Component-wise distribution analytics

#### 2. State Government Dashboard
- State-specific project management
- Update project progress in real-time
- Upload progress reports (PDF, images, documents)
- Request/accept fund releases
- View and manage executing agencies
- Track budget utilization

#### 3. Public/Citizen Dashboard
- Search projects by location, component, or keyword
- Interactive map with OpenStreetMap
- View project budgets and timelines
- Check project status and progress
- No authentication required

### Core Features
- **JWT-based Authentication**: Secure role-based access control
- **Interactive Maps**: Leaflet with OpenStreetMap (no API keys needed)
- **Fund Tracking**: Complete transaction history (allocated, released, utilized)
- **Progress Monitoring**: Real-time progress updates with SLA tracking
- **Audit Logging**: Complete system activity trail
- **Responsive Design**: Works on desktop, tablet, and mobile

## Tech Stack

### Frontend
- React 18 with Vite
- Tailwind CSS for styling
- Framer Motion for animations
- React Router DOM for navigation
- Recharts for data visualization
- Leaflet + React-Leaflet for maps
- Axios for API calls
- Lucide React for icons

### Backend
- Node.js with Express.js
- SQLite database (production-ready, can migrate to PostgreSQL/MySQL)
- JWT authentication with bcryptjs
- Multer for file uploads
- RESTful API architecture

## Quick Start

### Prerequisites
- Node.js v16 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/MissionAdak/PMAJAY-FLARE.git
cd PMAJAY-FLARE
```

2. **Install all dependencies**
```bash
npm run install-all
```

3. **Start the application**
```bash
npm start
```

This starts both backend (port 5000) and frontend (port 3000).

4. **Access the application**
- Frontend: http://localhost:3000
- Login Page: http://localhost:3000/login
- API: http://localhost:5000

## Demo Accounts

### Central Government Admin
```
Email: admin@pmajay.gov.in
Password: admin123
Dashboard: /dashboard/central
```
Full access to all data, analytics, and administrative functions.

### State Government Officer (Maharashtra)
```
Email: officer@mh.gov.in
Password: state123
Dashboard: /dashboard/state
```
Manage Maharashtra projects, update progress, upload reports, request funds.

### Public Access
```
No login required
Dashboard: /dashboard/public
```
View all projects, interactive map, public information.

## Project Structure
```
pm-ajay-system/
├── backend/
│   ├── server.js              # Main Express server
│   ├── test-api.js            # API smoke tests
│   ├── uploads/               # Uploaded reports storage
│   ├── pm_ajay.db            # SQLite database (auto-created)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── dashboards/       # Three main dashboards
│   │   ├── context/          # React context (Auth)
│   │   ├── utils/            # API utilities
│   │   ├── App.jsx           # Main app component
│   │   └── main.jsx          # Entry point
│   ├── dist/                 # Production build (generated)
│   └── package.json
├── README.md                  # This file
├── DEPLOYMENT_INSTRUCTIONS.md # Detailed deployment guide
└── package.json              # Root package for scripts
```

## Database Schema

### Tables
- **states**: Indian states/UTs (6 seeded)
- **agencies**: Implementing and executing agencies
- **projects**: PM-AJAY projects with geo-coordinates
- **fund_transactions**: Budget allocation, release, utilization
- **reports**: Uploaded progress reports with metadata
- **users**: Authentication and role management
- **audit_logs**: System activity tracking

### Sample Data
Automatically seeded on first run:
- 6 states (Maharashtra, Gujarat, Karnataka, Tamil Nadu, UP, Delhi)
- 4 agencies (Central and state-level)
- 4 sample projects with real coordinates
- 3 user accounts

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login (returns JWT)

### Projects
- `GET /api/v1/projects` - List all projects (with filters)
- `GET /api/v1/projects/:id` - Project details with transactions
- `POST /api/v1/projects/:id/progress` - Update progress (auth required)
- `POST /api/v1/projects/:id/funds` - Add fund transaction (auth required)

### Dashboards
- `GET /api/v1/dashboard/central` - Central govt KPIs (auth required)
- `GET /api/v1/dashboard/state/:stateId` - State KPIs (auth required)
- `GET /api/v1/dashboard/public` - Public dashboard data

### Master Data
- `GET /api/v1/states` - List all states
- `GET /api/v1/agencies` - List agencies (with filters)

### Reports
- `POST /api/v1/reports` - Upload report (multipart, auth required)

## Testing

### Run API Tests
```bash
cd backend
npm test
```

### Manual Testing
1. Start the application
2. Test each dashboard with respective credentials
3. Verify all CRUD operations
4. Check map functionality
5. Test file uploads
6. Verify authentication flows

### Test with curl
```bash
# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@pmajay.gov.in","password":"admin123"}'

# Get projects
curl http://localhost:5000/api/v1/projects

# Get central dashboard (replace TOKEN)
curl http://localhost:5000/api/v1/dashboard/central \
  -H "Authorization: Bearer TOKEN"
```

## Building for Production

### Frontend
```bash
cd frontend
npm run build
```
Output: `frontend/dist/` ready for deployment

### Backend
```bash
cd backend
NODE_ENV=production npm start
```

## Deployment

See [DEPLOYMENT_INSTRUCTIONS.md](./DEPLOYMENT_INSTRUCTIONS.md) for detailed deployment guide covering:
- Vercel/Railway deployment
- Docker containerization
- Database migration options
- Performance optimization
- Security hardening

## Key Features Implementation

### SLA Breach Detection
Automatically calculates expected progress based on project timeline:
```
Expected Progress = (Days Elapsed / Total Days) × 100
SLA Breach = Current Progress < (Expected Progress - 10%)
```

### Fund Flow Tracking
Three transaction types:
- **Allocated**: Budget assigned to project
- **Released**: Funds released to executing agency
- **Utilized**: Actual expenditure on project

### Interactive Maps
- OpenStreetMap tiles (no API keys required)
- Clustered markers for better performance
- Click markers for project details
- Filter by component or search term

### Responsive Design
- Mobile-first approach
- Breakpoints: 768px (tablet), 1024px (desktop)
- Touch-friendly controls
- Optimized for all screen sizes

## Technology Choices

### Why SQLite?
- No separate database server needed
- Perfect for free tier hosting
- Production-ready for 10k-100k records
- Easy migration path to PostgreSQL/MySQL

### Why OpenStreetMap?
- Completely free (no API keys)
- No usage limits
- Open-source community support
- High-quality map data for India

### Why JWT?
- Stateless authentication
- Scalable across servers
- Industry standard
- Easy to implement

## Performance Considerations

### Optimized for Free Tier Hosting
- Lightweight SQLite database
- No background workers
- Local file storage
- Efficient API queries
- Minimal dependencies

### Resource Usage
- RAM: ~200 MB (backend + frontend)
- Storage: ~50 MB (code + database)
- CPU: Minimal (<10% on single core)

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Security Features

### Implemented
✅ Password hashing with bcrypt (10 rounds)
✅ JWT token-based authentication
✅ Role-based access control
✅ SQL injection prevention (parameterized queries)
✅ CORS configuration
✅ Audit logging

### Production Recommendations
⚠️ Move JWT_SECRET to environment variable
⚠️ Add rate limiting
⚠️ Implement HTTPS
⚠️ Add input validation
⚠️ Restrict CORS origins
⚠️ Add refresh tokens

## Known Limitations

1. **File uploads**: Stored locally (use cloud storage for production)
2. **Concurrent users**: SQLite has write limitations (migrate to PostgreSQL for 100+ concurrent users)
3. **No email notifications**: Can be added with nodemailer
4. **No real-time updates**: WebSocket support can be added

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Email alerts for SLA breaches
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Mobile app (React Native)
- [ ] Offline mode with service workers
- [ ] Integration with payment gateways
- [ ] Automated report generation
- [ ] AI-powered insights

## Troubleshooting

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use different port
PORT=5001 npm start
```

### Database errors
```bash
# Reset database
rm backend/pm_ajay.db
cd backend && npm start
```

### Build errors
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

## Contributing

This project was built for Smart India Hackathon 2024. For issues or suggestions:
1. Open a GitHub issue
2. Provide detailed description
3. Include screenshots if applicable
4. Mention browser/OS details

## Acceptance Criteria Status

✅ **AC1**: Backend and frontend start without errors
✅ **AC2**: Central dashboard displays aggregated JSON data
✅ **AC3**: State dashboard allows posting progress updates
✅ **AC4**: Public dashboard displays interactive map with markers
✅ **AC5**: Code committed to feature branch
✅ **AC6**: README with exact run steps

## Team

Smart India Hackathon 2024 - Problem Statement 25153

## License

Educational purposes - Smart India Hackathon 2024

---

## Quick Reference

### Start Development
```bash
npm start
```

### Build Production
```bash
npm run build
```

### Run Tests
```bash
cd backend && npm test
```

### Reset Database
```bash
rm backend/pm_ajay.db && cd backend && npm start
```

### Access Points
- Home: http://localhost:3000
- Login: http://localhost:3000/login
- Central Dashboard: http://localhost:3000/dashboard/central
- State Dashboard: http://localhost:3000/dashboard/state
- Public Dashboard: http://localhost:3000/dashboard/public
- API Docs: See DEPLOYMENT_INSTRUCTIONS.md

---

**Built for Smart India Hackathon 2024 🇮🇳**
