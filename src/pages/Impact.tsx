import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { Heart, Users, TrendingUp, Award } from "lucide-react";
import Button from "../components/ui/Button";

const mockImpactStats = {
  farmersEmpowered: 3200,
  incomeUplift: "35%",
  transactions: 14500,
  wasteReduced: "22%",
};

const mockStories = [
  {
    name: "Grace Mwale",
    location: "Zomba",
    story: "Sold directly to restaurants – increased my income by 60% this season. No more middlemen!",
    impact: "MWK 450,000 extra earnings",
  },
  {
    name: "Thomas Banda",
    location: "Mzimba",
    story: "Used pest detection and weather alerts to save my maize crop from armyworms.",
    impact: "Saved 80% of harvest",
  },
];

export default function Impact() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Real Impact, Real Farmers
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            See how MlimiConnect is changing lives and building a fairer agricultural future in Malawi
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 text-center">
            <Users className="mx-auto text-green-600 mb-4" size={40} />
            <p className="text-4xl font-bold">{mockImpactStats.farmersEmpowered.toLocaleString()}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Farmers Empowered</p>
          </Card>
          <Card className="p-6 text-center">
            <TrendingUp className="mx-auto text-emerald-600 mb-4" size={40} />
            <p className="text-4xl font-bold">{mockImpactStats.incomeUplift}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Average Income Uplift</p>
          </Card>
          <Card className="p-6 text-center">
            <Award className="mx-auto text-blue-600 mb-4" size={40} />
            <p className="text-4xl font-bold">{mockImpactStats.transactions.toLocaleString()}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Transactions Completed</p>
          </Card>
          <Card className="p-6 text-center">
            <Heart className="mx-auto text-red-600 mb-4" size={40} />
            <p className="text-4xl font-bold">{mockImpactStats.wasteReduced}</p>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Post-Harvest Waste Reduced</p>
          </Card>
        </div>

        <h2 className="text-3xl font-bold text-center mb-10">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {mockStories.map((story, i) => (
            <Card key={i} className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-2xl font-bold text-green-600">
                  {story.name[0]}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{story.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{story.location}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 mb-6">"{story.story}"</p>
              <p className="font-medium text-green-600">Impact: {story.impact}</p>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="primary" size="lg">
            Join the Movement – Register Now
          </Button>
        </div>
      </div>
    </div>
  );
}