// src/pages/ResetPassword.tsx
import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Lock, ShieldCheck, ArrowLeft, CheckCircle } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../lib/api";

// ── Zod Schemas ────────────────────────────────────────────────────────
const resetSchema = z
  .object({
    otp: z.string().length(6, "Code must be 6 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetForm = z.infer<typeof resetSchema>;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // optional / legacy
  const [step, setStep] = useState<"verify" | "reset">("verify");
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      otp: "",
      password: "",
      confirmPassword: "",
    },
  });

  const otpValue = watch("otp");

  const onVerifyOTP = async (data: ResetForm) => {
    setLoading(true);
    setServerError(null);

    try {
      await api.post("/api/auth/verify-reset-otp/", {
        otp: data.otp.trim(),
        token, // include only if your backend still needs it
      });

      setStep("reset");
    } catch (err: any) {
      setServerError(
        err.response?.data?.detail ||
          "Invalid or expired code. Please request a new one."
      );
    } finally {
      setLoading(false);
    }
  };

  const onResetPassword = async (data: ResetForm) => {
    setLoading(true);
    setServerError(null);

    try {
      await api.post("/api/auth/reset-password/", {
        otp: data.otp.trim(),
        password: data.password,
        // token,  // uncomment if required by your backend
      });

      setSuccess(true);
    } catch (err: any) {
      setServerError(
        err.response?.data?.detail ||
          "Failed to reset password. The code may have expired."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center px-4 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-10 text-center"
        >
          <CheckCircle className="mx-auto text-green-600 dark:text-green-500 mb-6" size={64} strokeWidth={1.5} />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Password Reset Successful
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
            Your password has been updated successfully.<br />
            You can now sign in with your new credentials.
          </p>
          <Link to="/login">
            <Button variant="primary" size="lg" className="w-full">
              Sign In Now
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

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
          <ArrowLeft size={16} className="mr-2" /> Back to login
        </Link>

        <div className="text-center mb-8">
          <ShieldCheck className="mx-auto text-green-600 dark:text-green-500 mb-4" size={48} strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {step === "verify" ? "Enter Reset Code" : "Set New Password"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {step === "verify"
              ? "Enter the 6-digit code sent to your phone or email"
              : "Choose a strong new password"}
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        {step === "verify" ? (
          <form onSubmit={handleSubmit(onVerifyOTP)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                6-digit code
              </label>
              <Input
                {...register("otp")}
                placeholder="123456"
                maxLength={6}
                error={errors.otp?.message}
                autoComplete="one-time-code"
              />
              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Code expires in 10 minutes • Check your phone/email
              </p>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md hover:shadow-lg"
              disabled={loading || otpValue.length !== 6}
            >
              {loading ? "Verifying..." : "Verify Code"}
            </Button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Didn't receive the code?{" "}
              <Link
                to="/forgot-password"
                className="text-green-700 dark:text-green-400 hover:underline font-medium"
              >
                Request new code
              </Link>
            </p>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onResetPassword)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                New Password
              </label>
              <Input
                type="password"
                {...register("password")}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                error={errors.password?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                Confirm New Password
              </label>
              <Input
                type="password"
                {...register("confirmPassword")}
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                error={errors.confirmPassword?.message}
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        )}
      </motion.div>
    </div>
  );
}