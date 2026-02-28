// src/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Phone, ArrowLeft, ShieldCheck } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../lib/api";

// ── Zod Schemas ────────────────────────────────────────────────────────
const forgotSchema = z.object({
  method: z.enum(["email", "phone"]),
  email: z.string().email("Invalid email address").optional(),
  phone: z
    .string()
    .regex(/^\+265[79]\d{8}$/, "Use valid Malawian number (+2659xx xxx xxx or +2657xx xxx xxx)")
    .optional(),
}).refine(
  (data) => {
    if (data.method === "email") return !!data.email;
    if (data.method === "phone") return !!data.phone;
    return false;
  },
  {
    message: "Please provide either a valid email or phone number",
    path: ["email", "phone"], // general error shown under both fields
  }
);

type ForgotForm = z.infer<typeof forgotSchema>;

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    resetField,
  } = useForm<ForgotForm>({
    resolver: zodResolver(forgotSchema),
    defaultValues: {
      method: "phone", // default to phone — more common in Malawi rural areas
    },
  });

  const selectedMethod = watch("method");

  // Reset the opposite field when method changes
  React.useEffect(() => {
    if (selectedMethod === "email") {
      resetField("phone");
    } else {
      resetField("email");
    }
  }, [selectedMethod, resetField]);

  const onSubmit = async (data: ForgotForm) => {
    setServerMessage(null);
    setLoading(true);

    try {
      const payload: any = {
        method: data.method,
      };

      if (data.method === "email") {
        payload.email = data.email?.trim();
      } else {
        payload.phone = data.phone?.trim();
      }

      const response = await api.post("/api/auth/forgot-password/", payload);

      setSuccess(true);
      setServerMessage(
        response.data?.message ||
          `Reset code sent to your ${data.method === "email" ? "email" : "phone"}`
      );
    } catch (err: any) {
      const detail =
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Failed to send reset code. Please check the details and try again.";

      setServerMessage(detail);
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
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-green-100 dark:border-gray-700 p-8"
      >
        <Link
          to="/login"
          className="inline-flex items-center text-green-700 dark:text-green-400 hover:underline mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to login
        </Link>

        <div className="text-center mb-8">
          <ShieldCheck className="mx-auto text-green-600 dark:text-green-500 mb-4" size={48} strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-gray-600 dark:text-gray-400">
            We'll send a 6-digit code to reset your password
          </p>
        </div>

        {success ? (
          <div className="p-6 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl text-center">
            <p className="text-green-700 dark:text-green-300 font-medium text-lg mb-2">
              Code sent!
            </p>
            <p className="text-gray-700 dark:text-gray-300">{serverMessage}</p>
            <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              Enter the code on the next screen or{" "}
              <Link to="/reset-password" className="text-green-700 dark:text-green-400 hover:underline">
                go to reset page
              </Link>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {serverMessage && !success && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm">
                {serverMessage}
              </div>
            )}

            {/* Method selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Send code to
              </label>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all hover:border-green-500 dark:hover:border-green-600">
                  <input
                    type="radio"
                    value="phone"
                    {...register("method")}
                    className="sr-only"
                  />
                  <div
                    className={`text-center ${
                      selectedMethod === "phone"
                        ? "text-green-700 dark:text-green-400 font-semibold border-2 border-green-500 dark:border-green-600 rounded-lg p-2 w-full"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Phone className="mx-auto mb-1" size={20} />
                    Phone
                  </div>
                </label>

                <label className="flex items-center justify-center p-3 border rounded-xl cursor-pointer transition-all hover:border-green-500 dark:hover:border-green-600">
                  <input
                    type="radio"
                    value="email"
                    {...register("method")}
                    className="sr-only"
                  />
                  <div
                    className={`text-center ${
                      selectedMethod === "email"
                        ? "text-green-700 dark:text-green-400 font-semibold border-2 border-green-500 dark:border-green-600 rounded-lg p-2 w-full"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <Mail className="mx-auto mb-1" size={20} />
                    Email
                  </div>
                </label>
              </div>
            </div>

            {/* Conditional input */}
            {selectedMethod === "email" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Your registered email
                </label>
                <Input
                  {...register("email")}
                  type="email"
                  placeholder="yourname@example.com"
                  leftIcon={<Mail size={18} />}
                  error={errors.email?.message}
                />
              </div>
            ) : (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Your registered phone number
                </label>
                <Input
                  {...register("phone")}
                  placeholder="+265999123456"
                  leftIcon={<Phone size={18} />}
                  error={errors.phone?.message}
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
                  Must be the number used during registration (Airtel or TNM)
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
        )}

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Remember your password?{" "}
          <Link to="/login" className="text-green-700 dark:text-green-400 font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>
    </div>
  );
}