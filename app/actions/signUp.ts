"use server";

import bcrypt from 'bcrypt';
import { SignupFormSchema, LoginFormSchema } from '@/app/lib/definitions';
import prisma from '../lib/prisma';

export async function signup(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const validatedFields = SignupFormSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    return { success: false, message: "Invalid input." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return { success: false, message: "Email already exists." };
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  });

  return { success: true, message: "Signup successful"};
}