# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

SocialDoctors is a micro-SaaS marketplace platform that integrates 10+ independent SaaS products under a unified authentication system with an affiliate/partner revenue-sharing model. The concept is "Business Clinic" - diagnosing business/agricultural/lifestyle problems and prescribing appropriate SaaS solutions.

**Current Status:** Planning phase - codebase not yet implemented. See `prd.md` for complete product requirements.

## Technical Stack (Planned)

### Frontend
- **Framework:** Next.js 14+ with App Router for SEO and performance
- **Styling:** Tailwind CSS + Framer Motion for animations/interactions
- **UI Components:** Shadcn/ui for modern, clean components

### Backend
- **Server:** Node.js (NestJS) or Python (FastAPI) with microservices architecture consideration
- **Database:** PostgreSQL for relational data (users, payments, partner data)
- **Authentication:** NextAuth.js or Keycloak for SSO implementation
- **Deployment:** Vercel (frontend) + AWS/Docker (backend)

### Integrations
- **Payment:** PG integration with webhook receiver for payment event tracking
- **Social Media:** Meta Graph API for Facebook automated posting
- **AI:** OpenAI API for content generation and service curation

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

**Note:** No commands available yet as codebase is not initialized. Once implemented, common commands will likely include:

- Build commands for Next.js frontend
- Database migration commands for PostgreSQL
- Test commands for both frontend and backend
- Development server startup commands
- Deployment commands for Vercel and AWS/Docker

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
