import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Settings, Globe, Bell, Moon, Smartphone, Trash2, LogOut } from "lucide-react";

export default function SettingsPage() {
  const [language, setLanguage] = useState("english");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [lowData, setLowData] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            to="/app/profile"
            className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2 mb-4"
          >
            ← Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Settings className="text-green-600" size={32} /> Settings
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Customize your MlimiConnect experience
          </p>
        </div>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6">Preferences</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Globe size={18} /> Language
              </label>
              <select
                value={language}
                onChange={e => setLanguage(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              >
                <option value="english">English</option>
                <option value="chichewa">Chichewa</option>
                <option value="chitumbuka">Chitumbuka</option>
              </select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell size={18} />
                <span className="font-medium">Push Notifications</span>
              </div>
              <input
                type="checkbox"
                checked={notifications}
                onChange={e => setNotifications(e.target.checked)}
                className="h-6 w-6 text-green-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon size={18} />
                <span className="font-medium">Dark Mode</span>
              </div>
              <input
                type="checkbox"
                checked={darkMode}
                onChange={e => setDarkMode(e.target.checked)}
                className="h-6 w-6 text-green-600 rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone size={18} />
                <span className="font-medium">Low Data Mode</span>
              </div>
              <input
                type="checkbox"
                checked={lowData}
                onChange={e => setLowData(e.target.checked)}
                className="h-6 w-6 text-green-600 rounded"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 mb-8">
          <h2 className="text-xl font-semibold mb-6 text-red-600">Danger Zone</h2>
          <div className="space-y-4">
            <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 size={18} className="mr-2" /> Delete Account
            </Button>
            <Button variant="outline" className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50">
              <LogOut size={18} className="mr-2" /> Log Out
            </Button>
          </div>
        </Card>

        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          App Version 1.2.3 • © 2026 MlimiConnect
        </div>
      </div>
    </div>
  );
}