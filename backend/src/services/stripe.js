const Stripe = require('stripe');
const { stripeSecretKey } = require('../config');
const prisma = require('./prisma');

const stripe = new Stripe(stripeSecretKey);

async function createCheckoutSession({ userId, gameId, amount }) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          product_data: { name: `Entry fee for game ${gameId}` },
          unit_amount: Math.round(amount * 100)
        },
        quantity: 1
      }
    ],
    mode: 'payment',
    success_url: `${process.env.FRONTEND_URL}/payment-success`,
    cancel_url: `${process.env.FRONTEND_URL}/payment-cancelled`,
    metadata: { userId, gameId }
  });
  return session;
}

// TODO: Stripe webhooks should update payment records.

module.exports = { createCheckoutSession };
