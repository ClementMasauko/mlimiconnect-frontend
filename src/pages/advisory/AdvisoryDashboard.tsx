// src/pages/advisory/AdvisoryDashboard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Leaf, AlertTriangle, CloudRain, TrendingUp, Bug, Globe, Calendar, Search, Plus, ShieldCheck } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const mockAdvisories = [
  {
    id: 1,
    title: "Maize Planting Guide",
    type: "crop",
    description: "Best practices for high-yield maize in Central Region",
    priority: "high",
    icon: Leaf,
  },
  {
    id: 2,
    title: "Pest Alert: Armyworms",
    type: "pest",
    description: "Detected in Lilongwe area - take immediate action",
    priority: "critical",
    icon: Bug,
  },
  {
    id: 3,
    title: "Rain Forecast",
    type: "weather",
    description: "Heavy rains expected next week - prepare drainage",
    priority: "medium",
    icon: CloudRain,
  },
  {
    id: 4,
    title: "Market Price Trends",
    type: "market",
    description: "Maize prices up 15% - good time to sell",
    priority: "high",
    icon: TrendingUp,
  },
];

export default function AdvisoryDashboard() {
  const { user } = useAuth();
  const isFarmer = user?.user_type === "farmer";
  const [searchQuery, setSearchQuery] = useState("");

  const filteredAdvisories = mockAdvisories.filter(a =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <Globe className="text-green-600" size={32} /> Crop Advisory
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Personalized farming advice, weather alerts, and market insights
              </p>
            </div>
            {isFarmer && (
              <Link to="/app/advisory/smart-contracts">
                <Button className="flex items-center gap-2">
                  <ShieldCheck size={16} /> View Smart Contracts
                </Button>
              </Link>
            )}
          </div>
        </motion.div>

        {/* Search */}
        <Card className="p-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search advisories, crops, pests..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
            />
          </div>
        </Card>

        {/* Advisory Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredAdvisories.map((adv, index) => (
            <motion.div
              key={adv.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:border-green-500">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                    <adv.icon className="text-green-600" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold">{adv.title}</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {adv.description}
                </p>
                <Link to={`/app/advisory/${adv.type}/${adv.id}`}>
                  <Button variant="outline" className="w-full">
                    View Details
                  </Button>
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <Plus size={24} className="text-green-600" /> Quick Advisory Tools
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/app/advisory/crop-recommendation">
              <Button variant="primary" className="w-full flex items-center gap-2">
                <Leaf size={20} /> Get Crop Recommendations
              </Button>
            </Link>
            <Link to="/app/advisory/pest-detection">
              <Button variant="primary" className="w-full flex items-center gap-2">
                <Bug size={20} /> Detect Pests & Diseases
              </Button>
            </Link>
            <Link to="/app/advisory/weather">
              <Button variant="primary" className="w-full flex items-center gap-2">
                <CloudRain size={20} /> Weather Forecast
              </Button>
            </Link>
            <Link to="/app/advisory/market-forecast">
              <Button variant="primary" className="w-full flex items-center gap-2">
                <TrendingUp size={20} /> Market Price Forecast
              </Button>
            </Link>
            <Link to="/app/advisory/smart-contracts">
              <Button variant="primary" className="w-full flex items-center gap-2">
                <ShieldCheck size={20} /> Manage Smart Contracts
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}