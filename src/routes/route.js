const userRouter = require('./routers/userRouter')
const categoryRouter = require('./routers/categoryRouter')
const walletRouter = require("./routers/walletRouter")


const appRoute = (app) => {
    app.use("/api/v1/user", userRouter),
    app.use("/api/v1/category", categoryRouter)
    app.use('/api/v1/wallet', walletRouter)
}

module.exports = appRoute