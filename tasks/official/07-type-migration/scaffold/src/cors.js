/**
 * @typedef {Object} CorsOptions
 * @property {string|string[]} origin - Allowed origins
 * @property {string[]} [methods] - Allowed HTTP methods
 * @property {boolean} [credentials] - Whether to allow credentials
 * @property {number} [maxAge] - Preflight cache duration in seconds
 * @property {string[]} [allowedHeaders] - Allowed request headers
 * @property {string[]} [exposedHeaders] - Headers to expose to the browser
 */

/**
 * Creates a CORS middleware for Express
 * @param {CorsOptions} options - Configuration options
 * @returns {function} Express middleware function
 */
export function createCors(options) {
  const {
    origin,
    methods = ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials = false,
    maxAge = 86400,
    allowedHeaders = ['Content-Type', 'Authorization'],
    exposedHeaders = [],
  } = options;

  /**
   * Checks if the request origin is allowed
   * @param {string} requestOrigin
   * @returns {boolean}
   */
  function isOriginAllowed(requestOrigin) {
    if (typeof origin === 'string') {
      return origin === '*' || origin === requestOrigin;
    }
    if (Array.isArray(origin)) {
      return origin.includes(requestOrigin);
    }
    return false;
  }

  return function corsMiddleware(req, res, next) {
    const requestOrigin = req.headers.origin;

    if (requestOrigin && isOriginAllowed(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
    } else if (typeof origin === 'string' && origin === '*') {
      res.setHeader('Access-Control-Allow-Origin', '*');
    }

    if (credentials) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    if (exposedHeaders.length > 0) {
      res.setHeader('Access-Control-Expose-Headers', exposedHeaders.join(', '));
    }

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.setHeader('Access-Control-Allow-Methods', methods.join(', '));
      res.setHeader('Access-Control-Allow-Headers', allowedHeaders.join(', '));
      res.setHeader('Access-Control-Max-Age', String(maxAge));
      return res.status(204).end();
    }

    next();
  };
}
