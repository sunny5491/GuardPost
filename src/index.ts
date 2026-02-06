import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectRedis } from './redisClient.js';
import { rateLimiter } from './rateLimiter.js';
import { handleProxyRequest } from './proxy.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize the Redis Connection
connectRedis();

// --- MIDDLEWARE ---

// This applies the Rate Limiter to every single incoming request
app.use(rateLimiter);

// --- ROUTES ---


// 1. Health Check Route
// We define this specifically so we can verify the server is alive
app.get('/health', (req: Request, res: Response) => {
  res.json({ 
    status: 'active', 
    service: 'GuardPost Proxy',
    timestamp: new Date().toISOString()
  });
});

// 2. The Proxy Handler
// By using app.use() without a string path, it catches EVERYTHING.
// This acts as a "catch-all" for any endpoint (e.g., /posts, /users, /)
app.use(handleProxyRequest);

// --- SERVER START ---



app.listen(PORT, () => {
  console.log(`
  🛡️  GuardPost is running!
  🚀 Server:  http://localhost:${PORT}
  🏥 Health:  http://localhost:${PORT}/health
  📡 Proxying: ${process.env.EXTERNAL_API_URL}
  `);
});