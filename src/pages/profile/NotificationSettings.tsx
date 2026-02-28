// src/pages/profile/NotificationSettings.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Bell, Mail, MessageSquare, Smartphone, Save, ArrowLeft } from "lucide-react";

export default function NotificationSettings() {
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    emailNewOrders: true,
    emailPriceAlerts: true,
    emailMessages: true,
    smsNewOrders: false,
    smsPriceAlerts: false,
    smsMessages: true,
    pushNewOrders: true,
    pushPriceAlerts: true,
    pushMessages: true,
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      // Real API (uncomment later):
      // await api.put("/api/users/notifications", settings);

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      alert("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <button
            onClick={() => navigate("/app/profile")}
            className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2"
          >
            <ArrowLeft size={16} /> Back to Profile
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notification Settings</h1>
        </div>

        <Card className="p-6 md:p-8 shadow-lg">
          {success && (
            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300 text-center">
              Settings saved successfully!
            </div>
          )}

          <div className="space-y-10">
            {/* Email Notifications */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <Mail className="text-green-600" size={22} /> Email Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { key: "emailNewOrders", label: "New orders or messages" },
                  { key: "emailPriceAlerts", label: "Price changes on saved products" },
                  { key: "emailMessages", label: "New direct messages" },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof typeof settings]}
                      onChange={() => handleToggle(item.key as keyof typeof settings)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300 dark:border-gray-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* SMS Notifications */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <Smartphone className="text-green-600" size={22} /> SMS Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { key: "smsNewOrders", label: "New orders or messages" },
                  { key: "smsPriceAlerts", label: "Price changes on saved products" },
                  { key: "smsMessages", label: "New direct messages" },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof typeof settings]}
                      onChange={() => handleToggle(item.key as keyof typeof settings)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300 dark:border-gray-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Push Notifications */}
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-3">
                <Bell className="text-green-600" size={22} /> Push Notifications
              </h3>
              <div className="space-y-4">
                {[
                  { key: "pushNewOrders", label: "New orders or messages" },
                  { key: "pushPriceAlerts", label: "Price changes on saved products" },
                  { key: "pushMessages", label: "New direct messages" },
                ].map(item => (
                  <label key={item.key} className="flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
                    <input
                      type="checkbox"
                      checked={settings[item.key as keyof typeof settings]}
                      onChange={() => handleToggle(item.key as keyof typeof settings)}
                      className="w-5 h-5 text-green-600 rounded focus:ring-green-500 border-gray-300 dark:border-gray-600"
                    />
                  </label>
                ))}
              </div>
            </div>

            {/* Save Button */}
            <div className="pt-6 border-t dark:border-gray-700">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="w-full md:w-auto min-w-[200px] flex items-center justify-center gap-2"
              >
                <Save size={18} />
                {saving ? "Saving..." : "Save Notification Settings"}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}