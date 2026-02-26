# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SocialDoctors is a micro-SaaS marketplace platform that integrates 10+ independent SaaS products under a unified authentication system with an affiliate/partner revenue-sharing model. The concept is "Business Clinic" - diagnosing business/agricultural/lifestyle problems and prescribing appropriate SaaS solutions.

**Current Status:** MVP deployed to production. Frontend deployed on Vultr (Coolify). See `prd.md` for complete product requirements.

## Technical Stack

### Frontend (Production)
- **Framework:** Next.js 16.0.8 with App Router (Turbopack)
- **Styling:** Tailwind CSS + Framer Motion for animations/interactions
- **UI Components:** Shadcn/ui for modern, clean components
- **Authentication:** NextAuth.js (Google OAuth)
- **Build Mode:** Standalone output for Docker optimization
- **Deployment:** Vultr + Coolify (Docker containers)

### Backend
- **Server:** Node.js (NestJS) or Python (FastAPI) with microservices architecture consideration
- **Database:** PostgreSQL for relational data (users, payments, partner data)
- **Authentication:** NextAuth.js / session-based
- **Deployment:** Vultr + Coolify

### Integrations
- **Payment:** PG integration with webhook receiver for payment event tracking (planned)
- **Social Media:** Meta Graph API for Facebook automated posting (planned)
- **AI:** Google Gemini API for content generation and service curation
- **Project Management:** Plane integration for issue tracking

### Infrastructure
- **Platform:** Vultr (Ubuntu 24.04, 8GB RAM, 150GB SSD)
- **Container Runtime:** Docker 29.2.1
- **Deployment Platform:** Coolify (self-hosted PaaS)
- **Reverse Proxy:** nginx
- **CI/CD:** GitHub Actions (SSH direct deploy)
- **Domain:** socialdoctors.kr

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

### Vultr SSH Deployment (Manual)
```bash
# SSH into Vultr server
ssh root@158.247.235.31

# Pull latest code and rebuild
cd /opt/socialdoctors-nextjs
git pull origin main
docker build -f frontend/Dockerfile.production -t socialdoctors-nextjs ./frontend
docker stop socialdoctors-nextjs && docker rm socialdoctors-nextjs
docker run -d --name socialdoctors-nextjs \
  --network socialdoctors_internal \
  -p 3110:3000 \
  --env-file /opt/socialdoctors-nextjs/.env.production \
  socialdoctors-nextjs
```

### GitHub Actions (Automatic)
- Push to `main` branch triggers automatic deployment via SSH
- Workflow: `.github/workflows/deploy.yml`

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

## Vultr Deployment Guide

### Production Environment
- **Server IP:** 158.247.235.31 (Vultr, Ubuntu 24.04)
- **Domain:** socialdoctors.kr
- **Management:** Coolify (self-hosted PaaS)
- **Rails App:** socialdoctors-web → port 3100 → socialdoctors.kr
- **Next.js App:** socialdoctors-nextjs → port 3110 → app.socialdoctors.kr (or subdomain)

### Server Architecture

```
socialdoctors.kr
      ↓
   nginx (reverse proxy)
      ↓
  ┌─────────────────────────────┐
  │  Docker containers          │
  │  ├── socialdoctors-web:3100 │  (Rails app)
  │  ├── socialdoctors-nextjs:3110 │  (Next.js)
  │  └── socialdoctors-db:5432  │  (PostgreSQL)
  └─────────────────────────────┘
       network: socialdoctors_internal
```

### Dockerfile Configuration

**`frontend/Dockerfile.production`:**

```dockerfile
FROM node:20-alpine AS base
# NOTE: No --platform flag needed (Vultr is linux/amd64 native)

# standalone output mode
# Set in next.config.ts: output: 'standalone'
```

### Production Environment Variables

**`/opt/socialdoctors-nextjs/.env.production` on server:**
```env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://socialdoctors:[PASSWORD]@socialdoctors-db:5432/socialdoctors_nextjs
GOOGLE_CLIENT_ID=[your-google-client-id]
GOOGLE_CLIENT_SECRET=[your-google-client-secret]
NEXTAUTH_SECRET=[your-nextauth-secret]
NEXTAUTH_URL=https://app.socialdoctors.kr
NEXT_PUBLIC_BASE_URL=https://app.socialdoctors.kr
WEBHOOK_SECRET=[your-webhook-secret]
ADMIN_PASSWORD=[your-admin-password]
META_APP_ID=[your-meta-app-id]
META_APP_SECRET=[your-meta-app-secret]
TOKEN_ENCRYPTION_KEY=[32-char-random-key]
SOCIAL_PULSE_API_KEY=[your-api-key]
FORCE_REAL_PUBLISH=1
NEXT_TELEMETRY_DISABLED=1
```

### GitHub Actions Integration

**Required Secrets (Settings → Secrets → Actions):**
```
VULTR_HOST=158.247.235.31
VULTR_USER=root
VULTR_SSH_KEY=[private SSH key content]
```

**Workflow File:** `.github/workflows/deploy.yml`

**Trigger:** Automatic deployment on push to `main` branch via SSH

### Database Setup

**PostgreSQL on `socialdoctors-db` container:**
```bash
# Create Next.js database (run once)
docker exec socialdoctors-db psql -U socialdoctors -c \
  "CREATE DATABASE socialdoctors_nextjs;"

# Run Prisma migrations
docker exec socialdoctors-nextjs npx prisma migrate deploy
```

### nginx Configuration

**`/etc/nginx/sites-available/socialdoctors`:**
```nginx
# Rails app
server {
    listen 80;
    server_name socialdoctors.kr www.socialdoctors.kr;
    location / { proxy_pass http://localhost:3100; }
}

# Next.js app
server {
    listen 80;
    server_name app.socialdoctors.kr;
    location / { proxy_pass http://localhost:3110; }
}
```

### Common Issues & Solutions

#### 1. Container network access
**Problem:** Next.js can't connect to `socialdoctors-db`
**Solution:** Run container with `--network socialdoctors_internal`

#### 2. Prisma migrations on deploy
**Problem:** Schema changes not applied
**Solution:** Run `docker exec socialdoctors-nextjs npx prisma migrate deploy` after deploy

### Monitoring & Debugging

**Check Application Logs:**
```bash
# SSH into server
ssh root@158.247.235.31

# View Next.js logs
docker logs socialdoctors-nextjs --tail 100 -f

# View nginx logs
tail -f /var/log/nginx/access.log
```

**Health Check:**
```bash
curl -I http://158.247.235.31:3110
# Should return HTTP 200 OK
```
