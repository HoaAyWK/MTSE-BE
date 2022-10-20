# MTSE-BE
## To run this project
### Clone this project
    git clone https://github.com/HoaAyWK/MTSE-BE.git
    cd MTSE-BE
### Create .env file inside MTSE-BE directory and provide these env values
    PORT=5001
    NODE_ENV=development
    MONGODB_URL=<your_mongodb_url>
    JWT_SECRET=<your_jwt_secret>
    JWT_ACCESS_EXPIRATION_DAYS=
    JWT_REFRESH_EXPIRATION_DAYS=
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES=
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=
    SMTP_HOST=
    SMTP_PORT=
    SMTP_USERNAME=
    SMTP_PASSWORD=
    EMAIL_FROM=
    SMTP_FROM_EMAIL=
    SMTP_FROM_NAME=
    SMTP_EMAIL=
    COOKIE_EXPIRES_TIME=
    STRIPE_PUBLIC_KEY=<your_stripe_pk>
    STRIPE_SECRET_KEY=<your_stripe_sk>
    STRIPE_WEBHOOK_SECRET=<your_stripe_webhook_secret>
    PAYMENT_SUCCESS_URL=http://localhost:5001/api/v1/checkout/success
    PAYMENT_CANCEL_URL=http://localhost:5001/api/v1/checkout/failure

### After that, run
    npm i
    npm run seeder
    npm start
### Server listening on PORT that your provide in .env file.
