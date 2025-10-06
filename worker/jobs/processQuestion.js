const logger = require('../utils/logger');
const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function processQuestionJob(job) {
  const { questionId, questionText, areaOfLaw, province, userId } = job.data;

  logger.info('Processing question', { questionId, userId });

  try {
    // Call AI service to generate answer
    const prompt = `
You are a legal information assistant for forjustice.ca, helping users in ${province}, Canada understand ${areaOfLaw}.

User's question: ${questionText}

Please provide a clear, accurate legal information response in plain language. Remember:
- This is legal information, not legal advice
- Be specific to ${province} laws and procedures
- Use simple, accessible language
- Include relevant next steps or considerations
- Format for easy reading

Answer:`;

    const completion = await openai.chat.completions.create({
      model: process.env.AI_MODEL || 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful legal information assistant. Provide clear, accurate information while emphasizing you are not providing legal advice.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: parseInt(process.env.AI_MAX_TOKENS) || 4000,
      temperature: 0.7
    });

    const answer = completion.choices[0].message.content;

    // Store answer in database (implement database connection similar to backend)
    // await db.query('INSERT INTO answers (question_id, answer_text, ai_model) VALUES ($1, $2, $3)', 
    //   [questionId, answer, completion.model]);

    logger.info('Question processed successfully', { questionId });

    return { success: true, questionId, answer };
  } catch (error) {
    logger.error('Error processing question', {
      questionId,
      error: error.message,
      stack: error.stack
    });
    throw error;
  }
}

module.exports = processQuestionJob;
