// src/pages/Register.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { UserPlus, ArrowLeft, ArrowRight, User, Mail, Lock, Phone } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../lib/api";

// ── Zod Schemas ────────────────────────────────────────────────────────
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+265[79]\d{8}$/, "Phone must be valid Malawian number (+2659... or +2657...)")
    .optional(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["farmer", "buyer"]),
});

type RegisterForm = z.infer<typeof registerSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPForm = z.infer<typeof otpSchema>;

export default function Register() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"register" | "verify">("register");
  const [userData, setUserData] = useState<{ email: string; phone?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Register Form ─────────────────────────────────────────────
  const {
    register: registerForm,
    handleSubmit: handleRegister,
    formState: { errors: regErrors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "farmer" },
  });

  const onRegister = async (data: RegisterForm) => {
    setLoading(true);
    setServerError(null);

    try {
      await api.post("/api/auth/register/", {
        username: data.username.trim(),
        email: data.email.trim(),
        phone: data.phone?.trim(),
        password: data.password,
        user_type: data.role,
      });

      setUserData({ email: data.email.trim(), phone: data.phone?.trim() });
      setStep("verify");
    } catch (err: any) {
      setServerError(
        err.response?.data?.detail ||
          err.response?.data?.non_field_errors?.[0] ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // ── OTP Verification Form ─────────────────────────────────────
  const {
    register: otpRegister,
    handleSubmit: handleOtp,
    formState: { errors: otpErrors },
  } = useForm<OTPForm>({
    resolver: zodResolver(otpSchema),
  });

  const onVerify = async (data: OTPForm) => {
    setLoading(true);
    setServerError(null);

    try {
      await api.post("/api/auth/verify-otp/", {
        email: userData?.email,
        phone: userData?.phone,
        otp: data.otp.trim(),
      });

      // You could also auto-login here if you want to skip the login step
      // But for now we follow standard flow
      alert("Account verified successfully! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      setServerError(
        err.response?.data?.detail || "Invalid or expired OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-8 md:p-10"
      >
        <Link
          to="/login"
          className="inline-flex items-center text-green-700 dark:text-green-400 hover:underline mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-2" /> Already have an account? Sign in
        </Link>

        <div className="text-center mb-8">
          <UserPlus className="mx-auto text-green-600 dark:text-green-500 mb-4" size={48} strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {step === "register" ? "Create Your Account" : "Verify Your Phone/Email"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === "register"
              ? "Join thousands of Malawian farmers and buyers"
              : `We sent a 6-digit code to ${userData?.phone || userData?.email}`}
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        {step === "register" ? (
          <form onSubmit={handleRegister(onRegister)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Username
              </label>
              <Input
                {...registerForm("username")}
                placeholder="e.g. chikondi_farm"
                leftIcon={<User size={18} />}
                error={regErrors.username?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Email
              </label>
              <Input
                {...registerForm("email")}
                type="email"
                placeholder="yourname@example.com"
                leftIcon={<Mail size={18} />}
                error={regErrors.email?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Phone (Airtel / TNM – recommended)
              </label>
              <Input
                {...registerForm("phone")}
                placeholder="+265999123456"
                leftIcon={<Phone size={18} />}
                error={regErrors.phone?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <Input
                {...registerForm("password")}
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                error={regErrors.password?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                I am a...
              </label>
              <select
                {...registerForm("role")}
                className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              >
                <option value="farmer">Farmer (Seller)</option>
                <option value="buyer">Buyer / Business</option>
              </select>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Creating account..." : "Create Free Account"}
              {!loading && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleOtp(onVerify)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Enter 6-digit code
              </label>
              <Input
                {...otpRegister("otp")}
                placeholder="123456"
                maxLength={6}
                error={otpErrors.otp?.message}
                autoComplete="one-time-code"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Code sent to {userData?.phone || userData?.email} • Expires in 10 minutes
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Didn't receive code?{" "}
              <button
                type="button"
                className="text-green-700 dark:text-green-400 hover:underline font-medium"
                onClick={() => setStep("register")}
              >
                Start over
              </button>
            </p>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-green-700 dark:text-green-400 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}