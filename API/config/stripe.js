
import Stripe from 'stripe';

let client = null;

export const getStripe = () => {
    if (!client) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not set');
        }
        client = new Stripe(process.env.STRIPE_SECRET_KEY);
    }
    return client;
};