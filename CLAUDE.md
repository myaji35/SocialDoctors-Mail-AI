# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SocialDoctors is a micro-SaaS marketplace platform that integrates 10+ independent SaaS products under a unified authentication system with an affiliate/partner revenue-sharing model. The concept is "Business Clinic" - diagnosing business/agricultural/lifestyle problems and prescribing appropriate SaaS solutions.

**Current Status:** MVP deployed to production. Frontend deployed on Dokploy. See `prd.md` for complete product requirements and `DEPLOYMENT_SUMMARY.md` for deployment details.

## Technical Stack

### Frontend (Production)
- **Framework:** Next.js 16.0.8 with App Router (Turbopack)
- **Styling:** Tailwind CSS + Framer Motion for animations/interactions
- **UI Components:** Shadcn/ui for modern, clean components
- **Authentication:** Clerk (SSO)
- **Build Mode:** Standalone output for Docker optimization
- **Deployment:** Dokploy (Docker containers on GCP)

### Backend
- **Server:** Node.js (NestJS) or Python (FastAPI) with microservices architecture consideration
- **Database:** PostgreSQL for relational data (users, payments, partner data)
- **Authentication:** Clerk for unified SSO
- **Deployment:** Dokploy (planned)

### Integrations
- **Payment:** PG integration with webhook receiver for payment event tracking (planned)
- **Social Media:** Meta Graph API for Facebook automated posting (planned)
- **AI:** Google Gemini API for content generation and service curation
- **Project Management:** Plane integration for issue tracking

### Infrastructure
- **Platform:** GCP linux/amd64
- **Container Runtime:** Docker
- **Deployment Platform:** Dokploy (open-source PaaS)
- **Reverse Proxy:** Traefik (via Dokploy)
- **CI/CD:** GitHub Actions
- **Domain Service:** nip.io (wildcard DNS)

## Architecture Principles

### 1. Single Sign-On (SSO) System
- One SocialDoctors account provides automatic login to all 10+ integrated SaaS services
- Unified dashboard shows subscription status across all services
- Authentication must be centralized and propagate to all sub-services

### 2. Partner/Affiliate Attribution System
- **Referral Tracking:** Store partner ID in browser cookie/localStorage (30-90 day validity)
- **Attribution Logic:** When user signs up, permanently attribute them to referring partner via `ReferredBy` field
- **Revenue Share:** Partners earn commission (e.g., 20%) on ANY service payment made by their referred users
- **LTV Model:** Commissions continue on subscription renewals, not just initial purchase

### 3. Core Data Models

**User (통합 회원)**
- UUID, Email, Password, Role (User/Partner/Admin), ReferredBy (PartnerUUID)

**Partner_Wallet (지갑/정산)**
- PartnerUUID, CurrentBalance, TotalEarned, TierLevel

**Transaction_Log (통합 결제 로그)**
- LogID, UserUUID, ServiceID (which SaaS), Amount, CommissionAmount, CreatedAt

**Social_Post_Queue (포스팅 대기열)**
- PostID, Content, ImageURL, Status (Pending/Published/Failed), TargetPlatform

### 4. Landing Page Structure
- **Hero Section:** 3D interactive objects or high-quality loop video background with primary SaaS value proposition
- **Service Grid:** Apple/Linear-style Bento Grid layout for showcasing all SaaS products with hover effects
- **AI Curator:** Floating chatbot (bottom-right) that recommends appropriate SaaS based on user input

### 5. Automation Features
- **Event Triggers:** Detect platform activities (new partner signup, large payment, new service launch)
- **AI Content Generation:** Use LLM to generate Facebook-optimized copy and card news images
- **Auto-Posting:** Publish to Facebook Page via Meta Graph API

## Development Commands

### Local Development
```bash
cd frontend
npm install
npm run dev          # Development server (localhost:3000)
npm run build        # Production build test
```

### Docker Build (Local Testing)
```bash
cd frontend
docker build -f Dockerfile.production -t socialdoctors-test .
docker run -p 3000:3000 socialdoctors-test
```

### Dokploy CLI Deployment
```bash
# Install community CLI (supports non-interactive mode)
npm install -g @sebbev/dokploy-cli

# Authenticate
dokploy-cli auth login --url http://34.64.143.114:3000 --token [TOKEN]

# Deploy
dokploy-cli app deploy \
  -p SVSYksCZ8lAr2Mdrg8902 \
  -e jn2nZM3RYvYrTczdn4Tdl \
  -a 4sc-UR-ll0dwt7DtoBECo \
  -y
```

### GitHub Actions (Automatic)
- Push to `main` branch triggers automatic deployment
- Workflow: `.github/workflows/dokploy-deploy.yml`

## Key Implementation Considerations

1. **Payment Webhook Listener:** Must collect payment data from all 10+ integrated SaaS services to calculate partner commissions accurately
2. **Cookie Tracking Privacy:** Ensure GDPR/privacy compliance for referral cookie tracking system
3. **SSO Security:** Implement secure token exchange between main platform and sub-services
4. **Commission Calculation:** Real-time commission calculation and wallet balance updates on every transaction
5. **Partner Dashboard:** Must provide real-time visualization of clicks, signups, payments, and commissionable amounts

## Business Context

