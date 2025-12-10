# Coolify Deployment Guide

## Server Information
- **Coolify Server**: 34.64.191.91
- **Repository**: https://github.com/myaji35/SocialDoctors-Mail-AI.git
- **Application Port**: 3030

## Deployment Steps

### 1. Access Coolify Dashboard
Navigate to: `http://34.64.191.91` and log in to your Coolify dashboard.

### 2. Create New Application
1. Click **"New Resource"** → **"Application"**
2. Select **"Public Repository"**
3. Enter repository URL: `https://github.com/myaji35/SocialDoctors-Mail-AI.git`
4. Branch: `main`
5. Build Pack: **Docker** (or **Node.js** if using buildpack)

### 3. Configure Build Settings

#### Using Dockerfile (Recommended)
- **Dockerfile Path**: `./Dockerfile`
- **Build Command**: (automatic with Docker)
- **Start Command**: (automatic with Docker)

#### Using Node.js Buildpack (Alternative)
- **Build Command**: `cd frontend && npm ci && npm run build`
- **Start Command**: `cd frontend && npm start`
- **Port**: `3030`

### 4. Set Environment Variables

Add the following environment variables in Coolify:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_b2JsaWdpbmctdGVhbC03OC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_RzKvIGWTJ8QIkAPNt3WqjdC2sORh3hDQNlo1pLxp0H

# Clerk URLs
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# Google Gemini API
GEMINI_API_KEY=AIzaSyBDjky7Xxv6eZF0iEnh_WFf0obzKWru73A

# Node Environment
NODE_ENV=production
```

### 5. Configure Port Mapping
- **Container Port**: `3030`
- **Public Port**: `80` or `443` (with SSL)

### 6. Deploy
Click **"Deploy"** to start the build and deployment process.

### 7. Verify Deployment
Once deployed, access your application at:
- HTTP: `http://34.64.191.91`
- Or your configured domain

## Troubleshooting

### Build Fails
- Check build logs in Coolify dashboard
- Ensure all environment variables are set correctly
- Verify Dockerfile path is correct

### Application Not Starting
- Check that port 3030 is correctly exposed
- Verify Node.js version compatibility (requires Node 20+)
- Check container logs for startup errors

### Authentication Issues
- Ensure Clerk environment variables are correctly set
- Verify Clerk dashboard has correct redirect URLs configured
- Check that `NEXT_PUBLIC_` prefixed variables are available in browser

### AI Chatbot Not Working
- Verify Gemini API key is correctly set
- Check API key has sufficient quota
- Review `/api/chat` endpoint logs

## Post-Deployment

### Update Clerk Redirect URLs
In your Clerk dashboard (https://dashboard.clerk.com):
1. Navigate to **"Paths"** settings
2. Add your production domain to authorized redirect URLs
3. Update sign-in and sign-up URLs if needed

### Monitor Application
- Check Coolify logs regularly
- Monitor API usage for Gemini API
- Set up alerts for application downtime

## Rolling Updates
For future deployments:
1. Push changes to GitHub repository
2. Coolify will auto-deploy (if auto-deploy enabled)
3. Or manually trigger deployment from Coolify dashboard

## Rollback
If deployment fails:
1. Go to Coolify dashboard
2. Select previous successful deployment
3. Click **"Redeploy"**
