// src/pages/advisory/CropRecommendation.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { Leaf, MapPin, Calendar, TrendingUp, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const mockRecommendations = [
  {
    crop: "Maize",
    suitability: 95,
    plantingSeason: "November - December",
    expectedYield: "4-6 tons/ha",
    marketPrice: "MWK 28,500/50kg",
    risks: "Low drought risk with current weather",
    smartContract: "Available: Automatic insurance trigger on low rainfall",
  },
  {
    crop: "Soybeans",
    suitability: 88,
    plantingSeason: "December - January",
    expectedYield: "2-3 tons/ha",
    marketPrice: "MWK 58,000/50kg",
    risks: "Monitor for aphids",
    smartContract: "Available: Yield-based payment",
  },
  {
    crop: "Tomatoes",
    suitability: 76,
    plantingSeason: "Year-round with irrigation",
    expectedYield: "20-30 tons/ha",
    marketPrice: "MWK 15,000/10kg",
    risks: "High pest risk - use organic control",
    smartContract: "Available: Quality-based premium",
  },
];

export default function CropRecommendation() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    location: user?.location || "Lilongwe",
    soilType: "Loamy",
    farmSize: "3 hectares",
    season: "Rainy",
  });

  const [recommendations, setRecommendations] = useState(mockRecommendations);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setRecommendations(mockRecommendations); // Simulate AI/smart recommendation
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link to="/app/advisory" className="text-green-700 dark:text-green-400 hover:underline flex items-center gap-2">
            ← Back to Advisory
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mt-2 flex items-center gap-3">
            <Leaf className="text-green-600" size={32} /> Crop Recommendations
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Get AI-powered crop suggestions based on your location, soil, and season.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Form */}
          <Card className="p-6 lg:col-span-1 sticky top-24">
            <h2 className="text-xl font-semibold mb-6">Your Farm Details</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Input
                  value={form.location}
                  onChange={e => setForm({ ...form, location: e.target.value })}
                  icon={<MapPin size={18} />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Soil Type</label>
                <select
                  value={form.soilType}
                  onChange={e => setForm({ ...form, soilType: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option>Loamy</option>
                  <option>Sandy</option>
                  <option>Clay</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Farm Size</label>
                <Input
                  value={form.farmSize}
                  onChange={e => setForm({ ...form, farmSize: e.target.value })}
                  icon={<Leaf size={18} />}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Season</label>
                <select
                  value={form.season}
                  onChange={e => setForm({ ...form, season: e.target.value })}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  <option>Rainy</option>
                  <option>Dry</option>
                </select>
              </div>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full"
              >
                {loading ? "Generating..." : "Get Recommendations"}
              </Button>
            </div>
          </Card>

          {/* Recommendations */}
          <div className="lg:col-span-2 space-y-6">
            {recommendations.map((rec, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="p-6 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-full">
                      <Leaf className="text-green-600" size={24} />
                    </div>
                    <h3 className="text-xl font-semibold">{rec.crop}</h3>
                  </div>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Suitability:</span>
                      <span className="font-medium text-green-700 dark:text-green-400">{rec.suitability}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Planting Season:</span>
                      <span className="font-medium">{rec.plantingSeason}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Expected Yield:</span>
                      <span className="font-medium">{rec.expectedYield}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Market Price:</span>
                      <span className="font-medium text-blue-700 dark:text-blue-400">{rec.marketPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Risks:</span>
                      <span className="font-medium text-amber-700 dark:text-amber-400">{rec.risks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Smart Contract:</span>
                      <span className="font-medium text-purple-700 dark:text-purple-400">{rec.smartContract}</span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}