import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectRedis } from './redisClient'; // Add this

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to Redis before starting the server
connectRedis(); 

app.get('/', (req: Request, res: Response) => {
  res.send('GuardPost Proxy is Running!');
});

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`);
});