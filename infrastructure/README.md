# Infrastructure - forjustice.ca

This directory contains infrastructure-as-code and deployment configurations for the forjustice.ca platform.

## Directory Structure

```
infrastructure/
├── terraform/          # Terraform IaC for GCP resources
│   ├── main.tf        # Main Terraform configuration
│   ├── terraform.tfvars.example
│   └── README.md
├── cloud-run/         # Cloud Run deployment scripts
│   ├── deploy-backend.sh
│   ├── deploy-web.sh
│   └── deploy-worker.sh
└── kubernetes/        # Kubernetes manifests (future)
```

## Overview

The infrastructure is designed to be:
- **Scalable**: Auto-scaling based on traffic
- **Reliable**: High availability configuration
- **Secure**: Network isolation, encryption, IAM
- **Cost-effective**: Right-sized resources
- **Maintainable**: Infrastructure as code

## Components

### 1. Compute (Cloud Run)
- **Backend API**: Stateless API server
- **Web Frontend**: Next.js application
- **Worker**: Background job processor

### 2. Database (Cloud SQL)
- **PostgreSQL 15**: Primary database
- **Features**:
  - Automated backups (daily, 7-day retention)
  - Point-in-time recovery
  - High availability option
  - SSL encryption

### 3. Cache & Queue (Memorystore/Redis)
- **Redis 7**: Job queue and caching
- **Features**:
  - High availability tier
  - Automatic failover
  - Persistence enabled

### 4. Storage (Cloud Storage)
- **Document Storage**: GCS bucket for generated documents
- **Features**:
  - Versioning enabled
  - Lifecycle management
  - Regional redundancy

### 5. Networking
- **VPC**: Private network for services
- **Cloud Load Balancer**: Traffic distribution
- **Cloud CDN**: Static asset caching

## Quick Start

### Prerequisites
- GCP account with billing enabled
- `gcloud` CLI installed and authenticated
- Terraform >= 1.5 installed

### Initial Setup

1. **Create GCP Project**:
```bash
gcloud projects create forjustice-ca --name="forjustice.ca"
gcloud config set project forjustice-ca
```

2. **Enable APIs**:
```bash
gcloud services enable \
  run.googleapis.com \
  sqladmin.googleapis.com \
  redis.googleapis.com \
  storage.googleapis.com \
  secretmanager.googleapis.com \
  cloudresourcemanager.googleapis.com
```

3. **Provision Infrastructure**:
```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars with your values
terraform init
terraform plan
terraform apply
```

4. **Deploy Applications**:
```bash
cd ../cloud-run
./deploy-backend.sh
./deploy-web.sh
./deploy-worker.sh
```

## Terraform

See [terraform/README.md](terraform/README.md) for detailed Terraform documentation.

### Resources Managed
- Cloud SQL PostgreSQL instance
- Redis instance (Memorystore)
- Cloud Storage bucket
- VPC network
- IAM policies
- Service accounts

### State Management
Terraform state is stored in a GCS bucket for team collaboration:
```bash
# Create state bucket (one-time)
gcloud storage buckets create gs://forjustice-terraform-state --location=us-central1
```

## Cloud Run Deployment

### Manual Deployment

Each service can be deployed independently:

```bash
# Backend
cd cloud-run
./deploy-backend.sh

# Web Frontend
./deploy-web.sh

# Worker
./deploy-worker.sh
```

### Environment Variables

Environment variables are set during deployment. See deployment scripts for details.

### Secrets Management

Sensitive values should use Secret Manager:

```bash
# Create secret
gcloud secrets create jwt-secret --data-file=-
# Input secret value, then Ctrl+D

# Grant access to service account
gcloud secrets add-iam-policy-binding jwt-secret \
  --member=serviceAccount:SERVICE_ACCOUNT \
  --role=roles/secretmanager.secretAccessor
```

### Connecting to Cloud SQL

Cloud Run services connect via Unix socket:
```bash
--set-cloudsql-instances=PROJECT:REGION:INSTANCE
```

Database connection string:
```
postgresql://user:password@/database?host=/cloudsql/CONNECTION_NAME
```

## Monitoring

### Uptime Checks

```bash
gcloud monitoring uptime create \
  https://forjustice.ca \
  --display-name="Web Frontend"

gcloud monitoring uptime create \
  https://api.forjustice.ca/health \
  --display-name="Backend API"
```

