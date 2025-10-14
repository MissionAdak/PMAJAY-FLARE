# PM-AJAY Deployment Guide

## 🚀 Deploy to Vercel

### Option 1: Deploy Frontend Only (Recommended for Demo)

1. **Go to [Vercel](https://vercel.com)**
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import your repository**: `MissionAdak/PM-AJAY`
5. **Configure the project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. **Click "Deploy"**

### Option 2: Deploy with Backend (Full Stack)

For a full-stack deployment, you'll need to:

1. **Deploy Backend to Railway/Render**:
   - Go to [Railway](https://railway.app) or [Render](https://render.com)
   - Connect your GitHub repository
   - Set root directory to `backend`
   - Deploy the Node.js application

2. **Update Frontend API URL**:
   - In `frontend/src/`, update all API calls to use your deployed backend URL
   - Replace `http://localhost:5000` with your deployed backend URL

3. **Deploy Frontend to Vercel**:
   - Follow Option 1 steps
   - Add environment variable: `VITE_API_URL=your-backend-url`

## 🌐 Environment Variables

### Frontend (.env)
```
VITE_API_URL=https://your-backend-url.railway.app
```

### Backend (.env)
```
NODE_ENV=production
PORT=5000
```

## 📁 Project Structure for Deployment

```
PM-AJAY/
├── frontend/          # Vercel deployment
│   ├── src/
│   ├── package.json
│   ├── vercel.json
│   └── build.sh
├── backend/           # Railway/Render deployment
│   ├── server.js
│   ├── package.json
│   └── README.md
└── README.md
```

## 🔧 Vercel Configuration

The project includes `vercel.json` configuration files:

- **Root vercel.json**: For full-stack deployment
- **frontend/vercel.json**: For frontend-only deployment

## 🎯 Quick Deploy Commands

### Frontend Only
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from frontend directory
cd frontend
vercel --prod
```

### Full Stack
```bash
# Deploy frontend
cd frontend
vercel --prod

# Deploy backend (Railway/Render)
cd backend
# Follow Railway/Render deployment steps
```

## 📱 Post-Deployment

After deployment:

1. **Test all features**:
   - Agency management
   - Fund tracking
   - Communication hub
   - Reports dashboard

2. **Update API endpoints** if using separate backend

3. **Configure custom domain** (optional)

## 🚨 Important Notes

- **Database**: SQLite won't work in production. Consider using PostgreSQL or MongoDB
- **CORS**: Backend CORS is configured for localhost. Update for production domains
- **Environment**: Set NODE_ENV=production for backend
- **Security**: Add authentication and input validation for production use

## 🔗 Live Demo

Once deployed, your PM-AJAY system will be available at:
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-backend.railway.app` (if deployed separately)

## 📞 Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variables
3. Test API endpoints
4. Check browser console for errors

---

**Your PM-AJAY Agency Mapping System is now ready for deployment!** 🎉
