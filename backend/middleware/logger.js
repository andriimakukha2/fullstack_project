const logger = (req, res, next) => {
    console.log(`📌 [${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('🛠 Тіло запиту:', req.body);
    next();
};

export default logger;
