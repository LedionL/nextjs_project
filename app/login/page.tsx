"use client";

import { login } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "react-toastify";
import { LoginFormSchema } from "@/app/lib/definitions";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const validatedFields = LoginFormSchema.safeParse({ email, password });

    if (!validatedFields.success) {
      const errors = validatedFields.error.flatten().fieldErrors;

      const errorMessages = Object.values(errors)
        .flat()
        .filter((message) => message !== undefined)
        .join(" ");

      toast.error(`Please fill the required fields correctly: ${errorMessages}`);
      setIsSubmitting(false);
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const result = await login(formData);

    if (result.success) {
      localStorage.setItem("token", result.token!);
      toast.success("Login successful!");

      setTimeout(() => {
        router.push("/dashboard");
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
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging In..." : "Log In"}
        </button>
      </form>
      <button
        onClick={() => router.push("/Register")}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Register
      </button>
    </div>
  );
}