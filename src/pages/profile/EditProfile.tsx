// src/pages/profile/EditProfile.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import {
  Upload,
  X,
  Save,
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Leaf,
  Eye,
  EyeOff,
  Shield,
  Bell,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

export default function EditProfile() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    farmSize: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorEnabled: false,
    avatar: null as File | null,
    showPassword: false,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Modal states
  const [showEnable2FAModal, setShowEnable2FAModal] = useState(false);
  const [showDisable2FAModal, setShowDisable2FAModal] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [codeError, setCodeError] = useState("");

  const isFarmer = user?.user_type === "farmer";

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        username: user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        location: "Lilongwe, Area 18",
        bio: "Passionate farmer specializing in maize and vegetables.",
        farmSize: isFarmer ? "3.2 hectares" : "",
        twoFactorEnabled: false, // ← In real app: fetch from user.twoFactorEnabled
      }));
    }
  }, [user, isFarmer]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, avatar: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!form.username.trim()) newErrors.username = "Username is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = "Invalid email format";

    if (form.newPassword) {
      if (form.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
      if (form.newPassword !== form.confirmPassword) newErrors.confirmPassword = "Passwords do not match";
      if (!form.currentPassword) newErrors.currentPassword = "Current password is required to change password";
    }

    if (isFarmer && !form.farmSize.trim()) newErrors.farmSize = "Farm size is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSuccess(true);
      setTimeout(() => navigate("/app/profile"), 2000);
    } catch {
      setErrors({ submit: "Failed to update profile. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const requestEnable2FA = () => {
    // Simulate sending code to phone
    setShowEnable2FAModal(true);
    setVerificationCode("");
    setCodeError("");
  };

  const confirmEnable2FA = () => {
    if (!verificationCode.trim()) {
      setCodeError("Please enter the verification code");
      return;
    }
    if (verificationCode !== "123456") { // ← dummy check — replace with real backend validation
      setCodeError("Invalid code. Please try again.");
      return;
    }

    setForm((prev) => ({ ...prev, twoFactorEnabled: true }));
    setShowEnable2FAModal(false);
    // In real app: api.post("/api/2fa/verify", { code: verificationCode })
  };

  const confirmDisable2FA = () => {
    setForm((prev) => ({ ...prev, twoFactorEnabled: false }));
    setShowDisable2FAModal(false);
    // In real app: api.post("/api/2fa/disable")
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate("/app/profile")}
            className="inline-flex items-center text-green-700 dark:text-green-400 hover:underline mb-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Update your personal information and security settings
          </p>
        </div>

        {success ? (
          <Card className="p-12 text-center">
            <CheckCircle className="mx-auto text-green-600 dark:text-green-500" size={64} />
            <h2 className="text-2xl font-bold mt-6 mb-4 text-gray-900 dark:text-white">
              Profile Updated Successfully
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Your changes have been saved.
            </p>
            <Button onClick={() => navigate("/app/profile")}>View Profile</Button>
          </Card>
        ) : (
          <Card className="p-6 md:p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-10">
              {/* Avatar */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Profile Photo
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  <div className="relative">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Profile preview"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 dark:border-gray-700 shadow"
                      />
                    ) : (
                      <div className="w-32 h-32 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User size={48} className="text-gray-400" />
                      </div>
                    )}
                    <label className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2.5 cursor-pointer hover:bg-green-700 shadow">
                      <Upload size={16} />
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Click the camera icon to upload a new photo</p>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Username *
                  </label>
                  <Input
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    error={errors.username}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email *
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    error={errors.email}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Location
                  </label>
                  <Input
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                  />
                </div>
              </div>

              {isFarmer && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Farm Size (hectares/acres)
                  </label>
                  <Input
                    value={form.farmSize}
                    onChange={(e) => setForm({ ...form, farmSize: e.target.value })}
                    error={errors.farmSize}
                  />
                </div>
              )}

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bio / About You
                </label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white resize-y"
                  placeholder={isFarmer ? "Tell buyers about your farm..." : "Tell sellers about your needs..."}
                />
              </div>

              {/* Password Change */}
              <div className="pt-6 border-t dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">Current Password</label>
                    <div className="relative">
                      <Input
                        type={form.showPassword ? "text" : "password"}
                        value={form.currentPassword}
                        onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                        placeholder="••••••••"
                        error={errors.currentPassword}
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        onClick={() => setForm({ ...form, showPassword: !form.showPassword })}
                      >
                        {form.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">New Password</label>
                    <Input
                      type="password"
                      value={form.newPassword}
                      onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                      placeholder="New password (optional)"
                      error={errors.newPassword}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                    <Input
                      type="password"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      placeholder="Confirm new password"
                      error={errors.confirmPassword}
                    />
                  </div>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="pt-6 border-t dark:border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="text-green-600" size={22} /> Security
                </h3>
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.twoFactorEnabled}
                      onChange={() => {
                        if (form.twoFactorEnabled) {
                          setShowDisable2FAModal(true);
                        } else {
                          requestEnable2FA();
                        }
                      }}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
                  </label>
                </div>
              </div>

              {/* Notifications Preferences Link */}
              <div className="pt-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => navigate("/app/profile/notifications-management")}
                >
                  <Bell size={16} /> Manage Notification Preferences
                </Button>
              </div>

              {/* Submit Buttons */}
              <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t dark:border-gray-700">
                <Button type="button" variant="outline" onClick={() => navigate("/app/profile")}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={loading}
                  className="min-w-[200px]"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              {errors.submit && (
                <p className="text-red-600 dark:text-red-400 text-center mt-4">{errors.submit}</p>
              )}
            </form>
          </Card>
        )}

        {/* Enable 2FA Modal */}
        {showEnable2FAModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                  <Shield className="text-green-600" size={24} />
                  Enable Two-Factor Authentication
                </h3>
                <button
                  onClick={() => setShowEnable2FAModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X size={24} />
                </button>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We'll send a 6-digit verification code to{" "}
                <strong className="text-gray-900 dark:text-white">{form.phone || user?.phone || "your phone number"}</strong>.
              </p>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Verification Code
                </label>
                <Input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => {
                    setVerificationCode(e.target.value);
                    setCodeError("");
                  }}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  error={codeError}
                  autoFocus
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Didn't receive a code? <button className="text-green-600 hover:underline">Resend</button>
                </p>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowEnable2FAModal(false)}>
                  Cancel
                </Button>
                <Button onClick={confirmEnable2FA} disabled={!verificationCode.trim()}>
                  Verify & Enable
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Disable 2FA Confirmation Modal */}
        {showDisable2FAModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full p-8">
              <div className="flex items-center gap-4 mb-6">
                <AlertTriangle className="text-amber-600" size={32} />
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Disable Two-Factor Authentication?
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-8">
                Disabling 2FA will make your account less secure. You will only need your password to log in.
              </p>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowDisable2FAModal(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={confirmDisable2FA}>
                  Disable 2FA
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}