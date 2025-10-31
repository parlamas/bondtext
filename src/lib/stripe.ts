// lib/stripe.ts
import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
// Remove apiVersion - Stripe will use the default

// Helper to get or create Stripe customer
export const getOrCreateStripeCustomer = async (user: any, prisma: any) => {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || '',
    metadata: {
      userId: user.id,
    },
  });

  // Update user with Stripe customer ID
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
};