import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
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

    await prisma.car.delete({
      where: { id: carId },
    });

    return NextResponse.json(
      { success: true, message: 'Car deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting car:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete car' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}