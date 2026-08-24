// src/pages/Register.tsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, User, Mail, Lock, Phone, Building2, CheckCircle2 } from "lucide-react";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import api from "../../lib/api";
import AuthShell from "../../components/AuthShell";
import { useTranslation } from "react-i18next";

// ── Zod Schemas ────────────────────────────────────────────────────────
const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^(?:|0(?:88|89|98|99)\d{7})$/, "Enter 10 digits starting with 088, 089, 098 or 099")
    .optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  account_type: z.enum(["individual", "cooperative", "company", "ngo", "government", "institution"]),
  trading_mode: z.enum(["buy", "sell", "both"]),
  legal_name: z.string().optional(),
  registration_number: z.string().optional(),
  representative_name: z.string().optional(),
  representative_role: z.string().optional(),
  business_size: z.enum(["small", "medium", "large"]).optional(),
  member_count: z.string().optional(),
  address: z.string().optional(),
});

type RegisterForm = z.infer<typeof registerSchema>;

const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OTPForm = z.infer<typeof otpSchema>;

const normalizeMalawiPhone = (phone?: string) => {
  const compact = phone?.replace(/[\s-]/g, "") || "";
  return compact ? `+265${compact.slice(1)}` : "";
};

const registrationError = (error: any, fallback: string) => {
  const data = error.response?.data;
  if (!data || typeof data !== "object") return fallback;
  if (typeof data.detail === "string") return data.detail;
  const messages = Object.entries(data).flatMap(([field, value]) => {
    const values = Array.isArray(value) ? value : [value];
    return values.filter(item => typeof item === "string").map(item => `${field.replaceAll("_", " ")}: ${item}`);
  });
  return messages.join(" ") || fallback;
};

