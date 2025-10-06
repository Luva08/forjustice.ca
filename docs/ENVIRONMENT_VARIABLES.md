# Environment Variables Reference - forjustice.ca

Complete reference for all environment variables used across services.

## Backend Service

File: `backend/.env`

### Server Configuration
```env
# Environment
NODE_ENV=development|production
# Default: development
# Description: Application environment

PORT=3001
# Default: 3001
# Description: Port the server listens on

API_VERSION=v1
# Default: v1
# Description: API version prefix
```

### Database Configuration
```env
DATABASE_URL=postgresql://user:password@host:port/database
# Required: Yes
# Example: postgresql://forjustice_user:password@localhost:5432/forjustice
# Description: PostgreSQL connection string

DB_HOST=localhost
# Default: localhost
# Description: Database host

DB_PORT=5432
# Default: 5432
# Description: Database port

DB_NAME=forjustice
# Required: Yes
# Description: Database name

DB_USER=forjustice_user
# Required: Yes
# Description: Database username

DB_PASSWORD=secure_password
# Required: Yes
# Description: Database password
# Security: Store in Secret Manager in production
```

### Authentication
```env
JWT_SECRET=your-super-secret-jwt-key
# Required: Yes
# Description: Secret key for JWT token signing
# Security: Must be strong and unique (32+ characters)
# Important: Never commit to git, use Secret Manager

JWT_EXPIRES_IN=7d
# Default: 7d
# Description: JWT token expiration time
# Format: Examples: 60s, 10m, 2h, 7d
```

### Redis Configuration
```env
REDIS_HOST=localhost
# Default: localhost
# Description: Redis host for job queue

REDIS_PORT=6379
# Default: 6379
# Description: Redis port

REDIS_PASSWORD=
# Optional
# Description: Redis password (if required)
```

### CORS Configuration
```env
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
# Required: Yes
# Description: Comma-separated list of allowed origins
# Production: https://forjustice.ca,https://www.forjustice.ca
```

### Rate Limiting
```env
RATE_LIMIT_WINDOW_MS=900000
# Default: 900000 (15 minutes)
# Description: Rate limiting window in milliseconds

RATE_LIMIT_MAX_REQUESTS=100
# Default: 100
# Description: Maximum requests per window per IP
```

### AI Service
```env
OPENAI_API_KEY=sk-...
# Required: Yes (for production)
# Description: OpenAI API key for question processing
# Security: Store in Secret Manager

AI_MODEL=gpt-4
# Default: gpt-4
# Description: OpenAI model to use
# Options: gpt-4, gpt-3.5-turbo

AI_MAX_TOKENS=4000
# Default: 4000
# Description: Maximum tokens in AI response
```

### Payment Processing
```env
STRIPE_SECRET_KEY=sk_test_...
# Required: For payment features
# Description: Stripe secret key
# Security: Store in Secret Manager

STRIPE_PUBLISHABLE_KEY=pk_test_...
# Required: For payment features
# Description: Stripe publishable key
```

### Email Service
```env
SENDGRID_API_KEY=SG....
# Required: For email features
# Description: SendGrid API key
# Security: Store in Secret Manager

FROM_EMAIL=noreply@forjustice.ca
# Required: Yes
# Description: Email address for outgoing emails
```

### Cloud Storage
```env
GCS_BUCKET_NAME=forjustice-documents
# Required: For document storage
# Description: Google Cloud Storage bucket name

GCS_PROJECT_ID=forjustice-ca
# Required: For GCS
# Description: GCP project ID
```

### Logging
```env
LOG_LEVEL=info
# Default: info
# Options: error, warn, info, debug
# Description: Logging level
```

---

## Web Frontend

File: `web/.env.local`

### API Configuration
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
# Required: Yes
# Production: https://api.forjustice.ca/api/v1
# Description: Backend API URL
# Note: Must start with NEXT_PUBLIC_ to be exposed to browser

NEXT_PUBLIC_SITE_URL=http://localhost:3000
# Required: Yes
# Production: https://forjustice.ca
# Description: Full site URL for canonical links, redirects
```

### Feature Flags
```env
NEXT_PUBLIC_ENABLE_PAYMENTS=true
# Default: true
# Description: Enable/disable payment features

NEXT_PUBLIC_ENABLE_DOCUMENT_GENERATION=true
# Default: true
# Description: Enable/disable document generation
```

### Analytics
```env
NEXT_PUBLIC_GA_TRACKING_ID=G-XXXXXXXXXX
# Optional
# Description: Google Analytics tracking ID
```

### Client-side Keys
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
# Required: For payments
# Description: Stripe publishable key (safe for client-side)
```

---

## Worker Service

File: `worker/.env`

### Worker Configuration
```env
NODE_ENV=development|production
# Default: development
# Description: Environment

WORKER_NAME=forjustice-worker
# Default: forjustice-worker
# Description: Worker instance name
```

