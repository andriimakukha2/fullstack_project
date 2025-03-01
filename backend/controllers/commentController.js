import Post from '../models/Post.js';

// ✅ Додавання коментаря
export const addComment = async (req, res) => {
    try {
        const { id } = req.params; // ID поста
        const { text } = req.body;
        const userId = req.user.userId; // Поточний користувач

        if (!text) return res.status(400).json({ message: 'Коментар не може бути порожнім' });

        const post = await Post.findById(id);
        if (!post) return res.status(404).json({ message: 'Пост не знайдено' });

        const comment = { user: userId, text, createdAt: new Date() };
        post.comments.push(comment);

        await post.save();
        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};

// ✅ Отримання всіх коментарів
export const getComments = async (req, res) => {
    try {
        const { id } = req.params; // ID поста

        const post = await Post.findById(id).populate('comments.user', 'username avatar');
        if (!post) return res.status(404).json({ message: 'Пост не знайдено' });

        res.json(post.comments);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера' });
    }
};
