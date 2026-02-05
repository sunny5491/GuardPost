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

// Health Check Route (To verify the server is up)
app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'active', service: 'GuardPost Proxy' });
});

// The Proxy Route
// We use '*' to capture any path the user types (e.g., /posts, /users, /todos)
// These requests will be forwarded to the external API and cached.
app.get('*', handleProxyRequest);

// --- SERVER START ---
app.listen(PORT, () => {
  console.log(`
  🛡️  GuardPost is running!
  🚀 Server: http://localhost:${PORT}
  📡 Proxying to: ${process.env.EXTERNAL_API_URL}
  `);
});