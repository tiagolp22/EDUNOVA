const errorHandler = (err, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(err.stack);
        res.status(500).json({ error: err.message });
    } else {
        console.error('Error:', err.message); // Simplified logging for production
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = errorHandler;
