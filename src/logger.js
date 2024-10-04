// src/logger.js

const pino = require('pino');

// Determine the log level based on environment variables, defaulting to 'info'
const logLevel = process.env.LOG_LEVEL || 'info';

// Set up options for the logger
const options = {
  level: logLevel,
  ...(logLevel === 'debug' && {
    // If in debug mode, use 'pino-pretty' to format logs
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
      },
    },
  }),
};

// Create and export the Pino logger instance
const logger = pino(options);

module.exports = logger;
