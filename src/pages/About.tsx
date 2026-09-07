import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Users, Globe, Leaf, ShieldCheck } from "lucide-react";

const coreValues = [
  { icon: <Leaf />, title: "Farmer-First", desc: "We exist to empower smallholder farmers with fair prices, knowledge, and direct market access." },
  { icon: <ShieldCheck />, title: "Transparency & Trust", desc: "Append-only traceability records and clearly identified payment providers help build confidence." },
  { icon: <Globe />, title: "Sustainable Growth", desc: "Promoting organic practices, waste reduction, and climate-smart agriculture." },
  { icon: <Users />, title: "Community-Driven", desc: "Built with input from farmers, buyers, and extension officers across Malawi." },
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

      {/* Impact measurement */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Building evidence before publishing claims
          </h2>
          <Card className="mx-auto max-w-4xl p-8 text-center"><Users className="mx-auto text-green-700" size={40} /><p className="mt-5 text-lg text-gray-600 dark:text-gray-300">Verified reach, completed transactions, farmer income outcomes, and post-harvest loss measurements will be published only when a dated methodology and supporting evidence are available.</p><Link to="/impact" className="mt-5 inline-block font-bold text-green-700">View the impact measurement plan</Link></Card>
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

      {/* Collaboration */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-gray-900 dark:text-white">
            Built for responsible collaboration
          </h2>
          <Card className="mx-auto max-w-4xl p-8 text-center"><p className="text-lg text-gray-600 dark:text-gray-300">MlimiConnect is preparing structured pilot collaboration with farmers, buyers, transporters, extension professionals, and service providers. Named team or partner profiles will be published only after identity and role details are confirmed.</p></Card>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-emerald-800 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Be Part of the Change?
          </h2>
          <p className="text-xl opacity-90 mb-10 max-w-3xl mx-auto">
            Join the pilot community helping shape a stronger agricultural marketplace in Malawi.
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
