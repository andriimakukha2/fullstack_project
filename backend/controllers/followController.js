import User from '../models/User.js';

// ✅ Підписка на користувача
export const followUser = async (req, res) => {
    try {
        const { id } = req.params; // ID користувача, на якого підписуємось
        const currentUser = await User.findById(req.user.userId); // Поточний користувач

        if (!currentUser) return res.status(404).json({ message: 'Користувач не знайдений' });

        if (currentUser.following.includes(id)) {
            return res.status(400).json({ message: 'Ви вже підписані на цього користувача' });
        }

        // Додаємо ID до списків підписок і підписників
        await User.findByIdAndUpdate(id, { $push: { followers: req.user.userId } });
        await User.findByIdAndUpdate(req.user.userId, { $push: { following: id } });

        res.json({ message: 'Ви підписалися' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

// ✅ Відписка від користувача
export const unfollowUser = async (req, res) => {
    try {
        const { id } = req.params;
        const currentUser = await User.findById(req.user.userId);

        if (!currentUser) return res.status(404).json({ message: 'Користувач не знайдений' });

        if (!currentUser.following.includes(id)) {
            return res.status(400).json({ message: 'Ви не підписані на цього користувача' });
        }

        // Видаляємо ID зі списків
        await User.findByIdAndUpdate(id, { $pull: { followers: req.user.userId } });
        await User.findByIdAndUpdate(req.user.userId, { $pull: { following: id } });

        res.json({ message: 'Ви відписалися' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

// ✅ Отримати список підписок
export const getFollowing = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('following', 'username avatar');
        res.json(user.following);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

// ✅ Отримати список підписників
export const getFollowers = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).populate('followers', 'username avatar');
        res.json(user.followers);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};
