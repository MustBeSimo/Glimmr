import Stripe from 'stripe';

// Only initialize Stripe if we have an API key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeSecretKey 
  ? new Stripe(stripeSecretKey, {
      apiVersion: '2025-04-30.basil', // Using the required API version
    })
  : null;

export function getStripe() {
  if (!stripe) {
    throw new Error('Stripe has not been initialized. Please check your environment variables.');
  }
  return stripe;
} 