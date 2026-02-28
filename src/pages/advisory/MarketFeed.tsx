// src/pages/advisory/MarketFeed.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import {
  TrendingUp,
  DollarSign,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Calendar,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockMarketData = [
  { date: "Jan", maize: 26000, tomatoes: 14000, groundnuts: 38000 },
  { date: "Feb", maize: 27500, tomatoes: 13500, groundnuts: 40000 },
  { date: "Mar", maize: 29000, tomatoes: 15000, groundnuts: 42000 },
  { date: "Apr", maize: 28500, tomatoes: 14500, groundnuts: 41000 },
  { date: "May", maize: 31000, tomatoes: 16000, groundnuts: 43000 },
  { date: "Jun", maize: 34000, tomatoes: 15500, groundnuts: 45000 },
  { date: "Jul (Forecast)", maize: 36000, tomatoes: 17000, groundnuts: 47000 },
];

const crops = ["Maize", "Tomatoes", "Groundnuts", "Soybeans"];

export default function MarketFeed() {
  const [selectedCrop, setSelectedCrop] = useState("Maize");
  const [timeRange, setTimeRange] = useState<"monthly" | "quarterly" | "yearly">("monthly");

  const filteredData = mockMarketData.map(d => ({
    date: d.date,
    price: d[selectedCrop.toLowerCase() as keyof typeof d] || 0,
  }));

  const currentPrice = filteredData[filteredData.length - 1]?.price || 0;
  const priceChange = currentPrice - (filteredData[filteredData.length - 2]?.price || 0);
  const changePercent = ((priceChange / (filteredData[filteredData.length - 2]?.price || 1)) * 100).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Link to="/app/advisory" className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2 mb-4">
            ← Back to Advisory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <TrendingUp className="text-green-600" size={32} /> Market Data Feed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time and forecasted prices for major crops in Malawi
          </p>
        </motion.div>

        {/* Controls */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="flex-1">
              <label className="block text-sm font-medium mb-2">Select Crop</label>
              <select
                value={selectedCrop}
                onChange={e => setSelectedCrop(e.target.value)}
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
              >
                {crops.map(crop => (
                  <option key={crop}>{crop}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Time Range</label>
              <div className="flex gap-2">
                {["monthly", "quarterly", "yearly"].map(range => (
                  <Button
                    key={range}
                    variant={timeRange === range ? "primary" : "ghost"}
                    size="sm"
                    onClick={() => setTimeRange(range as any)}
                    className="capitalize"
                  >
                    {range}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Price Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Current Price</h3>
            <p className="text-3xl font-bold text-green-700 dark:text-green-500">
              MWK {currentPrice.toLocaleString()}
            </p>
            <p className={`mt-2 text-sm font-medium flex items-center gap-1 ${
              priceChange >= 0 ? "text-green-600" : "text-red-600"
            }`}>
              {priceChange >= 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
              {changePercent}% this {timeRange === "monthly" ? "month" : timeRange === "quarterly" ? "quarter" : "year"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Forecast (Next Month)</h3>
            <p className="text-3xl font-bold text-blue-700 dark:text-blue-500">
              MWK {(currentPrice * 1.08).toLocaleString()}
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">+8% expected</p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-2">Best Selling Time</h3>
            <p className="text-2xl font-bold text-purple-700 dark:text-purple-500">
              July - September
            </p>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Peak harvest season</p>
          </Card>
        </div>

        {/* Price Chart */}
        <Card className="p-6 mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold flex items-center gap-3">
              <BarChart3 className="text-green-600" size={24} />
              {selectedCrop} Price Trend
            </h2>
            <Button variant="outline" size="sm" onClick={() => {}}>
              <Download size={16} className="mr-2" /> Export Data
            </Button>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                <XAxis dataKey="date" stroke="#9CA3AF" />
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

        {/* Additional Insights */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Market Signals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg">
              <p className="font-medium text-green-800 dark:text-green-300">
                Strong demand in urban centers
              </p>
              <p className="text-sm text-green-700 dark:text-green-400 mt-2">
                Lilongwe and Blantyre markets showing 20% higher prices
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
              <p className="font-medium text-blue-800 dark:text-blue-300">
                Export opportunity to Zambia
              </p>
              <p className="text-sm text-blue-700 dark:text-blue-400 mt-2">
                Groundnut prices expected to rise further
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}