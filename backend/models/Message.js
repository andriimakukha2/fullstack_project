import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    isRead: { type: Boolean, default: false }, // Додаємо статус прочитаного повідомлення
    createdAt: { type: Date, default: Date.now }
});

// 🔹 Додаємо індексацію для швидкого пошуку повідомлень між двома користувачами
MessageSchema.index({ sender: 1, recipient: 1, createdAt: -1 });

export default mongoose.model('Message', MessageSchema);
