"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const resetSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetFormData = z.infer<typeof resetSchema>;

export default function ResetPasswordPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
  });

  const onSubmit = async (data: ResetFormData) => {
    setErrorMsg("");
    setMessage("");
    setLoading(true);

    const { password } = data;
    const { error } = await supabase.auth.updateUser({ password });

    if (error) setErrorMsg(error.message);
    else {
      setMessage("✅ Password reset successfully! Redirecting...");
      setTimeout(() => router.push("/login"), 2500);
    }

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
          Reset Password 🔑
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">New Password</label>
            <input
              type="password"
              {...register("password")}
              className="w-full p-2.5 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none transition"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-400 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm mb-1">Confirm New Password</label>
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full p-2.5 rounded-lg bg-[var(--color-bg-dark)] border border-[var(--color-border)] focus:border-[var(--color-accent)] outline-none transition"
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="text-red-400 text-sm mt-1">
                {errors.confirmPassword.message}
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
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
