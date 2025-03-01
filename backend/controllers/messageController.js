import Message from '../models/Message.js';
import redis from 'redis';

// 🔧 Підключаємо Redis
const client = redis.createClient();

// 📩 Відправити повідомлення
export const sendMessage = async (req, res, next) => {
    try {
        const { recipient, text } = req.body;
        const sender = req.user.userId;

        if (!text) {
            return res.status(400).json({ message: 'Текст не може бути порожнім' });
        }

        const message = new Message({ sender, recipient, text });
        await message.save();

        // 🧹 Очищаємо кеш, щоб наступний запит отримав оновлені дані
        client.del(`messages:${sender}:${recipient}`);
        client.del(`messages:${recipient}:${sender}`);

        // 📡 WebSocket-сповіщення (якщо отримувач онлайн)
        if (global.onlineUsers && global.onlineUsers.has(recipient)) {
            global.onlineUsers.get(recipient).send(JSON.stringify(message));
        }

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

// 📥 Отримати всі повідомлення між двома користувачами
export const getMessages = async (req, res, next) => {
    try {
        const userId = req.user.userId;
        const { recipientId } = req.params;

        // Перевіряємо кеш Redis
        client.get(`messages:${userId}:${recipientId}`, async (err, cachedMessages) => {
            if (cachedMessages) {
                return res.json(JSON.parse(cachedMessages));
            } else {
                const messages = await Message.find({
                    $or: [
                        { sender: userId, recipient: recipientId },
                        { sender: recipientId, recipient: userId }
                    ]
                }).sort({ createdAt: 1 });

                // Зберігаємо в кеш Redis на 60 секунд
                client.setex(`messages:${userId}:${recipientId}`, 60, JSON.stringify(messages));

                res.json(messages);
            }
        });

    } catch (error) {
        next(error);
    }
};
