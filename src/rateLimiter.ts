import { Request, Response, NextFunction } from 'express';
import redisClient from './redisClient.js'; 

const LIMIT = 5; // Maximum number of requests allowed
const WINDOW_SIZE_IN_SECONDS = 60; // Time frame (1 minute)



export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    // We use the user's IP address as the unique key in Redis
    const ip = req.ip || 'anonymous';
    const key = `rate-limit:${ip}`;

    try {
        // INCR increments the number in Redis. If the key doesn't exist, it creates it starting at 1.
        const requests = await redisClient.incr(key);

        if (requests === 1) {
            // If this is the first request, set the expiration to 60 seconds
            await redisClient.expire(key, WINDOW_SIZE_IN_SECONDS);
        }

        if (requests > LIMIT) {
            // If they exceed the limit, block the request here
            return res.status(429).json({
                error: 'Too many requests',
                message: `Rate limit exceeded. Try again in a minute.`,
                limit: LIMIT,
                current: requests
            });
        }

        // If they are under the limit, move to the next function
        next();
    } catch (err) {
        console.error('Rate Limiter Middleware Error:', err);
        // If Redis is down, we still want our app to work, so we call next()
        next();
    }
};