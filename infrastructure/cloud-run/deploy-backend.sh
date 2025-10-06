#!/bin/bash
# Deploy Backend to Cloud Run

set -e

PROJECT_ID=${GCP_PROJECT_ID:-"forjustice-ca"}
REGION=${REGION:-"us-central1"}
SERVICE_NAME="forjustice-backend"
IMAGE_NAME="gcr.io/${PROJECT_ID}/${SERVICE_NAME}"

echo "Deploying ${SERVICE_NAME} to Cloud Run..."

# Build and push image
gcloud builds submit --tag ${IMAGE_NAME} ../backend/

# Deploy to Cloud Run
gcloud run deploy ${SERVICE_NAME} \
  --image ${IMAGE_NAME} \
  --platform managed \
  --region ${REGION} \
  --allow-unauthenticated \
  --memory 512Mi \
  --cpu 1 \
  --min-instances 1 \
  --max-instances 10 \
  --timeout 300 \
  --set-env-vars="NODE_ENV=production,PORT=8080" \
  --set-cloudsql-instances=${CLOUD_SQL_CONNECTION_NAME} \
  --add-cloudsql-instances=${CLOUD_SQL_CONNECTION_NAME}

echo "Backend deployed successfully!"
