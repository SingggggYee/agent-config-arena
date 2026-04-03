/**
 * @typedef {Object} RateLimiterOptions
 * @property {number} windowMs - Time window in milliseconds
 * @property {number} maxRequests - Maximum requests per window
 * @property {string} [message] - Custom error message
 * @property {function(import('express').Request): string} [keyGenerator] - Custom key generator function
 * @property {number} [statusCode] - HTTP status code for rate limit response
 */

/**
 * @typedef {Object} RateLimitInfo
 * @property {number} count - Current request count
 * @property {number} resetTime - Timestamp when the window resets
 */

/** @type {Map<string, RateLimitInfo>} */
const store = new Map();

let cleanupInterval = null;

/**
 * Creates a rate limiter middleware for Express
 * @param {RateLimiterOptions} options - Configuration options
 * @returns {function} Express middleware function
 */
export function createRateLimiter(options) {
  const {
    windowMs,
    maxRequests,
    message = 'Too many requests, please try again later.',
    keyGenerator = (req) => req.ip || req.socket.remoteAddress || 'unknown',
    statusCode = 429,
  } = options;

  // Start cleanup interval if not already running
  if (!cleanupInterval) {
    cleanupInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, info] of store) {
        if (now > info.resetTime) {
          store.delete(key);
        }
      }
    }, windowMs);
    // Allow process to exit
    if (cleanupInterval.unref) {
      cleanupInterval.unref();
    }
  }

  return function rateLimiterMiddleware(req, res, next) {
    const key = keyGenerator(req);
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now > entry.resetTime) {
      store.set(key, { count: 1, resetTime: now + windowMs });
      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', String(maxRequests - 1));
      return next();
    }

    entry.count += 1;

    if (entry.count > maxRequests) {
      res.setHeader('X-RateLimit-Limit', String(maxRequests));
      res.setHeader('X-RateLimit-Remaining', '0');
      res.setHeader('Retry-After', String(Math.ceil((entry.resetTime - now) / 1000)));
      return res.status(statusCode).json({ error: message });
    }

    res.setHeader('X-RateLimit-Limit', String(maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(maxRequests - entry.count));
    next();
  };
}

/**
 * Resets the rate limiter store (useful for testing)
 */
export function resetRateLimiterStore() {
  store.clear();
}
