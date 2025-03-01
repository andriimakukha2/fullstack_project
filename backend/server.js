import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import Redis from "ioredis";
import jwt from "jsonwebtoken";
import webpush from "./config/push.js";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import favoriteRoutes from "./routes/favoriteRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import pushRoutes from "./routes/pushRoutes.js";
import Message from "./models/Message.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();
const app = express();
connectDB();
const redis = new Redis();
const PORT = process.env.PORT || 5001;

const messageLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: "Забагато запитів! Спробуйте пізніше."
});

app.use(express.json());
app.use(cors());
app.use(logger);
app.use("/api/messages", messageLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/push", pushRoutes);
app.use(errorHandler);

app.get("/", (req, res) => res.send("API працює!"));

// **WebSocket-сервер**
const server = http.createServer(app);
const wss = new WebSocketServer({ server });
const onlineSockets = new Map();

wss.on("connection", async (ws, req) => {
    const token = req.url.split("token=")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        onlineSockets.set(userId, ws);
        console.log(`🔌 Користувач ${userId} підключився`);

        await redis.set(`online:${userId}`, "true", "EX", 3600);

        ws.on("message", async (messageData) => {
            try {
                const data = JSON.parse(messageData);

                if (data.type === "MESSAGE") {
                    const { recipient, text } = data;
                    const message = new Message({ sender: userId, recipient, text });
                    await message.save();

                    const recipientSocket = onlineSockets.get(recipient);
                    if (recipientSocket && recipientSocket.readyState === ws.OPEN) {
                        recipientSocket.send(JSON.stringify(message));
                    } else {
                        const subscription = await redis.get(`push:${recipient}`);
                        if (subscription) {
                            webpush.sendNotification(
                                JSON.parse(subscription),
                                JSON.stringify({ title: "Нове повідомлення!", body: text })
                            );
                        }
                    }
                }

                if (data.type === "DELETE_MESSAGE") {
                    await Message.findByIdAndDelete(data.messageId);
                    const recipientSocket = onlineSockets.get(data.recipient);
                    if (recipientSocket && recipientSocket.readyState === ws.OPEN) {
                        recipientSocket.send(
                            JSON.stringify({ type: "MESSAGE_DELETED", messageId: data.messageId })
                        );
                    }
                }

                if (data.type === "TYPING") {
                    const recipientSocket = onlineSockets.get(data.recipient);
                    if (recipientSocket && recipientSocket.readyState === ws.OPEN) {
                        recipientSocket.send(JSON.stringify({ type: "TYPING", sender: data.sender }));
                    }
                }
            } catch (error) {
                console.error("❌ Помилка WebSocket:", error);
            }
        });

        ws.on("close", async () => {
            onlineSockets.delete(userId);
            await redis.del(`online:${userId}`);
            console.log(`🔴 Користувач ${userId} офлайн`);
        });
    } catch (error) {
        console.log("❌ Невірний токен WebSocket:", error);
        ws.close();
    }
});

server.listen(PORT, () => console.log(`🚀 Сервер і WebSocket запущено на порту ${PORT}`));
