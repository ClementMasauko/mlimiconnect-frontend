import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Heart, Users, TrendingUp, Award, Globe, Leaf, ShieldCheck } from "lucide-react";

const impactStats = {
  farmersEmpowered: 3200,
  incomeUplift: "35%",
  transactions: 14500,
  wasteReduced: "22%",
  regionsCovered: "28",
};

const coreValues = [
  { icon: <Leaf />, title: "Farmer-First", desc: "We exist to empower smallholder farmers with fair prices, knowledge, and direct market access." },
  { icon: <ShieldCheck />, title: "Transparency & Trust", desc: "Blockchain traceability and escrow payments build confidence for every transaction." },
  { icon: <Globe />, title: "Sustainable Growth", desc: "Promoting organic practices, waste reduction, and climate-smart agriculture." },
  { icon: <Users />, title: "Community-Driven", desc: "Built with input from farmers, buyers, and extension officers across Malawi." },
];

const teamHighlights = [
  { name: "Dr. Chimwemwe Banda", role: "Founder & Agronomist", desc: "15+ years improving smallholder yields in Malawi", imgInitial: "CB" },
  { name: "Aisha Mwale", role: "Head of Technology", desc: "Built mobile & USSD systems for rural connectivity", imgInitial: "AM" },
  { name: "Kelvin Phiri", role: "Partnerships Lead", desc: "Former NFRA & Agri-input supplier relations", imgInitial: "KP" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-green-700 to-emerald-900 text-white py-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/images/farm-pattern.svg')] bg-repeat opacity-10"></div>
        </div>
        <div className="relative max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Empowering Malawi's Farmers
          </h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed">
            MlimiConnect connects smallholder farmers directly to buyers, provides real-time advisory, traceability, and fair payments — building a stronger, more transparent agricultural future.
          </p>
          <div className="mt-10">
            <Button variant="primary" size="lg" className="px-10 py-6 text-lg shadow-xl" asChild>
              <Link to="/register">Join the Movement</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Impact Stats */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Real Impact Across Malawi
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Users />, value: impactStats.farmersEmpowered.toLocaleString(), label: "Farmers Empowered" },
              { icon: <TrendingUp />, value: impactStats.incomeUplift, label: "Average Income Uplift" },
              { icon: <Award />, value: impactStats.transactions.toLocaleString(), label: "Transactions Completed" },
              { icon: <Heart />, value: impactStats.wasteReduced, label: "Post-Harvest Waste Reduced" },
            ].map((stat, i) => (
              <Card key={i} className="p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                  {React.cloneElement(stat.icon, { className: "h-8 w-8 text-green-600" })}
                </div>
                <p className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3">
                  {stat.value}
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400">{stat.label}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Our Mission & Values */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
              Our Mission & Core Values
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto">
              We believe every farmer deserves fair prices, knowledge, and opportunity — no matter how small their land.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {coreValues.map((value, i) => (
              <Card key={i} className="p-8 text-center hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6">
                  {React.cloneElement(value.icon, { className: "h-8 w-8 text-green-600" })}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Highlights */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Meet the Team Driving Change
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {teamHighlights.map((member, i) => (
              <Card key={i} className="p-8 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-24 h-24 mx-auto rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mb-6 text-3xl font-bold text-green-600">
                  {member.imgInitial}
                </div>
                <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{member.name}</h3>
                <p className="text-green-600 dark:text-green-400 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400">{member.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-emerald-800 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Be Part of the Change?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Join thousands of farmers and buyers already building a stronger agricultural future in Malawi.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button variant="primary" size="lg" className="px-12 py-6 text-lg shadow-2xl" asChild>
              <Link to="/register">Register Now</Link>
            </Button>
            <Button variant="outline" size="lg" className="px-12 py-6 text-lg border-white text-white hover:bg-white/10" asChild>
              <Link to="/support">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}