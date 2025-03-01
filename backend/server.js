import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Redis from 'ioredis';
import webpush from './config/push.js';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import postRoutes from './routes/postRoutes.js';
import followRoutes from './routes/followRoutes.js';
import likeRoutes from './routes/likeRoutes.js';
import commentRoutes from './routes/commentRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import pushRoutes from './routes/pushRoutes.js';
import Message from './models/Message.js';
import logger from './middleware/logger.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();
const app = express();

// Підключення до MongoDB
connectDB();

// Підключення до Redis
const redis = new Redis();

const PORT = process.env.PORT || 5001;

// Ліміт запитів на повідомлення
const messageLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 хвилина
    max: 20, // Не більше 20 запитів за хвилину
    message: 'Забагато запитів! Спробуйте пізніше.'
});

app.use(express.json());
app.use(cors());
app.use(logger);

// Ліміти запитів застосовуються перед маршрутами
app.use('/api/messages', messageLimiter);

// Підключення маршрутів
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/follow', followRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/push', pushRoutes);

app.use(errorHandler);

// Основний маршрут
app.get('/', (req, res) => {
    res.send('API працює!');
});

// HTTP-сервер для WebSocket
const server = http.createServer(app);

// **WebSocketServer**
const wss = new WebSocketServer({ server });

// **Відстеження онлайн-користувачів через Redis**
wss.on('connection', (ws) => {
    console.log('🔌 Користувач підключився до WebSocket');

    ws.on('message', async (messageData) => {
        try {
            const data = JSON.parse(messageData);

            if (data.type === 'ONLINE') {
                await redis.set(`online:${data.userId}`, 'true', 'EX', 3600);
                console.log(`🟢 Користувач ${data.userId} онлайн`);
            }
            else if (data.type === 'OFFLINE') {
                await redis.del(`online:${data.userId}`);
                console.log(`🔴 Користувач ${data.userId} офлайн`);
            }
            else {
                const { sender, recipient, text } = data;
                const message = new Message({ sender, recipient, text });
                await message.save();

                const isRecipientOnline = await redis.exists(`online:${recipient}`);

                if (isRecipientOnline) {
                    wss.clients.forEach(client => {
                        if (client.readyState === ws.OPEN) {
                            client.send(JSON.stringify(message));
                        }
                    });
                } else {
                    const subscription = await redis.get(`push:${recipient}`);
                    if (subscription) {
                        webpush.sendNotification(
                            JSON.parse(subscription),
                            JSON.stringify({
                                title: 'Нове повідомлення!',
                                body: text,
                            })
                        );
                    }
                }
            }
        } catch (error) {
            console.error('❌ Помилка WebSocket:', error);
        }
    });

    ws.on('close', async () => {
        await redis.keys('online:*').then(keys => {
            keys.forEach(async key => {
                const userId = key.split(':')[1];
                await redis.del(key);
                console.log(`🔴 Користувач ${userId} офлайн`);
            });
        });
    });
});

// Запуск сервера
server.listen(PORT, () => console.log(`🚀 Сервер і WebSocket запущено на порту ${PORT}`));
