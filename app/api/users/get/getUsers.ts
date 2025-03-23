'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getUsers() {
  try {
    return await prisma.user.findMany({
      select: { id: true, name: true },
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  } finally {
    await prisma.$disconnect();
  }
}