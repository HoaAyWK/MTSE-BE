const userRouter = require('./routers/userRouter')

const appRoute = (app) => {
    app.use("/api/v1/user", userRouter)
}

module.exports = appRoute