import { Request, Response } from 'express';
import axios from 'axios';
import redisClient from './redisClient';

export const handleProxyRequest = async (req: Request, res: Response) => {
    try {
        // We use the URL path as a cache key (e.g., 'cache:/posts/1')
        const cacheKey = `cache:${req.originalUrl}`;

        // 1. Check if we have the data in Redis (Cache Hit)
        const cachedData = await redisClient.get(cacheKey);
        if (cachedData) {
            console.log('--- Cache Hit! Serving from Redis ---');
            return res.json(JSON.parse(cachedData));
        }

        // 2. If not in Redis, fetch from the real API (Cache Miss)
        console.log('--- Cache Miss! Fetching from External API ---');
        const targetUrl = `${process.env.EXTERNAL_API_URL}${req.originalUrl}`;
        const response = await axios.get(targetUrl);

        // 3. Save the result in Redis for 30 seconds so the next person gets it fast
        await redisClient.setEx(cacheKey, 30, JSON.stringify(response.data));

        // 4. Send the data to the user
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data from API' });
    }
};