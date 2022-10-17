const authRouter = require('./routers/authRouter');

const appRoute = (app) => {
    app.use('/api/v1', authRouter)
};

module.exports = appRoute;