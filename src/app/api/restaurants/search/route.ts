//src/app/api/restaurants/search/route.ts

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const country = searchParams.get('country');
  const city = searchParams.get('city');

  if (!country || !city) {
    return NextResponse.json(
      { error: 'Country and city are required' },
      { status: 400 }
    );
  }

  try {
    const restaurants = await prisma.restaurant.findMany({
      where: {
        country: { contains: country, mode: 'insensitive' },
        city: { contains: city, mode: 'insensitive' },
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        restaurantCode: true,
        country: true,
        city: true,
      },
    });

    return NextResponse.json({ restaurants });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}