const passwordStrength = (password: string) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  if (score <= 2) return { key: "passwordWeak", width: "33%", color: "bg-red-500", text: "text-red-600" };
  if (score <= 4) return { key: "passwordStrong", width: "66%", color: "bg-amber-500", text: "text-amber-600" };
  return { key: "passwordVeryStrong", width: "100%", color: "bg-green-600", text: "text-green-600" };
};

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [step, setStep] = useState<"register" | "verify" | "success">("register");
  const [userData, setUserData] = useState<{ email: string; phone?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // ── Register Form ─────────────────────────────────────────────
  const {
    register: registerForm,
    handleSubmit: handleRegister,
    formState: { errors: regErrors }, watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: { account_type: "individual", trading_mode: "sell", business_size: "small" },
  });
  const accountType = watch("account_type");
  const enteredPassword = watch("password") || "";
  const strength = passwordStrength(enteredPassword);

  const onRegister = async (data: RegisterForm) => {
    setLoading(true);
    setServerError(null);

    try {
      await api.post("/api/auth/register/", {
        username: data.username.trim(),
        email: data.email.trim(),
        phone: normalizeMalawiPhone(data.phone),
        password: data.password,
        user_type: data.trading_mode === "sell" ? "farmer" : "buyer",
        account_type: data.account_type,
        trading_mode: data.trading_mode,
        can_buy: data.trading_mode === "buy" || data.trading_mode === "both",
        can_sell: data.trading_mode === "sell" || data.trading_mode === "both",
        organization: data.account_type === "individual" ? undefined : {
          legal_name: data.legal_name?.trim(),
          registration_number: data.registration_number?.trim(),
          representative_name: data.representative_name?.trim(),
          representative_role: data.representative_role?.trim(),
          business_size: data.business_size,
          member_count: data.account_type === "cooperative" && data.member_count ? Number(data.member_count) : undefined,
          address: data.address?.trim(),
        },
      });

      setUserData({ email: data.email.trim(), phone: normalizeMalawiPhone(data.phone) });
      setStep("success");
    } catch (err: any) {
      setServerError(registrationError(err, t("registrationFailed")));
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
    <AuthShell title={step === "register" ? t("createAccount") : step === "success" ? t("accountReady") : "Verify your account"} description={step === "register" ? t("registerDescription") : step === "success" ? t("accountReadyDescription") : `We sent a 6-digit code to ${userData?.phone || userData?.email}`}>
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

        {step === "success" ? <div className="rounded-2xl border border-green-200 bg-green-50 p-7 text-center dark:border-green-900 dark:bg-green-950/30"><CheckCircle2 className="mx-auto text-green-700" size={52} /><h2 className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">{t("accountCreated")}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("signInContinue")}</p><Button className="mt-6 w-full" size="lg" onClick={() => navigate("/login")}>{t("continueSignIn")}<ArrowRight className="ml-2" size={18} /></Button></div> : step === "register" ? (
          <form onSubmit={handleRegister(onRegister)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t("username")}
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
                {t("email")}
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
                {t("phoneLocal")}
              </label>
              <Input
                {...registerForm("phone")}
                placeholder="0999123456"
                inputMode="tel"
                maxLength={10}
                leftIcon={<Phone size={18} />}
                error={regErrors.phone?.message}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t("password")}
              </label>
              <Input
                {...registerForm("password")}
                type="password"
                placeholder="••••••••"
                leftIcon={<Lock size={18} />}
                error={regErrors.password?.message}
              />
              {strength && <div className="mt-2" aria-live="polite"><div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700"><div className={`h-full ${strength.color} transition-all`} style={{ width: strength.width }} /></div><p className={`mt-1 text-xs font-semibold ${strength.text}`}>{t(strength.key)}</p></div>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                {t("accountOwner")}
              </label>
              <select
                {...registerForm("account_type")}
                className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all"
              >
                <option value="individual">{t("individual")}</option>
                <option value="cooperative">{t("cooperative")}</option>
                <option value="company">{t("company")}</option>
                <option value="ngo">NGO / development organization</option>
                <option value="government">Government department or agency</option>
                <option value="institution">Institution / research / education</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{t("tradingIntent")}</label>
              <select {...registerForm("trading_mode")} className="w-full h-11 px-4 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                <option value="buy">{t("buyProducts")}</option><option value="sell">{t("sellProducts")}</option><option value="both">{t("buyAndSell")}</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">{t("capabilityNote")}</p>
            </div>

            {accountType !== "individual" && <div className="space-y-4 rounded-xl border border-green-200 bg-green-50/60 p-4 dark:border-green-900 dark:bg-green-950/20">
              <h3 className="flex items-center gap-2 font-semibold"><Building2 size={18} /> {t("organizationDetails")}</h3>
              <Input {...registerForm("legal_name")} required placeholder={t("legalName")} />
              <Input {...registerForm("registration_number")} required placeholder={t("registrationNumber")} />
              <div className="grid gap-4 sm:grid-cols-2"><Input {...registerForm("representative_name")} required placeholder={t("representative")} /><Input {...registerForm("representative_role")} required placeholder={t("representativeRole")} /></div>
              <select {...registerForm("business_size")} className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white dark:border-gray-600 dark:bg-gray-700"><option value="small">{t("smallOrganization")}</option><option value="medium">{t("mediumOrganization")}</option><option value="large">{t("largeOrganization")}</option></select>
              {accountType === "cooperative" && <Input {...registerForm("member_count")} type="number" min="1" placeholder={t("memberCount")} />}
              <textarea {...registerForm("address")} required placeholder={t("organizationAddress")} className="min-h-24 w-full rounded-xl border border-gray-300 bg-white p-3 dark:border-gray-600 dark:bg-gray-700" />
              <p className="text-xs text-gray-600 dark:text-gray-300">{t("verificationNotice")}</p>
            </div>}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full mt-3 shadow-md hover:shadow-lg"
              disabled={loading}
            >
              {loading ? t("creatingAccount") : t("createFreeAccount")}
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
    </AuthShell>
  );
}
