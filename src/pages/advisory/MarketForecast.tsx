// src/pages/advisory/MarketForecast.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Calendar, BarChart3, AlertTriangle } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockForecastData = [
  { month: "Jan", price: 26000 },
  { month: "Feb", price: 27500 },
  { month: "Mar", price: 29000 },
  { month: "Apr", price: 28500 },
  { month: "May", price: 31000 },
  { month: "Jun", price: 34000 },
  { month: "Jul (Forecast)", price: 36000 },
  { month: "Aug (Forecast)", price: 35500 },
];

export default function MarketForecast() {
  const [crop, setCrop] = useState("Maize");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/app/advisory" className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2 mb-4">
            ← Back to Advisory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="text-green-600" size={32} /> Market Forecast
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Price trends and predictions for major crops in Malawi
          </p>
        </div>

        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <label className="text-lg font-medium whitespace-nowrap">Select Crop:</label>
            <select
              value={crop}
              onChange={e => setCrop(e.target.value)}
              className="w-full sm:w-64 px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            >
              <option>Maize</option>
              <option>Tomatoes</option>
              <option>Groundnuts</option>
              <option>Soybeans</option>
            </select>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
              <BarChart3 className="text-green-600" size={24} /> {crop} Price Forecast
            </h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockForecastData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1F2937",
                      border: "none",
                      borderRadius: "8px",
                      color: "#F3F4F6",
                    }}
                    formatter={(value) => [`MWK ${value.toLocaleString()}`, "Price"]}
                  />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#10B981"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-6">Key Insights</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <ArrowUpRight className="text-green-600" size={24} />
                <div>
                  <p className="font-medium">Current Trend</p>
                  <p className="text-green-700 dark:text-green-400">Upward +15% last 3 months</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Calendar className="text-blue-600" size={24} />
                <div>
                  <p className="font-medium">Peak Season</p>
                  <p>July - September (Harvest)</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <AlertTriangle className="text-amber-600" size={24} />
                <div>
                  <p className="font-medium">Risk Factors</p>
                  <p>Potential drought in Northern Region</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}