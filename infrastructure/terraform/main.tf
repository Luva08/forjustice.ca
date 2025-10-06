terraform {
  required_version = ">= 1.5"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
  
  backend "gcs" {
    bucket = "forjustice-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP Region"
  type        = string
  default     = "us-central1"
}

variable "environment" {
  description = "Environment (dev, staging, production)"
  type        = string
  default     = "production"
}

# Enable required APIs
resource "google_project_service" "run" {
  service = "run.googleapis.com"
}

resource "google_project_service" "sql" {
  service = "sqladmin.googleapis.com"
}

resource "google_project_service" "secretmanager" {
  service = "secretmanager.googleapis.com"
}

resource "google_project_service" "redis" {
  service = "redis.googleapis.com"
}

# Cloud SQL PostgreSQL instance
resource "google_sql_database_instance" "main" {
  name             = "forjustice-db-${var.environment}"
  database_version = "POSTGRES_15"
  region           = var.region

  settings {
    tier = "db-g1-small"
    
    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
      backup_retention_settings {
        retained_backups = 7
      }
    }

    ip_configuration {
      ipv4_enabled    = true
      require_ssl     = true
      authorized_networks {
        name  = "all"
        value = "0.0.0.0/0"
      }
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }

  deletion_protection = true
}

resource "google_sql_database" "database" {
  name     = "forjustice"
  instance = google_sql_database_instance.main.name
}

resource "google_sql_user" "user" {
  name     = "forjustice_user"
  instance = google_sql_database_instance.main.name
  password = var.db_password
}

# Redis instance for job queue
resource "google_redis_instance" "cache" {
  name           = "forjustice-redis-${var.environment}"
  tier           = "STANDARD_HA"
  memory_size_gb = 1
  region         = var.region

  redis_version = "REDIS_7_0"

  authorized_network = google_compute_network.vpc.id
}

# VPC Network
resource "google_compute_network" "vpc" {
  name                    = "forjustice-vpc-${var.environment}"
  auto_create_subnetworks = true
}

# Cloud Storage bucket for documents
resource "google_storage_bucket" "documents" {
  name          = "forjustice-documents-${var.project_id}"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  lifecycle_rule {
    condition {
      age = 90
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }
}

# Output values
output "database_connection_name" {
  value       = google_sql_database_instance.main.connection_name
  description = "Database connection name for Cloud Run"
}

output "redis_host" {
  value       = google_redis_instance.cache.host
  description = "Redis instance host"
}

output "bucket_name" {
  value       = google_storage_bucket.documents.name
  description = "Document storage bucket name"
}

variable "db_password" {
  description = "Database password"
  type        = string
  sensitive   = true
}
