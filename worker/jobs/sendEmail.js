const logger = require('../utils/logger');

async function sendEmailJob(job) {
  const { to, subject, text, html } = job.data;

  logger.info('Sending email', { to, subject });

  try {
    // Placeholder for email sending logic
    // This would use SendGrid or similar service
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to, from: process.env.FROM_EMAIL, subject, text, html });

    logger.info('Email sent successfully', { to, subject });

    return { success: true, to };
  } catch (error) {
    logger.error('Error sending email', {
      to,
      subject,
      error: error.message
    });
    throw error;
  }
}

module.exports = sendEmailJob;