### Redis Configuration
```env
REDIS_HOST=localhost
# Required: Yes
# Description: Redis host for job queue

REDIS_PORT=6379
# Default: 6379
# Description: Redis port

REDIS_PASSWORD=
# Optional
# Description: Redis password
```

### Database Configuration
```env
DATABASE_URL=postgresql://user:password@host:port/database
# Required: Yes
# Description: PostgreSQL connection string for storing results
```

### AI Service
```env
OPENAI_API_KEY=sk-...
# Required: Yes
# Description: OpenAI API key
# Security: Store in Secret Manager

AI_MODEL=gpt-4
# Default: gpt-4
# Description: AI model to use

AI_MAX_TOKENS=4000
# Default: 4000
# Description: Max tokens per response
```

### Email Configuration
```env
SENDGRID_API_KEY=SG....
# Required: For sending emails
# Description: SendGrid API key
# Security: Store in Secret Manager

FROM_EMAIL=noreply@forjustice.ca
# Required: Yes
# Description: From email address
```

### Cloud Storage
```env
GCS_BUCKET_NAME=forjustice-documents
# Required: Yes
# Description: GCS bucket for documents

GCS_PROJECT_ID=forjustice-ca
# Required: Yes
# Description: GCP project ID
```

### Job Configuration
```env
MAX_JOB_ATTEMPTS=3
# Default: 3
# Description: Maximum retry attempts for failed jobs

JOB_TIMEOUT=300000
# Default: 300000 (5 minutes)
# Description: Job timeout in milliseconds

CONCURRENCY=5
# Default: 5
# Description: Number of concurrent jobs to process
```

### Logging
```env
LOG_LEVEL=info
# Default: info
# Options: error, warn, info, debug
# Description: Logging level
```

---

## Mobile App

File: `mobile/.env`

### API Configuration
```env
API_URL=http://localhost:3001/api/v1
# Required: Yes
# iOS Simulator: http://localhost:3001/api/v1
# Android Emulator: http://10.0.2.2:3001/api/v1
# Physical Device: http://<YOUR_LOCAL_IP>:3001/api/v1
# Production: https://api.forjustice.ca/api/v1
# Description: Backend API URL
```

### Feature Flags
```env
ENABLE_PAYMENTS=true
# Default: true
# Description: Enable/disable payment features

ENABLE_DOCUMENT_GENERATION=true
# Default: true
# Description: Enable/disable document generation
```

---

## Cloud Run (Production)

Environment variables are set during deployment:

```bash
# Backend
gcloud run services update forjustice-backend \
  --set-env-vars="
    NODE_ENV=production,
    PORT=8080,
    DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/connection-name,
    JWT_SECRET=from-secret-manager,
    REDIS_HOST=10.x.x.x,
    CORS_ORIGIN=https://forjustice.ca
  "

# Web
gcloud run services update forjustice-web \
  --set-env-vars="
    NEXT_PUBLIC_API_URL=https://api.forjustice.ca/api/v1,
    NEXT_PUBLIC_SITE_URL=https://forjustice.ca
  "

# Worker
gcloud run services update forjustice-worker \
  --set-env-vars="
    NODE_ENV=production,
    DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/connection-name,
    REDIS_HOST=10.x.x.x
  "
```

---

## Secret Manager (Production)

Store sensitive values in Google Secret Manager:

```bash
# Create secrets
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
echo -n "your-openai-key" | gcloud secrets create openai-api-key --data-file=-
echo -n "your-stripe-key" | gcloud secrets create stripe-secret-key --data-file=-

# Grant access to service account
gcloud secrets add-iam-policy-binding jwt-secret \
  --member=serviceAccount:SERVICE_ACCOUNT@PROJECT.iam.gserviceaccount.com \
  --role=roles/secretmanager.secretAccessor

# Use in Cloud Run
gcloud run services update forjustice-backend \
  --update-secrets=JWT_SECRET=jwt-secret:latest
```

---

## Security Best Practices

### 1. Never Commit Secrets
- Always use `.env` files (in `.gitignore`)
- Use `.env.example` as template (no real values)
- Store production secrets in Secret Manager

### 2. Use Strong Secrets
- JWT_SECRET: 32+ characters, random
- Database passwords: 20+ characters, complex
- Rotate secrets regularly

### 3. Environment-Specific Values
- Use different values for dev/staging/prod
- Never use production credentials in development

### 4. Access Control
- Limit who can access secrets
- Use service accounts with minimal permissions
- Enable audit logging

---

## Validation Checklist

Before deploying, verify:

- [ ] All required variables set
- [ ] No hardcoded secrets in code
- [ ] Secrets stored in Secret Manager
- [ ] CORS origins correct for environment
- [ ] Database credentials valid
- [ ] API keys valid and not expired
- [ ] URLs use correct protocol (http/https)
- [ ] Port numbers correct
- [ ] Feature flags set appropriately

---

**Last Updated**: 2024  
**Document Version**: 1.0
