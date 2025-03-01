import User from '../models/User.js';
import Post from '../models/Post.js';

// ✅ Додавання/видалення поста із закладок
export const toggleFavorite = async (req, res) => {
    try {
        const { id } = req.params; // ID поста
        const userId = req.user.userId; // Поточний користувач

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'Користувач не знайдено' });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Пост не знайдено' });

        const isFavorited = user.favorites.includes(id);

        if (isFavorited) {
            user.favorites = user.favorites.filter(postId => postId.toString() !== id);
        } else {
            user.favorites.push(id);
        }

        await user.save();
        res.json({ message: isFavorited ? 'Пост видалено із закладок' : 'Пост додано в закладки', favorites: user.favorites });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

// ✅ Отримання всіх збережених постів
export const getFavorites = async (req, res) => {
    try {
        const userId = req.user.userId; // Поточний користувач

        const user = await User.findById(userId).populate('favorites');
        if (!user) return res.status(404).json({ message: 'Користувач не знайдено' });

        res.json(user.favorites);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};
