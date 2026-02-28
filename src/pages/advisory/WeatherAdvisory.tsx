// src/pages/advisory/WeatherAdvisory.tsx
import React from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import { CloudRain, Sun, Wind, Thermometer, Droplets, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

const mockWeather = {
  location: "Lilongwe",
  current: {
    temp: 28,
    condition: "Partly Cloudy",
    humidity: 65,
    wind: 12,
    rainChance: 30,
  },
  forecast: [
    { day: "Today", temp: "28°C", condition: "Partly Cloudy", rain: 30, icon: CloudRain },
    { day: "Tomorrow", temp: "26°C", condition: "Heavy Rain", rain: 80, icon: CloudRain },
    { day: "Day 3", temp: "24°C", condition: "Thunderstorms", rain: 90, icon: AlertTriangle },
    { day: "Day 4", temp: "29°C", condition: "Sunny", rain: 10, icon: Sun },
  ],
  alerts: [
    "Heavy rainfall expected tomorrow - prepare drainage",
    "High humidity may increase fungal risk on maize",
  ],
};

export default function WeatherAdvisory() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/app/advisory" className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2 mb-4">
            ← Back to Advisory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <CloudRain className="text-blue-600" size={32} /> Weather Advisory
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time weather + farming impact alerts for your location
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Current Weather */}
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Current Weather - {mockWeather.location}</h2>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Thermometer className="text-orange-500" size={48} />
                  <div>
                    <p className="text-4xl font-bold">{mockWeather.current.temp}°C</p>
                    <p className="text-gray-600 dark:text-gray-400">{mockWeather.current.condition}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Droplets className="mx-auto text-blue-500 mb-2" size={24} />
                  <p className="font-medium">{mockWeather.current.humidity}%</p>
                  <p className="text-sm text-gray-500">Humidity</p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <Wind className="mx-auto text-cyan-500 mb-2" size={24} />
                  <p className="font-medium">{mockWeather.current.wind} km/h</p>
                  <p className="text-sm text-gray-500">Wind</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Forecast */}
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-semibold mb-6">7-Day Forecast & Farming Impact</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {mockWeather.forecast.map((day, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 bg-white dark:bg-gray-800 rounded-lg text-center hover:shadow-md transition-shadow"
                >
                  <p className="font-medium mb-2">{day.day}</p>
                  <day.icon className="mx-auto mb-2" size={32} />
                  <p className="text-xl font-bold">{day.temp}</p>
                  <p className="text-sm text-gray-500">{day.condition}</p>
                  <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                    Rain chance: {day.rain}%
                  </p>
                </motion.div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <AlertTriangle className="text-amber-600" size={20} /> Farming Alerts
              </h3>
              {mockWeather.alerts.map((alert, i) => (
                <div key={i} className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg">
                  <p className="text-amber-800 dark:text-amber-300">{alert}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}