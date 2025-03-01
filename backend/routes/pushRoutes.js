import express from 'express';
import Redis from 'ioredis';

const router = express.Router();
const redis = new Redis();

// Збереження підписки
router.post('/subscribe', async (req, res) => {
    const { userId, subscription } = req.body;
    await redis.set(`push:${userId}`, JSON.stringify(subscription));
    res.status(200).json({ message: 'Підписку збережено' });
});

export default router;