### Alerting Policies

Create alerts for:
- High error rate
- API latency
- Database connection failures
- Resource utilization
- Budget overruns

### Dashboards

View metrics in Cloud Console:
- Cloud Run: Request count, latency, errors
- Cloud SQL: Connections, query time
- Memorystore: Memory usage, operations

## Backup & Recovery

### Database Backups

Automated daily backups with 7-day retention:
```bash
# Manual backup
gcloud sql backups create --instance=forjustice-db-production

# List backups
gcloud sql backups list --instance=forjustice-db-production

# Restore from backup
gcloud sql backups restore BACKUP_ID --backup-instance=forjustice-db-production
```

### Point-in-Time Recovery

Restore to any point within 7 days:
```bash
gcloud sql instances clone forjustice-db-production forjustice-db-clone \
  --point-in-time='2024-01-15T10:00:00.000Z'
```

### Disaster Recovery

1. Database: Restore from backup or PITR
2. Services: Redeploy from last known good image
3. Secrets: Stored in Secret Manager (backed up)
4. Code: Git repository (multiple remotes)

## Scaling

### Auto-scaling Configuration

Services auto-scale based on CPU and request metrics:
```yaml
Backend:
  min-instances: 1
  max-instances: 10
  cpu-throttling: false
  
Web:
  min-instances: 1
  max-instances: 10
  
Worker:
  min-instances: 1
  max-instances: 5
```

### Manual Scaling

```bash
gcloud run services update forjustice-backend \
  --min-instances=2 \
  --max-instances=20
```

## Cost Optimization

### Current Estimates

```
Monthly costs (production):
- Cloud Run (3 services):  $50-150
- Cloud SQL (db-g1-small): $30-50
- Memorystore (1GB HA):    $40-60
- Cloud Storage:           $10-30
- Networking:              $20-50
Total:                     $150-340/month
```

### Optimization Tips

1. **Right-size instances**: Use appropriate machine types
2. **Min instances**: Set to 0 for dev/staging
3. **Auto-scaling**: Let services scale down during low traffic
4. **Storage lifecycle**: Archive old documents
5. **CDN caching**: Reduce origin requests
6. **Query optimization**: Reduce database load

### Budget Alerts

```bash
# Set budget alerts
gcloud billing budgets create \
  --billing-account=BILLING_ACCOUNT_ID \
  --display-name="forjustice.ca Monthly Budget" \
  --budget-amount=500 \
  --threshold-rule=percent=50 \
  --threshold-rule=percent=80 \
  --threshold-rule=percent=100
```

## Security

### IAM Best Practices

- Use service accounts for applications
- Grant least privilege permissions
- Enable audit logging
- Rotate credentials regularly
- Use Secret Manager for sensitive data

### Network Security

- VPC for private networking
- Cloud Armor for WAF
- SSL/TLS for all connections
- Private IP for Cloud SQL (optional)

### Compliance

- Data residency: All data in Canada/US
- Encryption at rest: Enabled by default
- Encryption in transit: TLS 1.2+
- Audit logging: Enabled
- PIPEDA compliance: Documented

## Troubleshooting

### Common Issues

1. **Deployment fails**: Check build logs
2. **Service unhealthy**: Check startup time and health endpoints
3. **Database connection**: Verify Cloud SQL connection settings
4. **Permissions**: Check IAM roles and service accounts

See [TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) for more details.

## CI/CD

Automated deployment via GitHub Actions:
- Push to `main` triggers CI/CD
- Tests run automatically
- Docker images built and pushed
- Services deployed to Cloud Run

See [.github/workflows/ci.yml](../.github/workflows/ci.yml)

## Maintenance

### Regular Tasks

- **Daily**: Monitor dashboards, check logs
- **Weekly**: Review metrics, apply security patches
- **Monthly**: Cost review, capacity planning
- **Quarterly**: Disaster recovery test, security audit

### Maintenance Windows

- **Scheduled**: Sunday 2-4 AM EST
- **Emergency**: As needed with notification

## Support

- **Documentation**: See docs/ folder
- **GCP Support**: Via Cloud Console
- **On-call**: [contact info]

---

**Last Updated**: 2024  
**Maintained By**: forjustice.ca Engineering Team
