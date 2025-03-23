import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const carId = parseInt(params.id);
    if (isNaN(carId)) {
      return NextResponse.json(
        { success: false, message: 'Invalid car ID' },
        { status: 400 }
      );
    }

    const data = await req.json();

    const updatedCar = await prisma.car.update({
      where: { id: carId },
      data: {
        brand: data.brand,
        model: data.model,
        fuelType: data.fuelType,
        price: data.price ? Number(data.price) : undefined,
        ownerId: data.ownerId ? Number(data.ownerId) : undefined
      }
    });

    return NextResponse.json(
      { success: true, message: 'Car updated successfully', car: updatedCar },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error updating car:', error);
    return NextResponse.json(
      { 
        success: false,
        message: error.message?.includes('Record to update not found') 
          ? 'Car not found' 
          : 'Failed to update car'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}