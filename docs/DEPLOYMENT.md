# Deployment Guide - forjustice.ca

## Prerequisites

### Required Tools
- Google Cloud SDK (`gcloud`)
- Docker
- Terraform >= 1.5
- Node.js >= 18
- Git

### GCP Account Setup
1. Create a GCP project
2. Enable billing
3. Install and authenticate gcloud CLI:
```bash
gcloud init
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

## Infrastructure Provisioning

### Step 1: Terraform Setup

1. Navigate to infrastructure directory:
```bash
cd infrastructure/terraform
```

2. Copy and configure variables:
```bash
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your project details
```

3. Create state bucket:
```bash
gcloud storage buckets create gs://forjustice-terraform-state --location=us-central1
```

4. Initialize Terraform:
```bash
terraform init
```

5. Review and apply:
```bash
terraform plan
terraform apply
```

This provisions:
- Cloud SQL PostgreSQL instance
- Redis instance
- Cloud Storage bucket
- VPC network
- Required APIs

### Step 2: Database Setup

1. Get database connection details:
```bash
terraform output database_connection_name
```

2. Connect to the database:
```bash
gcloud sql connect forjustice-db-production --user=forjustice_user
```

3. Run migrations:
```bash
psql -h <DB_HOST> -U forjustice_user -d forjustice -f backend/migrations/001_initial_schema.sql
```

## Application Deployment

### Option A: Automated Deployment (Recommended)

1. Set up GitHub Secrets:
   - `GCP_PROJECT_ID`: Your GCP project ID
   - `GCP_SA_KEY`: Service account JSON key

2. Push to main branch:
```bash
git push origin main
```

GitHub Actions will automatically:
- Run tests
- Build Docker images
- Deploy to Cloud Run

### Option B: Manual Deployment

#### Deploy Backend

1. Navigate to backend directory:
```bash
cd backend
```

2. Build and push Docker image:
```bash
docker build -t gcr.io/YOUR_PROJECT_ID/forjustice-backend .
docker push gcr.io/YOUR_PROJECT_ID/forjustice-backend
```

3. Deploy to Cloud Run:
```bash
gcloud run deploy forjustice-backend \
  --image gcr.io/YOUR_PROJECT_ID/forjustice-backend \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --min-instances 1 \
  --max-instances 10 \
  --set-env-vars="NODE_ENV=production,PORT=8080" \
  --set-cloudsql-instances=YOUR_CLOUD_SQL_CONNECTION_NAME
```

#### Deploy Web Frontend

1. Navigate to web directory:
```bash
cd web
```

2. Build and deploy:
```bash
docker build -t gcr.io/YOUR_PROJECT_ID/forjustice-web .
docker push gcr.io/YOUR_PROJECT_ID/forjustice-web

gcloud run deploy forjustice-web \
  --image gcr.io/YOUR_PROJECT_ID/forjustice-web \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 512Mi \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://YOUR_BACKEND_URL"
```

#### Deploy Worker

1. Navigate to worker directory:
```bash
cd worker
```

2. Build and deploy:
```bash
docker build -t gcr.io/YOUR_PROJECT_ID/forjustice-worker .
docker push gcr.io/YOUR_PROJECT_ID/forjustice-worker

gcloud run deploy forjustice-worker \
  --image gcr.io/YOUR_PROJECT_ID/forjustice-worker \
  --platform managed \
  --region us-central1 \
  --no-allow-unauthenticated \
  --memory 1Gi \
  --min-instances 1 \
  --set-cloudsql-instances=YOUR_CLOUD_SQL_CONNECTION_NAME
```

### Option C: Using Deployment Scripts

```bash
cd infrastructure/cloud-run

# Set environment variables
export GCP_PROJECT_ID=your-project-id
export CLOUD_SQL_CONNECTION_NAME=your-connection-name
export BACKEND_URL=https://your-backend-url

# Deploy all services
./deploy-backend.sh
./deploy-web.sh
./deploy-worker.sh
```

## Environment Variables

### Backend
```bash
gcloud run services update forjustice-backend \
  --set-env-vars="
    NODE_ENV=production,
    DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/connection-name,
    JWT_SECRET=your-secret-key,
    OPENAI_API_KEY=your-openai-key,
    REDIS_HOST=10.x.x.x,
    REDIS_PORT=6379
  "
