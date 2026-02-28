// src/pages/LandingPage.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Leaf, CheckCircle, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
  size?: "default" | "lg";
  children: React.ReactNode;
  className?: string;
}

const Button = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  ...props
}: ButtonProps) => {
  const base =
    "inline-flex items-center justify-center rounded-xl font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg",
    outline: "border-2 border-green-600 text-green-700 hover:bg-green-50 hover:border-green-700",
  };
  const sizes = {
    default: "h-10 py-2 px-6",
    lg: "h-12 px-8 text-lg",
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

export default function LandingPage() {
  const [logoError, setLogoError] = useState(false);
  const [dashboardError, setDashboardError] = useState(false);

  return (
    <>
      <Helmet>
        <title>MlimiConnect – Sell Your Harvest Smarter in Malawi</title>
        <meta
          name="description"
          content="Get better prices, secure mobile money payments, and reliable transport. Join 1,000+ Malawian farmers, buyers & transporters today."
        />
        <meta
          name="keywords"
          content="agritech Malawi, sell crops online Malawi, farmer marketplace, mobile money farming, maize prices Malawi"
        />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-green-50">

        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-green-100 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="MlimiConnect Logo"
                  className="h-9 md:h-10"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-xl">
                  MC
                </div>
              )}
              <span className="text-2xl font-extrabold text-green-800 tracking-tight">MlimiConnect</span>
            </div>

            <div className="hidden md:flex items-center gap-7 text-gray-700 font-medium">
              <Link to="/marketplace" className="hover:text-green-700 transition-colors">Marketplace</Link>
              <Link to="/prices" className="hover:text-green-700 transition-colors">Prices</Link>
              <Link to="/features" className="hover:text-green-700 transition-colors">Features</Link>
              <Link to="/pricing" className="hover:text-green-700 transition-colors">Pricing</Link>
              <Link to="/blog" className="hover:text-green-700 transition-colors">Blog</Link>
              <Link to="/about" className="hover:text-green-700 transition-colors">About</Link>
            </div>

            <div className="flex items-center gap-5">
              <Link
                to="/login"
                className="hidden sm:block text-gray-700 hover:text-green-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>

        {/* HERO */}
        <section className="relative pt-20 pb-32 md:pb-40 overflow-hidden min-h-[85vh] flex items-center">
          <div className="absolute inset-0 grid lg:grid-cols-2">
            <div className="bg-gradient-to-br from-white via-green-50 to-green-50/40" />
            <div className="hidden lg:block relative">
              <img
                src="/hero.png"
                alt="Malawian maize field"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.96]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Get <span className="text-green-600">Better Prices</span>, Faster Sales & Safer Payments
              </h1>

              <p className="text-lg sm:text-xl text-gray-800 mb-8 max-w-xl leading-relaxed">
                Thousands of Malawian farmers are already selling more, getting paid securely via mobile money, and arranging reliable transport — all in one place.
              </p>

              <div className="flex flex-wrap gap-4 mb-10">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="shadow-lg">
                    Start Selling Today – Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/marketplace">
                  <Button variant="outline" size="lg">Browse Listings</Button>
                </Link>
              </div>

              <div className="flex items-center gap-3 text-green-700 font-medium">
                <CheckCircle className="h-5 w-5" />
                <span>Trusted by 1,000+ farmers across Malawi</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto lg:mx-0 max-w-md lg:max-w-xl"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-[14px] border-gray-900 ring-1 ring-gray-800/50 bg-gray-900">
                {!dashboardError ? (
                  <img
                    src="/dashboard-screenshot.png"
                    alt="MlimiConnect farmer dashboard"
                    className="w-full h-auto object-cover"
                    onError={() => setDashboardError(true)}
                    loading="lazy"
                  />
                ) : (
                  <div className="aspect-[4/3] bg-green-700 flex items-center justify-center text-white text-xl font-bold p-8 text-center">
                    MlimiConnect Dashboard Preview
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </section>

        {/* STATS – minimal */}
        <section className="bg-white-60 py-16 border-y border-green-100">
          <div className="max-w-9xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-center">
            {[
              { num: "1,000+", label: "Farmers" },
              { num: "300+", label: "Buyers" },
              { num: "50+", label: "Transporters" },
              { num: "MWK 120M+", label: "Trade Volume" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-2xl lg:text-3xl font-extrabold text-green-700">{stat.num}</p>
                <p className="mt-1 text-gray-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="py-20 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h2 className="text-2xl lg:text-3xl font-extrabold mb-12 lg:mb-16">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
              {[
                { title: "List Your Produce", desc: "Upload your crops, quantity and photos in minutes — free." },
                { title: "Get Matched & Sell", desc: "Buyers see your listing and place secure orders." },
                { title: "Deliver & Get Paid", desc: "Arrange transport and receive payment via mobile money after delivery." },
              ].map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-green-50/60 p-8 rounded-2xl shadow-sm border border-green-100"
                >
                  <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center text-green-700 text-2xl font-bold">
                    {i + 1}
                  </div>
                  <h3 className="font-bold text-xl mb-3">{step.title}</h3>
                  <p className="text-gray-700">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES – with images */}
        <section className="py-20 lg:py-24 bg-gradient-to-b from-white to-green-50" id="features">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-4xl lg:text-5xl font-extrabold text-center mb-16">Why Farmers Choose MlimiConnect</h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {[
                { title: "Get Paid Safely", desc: "Escrow holds payment until you confirm delivery — no more chasing buyers.", img: "/features/secure-payments.png" },
                { title: "Find Reliable Transport", desc: "Compare transporter bids and book delivery in one tap.", img: "/features/logistics.png" },
                { title: "Know the Real Market Price", desc: "Live price updates for maize, beans, soy & more — sell at the best time.", img: "/features/prices.png" },
                { title: "Build Your Reputation", desc: "Verified profiles & ratings help serious buyers trust you faster.", img: "/features/network.png" },
                { title: "Instant Mobile Money", desc: "Withdraw earnings directly to Airtel Money or TNM Mpamba.", img: "/features/mobile-money.png" },
                { title: "Sell Beyond Your District", desc: "Reach buyers in Mzuzu, Blantyre, Zomba & beyond.", img: "/features/regional.png" },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-200 hover:border-green-500 transition-all duration-300"
                >
                  <div className="h-48 md:h-56 relative">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-xl text-gray-900 mb-3">{f.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERS / TRUST */}
        <section className="py-16 bg-green-50/70">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-8">
              Trusted by Leading Organizations & Networks
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-10 md:gap-16 opacity-90">
              <img src="/partners/airtel.png" alt="Airtel Malawi" className="h-10 md:h-12 object-contain" loading="lazy" />
              <img src="/partners/tnm.png" alt="TNM" className="h-10 md:h-12 object-contain" loading="lazy" />
              <img src="/partners/agcom.png" alt="Farmers Union" className="h-10 md:h-12 object-contain" loading="lazy" />
              <img src="/partners/malawi.jpg" alt="Government of Malawi" className="h-10 md:h-12 object-contain" loading="lazy" />
              <img src="/partners/IFAD.png" alt="IFAD" className="h-10 md:h-12 object-contain" loading="lazy" />
              <img src="/partners/fao.webp" alt="FAO" className="h-10 md:h-12 object-contain" loading="lazy" />
            </div>
          </div>
        </section>

        {/* CTA – with background image restored */}
        <section
          className="relative py-28 lg:py-36 text-center text-white bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/cta-farm.png')", // ← your original farm image – replace if needed
          }}
        >
          <div className="absolute inset-0 bg-green-900/65" /> {/* Darker overlay for text readability */}
          <div className="relative max-w-4xl mx-auto px-6 z-10">
            <Leaf className="mx-auto mb-8" size={72} strokeWidth={1.2} />
            <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
              Join Malawi's Fastest Growing Farmer Network Today
            </h2>
            <p className="text-xl lg:text-2xl text-green-100 mb-10 max-w-3xl mx-auto">
              Start listing, selling and getting paid — completely free to join.
            </p>
            <Link to="/register">
              <Button
                variant="primary"
                size="lg"
                className="bg-white-60 cursor-pointer text-green-800 hover:bg-gray-100 text-xl px-12 py-6 shadow-2xl"
              >
                Create Free Account – Start Selling Now
              </Button>
            </Link>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-gray-900 text-gray-300 py-16">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-10 lg:gap-12">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <Leaf className="text-green-500" size={32} />
                <span className="text-2xl font-bold text-white">MlimiConnect</span>
              </div>
              <p className="text-gray-400 mb-6 text-sm leading-relaxed">
                Connecting Malawian farmers, buyers and transporters for better prices, secure payments and reliable logistics.
              </p>
              <div className="flex gap-5">
                <a href="#" className="hover:text-green-400 transition-colors"><Facebook size={20} /></a>
                <a href="#" className="hover:text-green-400 transition-colors"><Twitter size={20} /></a>
                <a href="#" className="hover:text-green-400 transition-colors"><Instagram size={20} /></a>
                <a href="#" className="hover:text-green-400 transition-colors"><Linkedin size={20} /></a>
              </div>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/about" className="hover:text-green-400 transition-colors">About</Link></li>
                <li><Link to="#features" className="hover:text-green-400 transition-colors">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-green-400 transition-colors">Pricing</Link></li>
                <li><Link to="/blog" className="hover:text-green-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/faq" className="hover:text-green-400 transition-colors">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-green-400 transition-colors">Contact Us</Link></li>
              </ul>

              <h4 className="text-lg font-semibold text-white mt-8 mb-6">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/disclaimer" className="hover:text-green-400 transition-colors">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="text-lg font-semibold text-white mb-6">Follow Us</h4>
              <p className="text-gray-400 text-sm mb-4">
                Get updates on market prices, farming tips & platform news.
              </p>
              <p className="text-sm text-gray-500 mt-10">
                © {new Date().getFullYear()} MlimiConnect. All rights reserved.
              </p>
            </div>
          </div>
        </footer>

        {/* WHATSAPP FLOATING BUTTON */}
        <a
          href="https://wa.me/265123456789" // ← Replace with real number
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-2xl hover:bg-green-700 hover:scale-110 transition-all z-50"
        >
          <MessageCircle size={28} />
        </a>
      </div>
    </>
  );
}