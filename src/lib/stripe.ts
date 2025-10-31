// lib/stripe.ts

import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-10-29.clover', // Updated to latest version
});

export const getStripeCustomerId = async (user: any) => {
  if (user.stripeCustomerId) {
    return user.stripeCustomerId;
  }

  // Create new Stripe customer
  const customer = await stripe.customers.create({
    email: user.email,
    name: user.name || '',
    metadata: {
      userId: user.id,
    },
  });

  // Update user with Stripe customer ID
  // Note: You'll need to import prisma here
  const { prisma } = await import('./prisma');
  
  await prisma.user.update({
    where: { id: user.id },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
};

