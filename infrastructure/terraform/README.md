# Terraform Infrastructure

This directory contains Terraform configurations for provisioning GCP infrastructure for forjustice.ca.

## Resources Provisioned

- **Cloud SQL PostgreSQL**: Primary database with automated backups
- **Redis Instance**: Job queue and caching
- **Cloud Storage**: Document storage
- **VPC Network**: Private networking
- **Secret Manager**: Secure credential storage

## Prerequisites

- Terraform >= 1.5
- GCP account with billing enabled
- GCP CLI (`gcloud`) installed and authenticated

## Setup

1. Copy the example tfvars:
```bash
cp terraform.tfvars.example terraform.tfvars
```

2. Edit `terraform.tfvars` with your project details

3. Initialize Terraform:
```bash
terraform init
```

4. Review the plan:
```bash
terraform plan
```

5. Apply the configuration:
```bash
terraform apply
```

## State Management

Terraform state is stored in a GCS bucket. Create the bucket before first run:

```bash
gcloud storage buckets create gs://forjustice-terraform-state --location=us-central1
```

## Outputs

After applying, Terraform will output:
- Database connection name
- Redis host
- Storage bucket name

## Security

- Store `terraform.tfvars` securely (never commit to git)
- Use Secret Manager for sensitive values
- Enable deletion protection on production resources

## Cost Estimation

Run `terraform plan` to see estimated costs before applying.
