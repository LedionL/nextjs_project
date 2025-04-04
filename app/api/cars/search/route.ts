import { NextResponse } from 'next/server';
import prisma from '@/app/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('q') || '';
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = parseInt(searchParams.get('pageSize') || '10', 10);
  const skip = (page - 1) * pageSize;

  try {
    const whereClause = {
      OR: [
        { brand: { contains: search, mode: 'insensitive' } },
        { model: { contains: search, mode: 'insensitive' } },
      ],
    };

    const [cars, totalCars] = await Promise.all([
      prisma.car.findMany({
        where: whereClause,
        skip,
        take: pageSize,
        orderBy: { id: 'asc' },
        include: { owner: true },
      }),
      prisma.car.count({ where: whereClause }),
    ]);

    const formattedCars = cars.map(car => ({
      id: car.id,
      brand: car.brand,
      model: car.model,
      fuelType: car.fuelType,
      price: car.price,
      ownerName: car.owner.name,
      ownerId: car.owner.id,
    }));

    return NextResponse.json({
      cars: formattedCars,
      total: totalCars,
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}