```

### Web
```bash
gcloud run services update forjustice-web \
  --set-env-vars="
    NEXT_PUBLIC_API_URL=https://your-backend-url/api/v1
  "
```

### Worker
```bash
gcloud run services update forjustice-worker \
  --set-env-vars="
    NODE_ENV=production,
    DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/connection-name,
    REDIS_HOST=10.x.x.x,
    OPENAI_API_KEY=your-openai-key
  "
```

## Custom Domain Setup

1. Verify domain ownership:
```bash
gcloud domains verify forjustice.ca
```

2. Map domain to services:
```bash
gcloud run domain-mappings create --service forjustice-web --domain forjustice.ca --region us-central1
gcloud run domain-mappings create --service forjustice-backend --domain api.forjustice.ca --region us-central1
```

3. Update DNS records as instructed by GCP

## SSL/TLS Certificates

Cloud Run automatically provisions and manages SSL certificates for custom domains.

## Monitoring Setup

1. Create uptime checks:
```bash
gcloud monitoring uptime create https://forjustice.ca --display-name="Web Frontend"
gcloud monitoring uptime create https://api.forjustice.ca/health --display-name="Backend API"
```

2. Set up alerting policies in Cloud Console

## Backup Configuration

Backups are automatically configured via Terraform:
- Database: Daily automated backups, 7-day retention
- Point-in-time recovery enabled
- Document storage: Versioning enabled

## Security Checklist

- [ ] Change all default passwords
- [ ] Rotate JWT secret
- [ ] Configure API keys in Secret Manager
- [ ] Enable Cloud Armor (WAF)
- [ ] Set up VPC Service Controls
- [ ] Enable audit logging
- [ ] Configure CORS properly
- [ ] Review IAM permissions
- [ ] Enable 2FA for GCP account
- [ ] Set up budget alerts

## Post-Deployment Verification

1. Check service health:
```bash
curl https://api.forjustice.ca/health
```

2. Test authentication:
```bash
curl -X POST https://api.forjustice.ca/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpassword123"}'
```

3. Verify logs:
```bash
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=forjustice-backend" --limit 50
```

4. Check metrics in Cloud Console

## Rollback Procedure

If deployment fails:

1. Revert to previous revision:
```bash
gcloud run services update-traffic forjustice-backend --to-revisions=PREVIOUS_REVISION=100
```

2. Or redeploy previous image:
```bash
gcloud run deploy forjustice-backend --image gcr.io/PROJECT_ID/forjustice-backend:PREVIOUS_TAG
```

## Troubleshooting

### Database Connection Issues
```bash
# Test Cloud SQL connectivity
gcloud sql connect forjustice-db-production --user=forjustice_user

# Check Cloud Run service account permissions
gcloud projects get-iam-policy YOUR_PROJECT_ID
```

### Container Startup Failures
```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 100

# Check health endpoints
curl https://api.forjustice.ca/health/live
```

### Redis Connection Issues
```bash
# Verify Redis instance
gcloud redis instances describe forjustice-redis-production --region us-central1

# Check VPC connectivity
```

## Scaling Configuration

### Manual Scaling
```bash
gcloud run services update forjustice-backend \
  --min-instances=2 \
  --max-instances=20
```

### Auto-scaling Metrics
- Default: CPU utilization (80%)
- Custom: Request rate, queue depth

## Cost Monitoring

View current costs:
```bash
gcloud billing accounts list
gcloud billing accounts get-cost-table BILLING_ACCOUNT_ID
```

Set budget alerts in Cloud Console:
1. Billing → Budgets & alerts
2. Create budget
3. Set thresholds: 50%, 80%, 100%

## Maintenance Windows

Schedule maintenance during low-traffic periods:
- Preferred: Sunday 2-4 AM EST
- Notify users 24 hours in advance
- Monitor during and after maintenance

## Support Contacts

- GCP Support: Via Cloud Console
- Technical Issues: GitHub Issues
- Security Issues: security@forjustice.ca

---

**Last Updated**: 2024  
**Next Review**: Q1 2025
