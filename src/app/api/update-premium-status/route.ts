// app/api/update-premium-status/route.ts

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { userId, subscriptionId } = await request.json();

  try {
    // Update user to premium
    await prisma.user.update({
      where: { id: userId },
      data: {
        isPremium: true,
        premiumSince: new Date(),
        stripeSubscriptionId: subscriptionId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating premium status:', error);
    return NextResponse.json(
      { error: 'Failed to update premium status' },
      { status: 500 }
    );
  }
}