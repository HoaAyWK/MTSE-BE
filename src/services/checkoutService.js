const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const ApiError = require('../utils/ApiError');
const creditService = require('./creditService');
const paymentHistoryService = require('./paymentHistoryService');
const walletService = require('./walletService');
const { paymentStatus } = require('../config/paymentStatus');

class CheckoutService {
    async checkoutWithStripe(userId, creditId) {
        const credit = await creditService.getCreditById(creditId);

        if (!credit) {
            throw new ApiError(404, 'Credit not found');
        }

        try {
            const session = await stripe.checkout.sessions.create({
                mode: 'payment',
                success_url: process.env.PAYMENT_SUCCESS_URL,
                cancel_url: process.env.PAYMENT_CANCEL_URL,
                payment_method_types: ['card'],
                line_items: [{
                        price_data: {
                            currency: 'usd',
                            product_data: {
                                name: credit.name
                            },
                            unit_amount: credit.price,
                        },
                        quantity: 1
                    }
                ],
                metadata: {
                    'user_id': userId,
                    'credit_id': creditId
                }
            });

            const paymentHistory = await paymentHistoryService.createPaymentHistory({
                user: userId,
                credit: creditId,
                paymentIntent: session.payment_intent
            });

            return session;
        } catch (error) {
            throw new ApiError(500, error.message);
        }
    }

    async stripeWebhook (req) {
        let event = req.body;

        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        if (webhookSecret) {
            const signature = req.headers["stripe-signature"];
            try {
                event = stripe.webhooks.constructEvent(
                    req.body,
                    signature,
                    webhookSecret
                );
    
            } catch (error) {
                console.log(`⚠️  Webhook signature verification failed.`, error.message);
                throw new ApiError(500, error.message);
            }
        }
    
        switch (event.type) {
            case "checkout.session.completed":
                const { payment_intent } = event.data.object;
                const { user_id, credit_id } = event.data.object.metadata;       
                const credit = await creditService.getCreditById(credit_id);
                const wallet = await walletService.getWalletByUser(user_id);
                console.log(wallet);
                const paymentHistory = await paymentHistoryService.getPaymentHistoryByPaymentIntent(payment_intent);

                await paymentHistoryService.updatePaymentHistory(paymentHistory.id, { status: paymentStatus.SUCCESS });
                await walletService.addPoint(wallet._id, credit.points);
    
                break;
            default:
                console.log(`Unhandled event type ${event.type}.`);
        }
    }
}

module.exports = new CheckoutService;