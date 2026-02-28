// src/pages/Login.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, ArrowLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";   // ← use the hook
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { login: authLogin, isLoading: authLoading } = useAuth();   // ← from hook
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: false,
    },
  });

  const from = location.state?.from?.pathname || "/dashboard";

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    setLoading(true);

    try {
      // Call the login function from context
      const response = await authLogin(data.identifier.trim(), data.password);

      // If your login function returns the user/response directly,
      // you can use it here. Otherwise, rely on context update.
      // For role-based redirect, we can get user from context after login
      // but since login is async, we wait a tick or use the returned data

      // Option A: if login returns user/response
      const userRole =
        response?.user?.user_type ||
        response?.user?.role ||
        response?.data?.user_type ||
        response?.data?.role ||
        "farmer";

      let redirectTo = from;

      if (!from || from === "/" || from === "/dashboard") {
        if (userRole === "farmer") {
          redirectTo = "/dashboard/farmer";
        } else if (userRole === "buyer") {
          redirectTo = "/marketplace";
        } else if (userRole === "transporter") {
          redirectTo = "/dashboard/transporter";
        } else {
          redirectTo = "/dashboard";
        }
      }

      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      console.error("Login error:", err);
      setServerError(
        err.message ||
        err.response?.data?.detail ||
        err.response?.data?.non_field_errors?.[0] ||
        "Invalid username/email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth context is initializing
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
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
          to="/"
          className="inline-flex items-center text-green-700 dark:text-green-400 hover:underline mb-6 text-sm font-medium"
        >
          <ArrowLeft size={16} className="mr-2" /> Back to home
        </Link>

        <div className="text-center mb-8">
          <LogIn className="mx-auto text-green-600 dark:text-green-500 mb-4" size={48} strokeWidth={1.5} />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your MlimiConnect account
          </p>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Email or Username
            </label>
            <Input
              {...register("identifier")}
              placeholder="username or email"
              leftIcon={<Mail size={18} />}
              error={errors.identifier?.message}
              autoComplete="username email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              Password
            </label>
            <Input
              type="password"
              {...register("password")}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              autoComplete="current-password"
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 mr-2"
                {...register("rememberMe")}
              />
              <span className="text-gray-600 dark:text-gray-400">Remember me</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-green-700 dark:text-green-400 hover:underline font-medium"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-md hover:shadow-lg"
            disabled={loading || authLoading}
          >
            {loading || authLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="text-green-700 dark:text-green-400 font-semibold hover:underline"
          >
            Create free account
          </Link>
        </p>

                <p className="mt-8 text-center text-sm text-gray-900 dark:text-gray-600">
          We are  in Testing Mode{" "}
          <Link
            to="/app/dashboard"
            className="text-green-700 dark:text-green-400 font-semibold hover:underline"
          >
            Click Here To See the Magic
          </Link>
        </p>
      </motion.div>
    </div>
  );
}