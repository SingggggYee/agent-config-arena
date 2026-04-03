/**
 * @typedef {Object} LogEntry
 * @property {string} method - HTTP method
 * @property {string} url - Request URL
 * @property {number} statusCode - Response status code
 * @property {number} duration - Request duration in milliseconds
 * @property {string} timestamp - ISO timestamp
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {function(LogEntry): string} [format] - Custom format function
 * @property {function(string): void} [output] - Custom output function
 * @property {boolean} [skip404] - Whether to skip logging 404 responses
 */

/**
 * Creates a request logger middleware for Express
 * @param {LoggerOptions} [options] - Configuration options
 * @returns {function} Express middleware function
 */
export function createLogger(options = {}) {
  const {
    format = defaultFormat,
    output = console.log,
    skip404 = false,
  } = options;

  return function loggerMiddleware(req, res, next) {
    const startTime = Date.now();

    // Capture the original end method
    const originalEnd = res.end;

    res.end = function (...args) {
      const duration = Date.now() - startTime;

      if (skip404 && res.statusCode === 404) {
        return originalEnd.apply(res, args);
      }

      /** @type {LogEntry} */
      const entry = {
        method: req.method,
        url: req.originalUrl || req.url,
        statusCode: res.statusCode,
        duration,
        timestamp: new Date().toISOString(),
      };

      output(format(entry));
      return originalEnd.apply(res, args);
    };

    next();
  };
}

/**
 * Default log format
 * @param {LogEntry} entry
 * @returns {string}
 */
function defaultFormat(entry) {
  return `[${entry.timestamp}] ${entry.method} ${entry.url} ${entry.statusCode} ${entry.duration}ms`;
}
