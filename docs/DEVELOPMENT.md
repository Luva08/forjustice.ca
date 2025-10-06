# Development Setup Guide - forjustice.ca

## Prerequisites

### Required Software
- **Node.js**: 18 or higher ([Download](https://nodejs.org/))
- **npm**: 9 or higher (comes with Node.js)
- **Docker**: Latest version ([Download](https://www.docker.com/))
- **Git**: Latest version ([Download](https://git-scm.com/))
- **PostgreSQL**: 14 or higher (for local development)
- **Redis**: 6 or higher (for local development)

### Optional but Recommended
- **VS Code**: With extensions for JavaScript, React, Docker
- **Postman** or **Insomnia**: For API testing
- **pgAdmin**: PostgreSQL management tool

## Project Structure

```
forjustice.ca/
├── backend/           # Express.js API server
├── web/              # Next.js web application
├── mobile/           # React Native mobile app
├── worker/           # Background job processor
├── infrastructure/   # Terraform and deployment configs
├── docs/            # Documentation
└── .github/         # GitHub Actions workflows
```

## Initial Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Luva08/forjustice.ca.git
cd forjustice.ca
```

### 2. Install Dependencies

Each service has its own dependencies:

```bash
# Backend
cd backend
npm install

# Web Frontend
cd ../web
npm install

# Worker
cd ../worker
npm install

# Mobile (optional for backend developers)
cd ../mobile
npm install
```

### 3. Setup Local Database

#### Install PostgreSQL

**macOS (Homebrew)**:
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install postgresql-15
sudo systemctl start postgresql
```

**Windows**: Download from [postgresql.org](https://www.postgresql.org/download/)

#### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# In psql:
CREATE DATABASE forjustice;
CREATE USER forjustice_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE forjustice TO forjustice_user;
\q
```

#### Run Migrations

```bash
cd backend
psql -U forjustice_user -d forjustice -f migrations/001_initial_schema.sql
```

### 4. Setup Redis

#### Install Redis

**macOS (Homebrew)**:
```bash
brew install redis
brew services start redis
```

**Ubuntu/Debian**:
```bash
sudo apt-get install redis-server
sudo systemctl start redis
```

**Windows**: Use Docker or WSL

#### Verify Redis

```bash
redis-cli ping
# Should return: PONG
```

### 5. Configure Environment Variables

#### Backend

```bash
cd backend
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://forjustice_user:dev_password@localhost:5432/forjustice
JWT_SECRET=dev-secret-change-in-production
REDIS_HOST=localhost
REDIS_PORT=6379
CORS_ORIGIN=http://localhost:3000,http://localhost:19006
OPENAI_API_KEY=your-key-here
LOG_LEVEL=debug
```

#### Web Frontend

```bash
cd ../web
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

#### Worker

```bash
cd ../worker
cp .env.example .env
```

Edit `.env`:
```env
NODE_ENV=development
REDIS_HOST=localhost
REDIS_PORT=6379
DATABASE_URL=postgresql://forjustice_user:dev_password@localhost:5432/forjustice
OPENAI_API_KEY=your-key-here
LOG_LEVEL=debug
```

#### Mobile

```bash
cd ../mobile
cp .env.example .env
```

Edit `.env`:
```env
API_URL=http://localhost:3001/api/v1
```

## Running the Application

### Start All Services

Open 3-4 terminal windows:

#### Terminal 1: Backend API
```bash
cd backend
npm run dev
# Runs on http://localhost:3001
```

#### Terminal 2: Web Frontend
```bash
cd web
npm run dev
# Runs on http://localhost:3000
```

#### Terminal 3: Worker (optional for basic development)
```bash
cd worker
npm run dev
```

#### Terminal 4: Mobile (optional)
```bash
cd mobile
npm start
# Opens Expo DevTools
```

### Verify Everything is Running

1. **Backend Health Check**: 
   - Open http://localhost:3001/health
   - Should see: `{"status":"healthy",...}`

2. **Web Frontend**: 
   - Open http://localhost:3000
   - Should see the home page

3. **Test Authentication**:
   - Go to http://localhost:3000/auth
   - Try registering a new user

## Development Workflow

### Making Changes

1. Create a feature branch:
```bash
git checkout -b feature/your-feature-name
```

2. Make your changes

3. Test your changes:
```bash
# Backend
cd backend
npm test

# Web
cd web
npm test
```

4. Lint your code:
```bash
npm run lint
```

5. Commit and push:
```bash
git add .
git commit -m "Description of changes"
git push origin feature/your-feature-name
```

6. Open a Pull Request on GitHub

### Code Style

- Use ES6+ JavaScript features
- Follow existing code patterns
- Write meaningful commit messages
- Add comments for complex logic
- Keep functions small and focused

### Testing

#### Backend Tests
```bash
cd backend
npm test
npm run test:coverage
```

#### Web Tests
```bash
cd web
npm test
```

#### Integration Tests
```bash
# Run all services first, then:
npm run test:integration
```

### Database Management

#### View Current Schema
```bash
psql -U forjustice_user -d forjustice -c "\dt"
```

#### Create New Migration
```bash
cd backend/migrations
# Create new file: 002_your_migration.sql
```

#### Run Migration
```bash
psql -U forjustice_user -d forjustice -f migrations/002_your_migration.sql
```

#### Reset Database (careful!)
```bash
psql -U forjustice_user -d forjustice -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
psql -U forjustice_user -d forjustice -f migrations/001_initial_schema.sql
```

### API Testing

#### Using curl
```bash
# Register a user
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'

# Login
curl -X POST http://localhost:3001/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass123"}'
```

#### Using Postman
1. Import the API collection (if provided)
2. Set environment variables
3. Test endpoints

### Debugging

#### Backend Debugging (VS Code)
Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Debug Backend",
      "skipFiles": ["<node_internals>/**"],
      "program": "${workspaceFolder}/backend/server.js",
      "cwd": "${workspaceFolder}/backend"
    }
  ]
}
```

#### View Logs
```bash
# Backend logs
cd backend
tail -f logs/combined.log

# Watch logs in real-time
npm run dev | bunyan  # if bunyan is installed
```

#### Check Redis Queue
```bash
redis-cli
> KEYS *
> LLEN bull:question-processing:waiting
```

## Docker Development (Alternative)

### Using Docker Compose

Create `docker-compose.yml` in the root:
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: forjustice
      POSTGRES_USER: forjustice_user
      POSTGRES_PASSWORD: dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
  
  backend:
    build: ./backend
    ports:
      - "3001:8080"
    environment:
      DATABASE_URL: postgresql://forjustice_user:dev_password@postgres:5432/forjustice
      REDIS_HOST: redis
    depends_on:
      - postgres
      - redis
  
  web:
    build: ./web
    ports:
      - "3000:8080"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001/api/v1
    depends_on:
      - backend

volumes:
  postgres_data:
```

### Run with Docker
```bash
docker-compose up
```

## Troubleshooting

### Port Already in Use
```bash
# Find process using port 3001
lsof -i :3001
# Kill the process
kill -9 <PID>
```

### Database Connection Error
```bash
# Check if PostgreSQL is running
pg_isready
# Or
brew services list  # macOS
systemctl status postgresql  # Linux
```

### Redis Connection Error
```bash
# Check if Redis is running
redis-cli ping
# Or
brew services list  # macOS
systemctl status redis  # Linux
```

### npm Install Fails
```bash
# Clear npm cache
npm cache clean --force
# Remove node_modules and package-lock.json
rm -rf node_modules package-lock.json
# Reinstall
npm install
```

### Docker Build Fails
```bash
# Clear Docker cache
docker system prune -a
# Rebuild without cache
docker build --no-cache -t service-name .
```

## Common Tasks

### Add New API Endpoint

1. Create route handler in `backend/routes/`
2. Add route to `backend/server.js`
3. Test with curl or Postman
4. Add tests
5. Update API documentation

### Add New Page to Web

1. Create file in `web/pages/`
2. Add navigation link
3. Test locally
4. Add responsive styles

### Update Database Schema

1. Create new migration file
2. Test migration locally
3. Add rollback script
4. Document changes

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [React Native Documentation](https://reactnative.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Redis Documentation](https://redis.io/docs/)

## Getting Help

- **GitHub Issues**: For bugs and features
- **Team Chat**: For quick questions
- **Documentation**: Check docs/ folder first

## Next Steps

1. Complete the setup above
2. Run the application locally
3. Test authentication flow
4. Explore the codebase
5. Pick an issue to work on
6. Make your first contribution!

---

**Happy Coding!** 🚀

**Last Updated**: 2024
