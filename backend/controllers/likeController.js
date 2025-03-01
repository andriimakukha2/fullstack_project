import Post from '../models/Post.js';

// ✅ Лайк/дизлайк поста
export const toggleLike = async (req, res) => {
    try {
        const { id } = req.params; // ID поста
        const userId = req.user.userId; // Поточний користувач

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Пост не знайдено' });

        const hasLiked = post.likes.includes(userId);

        if (hasLiked) {
            post.likes = post.likes.filter(uid => uid.toString() !== userId);
        } else {
            post.likes.push(userId);
        }

        await post.save();
        res.json({ message: hasLiked ? 'Лайк видалено' : 'Лайк додано', likes: post.likes.length });
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};
