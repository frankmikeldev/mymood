"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { motion } from "framer-motion";
import Link from "next/link";

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotFormData = z.infer<typeof forgotSchema>;

export default function ForgotPasswordPage() {
  const supabase = createClientComponentClient();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormData>({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data: ForgotFormData) => {
    setErrorMsg("");
    setMessage("");
    setLoading(true);

    const { email } = data;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    if (error) setErrorMsg(error.message);
    else setMessage("✅ Check your email for a password reset link!");

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex justify-center bg-[var(--color-bg-main)] text-white px-6 pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[var(--color-bg-card)]/90 backdrop-blur-md border border-[var(--color-border)] rounded-2xl p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-white">
          Forgot Password?
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full p-2.5 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none transition"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-red-400 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {errorMsg && (
            <p className="text-red-400 text-sm text-center">{errorMsg}</p>
          )}
          {message && (
            <p className="text-green-400 text-sm text-center">{message}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white hover:bg-gray-200 transition text-black font-medium py-2.5 rounded-lg mt-2 disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-4">
          Remembered your password?{" "}
          <Link
            href="/login"
            className="text-[var(--color-accent)] hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
