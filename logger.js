import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf } = format;

// Define the log format
const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Create a logger
export default createLogger({
  level: 'info', // Set the log level (error, warn, info, verbose, debug, silly)
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    logFormat
  ),
  transports: [
    new transports.Console(), // Log to the console
    new transports.File({ filename: './database/logs.log' }) // Log to a file named logs.log
  ]
});
