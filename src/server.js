require('dotenv').config();

const app = require('./app');
const { connectDatabase } = require('./config/database');
const appRoute = require("./routes/route")

const PORT = process.env.PORT || 5000;

connectDatabase();

appRoute(app)

app.listen(PORT, () => 
    console.log(`http://localhost:${PORT}`)
);