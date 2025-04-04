import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    
    if (!data.email || !data.brand || !data.model || !data.fuelType || !data.price) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User with this email not found' },
        { status: 404 }
      );
    }

    const newCar = await prisma.car.create({
      data: {
        brand: data.brand,
        model: data.model,
        fuelType: data.fuelType,
        price: data.price,
        ownerId: user.id,
      }
    });

    return NextResponse.json(
      { success: true, message: 'Car added successfully', car: newCar },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error adding car:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to add car' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}