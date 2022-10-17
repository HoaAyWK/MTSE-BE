const authRouter = require('./routers/authRouter');
const categoryRouter = require('./routers/categoryRouter');
const userRouter = require('./routers/userRouter');
const walletRouter = require("./routers/walletRouter")

const appRoute = (app) => {
    app.use('/api/v1', authRouter);
    app.use('/api/v1', userRouter);
    app.use("/api/v1/category", categoryRouter);
    app.use('/api/v1/wallet', walletRouter);
};

module.exports = appRoute;