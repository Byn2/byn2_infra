"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";

const formSchema = z.object({
  email: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    console.log(values);
    try {
      const response = await fetch("/api/v1/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("Login successful");
      router.push("/dashboard");
    } catch (error) {
      //@ts-ignore
      console.error("Login failed:", error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-8 md:w-1/2 lg:px-12 xl:px-16">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Byn2 Logo" className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold text-[#01133B]">
                Byn2
              </span>
            </div>
          </div>

          <h1 className="text-center text-3xl font-bold text-gray-900">
            Log in
          </h1>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your details below
          </p>

          <div className="mt-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="+232 78 555123"
                  {...form.register("email")}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-[#01133B] focus:outline-none focus:ring-1 focus:ring-[#01133B]"
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...form.register("password")}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pr-10 shadow-sm focus:border-[#01133B] focus:outline-none focus:ring-1 focus:ring-[#01133B]"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {form.formState.errors.password && (
                  <p className="text-xs text-red-500">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full rounded-md bg-[#01133B] py-3 text-white hover:bg-[#523526] focus:outline-none focus:ring-2 focus:ring-[#01133B] focus:ring-offset-2"
              >
                {isLoading ? "Logging in..." : "Log in"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-[#01133B] hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="hidden bg-[#FAF7F2] md:flex md:w-1/2 md:flex-col md:items-center md:justify-center">
        <div className="mx-auto max-w-md px-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900">B2B Transfer</h2>
          <p className="mt-2 text-gray-600">
            Transfer money to your vendor, supplier, business partner with ease.
          </p>

          <div className="mt-8 flex justify-center">
            <div className="relative">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-04-25%20at%202.03.14%E2%80%AFAM-fbjkkAkxOQ7Sc18P6dLOfszar3ufQg.png"
                alt="B2B Transfer Illustration"
                className="h-auto w-full max-w-md"
              />
              <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-4">
                <div className="h-2 w-2 rounded-full bg-[#01133B] opacity-70"></div>
                <div className="h-2 w-2 rounded-full bg-[#01133B] opacity-30"></div>
                <div className="h-2 w-2 rounded-full bg-[#01133B] opacity-30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
