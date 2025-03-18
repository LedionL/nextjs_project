'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

type State = {
  success: boolean;
  message: string;
} | null;

export async function addCar(prevState: State, formData: FormData): Promise<State> {
  try {
    const rawData = {
      brand: formData.get('brand'),
      model: formData.get('model'),
      fuelType: formData.get('fuelType'),
      price: Number(formData.get('price')),
      email: formData.get('email')
    };

    if (!rawData.email || !rawData.brand || !rawData.model || !rawData.fuelType || !rawData.price) {
      return { success: false, message: 'All fields are required' };
    }

    const user = await prisma.user.findUnique({
      where: { email: rawData.email.toString() }
    });

    if (!user) {
      return { success: false, message: 'User with this email not found' };
    }

    await prisma.car.create({
      data: {
        brand: rawData.brand.toString(),
        model: rawData.model.toString(),
        fuelType: rawData.fuelType.toString(),
        price: rawData.price,
        ownerId: user.id,
      }
    });

    revalidatePath('/dashboard');
    return { success: true, message: 'Car added successfully' };
  } catch (error) {
    console.error('Error adding car:', error);
    return { success: false, message: 'Failed to add car' };
  } finally {
    await prisma.$disconnect();
  }
}