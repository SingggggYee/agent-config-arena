import { describe, it, expect, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { createRateLimiter, resetRateLimiterStore, createCors, createLogger } from '../src/index.js';

// Helper to create a test app
function createApp(middleware) {
  const app = express();
  app.use(middleware);
  app.get('/test', (req, res) => res.json({ ok: true }));
  app.post('/test', (req, res) => res.json({ ok: true }));
  return app;
}

describe('Rate Limiter', () => {
  beforeEach(() => {
    resetRateLimiterStore();
  });

  it('should allow requests under the limit', async () => {
    const app = createApp(createRateLimiter({ windowMs: 60000, maxRequests: 5 }));
    const res = await request(app).get('/test');
    expect(res.status).toBe(200);
    expect(res.headers['x-ratelimit-limit']).toBe('5');
    expect(res.headers['x-ratelimit-remaining']).toBe('4');
  });

  it('should block requests over the limit', async () => {
    const app = createApp(createRateLimiter({ windowMs: 60000, maxRequests: 2 }));
    await request(app).get('/test');
    await request(app).get('/test');
    const res = await request(app).get('/test');
    expect(res.status).toBe(429);
    expect(res.body.error).toBe('Too many requests, please try again later.');
  });

  it('should use custom message', async () => {
    const app = createApp(createRateLimiter({ windowMs: 60000, maxRequests: 1, message: 'Slow down!' }));
    await request(app).get('/test');
    const res = await request(app).get('/test');
    expect(res.status).toBe(429);
    expect(res.body.error).toBe('Slow down!');
  });

  it('should set rate limit headers', async () => {
    const app = createApp(createRateLimiter({ windowMs: 60000, maxRequests: 10 }));
    const res = await request(app).get('/test');
    expect(res.headers['x-ratelimit-limit']).toBeDefined();
    expect(res.headers['x-ratelimit-remaining']).toBeDefined();
  });
});

describe('CORS', () => {
  it('should set CORS headers for allowed origin', async () => {
    const app = createApp(createCors({ origin: 'http://example.com' }));
    const res = await request(app)
      .get('/test')
      .set('Origin', 'http://example.com');
    expect(res.headers['access-control-allow-origin']).toBe('http://example.com');
  });

  it('should handle wildcard origin', async () => {
    const app = createApp(createCors({ origin: '*' }));
    const res = await request(app).get('/test');
    expect(res.headers['access-control-allow-origin']).toBe('*');
  });

  it('should handle preflight requests', async () => {
    const app = createApp(createCors({ origin: '*', methods: ['GET', 'POST'] }));
    const res = await request(app)
      .options('/test')
      .set('Origin', 'http://example.com');
    expect(res.status).toBe(204);
    expect(res.headers['access-control-allow-methods']).toContain('GET');
  });

  it('should set credentials header when enabled', async () => {
    const app = createApp(createCors({ origin: 'http://example.com', credentials: true }));
    const res = await request(app)
      .get('/test')
      .set('Origin', 'http://example.com');
    expect(res.headers['access-control-allow-credentials']).toBe('true');
  });

  it('should support array of origins', async () => {
    const app = createApp(createCors({ origin: ['http://a.com', 'http://b.com'] }));
    const res = await request(app)
      .get('/test')
      .set('Origin', 'http://b.com');
    expect(res.headers['access-control-allow-origin']).toBe('http://b.com');
  });
});

describe('Logger', () => {
  it('should log requests with default format', async () => {
    const logs = [];
    const app = createApp(createLogger({ output: (msg) => logs.push(msg) }));
    await request(app).get('/test');
    expect(logs).toHaveLength(1);
    expect(logs[0]).toContain('GET');
    expect(logs[0]).toContain('/test');
    expect(logs[0]).toContain('200');
  });

  it('should use custom format function', async () => {
    const logs = [];
    const app = createApp(createLogger({
      format: (entry) => `${entry.method}:${entry.statusCode}`,
      output: (msg) => logs.push(msg),
    }));
    await request(app).get('/test');
    expect(logs[0]).toBe('GET:200');
  });

  it('should skip 404 when configured', async () => {
    const logs = [];
    const app = express();
    app.use(createLogger({ output: (msg) => logs.push(msg), skip404: true }));
    app.get('/exists', (req, res) => res.json({ ok: true }));
    await request(app).get('/not-found');
    expect(logs).toHaveLength(0);
  });
});
