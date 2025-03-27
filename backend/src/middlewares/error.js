// Middleware para lidar com erros 404 (Not Found)
const notFound = (req, res, next) => {
    const error = new Error(`Não encontrado - ${req.originalUrl}`);
    res.status(404);
    next(error);
};

// Middleware para lidar com erros gerais
const errorHandler = (err, req, res, next) => {
    // Se o status code ainda for 200, alterar para 500
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
};

module.exports = { notFound, errorHandler };