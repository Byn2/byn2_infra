"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Eye, EyeOff, User, Lock } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast"

const formSchema = z
  .object({
    businessName: z
      .string()
      .min(2, { message: "Business name must be at least 2 characters" }),
    phoneNumber: z
      .string()
      .min(6, { message: "Please enter a valid phone number" }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SignupPage() {
  // const { toast } = useToast()
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      businessName: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const response = await fetch("/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: values.businessName,
          phoneNumber: values.phoneNumber,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // toast({
      //   title: "Registration successful",
      //   description: "Your account has been created. Please log in.",
      // })
      router.push("/login");
    } catch (error) {
      // toast({
      //   title: "Registration failed",
      //   description: error.message || "There was an error creating your account. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex flex-1 flex-col justify-center px-12 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="flex items-center">
              <img src="/logo.svg" alt="Byn2 Logo" className="h-8 w-8" />
              <span className="ml-2 text-2xl font-bold text-[#01133B]">
                Byn2
              </span>
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900">
            Sign up
          </h2>
          <p className="mt-1 text-center text-sm text-gray-600">
            Enter your details below
          </p>

          <div className="mt-8">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Business Name *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="businessName"
                    {...form.register("businessName")}
                    placeholder="Byn2@gmail.com"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01133B] focus:border-[#01133B]"
                  />
                </div>
                {form.formState.errors.businessName && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.businessName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="phoneNumber"
                  className="block text-sm font-medium text-gray-700"
                >
                  Phone Number *
                </label>
                <input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  placeholder="+232 78 555123"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01133B] focus:border-[#01133B]"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Create Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...form.register("password")}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01133B] focus:border-[#01133B]"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {form.formState.errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...form.register("confirmPassword")}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#01133B] focus:border-[#01133B]"
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                {form.formState.errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {form.formState.errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="flex items-center">
                <input
                  id="agreeToTerms"
                  type="checkbox"
                  {...form.register("agreeToTerms")}
                  className="h-4 w-4 text-[#01133B] focus:ring-[#01133B] border-gray-300 rounded"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 block text-sm text-gray-700"
                >
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#01133B] hover:underline"
                  >
                    terms & conditions
                  </Link>
                </label>
              </div>
              {form.formState.errors.agreeToTerms && (
                <p className="text-red-500 text-xs mt-1">
                  {form.formState.errors.agreeToTerms.message}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#01133B] hover:bg-[#523526] text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#01133B]"
              >
                {isLoading ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-medium text-[#01133B] hover:text-[#52341F]"
              >
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 bg-[#FAF7F2] relative">
        <div className="flex flex-col justify-center px-12 h-full">
          <div className="max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-center text-gray-900 mb-4">
              B2B Transfer
            </h3>
            <p className="text-center text-gray-700 mb-8">
              Transfer money to your vendor, supplier, business partner with
              ease.
            </p>

            <div className="flex justify-center">
              <div className="relative">
                <div className="w-64 h-44 bg-green-500 rounded-xl relative transform rotate-3 shadow-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                      <span className="text-3xl font-bold text-green-500">
                        ₹
                      </span>
                    </div>
                  </div>
                  <div className="absolute w-4 h-full bg-orange-400 right-0 rounded-r-xl"></div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-gray-600"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
                <div className="w-2 h-2 rounded-full bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
