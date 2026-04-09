"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const font = "'Manrope', sans-serif";

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
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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

  const handleGoogleSignup = async () => {
    setErrorMsg("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) {
      setErrorMsg(error.message);
      setGoogleLoading(false);
    }
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
    <main
      className="min-h-screen flex items-center justify-center px-6 py-12"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: "#EDE8DF", border: "1px solid #D8D1C4" }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" fill="#E8521A" fillOpacity="0.15"/>
              <path d="M8 13s1.5 2 4 2 4-2 4-2" stroke="#E8521A" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="9" cy="10" r="1" fill="#111111"/>
              <circle cx="15" cy="10" r="1" fill="#111111"/>
            </svg>
          </div>
          <h1
            className="text-2xl"
            style={{ fontWeight: 800, color: "#111111", fontFamily: font, letterSpacing: "-0.02em" }}
          >
            Create your account
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "#6b7280", fontFamily: font, fontWeight: 400 }}
          >
            Start your wellness journey today — it's free
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #E2DDD6", boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}
        >
          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed mb-5"
            style={{
              border: "1px solid #D8D1C4",
              backgroundColor: "#F5F0E8",
              color: "#111111",
              fontSize: "14px",
              fontWeight: 500,
              fontFamily: font,
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#EDE8DF")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#F5F0E8")}
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            {googleLoading ? "Connecting..." : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px" style={{ backgroundColor: "#E2DDD6" }} />
            <span style={{ fontSize: "12px", color: "#9ca3af", fontFamily: font }}>or sign up with email</span>
            <div className="flex-1 h-px" style={{ backgroundColor: "#E2DDD6" }} />
          </div>

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
                  <label
                    className="block text-xs mb-2"
                    style={{ fontWeight: 600, color: "#444444", fontFamily: font }}
                  >
                    {field.label}
                  </label>
                  <div className="relative">
                    <input
                      id={field.key}
                      type={showToggle ? (visible ? "text" : "password") : field.type}
                      {...register(field.key as keyof SignupFormData)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl outline-none transition"
                      style={{
                        backgroundColor: "#F5F0E8",
                        border: "1px solid #D8D1C4",
                        color: "#111111",
                        fontSize: "15px",
                        fontFamily: font,
                        fontWeight: 400,
                        paddingRight: showToggle ? "2.5rem" : "1rem",
                      }}
                      onFocus={e => (e.currentTarget.style.borderColor = "#E8521A")}
                      onBlur={e => (e.currentTarget.style.borderColor = "#D8D1C4")}
                    />
                    {showToggle && (
                      <button
                        type="button"
                        onClick={toggle}
                        className="absolute right-3 top-1/2 -translate-y-1/2 transition"
                        style={{ color: "#9ca3af" }}
                      >
                        <EyeIcon open={visible} />
                      </button>
                    )}
                  </div>
                  {errors[field.key as keyof SignupFormData] && (
                    <p className="text-xs mt-1.5" style={{ color: "#E8521A", fontFamily: font }}>
                      {errors[field.key as keyof SignupFormData]?.message?.toString()}
                    </p>
                  )}
                </div>
              );
            })}

            {errorMsg && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
                style={{ backgroundColor: "rgba(232,82,26,0.06)", border: "1px solid rgba(232,82,26,0.2)", color: "#E8521A", fontFamily: font }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#E8521A" }} />
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs"
                style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", color: "#16a34a", fontFamily: font }}
              >
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: "#16a34a" }} />
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2 hover:-translate-y-0.5"
              style={{
                backgroundColor: "#E8521A",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "15px",
                fontFamily: font,
                boxShadow: "0 4px 20px rgba(232,82,26,0.3)",
              }}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#D4480F")}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = "#E8521A")}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : "Create account"}
            </button>
          </form>
        </div>

        <p
          className="text-center text-sm mt-6"
          style={{ color: "#6b7280", fontFamily: font }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            className="hover:underline transition"
            style={{ color: "#111111", fontWeight: 600, fontFamily: font }}
          >
            Sign in
          </Link>
        </p>

      </motion.div>
    </main>
  );
}