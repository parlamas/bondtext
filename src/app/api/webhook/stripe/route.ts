// app/api/webhook/stripe/route.ts

import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event: any;

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
        
        // Check if we have the necessary data
        if (!session.customer_email || !session.customer || !session.subscription) {
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
        if (!subscription.id) {
          console.error('Missing subscription ID');
          break;
        }

        // Find user by stripeSubscriptionId first, then update
        const user = await prisma.user.findFirst({
          where: {
            stripeSubscriptionId: subscription.id
          }
        });

        if (user) {
          // Downgrade user if subscription is cancelled
          await prisma.user.update({
            where: { 
              id: user.id 
            },
            data: {
              isPremium: false,
              stripeSubscriptionId: null,
            },
          });
        } else {
          console.error('User not found for subscription:', subscription.id);
        }
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