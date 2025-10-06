# Worker Service - forjustice.ca

Background job processor for the forjustice.ca platform.

## Features

- **Job Processing**: Handles background tasks asynchronously
- **Queue Management**: Bull queue with Redis backend
- **Retry Logic**: Exponential backoff for failed jobs
- **Logging**: Structured logging with Winston
- **Scalability**: Configurable concurrency

## Job Types

1. **Question Processing**: AI-powered legal question answering
2. **Document Generation**: Court document creation
3. **Email Sending**: Notification and communication emails

## Prerequisites

- Node.js 18+
- Redis 6+
- PostgreSQL 14+ (for data storage)

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

## Running

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## Job Queue Architecture

```
Question Submitted → Question Queue → AI Processing → Store Answer
Document Request → Document Queue → Generate Document → Store in GCS
User Action → Email Queue → Send Email via SendGrid
```

## Monitoring

- Job completion/failure events are logged
- Redis queue metrics can be monitored
- Failed jobs are retried with exponential backoff

## Scaling

Horizontal scaling is supported:
- Run multiple worker instances
- Each worker processes jobs from shared Redis queue
- Configure concurrency per worker based on resources

## Docker

Build the image:
```bash
docker build -t forjustice-worker .
```

Run the container:
```bash
docker run --env-file .env forjustice-worker
```
