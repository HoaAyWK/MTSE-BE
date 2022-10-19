const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const errorHandlersMiddleware = require('./middlewares/errorHandlers');
const route = require('./routes/route');
const checkoutController = require('./controllers/checkoutController')

const app = express();

app.post('/api/v1/webhook', express.raw({ type: 'application/json' }), checkoutController.stripeWebhook);

app.use(express.json());
app.use(cors());
app.use(cookieParser());

route(app);

app.use(errorHandlersMiddleware);

module.exports = app;