const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');

const errorHandlersMiddleware = require('./middlewares/errorHandlers');
const route = require('./routes/route');
const checkoutController = require('./controllers/checkoutController')

const app = express();

app.post('/api/v1/webhook', express.raw({ type: 'application/json' }), checkoutController.stripeWebhook);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors({ origin: 'http://localhost:3000', allowedHeaders: 'Content-Type,Authorization', credentials: true }));
app.use(cookieParser());
app.use(fileUpload());

route(app);

app.use(errorHandlersMiddleware);

module.exports = app;