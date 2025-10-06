# Troubleshooting Guide - forjustice.ca

## Common Issues and Solutions

### Backend Issues

#### Database Connection Errors

**Symptom**: Backend fails to start with "connection refused" or "database not found"

**Solutions**:
1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   # Linux
   systemctl status postgresql
   # Docker
   docker-compose ps postgres
   ```

2. Verify database credentials:
   ```bash
   psql -U forjustice_user -d forjustice -h localhost
   ```

3. Check DATABASE_URL in `.env`:
   ```env
   DATABASE_URL=postgresql://forjustice_user:dev_password@localhost:5432/forjustice
   ```

4. Recreate database if corrupted:
   ```bash
   dropdb forjustice
   createdb forjustice
   psql -U forjustice_user -d forjustice -f backend/migrations/001_initial_schema.sql
   ```

#### Redis Connection Errors

**Symptom**: Worker or backend logs show "Redis connection failed"

**Solutions**:
1. Check if Redis is running:
   ```bash
   redis-cli ping
   # Should return: PONG
   ```

2. Start Redis:
   ```bash
   # macOS
   brew services start redis
   # Linux
   sudo systemctl start redis
   # Docker
   docker-compose up redis
   ```

3. Verify Redis host/port in `.env`:
   ```env
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```

#### Port Already in Use

**Symptom**: "Error: listen EADDRINUSE: address already in use :::3001"

**Solutions**:
1. Find and kill process:
   ```bash
   # Find process using port 3001
   lsof -i :3001
   # Kill it
   kill -9 <PID>
   ```

2. Use different port:
   ```env
   PORT=3002
   ```

#### JWT Authentication Failures

**Symptom**: "Invalid token" or "Token expired"

**Solutions**:
1. Clear stored tokens:
   ```javascript
   localStorage.clear(); // In browser console
   ```

2. Verify JWT_SECRET matches between environments

3. Check token expiry settings:
   ```env
   JWT_EXPIRES_IN=7d
   ```

### Frontend Issues

#### API Connection Errors

**Symptom**: Frontend can't connect to backend API

**Solutions**:
1. Verify backend is running:
   ```bash
   curl http://localhost:3001/health
   ```

2. Check CORS settings in backend:
   ```env
   CORS_ORIGIN=http://localhost:3000
   ```

3. Verify API URL in frontend:
   ```env
   # .env.local
   NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
   ```

#### Next.js Build Errors

**Symptom**: "Error: Cannot find module" or build fails

**Solutions**:
1. Clear cache and rebuild:
   ```bash
   rm -rf .next node_modules
   npm install
   npm run build
   ```

2. Check for missing dependencies:
   ```bash
   npm install
   ```

#### Page Not Found (404)

**Symptom**: Navigating to a route shows 404

**Solutions**:
1. Verify file exists in `pages/` directory
2. Check file naming (lowercase, no spaces)
3. Restart dev server:
   ```bash
   npm run dev
   ```

### Worker Issues

#### Jobs Not Processing

**Symptom**: Jobs stay in "waiting" state

**Solutions**:
1. Check worker is running:
   ```bash
   ps aux | grep worker
   ```

2. Verify Redis connection

3. Check worker logs:
   ```bash
   cd worker
   tail -f logs/combined.log
   ```

4. Inspect queue in Redis:
   ```bash
   redis-cli
   > LLEN bull:question-processing:waiting
   > LRANGE bull:question-processing:waiting 0 -1
   ```

#### Job Failures

**Symptom**: Jobs repeatedly fail and retry

**Solutions**:
1. Check error logs:
   ```bash
   redis-cli
   > LRANGE bull:question-processing:failed 0 -1
   ```

2. Verify external API keys (OpenAI, etc.)

3. Check job timeout settings:
   ```env
   JOB_TIMEOUT=300000
   ```

### Docker Issues

#### Build Failures

**Symptom**: Docker build fails with errors

**Solutions**:
1. Clear Docker cache:
   ```bash
   docker system prune -a
   ```

2. Rebuild without cache:
   ```bash
   docker-compose build --no-cache
   ```

3. Check Dockerfile syntax

#### Container Exits Immediately

**Symptom**: Container starts then exits

**Solutions**:
1. Check logs:
   ```bash
   docker logs forjustice-backend
   ```

2. Verify environment variables

3. Check health checks:
   ```bash
   docker inspect forjustice-backend
   ```

#### Volume Permission Issues

**Symptom**: "Permission denied" in containers

**Solutions**:
1. Fix volume permissions:
   ```bash
   sudo chown -R $USER:$USER ./backend
   ```

2. Use named volumes instead of bind mounts

### Mobile App Issues

#### Expo Connection Issues

**Symptom**: Can't connect to Expo dev server

**Solutions**:
1. Ensure devices on same network

2. Use tunnel mode:
   ```bash
   npm start -- --tunnel
   ```

3. Check firewall settings

#### API Connection from Mobile

**Symptom**: Mobile app can't reach backend

**Solutions**:
1. Use local IP instead of localhost:
   ```env
   API_URL=http://192.168.1.x:3001/api/v1
   ```

2. For Android emulator:
   ```env
   API_URL=http://10.0.2.2:3001/api/v1
   ```

3. For iOS simulator:
   ```env
   API_URL=http://localhost:3001/api/v1
   ```

### Deployment Issues

#### Cloud Run Deployment Fails

**Symptom**: Deployment fails or service unhealthy

**Solutions**:
1. Check build logs:
   ```bash
   gcloud builds log <BUILD_ID>
   ```

2. Verify Dockerfile builds locally:
   ```bash
   docker build -t test .
   docker run -p 8080:8080 test
   ```

3. Check environment variables are set

4. Verify service account permissions

#### Database Connection in Cloud Run

**Symptom**: Cloud Run can't connect to Cloud SQL

**Solutions**:
1. Add Cloud SQL connection:
   ```bash
   --set-cloudsql-instances=PROJECT:REGION:INSTANCE
   ```

2. Use Unix socket connection:
   ```env
   DATABASE_URL=postgresql://user:pass@/dbname?host=/cloudsql/connection-name
   ```

3. Verify service account has Cloud SQL Client role

#### Health Check Failures

**Symptom**: Cloud Run marks service as unhealthy

**Solutions**:
1. Test health endpoint locally:
   ```bash
   curl http://localhost:8080/health
   ```

2. Check startup time (increase timeout if needed)

3. Verify dependencies (DB, Redis) are accessible

### Performance Issues

#### Slow API Response

**Symptom**: API requests take too long

**Solutions**:
1. Check database query performance:
   ```sql
   EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';
   ```

2. Add database indexes:
   ```sql
   CREATE INDEX idx_users_email ON users(email);
   ```

3. Enable query logging:
   ```env
   LOG_LEVEL=debug
   ```

4. Monitor with Cloud Monitoring

#### High Memory Usage

**Symptom**: Container uses too much memory

**Solutions**:
1. Check for memory leaks:
   ```bash
   node --inspect server.js
   # Use Chrome DevTools
   ```

2. Increase memory limit:
   ```bash
   --memory 1Gi
   ```

3. Optimize database connection pool:
   ```javascript
   max: 10  // Reduce pool size
   ```

#### Database Connection Pool Exhausted

**Symptom**: "Too many connections" error

**Solutions**:
1. Increase pool size:
   ```javascript
   max: 20
   ```

2. Check for connection leaks (unclosed connections)

3. Reduce connection timeout:
   ```javascript
   idleTimeoutMillis: 10000
   ```

### Security Issues

#### CORS Errors

**Symptom**: "CORS policy" errors in browser

**Solutions**:
1. Add origin to CORS config:
   ```env
   CORS_ORIGIN=http://localhost:3000,https://forjustice.ca
   ```

2. Verify CORS middleware is before routes

#### Rate Limit Hit

**Symptom**: "Too many requests" response

**Solutions**:
1. Increase rate limit:
   ```env
   RATE_LIMIT_MAX_REQUESTS=200
   ```

2. Whitelist IP addresses

3. Implement user-based rate limiting

## Debugging Tips

### Enable Debug Logging

```env
LOG_LEVEL=debug
NODE_ENV=development
```

### Monitor Logs in Real-Time

```bash
# Backend
tail -f backend/logs/combined.log

# Cloud Run
gcloud logging tail "resource.type=cloud_run_revision"

# Docker
docker logs -f forjustice-backend
```

### Database Debugging

```bash
# Enable query logging
psql -U forjustice_user -d forjustice
\set ECHO_HIDDEN on

# Show slow queries
SELECT * FROM pg_stat_statements ORDER BY total_time DESC LIMIT 10;
```

### Network Debugging

```bash
# Test connectivity
nc -zv localhost 3001
curl -v http://localhost:3001/health

# Check DNS
nslookup forjustice.ca
dig forjustice.ca
```

## Getting Help

If you can't resolve the issue:

1. **Check logs**: Always start with logs
2. **Search issues**: Check GitHub issues for similar problems
3. **Documentation**: Review relevant documentation
4. **Stack Overflow**: Search for error messages
5. **Create issue**: Open a GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Logs

## Emergency Contacts

- **Technical Lead**: [email]
- **DevOps**: [email]
- **On-call**: [phone/slack]

---

**Last Updated**: 2024  
**Document Version**: 1.0
