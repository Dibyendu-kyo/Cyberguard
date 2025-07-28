# 🚀 Deployment Guide for Cyberguard

This guide covers how to deploy Cyberguard to various platforms.

## 📋 Pre-deployment Checklist

- [ ] All environment variables are set up
- [ ] Firebase project is configured
- [ ] Gemini API key is obtained
- [ ] Frontend builds successfully (`npm run build`)
- [ ] Backend starts without errors
- [ ] Database rules are configured in Firebase

## 🌐 Platform Deployment Options

### 1. Vercel (Recommended for Frontend)

#### Frontend Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy frontend
cd frontend
vercel

# Set environment variables in Vercel dashboard
# Add all REACT_APP_* variables from your .env file
```

#### Backend Deployment (Vercel Functions)
```bash
# Deploy backend as serverless functions
cd backend
vercel

# Set GEMINI_API_KEY in Vercel dashboard
```

### 2. Netlify (Alternative for Frontend)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
cd frontend
npm run build
netlify deploy --prod --dir=build

# Set environment variables in Netlify dashboard
```

### 3. Heroku (Full-stack)

#### Create Heroku Apps
```bash
# Install Heroku CLI first
heroku create cyberguard-app
heroku create cyberguard-api

# Deploy backend
cd backend
git init
heroku git:remote -a cyberguard-api
git add .
git commit -m "Initial backend deploy"
git push heroku main

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key_here

# Deploy frontend
cd ../frontend
# Update API URL in code to point to Heroku backend
heroku git:remote -a cyberguard-app
git add .
git commit -m "Initial frontend deploy"
git push heroku main
```

### 4. Railway (Modern Alternative)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up

# Set environment variables in Railway dashboard
```

### 5. DigitalOcean App Platform

1. Connect your GitHub repository
2. Configure build settings:
   - **Frontend**: Build command: `cd frontend && npm run build`
   - **Backend**: Build command: `cd backend && npm install`
3. Set environment variables in the dashboard
4. Deploy

## 🔧 Environment Variables for Production

### Frontend (.env)
```env
REACT_APP_FIREBASE_API_KEY=your_production_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### Backend (.env)
```env
GEMINI_API_KEY=your_production_gemini_key
PORT=5000
NODE_ENV=production
```

## 🔒 Security Considerations

### Firebase Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /leaderboard/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
                   request.auth.uid == resource.data.uid;
    }
  }
}
```

### CORS Configuration
Make sure your backend allows requests from your frontend domain:

```javascript
// In server.js
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend-domain.com'],
  credentials: true
};
app.use(cors(corsOptions));
```

## 📊 Performance Optimization

### Frontend Optimization
```bash
# Analyze bundle size
cd frontend
npm install -g webpack-bundle-analyzer
npm run build
npx webpack-bundle-analyzer build/static/js/*.js
```

### Backend Optimization
- Enable gzip compression
- Use PM2 for process management
- Implement caching for API responses

## 🔍 Monitoring & Analytics

### Add Error Tracking
```bash
# Install Sentry for error tracking
npm install @sentry/react @sentry/node
```

### Add Analytics
```bash
# Install Google Analytics
npm install react-ga4
```

## 🧪 Testing Before Deployment

```bash
# Run all tests
npm test

# Test production build locally
cd frontend
npm run build
npx serve -s build

# Test backend
cd backend
npm start
```

## 🚨 Troubleshooting Common Issues

### Build Failures
- Check Node.js version compatibility
- Clear npm cache: `npm cache clean --force`
- Delete node_modules and reinstall

### Environment Variable Issues
- Ensure all required variables are set
- Check variable names (REACT_APP_ prefix for frontend)
- Verify Firebase configuration

### CORS Errors
- Update CORS settings in backend
- Check if frontend URL is whitelisted

### Firebase Issues
- Verify Firebase project settings
- Check authentication providers
- Ensure Firestore rules allow access

## 📞 Support

If you encounter deployment issues:

1. Check the platform-specific documentation
2. Verify all environment variables are set correctly
3. Test locally before deploying
4. Check logs for specific error messages

---

**Happy Deploying! 🚀**