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

const FIELDS = [
  { key: "fullName", label: "Full name", type: "text", placeholder: "Jane Doe" },
  { key: "email", label: "Email address", type: "email", placeholder: "you@example.com" },
  { key: "password", label: "Password", type: "password", placeholder: "••••••••" },
  { key: "confirmPassword", label: "Confirm password", type: "password", placeholder: "••••••••" },
];

export default function SignupPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

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

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      await supabase.from("user_profiles").upsert({
        id: authData.user.id,
        name: fullName,
        email: email,
        created_at: new Date().toISOString(),
      });
    }

    setSuccessMsg("Check your email to confirm your account!");
    setTimeout(() => router.push("/login"), 3000);
    setLoading(false);
  };

  const EyeIcon = ({ open }: { open: boolean }) => open ? (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="1" y1="1" x2="23" y2="23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ) : (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
    </svg>
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0a0a0f] px-6 py-12 relative overflow-hidden">

      {/* Grid background */}
      <div
        className="fixed inset-0 -z-10 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="white" fillOpacity="0.15"/>
              <path d="M8 13s1.5 2 4 2 4-2 4-2" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="10" r="1" fill="white"/>
              <circle cx="15" cy="10" r="1" fill="white"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Create your account</h1>
          <p className="text-gray-500 text-sm mt-1">Start your wellness journey today — it's free</p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f18] border border-white/5 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {FIELDS.map((field) => {
              const isPassword = field.key === "password";
              const isConfirm = field.key === "confirmPassword";
              const showToggle = isPassword || isConfirm;
              const visible = isPassword ? showPassword : showConfirm;
              const toggle = isPassword
                ? () => setShowPassword(!showPassword)
                : () => setShowConfirm(!showConfirm);

              return (
                <div key={field.key}>
                  <label className="block text-xs font-medium text-gray-400 mb-2">
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      id={field.key}
                      type={showToggle ? (visible ? "text" : "password") : field.type}
                      {...register(field.key as keyof SignupFormData)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl bg-white/4 border border-white/8 text-white placeholder:text-gray-600 text-sm outline-none focus:border-white/20 transition pr-10"
                    />
                    {showToggle && (
                      <button
                        type="button"
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition"
                      >
                        <EyeIcon open={visible} />
                      </button>
                    )}
                  </div>
                  {errors[field.key as keyof SignupFormData] && (
                    <p className="text-red-400 text-xs mt-1.5">
                      {errors[field.key as keyof SignupFormData]?.message?.toString()}
                    </p>
                  )}
                </div>
              );
            })}

            {/* Error */}
            {errorMsg && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/8 border border-red-500/15 text-red-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                {errorMsg}
              </div>
            )}

            {/* Success */}
            {successMsg && (
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-500/8 border border-green-500/15 text-green-400 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                {successMsg}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-white text-[#0a0a0f] font-semibold text-sm hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/20 border-t-black/70 rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create account"
              )}
            </button>

          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-gray-300 hover:text-white font-medium transition">
            Sign in
          </Link>
        </p>

      </motion.div>
    </main>
  );
}