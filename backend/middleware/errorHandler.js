const errorHandler = (err, req, res, next) => {
    console.error('❌ Помилка сервера:', err.message);
    res.status(500).json({ message: 'Помилка сервера', error: err.message });
};

export default errorHandler;
