"use server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { SignupFormSchema, LoginFormSchema } from "@/app/lib/definitions";
import { readUsers, writeUsers } from "@/app/actions/users";
import { cookies } from "next/headers";

export async function signup(formData: FormData) {
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  const validatedFields = SignupFormSchema.safeParse({ name, email, password });

  if (!validatedFields.success) {
    return { success: false, message: "Invalid input." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const users = readUsers();

  if (users.some((u) => u.email === email)) {
    return { success: false, message: "Email already exists." };
  }

  users.push({ name, email, password: hashedPassword });
  writeUsers(users);
  
  return { success: true, message: "Signup successful", token };
}

export async function login(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { success: false, message: "All fields are required." };
  }

  const users = readUsers();
  const user = users.find((u) => u.email === email);

  if (!user) {
    return { success: false, message: "Invalid credentials." };
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return { success: false, message: "Invalid credentials." };
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET!);

  return { success: true, message: "Login successful", token };
}