- **Primary Target:** Marketers, influencers, local sales agents who want passive income through their networks
- **Secondary Target:** Small business owners, farmers, startup founders seeking easy-to-use tools
- **Strategy:** "Hero Product" approach - highlight 1-2 killer services to drive traffic, with other services benefiting from trickle-down effect
- **Korean Language:** Platform is designed for Korean market (see Korean text in PRD)

---

## Dokploy Deployment Guide

### Production Environment
- **URL:** http://socialdoctors.34.64.143.114.nip.io
- **Dashboard:** http://34.64.143.114:3000
- **Server:** GCP linux/amd64
- **Project ID:** SVSYksCZ8lAr2Mdrg8902
- **Environment ID:** jn2nZM3RYvYrTczdn4Tdl
- **Application ID:** 4sc-UR-ll0dwt7DtoBECo

### Dockerfile Configuration

**Key Settings for Next.js on Dokploy:**

```dockerfile
# MUST specify platform for cross-platform builds
FROM --platform=linux/amd64 node:20-alpine AS base

# MUST use standalone output mode
# Set in next.config.ts: output: 'standalone'

# MUST provide build-time environment variables
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_[your-key]
ENV NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=$NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
```

**File Location:** `frontend/Dockerfile.production`

### Dokploy Dashboard Settings

**Build Configuration:**
- **Build Type:** Dockerfile
- **Dockerfile Path:** `Dockerfile.production`
- **Docker Context Path:** `frontend`
- **Container Port:** 3000

**CRITICAL:** The build context must be the `frontend` folder, not project root!

### Environment Variables

**Set in Dokploy Environment Tab:**
```env
NODE_ENV=production
PORT=3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[your-key]
CLERK_SECRET_KEY=[your-secret]
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
GEMINI_API_KEY=[your-key]
PLANE_URL=http://34.158.192.195
PLANE_WORKSPACE=testgraph
PLANE_PROJECT_ID=SOCIA
NEXT_TELEMETRY_DISABLED=1
```

### Domain Configuration

**Using nip.io for IP-based subdomains:**
```
Host: socialdoctors.34.64.143.114.nip.io
Path: /
Container Port: 3000
HTTPS: OFF (enable later with SSL)
```

**Why nip.io?** IP addresses cannot have traditional subdomains. nip.io provides wildcard DNS that automatically resolves to the IP embedded in the domain name.

### GitHub Actions Integration

**Required Secrets (Settings → Secrets → Actions):**
```
DOKPLOY_URL=http://34.64.143.114:3000
DOKPLOY_TOKEN=[your-api-token]
DOKPLOY_APP_ID=4sc-UR-ll0dwt7DtoBECo
```

**Workflow File:** `.github/workflows/dokploy-deploy.yml`

**Trigger:** Automatic deployment on push to `main` branch

### Common Issues & Solutions

#### 1. "Clerk publishableKey missing" during build
**Problem:** `NEXT_PUBLIC_*` variables are bundled at build time, not runtime
**Solution:** Add real values to Dockerfile ARG defaults:
```dockerfile
ARG NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_[actual-test-key]
```

#### 2. "/app/public: not found" during Docker build
**Problem:** Docker context path mismatch
**Solution:** Set Context Path to `frontend` in Dokploy, not `.` or `/`

#### 3. "Github Provider not found"
**Problem:** GitHub not connected to Dokploy
**Solution:**
1. Dokploy Dashboard → Settings → Git Providers
2. Add GitHub → Authorize application
3. Grant repository access

#### 4. CLI "readline was closed" error
**Problem:** Official `@dokploy/cli` only supports interactive mode
**Solution:** Use community CLI `@sebbev/dokploy-cli` which supports `--yes` flag

#### 5. Cross-platform build issues (Apple Silicon → GCP)
**Problem:** Building on macOS arm64, deploying to linux/amd64
**Solution:** Always specify `--platform=linux/amd64` in Dockerfile FROM statement

### Best Practices

1. **Environment Variables:**
   - NEVER commit sensitive keys to git
   - Use Dokploy Environment Variables for runtime secrets
   - Use Dockerfile ARG defaults for build-time variables (with placeholder values)

2. **Docker Optimization:**
   - Use multi-stage builds
   - Use `.dockerignore` to exclude unnecessary files
   - Use `standalone` output mode in Next.js for minimal image size

3. **Build Context:**
   - Always set Docker Context Path to the folder containing package.json
   - For monorepos, context should be the app folder, not root

4. **Public Routes:**
   - Configure Clerk middleware to allow public access to home page
   - Use `createRouteMatcher` for public route patterns

5. **CI/CD:**
   - Use GitHub Actions for automatic deployments
   - Store all secrets in GitHub Secrets, never in workflow files
   - Add proper error handling in deployment scripts

### Monitoring & Debugging

**Check Application Logs:**
```bash
# Via Dokploy Dashboard
Logs tab → Real-time container logs

# Via CLI (if available)
dokploy-cli logs --app [APP_ID] --follow
```

**Check Build Logs:**
- Dokploy Dashboard → Deployments tab → Latest deployment → View logs

**Health Check:**
```bash
curl -I http://socialdoctors.34.64.143.114.nip.io
# Should return HTTP 200 OK
```

### Useful Resources

- **Dokploy Docs:** https://docs.dokploy.com
- **Deployment Summary:** See `DEPLOYMENT_SUMMARY.md` in repository
- **Quick Start Guide:** See `DOKPLOY_QUICKSTART.md` in repository
