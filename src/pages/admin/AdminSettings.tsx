// src/pages/admin/AdminSettings.tsx
import React, { useState } from "react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Save, Globe, DollarSign, Percent, Bell, Shield, Mail, Smartphone, Settings } from "lucide-react";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    platformName: "MlimiConnect",
    commissionRate: 3.5,
    currency: "MWK",
    supportEmail: "support@mlimiconnect.mw",
    supportPhone: "+265 999 123 456",
    smsAlertsEnabled: true,
    emailAlertsEnabled: true,
    twoFactorRequired: false,
    maintenanceMode: false,
    maxListingImages: 8,
    maxProductQuantity: 10000,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    // Simulate API save
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSaving(false);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Settings className="text-blue-600" size={32} />
            Platform Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage global configuration, fees, notifications, and security settings
          </p>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300">
            Settings saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* General Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Globe className="text-blue-600" size={24} />
              General
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform Name
                </label>
                <input
                  type="text"
                  value={settings.platformName}
                  onChange={(e) => handleChange("platformName", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) => handleChange("currency", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MWK">MWK - Malawian Kwacha</option>
                  <option value="USD">USD - US Dollar</option>
                  <option value="ZAR">ZAR - South African Rand</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Images per Listing
                </label>
                <input
                  type="number"
                  value={settings.maxListingImages}
                  onChange={(e) => handleChange("maxListingImages", parseInt(e.target.value) || 1)}
                  min="1"
                  max="20"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Max Product Quantity
                </label>
                <input
                  type="number"
                  value={settings.maxProductQuantity}
                  onChange={(e) => handleChange("maxProductQuantity", parseInt(e.target.value) || 100)}
                  min="100"
                  step="100"
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </Card>

          {/* Revenue & Fees */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <DollarSign className="text-emerald-600" size={24} />
              Revenue & Fees
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Platform Commission Rate (%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={settings.commissionRate}
                    onChange={(e) => handleChange("commissionRate", parseFloat(e.target.value) || 0)}
                    min="0"
                    max="20"
                    step="0.1"
                    className="w-full px-4 py-3 pr-12 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {settings.commissionRate}% of each successful transaction goes to platform
                </p>
              </div>

              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg">
                <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                  Current Monthly Revenue (estimated)
                </p>
                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-400 mt-2">
                  MWK 8,420,000
                </p>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1">
                  +18% from last month
                </p>
              </div>
            </div>
          </Card>

          {/* Support & Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Bell className="text-purple-600" size={24} />
              Support & Notifications
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Support Email
                </label>
                <input
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => handleChange("supportEmail", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Support Phone (WhatsApp/SMS)
                </label>
                <input
                  type="tel"
                  value={settings.supportPhone}
                  onChange={(e) => handleChange("supportPhone", e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="space-y-4">
                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable SMS Alerts
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.smsAlertsEnabled}
                    onChange={(e) => handleChange("smsAlertsEnabled", e.target.checked)}
                    className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>

                <label className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Enable Email Alerts
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.emailAlertsEnabled}
                    onChange={(e) => handleChange("emailAlertsEnabled", e.target.checked)}
                    className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Security & Maintenance */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
              <Shield className="text-red-600" size={24} />
              Security & Maintenance
            </h2>
            <div className="space-y-6">
              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Require 2FA for Admin Accounts
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    All admins must enable two-factor authentication
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactorRequired}
                  onChange={(e) => handleChange("twoFactorRequired", e.target.checked)}
                  className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                />
              </label>

              <label className="flex items-center justify-between">
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Maintenance Mode
                  </span>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Temporarily disable public access for updates
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.maintenanceMode}
                  onChange={(e) => handleChange("maintenanceMode", e.target.checked)}
                  className="h-5 w-5 text-red-600 rounded focus:ring-red-500"
                />
              </label>

              {settings.maintenanceMode && (
                <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Platform is currently in maintenance mode. Only admins can access.
                  </p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Save Button */}
        <div className="mt-10 flex justify-end">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="px-8 py-4 text-lg flex items-center gap-3"
          >
            <Save size={20} />
            {saving ? "Saving..." : "Save All Settings"}
          </Button>
        </div>
      </div>
    </div>
  );
}