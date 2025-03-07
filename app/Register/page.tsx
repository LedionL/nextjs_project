"use client";

import { signup } from "@/app/actions/auth";
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
    <div>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
          {isSubmitting ? "Signing Up..." : "Sign Up"}
        </button>
      </form>
      <button
        onClick={() => router.push("/login")}
        className="mt-4 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Log In
      </button>
    </div>
  );
}