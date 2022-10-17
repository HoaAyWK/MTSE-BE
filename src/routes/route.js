const userRouter = require('./routers/userRouter')
const categoryRouter = require('./routers/categoryRouter')
const appRoute = (app) => {
    app.use("/api/v1/user", userRouter),
    app.use("/api/v1/category", categoryRouter)
}

module.exports = appRoute