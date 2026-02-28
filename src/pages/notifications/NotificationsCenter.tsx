import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import { Bell, CheckCircle2, AlertTriangle, MessageSquare, CloudRain } from "lucide-react";

const mockNotifications = [
  {
    id: 1,
    type: "order",
    title: "Order Confirmed",
    message: "50kg maize sold to Shoprite Lilongwe – MWK 185,000",
    time: "2 hours ago",
    read: false,
    icon: CheckCircle2,
    color: "text-green-600",
  },
  {
    id: 2,
    type: "weather",
    title: "Heavy Rain Alert – Central Region",
    message: "Heavy rainfall expected tomorrow. Protect harvested crops.",
    time: "1 hour ago",
    read: false,
    icon: CloudRain,
    color: "text-blue-600",
  },
  {
    id: 3,
    type: "message",
    title: "New Message",
    message: "Buyer asked about delivery timeline for tomatoes",
    time: "3 hours ago",
    read: true,
    icon: MessageSquare,
    color: "text-indigo-600",
  },
  {
    id: 4,
    type: "pest",
    title: "Pest Detection Result",
    message: "Fall armyworm detected in maize field – treatment advice sent",
    time: "Yesterday",
    read: true,
    icon: AlertTriangle,
    color: "text-amber-600",
  },
];

export default function NotificationsCenter() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            to="/app/dashboard"
            className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2 mb-4"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Bell className="text-green-600" size={32} /> Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Updates, alerts, messages and important farm notifications
          </p>
        </div>

        <Card className="p-6">
          {mockNotifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              No notifications at the moment. Check back later.
            </div>
          ) : (
            <div className="space-y-4">
              {mockNotifications.map((notif, index) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div
                    className={`p-5 rounded-xl border ${
                      notif.read
                        ? "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                        : "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800"
                    } hover:shadow-md transition-shadow`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-full bg-opacity-10 ${notif.color.replace("text-", "bg-")}`}>
                        <notif.icon size={24} className={notif.color} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            {notif.title}
                          </h3>
                          <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                            {notif.time}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-gray-300">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}