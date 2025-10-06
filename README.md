# forjustice.ca

## Purpose

forjustice.ca is a user-friendly platform designed to help modest means clients in Canada access the legal information and tools they need to advocate for themselves. The app aims to empower individuals—especially those with little or no legal background, limited English, or financial constraints—to get answers to legal questions and generate court documents affordably.

## Who It's For

- Low-income individuals, single parents, immigrants, and anyone who finds the justice system inaccessible.
- The platform is designed and marketed for people who cannot afford lawyers or paralegals. However, registration is open to anyone who needs help.

## Core Features

- **Legal Question Service:**  
  - Users pay $99 for up to 3 legal questions answered, using the latest AI models.
  - After receiving answers, users can opt to generate all relevant court documents for $399.
  - Documents are formatted for email submission and include the correct court email for their region.

- **Areas of Law Supported (Ontario MVP):**
  - Administrative Law
  - Landlord and Tenant Board
  - Immigration Law
  - Human Rights Law
  - Family Law
  - Criminal Law
  - Wills and Estates
  - Municipal Law

- **Province-by-Province Rollout:**  
  - Starting with Ontario, with the plan to expand to British Columbia, Alberta, and other provinces.

- **Multi-Language Support:**  
  - Supports the 10 most spoken languages in Canada from launch.

- **User Experience:**  
  - Plain-language, easy-to-read answers.
  - Short summaries or guides for common legal problems.
  - Simple, intuitive navigation for users with little legal or technical background.
  - Feedback option: Users can provide short, three-sentence feedback in their own words.

- **Privacy & Security:**  
  - Registration and password required for all users.
  - User activity is tracked to help improve the platform and understand usage patterns.
  - Security and privacy are prioritized for all users.

- **Reliability & Scalability:**  
  - The app will be engineered for high reliability and scalability.
  - Special attention will be paid to infrastructure, code quality, and testing to ensure the platform can handle high traffic, especially in the first 36 months after launch.
  - Robust error handling, monitoring, and automated backups will be implemented to minimize downtime and data loss.
  - The goal is to provide a stable, responsive experience for every user, even as demand grows.

## Timeline

- **Beta/Free Version:** Launch by October 30th, 2025, to gather feedback and identify bugs.
- **Official MVP Release:** Full MVP ready by December 31st, 2025.

## Architecture

This project uses a modern, scalable microservices architecture:

- **Backend API** (Express.js) - RESTful API with JWT authentication
- **Web Frontend** (Next.js) - Server-side rendered React application
- **Mobile App** (React Native/Expo) - Cross-platform mobile application
- **Worker Service** (Bull Queue) - Background job processing
- **Database** (PostgreSQL) - Primary data store
- **Cache/Queue** (Redis) - Job queue and caching
- **Storage** (Cloud Storage) - Document storage

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

## Quick Start

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- PostgreSQL 14+ (or use Docker)
- Redis 6+ (or use Docker)

### Using Docker (Recommended)

```bash
# Start all services
docker-compose up

# Access the application
# Web: http://localhost:3000
# API: http://localhost:3001
# API Health: http://localhost:3001/health
```

### Manual Setup

See [DEVELOPMENT.md](docs/DEVELOPMENT.md) for detailed setup instructions.

```bash
# Install dependencies for all services
cd backend && npm install
cd ../web && npm install
cd ../worker && npm install
cd ../mobile && npm install

# Setup environment variables
cp backend/.env.example backend/.env
cp web/.env.example web/.env.local
cp worker/.env.example worker/.env

# Start PostgreSQL and Redis locally
# (or use docker-compose for just the databases)

# Run database migrations
psql -U forjustice_user -d forjustice -f backend/migrations/001_initial_schema.sql

# Start services (in separate terminals)
cd backend && npm run dev
cd web && npm run dev
cd worker && npm run dev
cd mobile && npm start
```

## Project Structure

```
forjustice.ca/
├── backend/              # Express.js API server
│   ├── config/          # Database and configuration
│   ├── routes/          # API routes
│   ├── middleware/      # Express middleware
│   ├── migrations/      # Database migrations
│   ├── utils/           # Utility functions
│   └── server.js        # Main server file
├── web/                 # Next.js web application
│   ├── pages/           # Next.js pages
│   └── public/          # Static assets
├── mobile/              # React Native mobile app
│   ├── App.js           # Main app component
│   └── AuthScreen.js    # Authentication screen
├── worker/              # Background job processor
│   ├── jobs/            # Job handlers
│   └── worker.js        # Main worker file
├── infrastructure/      # Infrastructure as Code
│   ├── terraform/       # Terraform configurations
│   └── cloud-run/       # Cloud Run deployment scripts
├── docs/               # Documentation
│   ├── ARCHITECTURE.md # System architecture
│   ├── DEPLOYMENT.md   # Deployment guide
│   ├── DEVELOPMENT.md  # Development setup
│   └── LAUNCH_CHECKLIST.md # Launch checklist
└── docker-compose.yml  # Docker Compose configuration
```

## Documentation

- [System Architecture](docs/ARCHITECTURE.md) - Detailed system design and architecture
- [Deployment Guide](docs/DEPLOYMENT.md) - How to deploy to production
- [Development Guide](docs/DEVELOPMENT.md) - Local development setup
- [Launch Checklist](docs/LAUNCH_CHECKLIST.md) - Master checklist for production launch

## API Endpoints

### Health Checks
- `GET /health` - Overall health status
- `GET /health/ready` - Readiness probe
- `GET /health/live` - Liveness probe

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user

See full API documentation (coming soon).

## Testing

```bash
# Backend tests
cd backend && npm test

# Web tests
cd web && npm test

# Worker tests
cd worker && npm test

# Run all tests
npm test --workspaces
```

## Deployment

### Cloud Run (GCP)

See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

```bash
# Deploy using scripts
cd infrastructure/cloud-run
./deploy-backend.sh
./deploy-web.sh
./deploy-worker.sh
```

### Using GitHub Actions

Automated CI/CD is configured in `.github/workflows/ci.yml`. Push to main branch to trigger deployment.

## Environment Variables

Each service requires specific environment variables. See `.env.example` files in each service directory:

- [Backend Environment Variables](backend/.env.example)
- [Web Environment Variables](web/.env.example)
- [Worker Environment Variables](worker/.env.example)

## Security

- JWT-based authentication
- bcrypt password hashing (12 rounds)
- Rate limiting (100 req/15min per IP)
- Security headers (Helmet.js)
- CORS configuration
- SQL injection prevention
- XSS protection

## Monitoring

- Structured logging (Winston)
- Health check endpoints
- Cloud Monitoring integration
- Error tracking
- Performance metrics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write/update tests
5. Submit a pull request

## Feedback

Users can provide feedback (maximum three sentences) on their experience to help improve the platform.

## Vision

forjustice.ca is built to help as many people as possible get justice, starting with those who need it most. If others use it, that's a positive outcome—the core goal is to make legal help accessible for everyone.

## License

[Add license information]

## Support

- Email: support@forjustice.ca
- Documentation: [docs/](docs/)
- Issues: [GitHub Issues](https://github.com/Luva08/forjustice.ca/issues)

---

*This project is under active development. We're working toward a beta launch by October 30th, 2025, and full MVP by December 31st, 2025.*