#!/bin/bash
# Deploy Worker to Cloud Run

set -e

PROJECT_ID=${GCP_PROJECT_ID:-"forjustice-ca"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="forjustice-worker"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "Deploying ${SERVICE_NAME} to Cloud Run..."

# Build and push image
gcloud builds submit --tag ${IMAGE_NAME} ../worker/

# Deploy to Cloud Run (no-traffic for worker)
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --no-allow-unauthenticated \
  --memory 1Gi \
  --cpu 2 \
  --min-instances 1 \
  --max-instances 5 \
  --timeout 600 \
  --set-env-vars="NODE_ENV=production" \
  --set-cloudsql-instances=${CLOUD_SQL_CONNECTION_NAME} \
  --add-cloudsql-instances=${CLOUD_SQL_CONNECTION_NAME}

echo "Worker deployed successfully!"
