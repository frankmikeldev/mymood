"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const signupSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type SignupFormData = z.infer<typeof signupSchema>;

export default function SignupPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    setErrorMsg("");
    setSuccessMsg("");
    setLoading(true);

    const { email, password, fullName } = data;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) setErrorMsg(error.message);
    else {
      setSuccessMsg("Check your email to confirm your account!");
      setTimeout(() => router.push("/login"), 3000);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)] text-[var(--color-text-body)] px-4 sm:px-6 py-8 transition-colors duration-300">
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
    className="w-full max-w-md bg-[var(--color-bg-card)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-2xl p-6 sm:p-8 shadow-xl mx-4"
  >
    <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 text-center text-[var(--color-text-header)] break-words leading-tight whitespace-normal">
      Create Your MyMood Account
    </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {["fullName", "email", "password", "confirmPassword"].map((field, i) => {
            const labels: Record<string, string> = {
              fullName: "Full Name",
              email: "Email",
              password: "Password",
              confirmPassword: "Confirm Password",
            };
            return (
              <div key={i}>
                <label
                  className="block text-sm mb-1 text-[var(--color-text-header)]"
                  htmlFor={field}
                >
                  {labels[field]}
                </label>
                <input
                  id={field}
                  type={field.includes("password") ? "password" : "text"}
                  {...register(field as keyof SignupFormData)}
                  placeholder={
                    field === "email"
                      ? "you@example.com"
                      : field === "fullName"
                      ? "Jane Doe"
                      : ""
                  }
                  className="w-full p-3 rounded-lg bg-[var(--color-bg-main)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/40 outline-none text-[var(--color-text-body)] placeholder-gray-400 transition"
                />
                {errors[field as keyof SignupFormData] && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors[field as keyof SignupFormData]?.message?.toString()}
                  </p>
                )}
              </div>
            );
          })}

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}
          {successMsg && (
            <p className="text-green-500 text-sm text-center">{successMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-accent)] hover:opacity-90 transition text-white font-medium py-2.5 rounded-lg mt-2 disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-[var(--color-text-body)] text-sm text-center mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[var(--color-accent)] hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
