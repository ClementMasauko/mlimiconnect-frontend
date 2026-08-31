// src/pages/Login.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { demoLoginEnabled, useAuth } from "../../context/AuthContext";   // ← use the hook
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import AuthShell from "../../components/AuthShell";
import LogoLoader from "../../components/LogoLoader";
import { useTranslation } from "react-i18next";
import { getApiError } from "../../lib/api";

const loginSchema = z.object({
  identifier: z.string().min(1, "Email or username is required"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional(),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const { login: authLogin, isLoading: authLoading } = useAuth();   // ← from hook
  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const from = location.state?.from?.pathname || "/app/dashboard";

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    setLoading(true);

    try {
      // Call the login function from context
      const user = await authLogin(data.identifier.trim(), data.password);
      const userRole = user.user_type;

      let redirectTo = from;

      if (!from || from === "/" || from === "/dashboard" || from === "/app/dashboard") {
        if (userRole === "farmer") {
          redirectTo = "/app/dashboard";
        } else if (userRole === "buyer") {
          redirectTo = "/app/marketplace";
        } else if (userRole === "transporter") {
          redirectTo = "/app/dashboard";
        } else if (userRole === "admin") {
          redirectTo = "/admin";
        } else {
          redirectTo = "/app/dashboard";
        }
      }

      navigate(redirectTo, { replace: true });
    } catch (err: unknown) {
      console.error("Login error:", err);
      setServerError(getApiError(err, "Invalid username/email or password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while auth context is initializing
  if (authLoading) {
    return <LogoLoader fullScreen label={t("checkingAuth")} />;
  }

  return (
    <AuthShell title={t("welcomeBack")} description={t("loginDescription")}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full"
      >
        {serverError && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-xl text-sm">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t("identifier")}
            </label>
            <Input
              {...register("identifier")}
              placeholder={t("identifierPlaceholder")}
              leftIcon={<Mail size={18} />}
              error={errors.identifier?.message}
              autoComplete="username email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
              {t("password")}
            </label>
            <Input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              placeholder="••••••••"
              leftIcon={<Lock size={18} />}
              error={errors.password?.message}
              autoComplete="current-password"
              rightElement={<button type="button" onClick={() => setShowPassword(value => !value)} className="inline-flex h-9 w-9 items-center justify-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-600 dark:hover:bg-gray-800 dark:hover:text-white" aria-label={showPassword ? "Hide password" : "Show password"} aria-pressed={showPassword}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button>}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-sm">
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300 dark:border-gray-600 text-green-600 focus:ring-green-500 mr-2"
                {...register("rememberMe")}
              />
              <span className="text-gray-600 dark:text-gray-400">{t("rememberMe")}</span>
            </label>

            <Link
              to="/forgot-password"
              className="text-green-700 dark:text-green-400 hover:underline font-medium"
            >
              {t("forgotPassword")}
            </Link>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full shadow-md hover:shadow-lg"
            disabled={loading || authLoading}
          >
            {loading || authLoading ? t("signingIn") : t("signIn")}
          </Button>
        </form>

        {demoLoginEnabled && (
          <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-100">
            <p className="font-semibold">Demo login (test deployment)</p>
            <p className="mt-1">Use <code>farmer@demo.mw</code>, <code>buyer@demo.mw</code>, or <code>admin@demo.mw</code>.</p>
            <p>Password for all accounts: <code>demo123</code></p>
          </div>
        )}

        <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
          {t("noAccount")}{" "}
          <Link
            to="/register"
            className="text-green-700 dark:text-green-400 font-semibold hover:underline"
          >
            {t("createFreeAccount")}
          </Link>
        </p>

      </motion.div>
    </AuthShell>
  );
}
