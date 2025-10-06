# Backend Service - forjustice.ca

Production-ready Express.js backend API for the forjustice.ca platform.

## Features

- **Authentication & Authorization**: JWT-based authentication with bcrypt password hashing
- **Database**: PostgreSQL with connection pooling
- **Security**: Helmet.js, CORS, rate limiting
- **Logging**: Structured logging with Winston
- **Health Checks**: Kubernetes-ready health, readiness, and liveness endpoints
- **Job Queue**: Bull queue for background processing
- **API Documentation**: RESTful API design

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis 6+ (for job queue)

## Installation

```bash
npm install
```

## Configuration

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

### Database Setup

1. Create database:
```bash
createdb forjustice
```

2. Run migrations:
```bash
psql -U postgres -d forjustice -f migrations/001_initial_schema.sql
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

## API Endpoints

### Health Checks
- `GET /health` - Overall health status
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

## Testing

```bash
npm test
```

## Docker

Build the image:
```bash
docker build -t forjustice-backend .
```

Run the container:
```bash
docker run -p 3001:3001 --env-file .env forjustice-backend
```

## Architecture

```
backend/
├── config/          # Configuration files (database, etc.)
├── middleware/      # Express middleware
├── migrations/      # Database migrations
├── models/          # Data models
├── routes/          # API routes
├── services/        # Business logic
├── utils/           # Utility functions
├── server.js        # Main application entry point
└── package.json
```

## Security Considerations

- Passwords are hashed with bcrypt (12 rounds)
- JWT tokens for stateless authentication
- Rate limiting on API endpoints
- Helmet.js for security headers
- Input validation on all endpoints
- CORS configuration
- SQL injection prevention with parameterized queries

## Monitoring

The application logs are structured JSON for easy parsing:
- Console output in development
- File-based logging in production
- Error tracking with stack traces
- Request logging with metadata

## Deployment

See the main repository documentation for Cloud Run deployment instructions.
