import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cars = await prisma.car.findMany({
      take: 16,
      include: {
        owner: true 
      }
    });

    const transformedCars = cars.map((car: { id: any; brand: any; model: any; fuelType: any; price: any; owner: { name: any; }; }) => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      fuelType: car.fuelType,
      price: car.price,
      ownerName: car.owner.name
    }));

    return NextResponse.json(transformedCars);
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars', details: error },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}