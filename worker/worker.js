require('dotenv').config();
const Bull = require('bull');
const logger = require('./utils/logger');
const processQuestionJob = require('./jobs/processQuestion');
const generateDocumentJob = require('./jobs/generateDocument');
const sendEmailJob = require('./jobs/sendEmail');

const REDIS_CONFIG = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  maxRetriesPerRequest: null,
  enableReadyCheck: false
};

// Create queues
const questionQueue = new Bull('question-processing', {
  redis: REDIS_CONFIG,
  defaultJobOptions: {
    attempts: parseInt(process.env.MAX_JOB_ATTEMPTS) || 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    timeout: parseInt(process.env.JOB_TIMEOUT) || 300000
  }
});

const documentQueue = new Bull('document-generation', {
  redis: REDIS_CONFIG,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    timeout: 600000 // 10 minutes for document generation
  }
});

const emailQueue = new Bull('email-sending', {
  redis: REDIS_CONFIG,
  defaultJobOptions: {
    attempts: 5,
    backoff: {
      type: 'exponential',
      delay: 1000
    },
    timeout: 30000
  }
});

// Process jobs
const concurrency = parseInt(process.env.CONCURRENCY) || 5;

questionQueue.process(concurrency, processQuestionJob);
documentQueue.process(2, generateDocumentJob); // Lower concurrency for heavy tasks
emailQueue.process(10, sendEmailJob);

// Event listeners for question queue
questionQueue.on('completed', (job, result) => {
  logger.info('Question processing completed', {
    jobId: job.id,
    questionId: job.data.questionId,
    result
  });
});

questionQueue.on('failed', (job, err) => {
  logger.error('Question processing failed', {
    jobId: job.id,
    questionId: job.data.questionId,
    error: err.message,
    stack: err.stack
  });
});

// Event listeners for document queue
documentQueue.on('completed', (job, result) => {
  logger.info('Document generation completed', {
    jobId: job.id,
    documentId: job.data.documentId,
    result
  });
});

documentQueue.on('failed', (job, err) => {
  logger.error('Document generation failed', {
    jobId: job.id,
    documentId: job.data.documentId,
    error: err.message
  });
});

// Event listeners for email queue
emailQueue.on('completed', (job, result) => {
  logger.info('Email sent successfully', {
    jobId: job.id,
    to: job.data.to,
    subject: job.data.subject
  });
});

emailQueue.on('failed', (job, err) => {
  logger.error('Email sending failed', {
    jobId: job.id,
    to: job.data.to,
    error: err.message
  });
});

// Global error handlers
questionQueue.on('error', (error) => {
  logger.error('Question queue error', { error: error.message });
});

documentQueue.on('error', (error) => {
  logger.error('Document queue error', { error: error.message });
});

emailQueue.on('error', (error) => {
  logger.error('Email queue error', { error: error.message });
});

// Graceful shutdown
async function gracefulShutdown() {
  logger.info('Shutting down worker gracefully...');
  
  await Promise.all([
    questionQueue.close(),
    documentQueue.close(),
    emailQueue.close()
  ]);
  
  logger.info('All queues closed. Exiting.');
  process.exit(0);
}

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

logger.info('Worker started successfully', {
  concurrency,
  queues: ['question-processing', 'document-generation', 'email-sending']
});

// Health check endpoint (optional - can be exposed via HTTP server)
module.exports = { questionQueue, documentQueue, emailQueue };
