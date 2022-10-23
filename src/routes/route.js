const authRouter = require('./routers/authRouter');
const categoryRouter = require('./routers/categoryRouter');
const userRouter = require('./routers/userRouter');
const walletRouter = require("./routers/walletRouter");
const creditRouter = require('./routers/creditRouter');
const checkoutRouter = require('./routers/checkoutRouter');
const paymentRouter = require('./routers/paymentHistoryRouter');
const jobRouter = require('./routers/jobRouter');
const commentRouter = require('./routers/commentRouter');
const taskRouter = require('./routers/taskRouter');
const transactionRouter = require('./routers/transactionRouter');
const pointHisories = require('./routers/pointHistoryRouter');

const appRoute = (app) => {
    app.use('/api/v1', authRouter);
    app.use('/api/v1', userRouter);
    app.use("/api/v1", categoryRouter);
    app.use('/api/v1/wallet', walletRouter);
    app.use('/api/v1', creditRouter);
    app.use('/api/v1', checkoutRouter);
    app.use('/api/v1', paymentRouter);
    app.use('/api/v1', jobRouter);
    app.use('/api/v1', commentRouter);
    app.use('/api/v1', transactionRouter)
    app.use('/api/v1', taskRouter);
    app.use('/api/v1', pointHisories);
};

module.exports = appRoute;