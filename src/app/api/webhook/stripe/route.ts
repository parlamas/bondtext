// app/api/webhooks/stripe/route.ts

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';
import type { Stripe } from 'stripe';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed.', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Use type guards to check the properties
        if (typeof session.customer_email !== 'string' || 
            typeof session.customer !== 'string' || 
            typeof session.subscription !== 'string') {
          console.error('Missing required session data:', session);
          break;
        }

        // Update user to premium
        await prisma.user.update({
          where: { 
            email: session.customer_email 
          },
          data: {
            isPremium: true,
            premiumSince: new Date(),
            stripeSubscriptionId: session.subscription,
            stripeCustomerId: session.customer,
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        
        // Check if we have the subscription ID
        if (typeof subscription.id !== 'string') {
          console.error('Missing subscription ID');
          break;
        }

        // Downgrade user if subscription is cancelled
        await prisma.user.update({
          where: { 
            stripeSubscriptionId: subscription.id 
          },
          data: {
            isPremium: false,
            stripeSubscriptionId: null,
          },
        });
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}