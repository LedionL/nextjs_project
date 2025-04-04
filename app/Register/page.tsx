"use client";

import { signup } from "../actions/signUp";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { SignupFormSchema } from "@/app/lib/definitions";

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const validatedFields = SignupFormSchema.safeParse({ name, email, password });

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;

      const errorMessages = Object.values(errors)
        .flat()
        .filter((message) => message !== undefined)
        .join(" ");

      toast.error(`Please fill the following fields correctly: ${errorMessages}`);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    const result = await signup(formData);

    if (result.success) {
      toast.success(`Sign up successful! Welcome, ${name}!`);

      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } else {
      toast.error(result.message);
    }

    setIsSubmitting(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 pt-20">
      <main className="container mx-auto px-6 py-12 max-w-md">
        <div className="bg-gray-800/50 backdrop-blur-lg border border-amber-500/20 rounded-xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-amber-500 mb-8 text-center">
            Register
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-amber-500/80 mb-2">
                Full Name
              </label>
              <input
                id="name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-700 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-500/80 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="example@mail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-700 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-400 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-amber-500/80 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gray-700 border border-amber-500/30 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 text-white placeholder-gray-400 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isSubmitting ? "Securing Membership..." : "Become a Member"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => router.push("/login")}
              className="text-amber-500 hover:text-amber-400 text-sm font-medium transition-colors"
            >
              Already a Member? Login
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}