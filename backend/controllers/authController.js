import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Отримуємо секретний ключ для JWT
const SECRET_KEY = process.env.JWT_SECRET || 'fallbackSecretKey';

// ✅ Реєстрація користувача
export const register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // Перевірка, чи існує такий email або username
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Такий email вже існує' });
        }

        const existingUsername = await User.findOne({ username });
        if (existingUsername) {
            return res.status(400).json({ message: 'Такий username вже зайнятий' });
        }

        // Хешування пароля
        const hashedPassword = await bcrypt.hash(password, 10);

        // Створення нового користувача
        const newUser = new User({ username, email, password: hashedPassword, role: 'user' });
        await newUser.save();

        // 🔥 Генерація токена
        const token = jwt.sign({ userId: newUser._id, role: 'user' }, SECRET_KEY, { expiresIn: '7d' });

        console.log('✅ Токен створено:', token);

        // ✅ Відправка даних користувача + токен
        res.status(201).json({
            user: { id: newUser._id, username: newUser.username, email: newUser.email, role: 'user' },
            token
        });

    } catch (error) {
        console.error('❌ Помилка реєстрації:', error);
        next(error); // Передаємо помилку в middleware errorHandler
    }
};

// ✅ Вхід користувача
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Неправильний email або пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Неправильний email або пароль' });
        }

        // 🔥 Генерація токена
        const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: '7d' });

        // ✅ Відправка даних користувача + токен
        res.json({
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
            token
        });

    } catch (error) {
        console.error('❌ Помилка авторизації:', error);
        next(error);
    }
};

// ✅ Отримання профілю користувача (захищено)
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Користувач не знайдений' });
        }

        res.json(user);
    } catch (error) {
        console.error('❌ Помилка отримання профілю:', error);
        next(error);
    }
};
