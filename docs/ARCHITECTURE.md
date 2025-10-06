# forjustice.ca - System Architecture

## Overview

forjustice.ca is a scalable, cloud-native platform built to help Canadians access legal information and document generation services. The system is designed for high reliability, security, and scalability.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         Users / Clients                          │
│                    (Web, Mobile, API Consumers)                  │
└─────────────────────────────────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Load Balancer / CDN                           │
│                  (Cloud Run / Cloud CDN)                         │
└─────────────────────────────────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                ▼              ▼              ▼
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│   Web Frontend   │ │  Backend API     │ │  Worker Service  │
│    (Next.js)     │ │   (Express.js)   │ │   (Bull Queue)   │
│  Cloud Run       │ │  Cloud Run       │ │  Cloud Run       │
└──────────────────┘ └──────────────────┘ └──────────────────┘
         │                    │                     │
         │                    │                     │
         └────────────────────┼─────────────────────┘
                              │
                ┌─────────────┼─────────────┐
                ▼             ▼             ▼
┌──────────────────┐ ┌──────────────┐ ┌──────────────┐
│  Cloud SQL       │ │    Redis     │ │ Cloud Storage│
│  (PostgreSQL)    │ │   (Queue)    │ │ (Documents)  │
└──────────────────┘ └──────────────┘ └──────────────┘
```

## Core Components

### 1. Web Frontend (Next.js)
- **Technology**: Next.js 14, React 18
- **Deployment**: Cloud Run with auto-scaling
- **Features**:
  - Server-side rendering for optimal SEO
  - Static generation for performance
  - Progressive Web App capabilities
  - Responsive design for mobile/desktop

### 2. Backend API (Express.js)
- **Technology**: Node.js 20, Express.js 4
- **Deployment**: Cloud Run with auto-scaling
- **Features**:
  - RESTful API architecture
  - JWT-based authentication
  - Rate limiting and security headers
  - Health check endpoints
  - Structured logging with Winston
  - Database connection pooling

### 3. Worker Service (Background Jobs)
- **Technology**: Node.js 20, Bull Queue
- **Deployment**: Cloud Run (always-on instances)
- **Features**:
  - AI-powered question processing
  - Document generation pipeline
  - Email notification system
  - Retry logic with exponential backoff

### 4. Mobile App (React Native/Expo)
- **Technology**: React Native, Expo 50
- **Deployment**: App Store & Google Play
- **Features**:
  - Cross-platform iOS and Android
  - Native UI components
  - Secure token storage

## Technology Stack

### Backend
- Node.js 20, Express.js 4
- PostgreSQL 15, Redis 7
- Bull Queue, Winston
- JWT, bcrypt

### Frontend
- Next.js 14, React 18

### Mobile
- React Native 0.73, Expo 50

### Infrastructure
- Google Cloud Platform
- Cloud Run, Cloud SQL
- Memorystore, Cloud Storage
- GitHub Actions, Docker, Terraform

See full architecture details in the complete documentation.

---

**Document Version**: 1.0  
**Last Updated**: 2024
