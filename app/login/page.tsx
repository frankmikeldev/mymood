"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
 const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push("/dashboard");
    });
  }, [router, supabase]);

  const onSubmit = async (data: LoginFormData) => {
    setErrorMsg("");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword(data);
    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }
    setTimeout(() => router.push("/dashboard"), 800);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[var(--color-bg-main)] text-[var(--color-text-body)] px-6 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[var(--color-bg-card)]/95 backdrop-blur-md border border-[var(--color-border)] rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-[var(--color-text-header)]">
          Welcome Back
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {["email", "password"].map((field, i) => (
            <div key={i}>
              <label
                className="block text-sm mb-1 capitalize text-[var(--color-text-header)]"
                htmlFor={field}
              >
                {field}
              </label>
              <input
                id={field}
                type={field}
                {...register(field as keyof LoginFormData)}
                className="w-full p-3 rounded-lg bg-[var(--color-bg-main)] border border-[var(--color-border)] focus:border-[var(--color-accent)] focus:ring-2 focus:ring-[var(--color-accent)]/40 outline-none text-[var(--color-text-body)] placeholder-gray-400 transition"
                placeholder={field === "email" ? "you@example.com" : "••••••••"}
              />
              {errors[field as keyof LoginFormData] && (
                <p className="text-red-500 text-sm mt-1">
                  {errors[field as keyof LoginFormData]?.message?.toString()}
                </p>
              )}
            </div>
          ))}

          {errorMsg && (
            <p className="text-red-500 text-sm text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[var(--color-accent)] hover:opacity-90 transition text-white font-medium py-2.5 rounded-lg mt-2 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="text-center mt-5 space-y-2">
          <Link
            href="/forgot-password"
            className="text-[var(--color-accent)] hover:underline"
          >
            Forgot Password?
          </Link>
          <p className="text-[var(--color-text-body)] text-sm">
            Don’t have an account?{" "}
            <Link
              href="/signup"
              className="text-[var(--color-accent)] hover:underline font-medium"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </main>
  );
}
