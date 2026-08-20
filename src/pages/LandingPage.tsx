// src/pages/LandingPage.tsx

import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle, Leaf, CheckCircle, Menu, X, MapPin, ShieldCheck, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet";
import ThemeToggle from "../components/ThemeToggle";
import InstallAppButton from "../components/InstallAppButton";

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
  const [menuOpen, setMenuOpen] = useState(false);
  const featuredProducts = [
    { name: "Fresh Maize, Grade A", price: "28,500", unit: "50 kg bag", location: "Lilongwe", image: "https://images.unsplash.com/photo-1627920748119-7f6d4e73d961?w=700&h=500&fit=crop" },
    { name: "Premium Groundnuts", price: "42,000", unit: "20 kg sack", location: "Kasungu", image: "https://images.unsplash.com/photo-1574323347407-8b21d98f4e84?w=700&h=500&fit=crop" },
    { name: "Vine-ripened Tomatoes", price: "15,000", unit: "10 kg crate", location: "Zomba", image: "https://images.unsplash.com/photo-1561136594-7f684b9e67b0?w=700&h=500&fit=crop" },
    { name: "Clean Soybeans", price: "58,000", unit: "50 kg sack", location: "Mzuzu", image: "https://images.unsplash.com/photo-1625246332058-6e9e9d307a1b?w=700&h=500&fit=crop" },
  ];

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

      <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-gray-950 dark:text-gray-100">

        {/* NAVBAR */}
        <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md dark:border-gray-800 dark:bg-gray-950/90">
          <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex min-w-0 items-center gap-2 sm:gap-3">
              {!logoError ? (
                <img
                  src="/logo.png"
                  alt="MlimiConnect Logo"
                  className="h-8 max-w-10 object-contain sm:h-10 sm:max-w-none"
                  onError={() => setLogoError(true)}
                  loading="lazy"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-green-700 flex items-center justify-center text-white font-bold text-xl">
                  MC
                </div>
              )}
              <span className="truncate text-lg font-extrabold tracking-tight text-slate-900 sm:text-2xl dark:text-white">Mlimi<span className="text-green-700 dark:text-green-400">Connect</span></span>
            </div>

            <div className="hidden md:flex items-center gap-7 text-gray-700 font-medium">
              <Link to="/app/marketplace" className="hover:text-green-700 transition-colors dark:text-gray-300 dark:hover:text-green-400">Marketplace</Link>
              <Link to="/app/advisory/market-feed" className="hover:text-green-700 transition-colors dark:text-gray-300 dark:hover:text-green-400">Prices</Link>
              <a href="#features" className="hover:text-green-700 transition-colors dark:text-gray-300 dark:hover:text-green-400">Features</a>
              <Link to="/pricing" className="hover:text-green-700 transition-colors">Pricing</Link>
              <Link to="/blog" className="hover:text-green-700 transition-colors">Blog</Link>
              <Link to="/about" className="hover:text-green-700 transition-colors">About</Link>
            </div>

            <div className="flex shrink-0 items-center gap-2 sm:gap-5">
              <InstallAppButton compact />
              <ThemeToggle />
              <Link
                to="/login"
                className="hidden sm:block text-gray-700 hover:text-green-700 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link to="/register" className="hidden sm:block">
                <Button variant="primary" className="px-3 text-sm sm:px-6 sm:text-base">Get Started</Button>
              </Link>
              <button type="button" onClick={() => setMenuOpen((open) => !open)} className="rounded-lg p-2 text-green-800 hover:bg-green-50 md:hidden" aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}>{menuOpen ? <X size={22} /> : <Menu size={22} />}</button>
            </div>
          </div>
          {menuOpen && <div className="border-t border-green-100 bg-white px-4 py-3 shadow-lg dark:border-gray-800 dark:bg-gray-950 md:hidden"><div className="grid grid-cols-2 gap-1 text-sm font-medium"><Link onClick={() => setMenuOpen(false)} to="/app/marketplace" className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800">Marketplace</Link><Link onClick={() => setMenuOpen(false)} to="/app/advisory/market-feed" className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800">Prices</Link><a onClick={() => setMenuOpen(false)} href="#features" className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800">Features</a><Link onClick={() => setMenuOpen(false)} to="/pricing" className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800">Pricing</Link><Link onClick={() => setMenuOpen(false)} to="/about" className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800">About</Link><Link onClick={() => setMenuOpen(false)} to="/login" className="rounded-lg px-3 py-2 hover:bg-green-50 dark:hover:bg-gray-800">Sign in</Link></div><Link onClick={() => setMenuOpen(false)} to="/register" className="mt-2 block"><Button className="w-full">Get Started</Button></Link></div>}
        </nav>

        {/* HERO */}
        <section className="relative flex items-center overflow-hidden py-10 sm:py-16 lg:min-h-[85vh] lg:py-20">
          <div className="absolute inset-0 grid lg:grid-cols-2">
            <div className="bg-gradient-to-br from-slate-50 via-white to-green-50/70" />
            <div className="hidden lg:block relative">
              <img
                src="/hero.png"
                alt="Malawian maize field"
                className="absolute inset-0 w-full h-full object-cover brightness-[0.96]"
                loading="lazy"
              />
            </div>
          </div>

          <div className="relative mx-auto grid max-w-7xl items-center gap-8 px-4 sm:gap-12 sm:px-6 lg:grid-cols-2 z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <h1 className="mb-4 text-3xl font-extrabold leading-tight sm:mb-6 sm:text-5xl lg:text-6xl">
                Get <span className="text-green-600">Better Prices</span>, Faster Sales & Safer Payments
              </h1>

              <p className="mb-5 text-base leading-relaxed text-gray-800 sm:mb-8 sm:text-xl max-w-xl">
                Thousands of Malawian farmers are already selling more, getting paid securely via mobile money, and arranging reliable transport — all in one place.
              </p>

              <div className="mb-5 flex flex-wrap gap-3 sm:mb-10 sm:gap-4">
                <Link to="/register">
                  <Button variant="primary" size="lg" className="shadow-lg">
                    Start Selling Today – Free <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/app/marketplace">
                  <Button variant="outline" size="lg">Browse Listings</Button>
                </Link>
              </div>

              <div className="flex items-center gap-2 text-sm font-medium text-green-700 sm:gap-3 sm:text-base">
                <CheckCircle className="h-5 w-5" />
                <span>Trusted by 1,000+ farmers across Malawi</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95, x: 30 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative mx-auto hidden max-w-md lg:mx-0 lg:block lg:max-w-xl"
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
        <section className="border-y border-green-100 bg-white py-8 dark:border-gray-800 dark:bg-gray-900 sm:py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-4 gap-2 px-4 text-center sm:gap-8 sm:px-6 lg:gap-12">
            {[
              { num: "1,000+", label: "Farmers" },
              { num: "300+", label: "Buyers" },
              { num: "50+", label: "Transporters" },
              { num: "MWK 120M+", label: "Trade Volume" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-base font-extrabold text-green-700 sm:text-2xl lg:text-3xl">{stat.num}</p>
                <p className="mt-1 text-xs font-medium text-gray-600 sm:text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-slate-50 py-14 dark:bg-gray-950 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div><p className="text-sm font-bold uppercase tracking-[.15em] text-green-700 dark:text-green-400">Marketplace preview</p><h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">Fresh products, available now</h2><p className="mt-3 max-w-2xl text-slate-600 dark:text-gray-300">Explore current produce from verified local farms before creating an account.</p></div>
              <Link to="/register" className="inline-flex items-center gap-2 font-semibold text-green-700 hover:text-green-800 dark:text-green-400">Create an account to shop <ArrowRight size={17} /></Link>
            </div>
            <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">{featuredProducts.map((product) => <article key={product.name} className="group overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"><div className="relative overflow-hidden"><img src={product.image} alt={product.name} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy" /><span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-green-800 shadow-sm"><ShieldCheck size={13} /> Verified farm</span></div><div className="p-4"><h3 className="font-bold text-slate-900 dark:text-white">{product.name}</h3><p className="mt-1 text-sm text-slate-500">{product.unit}</p><p className="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">MWK {product.price}</p><p className="mt-2 flex items-center gap-1 text-xs font-medium text-slate-500"><MapPin size={14} /> {product.location}</p><Link to="/register" className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-green-700 px-3 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-700 hover:text-white dark:text-green-400"><ShoppingBag size={16} /> View availability</Link></div></article>)}</div>
            <div className="mt-8 text-center"><Link to="/register"><Button size="lg">Browse the full marketplace <ArrowRight className="ml-2" size={18} /></Button></Link><p className="mt-3 text-sm text-slate-500 dark:text-gray-400">Sign up free to view full listings, contact sellers, and order securely.</p></div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white py-12 dark:bg-gray-950 sm:py-20 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 text-center sm:px-6">
            <h2 className="mb-7 text-2xl font-extrabold lg:mb-16 lg:text-3xl">How It Works</h2>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 sm:gap-8 lg:gap-12">
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
                  className={`rounded-2xl border border-green-100 bg-green-50/60 p-4 shadow-sm dark:border-green-900/50 dark:bg-green-950/30 sm:p-8 ${i === 2 ? "col-span-2 md:col-span-1" : ""}`}
                >
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-lg font-bold text-green-700 sm:mb-6 sm:h-14 sm:w-14 sm:text-2xl">
                    {i + 1}
                  </div>
                  <h3 className="mb-2 text-base font-bold sm:mb-3 sm:text-xl">{step.title}</h3>
                  <p className="text-sm text-gray-700 sm:text-base">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES – with images */}
        <section className="bg-gradient-to-b from-white to-green-50 py-12 dark:from-gray-950 dark:to-green-950/20 sm:py-20 lg:py-24" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <h2 className="mb-8 text-center text-2xl font-extrabold sm:mb-16 sm:text-4xl lg:text-5xl">Why Farmers Choose MlimiConnect</h2>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
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
                  className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md transition-all duration-300 hover:border-green-500 dark:border-gray-800 dark:bg-gray-900"
                >
                  <div className="relative h-24 sm:h-48 md:h-56">
                    <img
                      src={f.img}
                      alt={f.title}
                      className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-3 sm:p-6">
                    <h3 className="mb-1 text-sm font-bold text-gray-900 dark:text-white sm:mb-3 sm:text-xl">{f.title}</h3>
                    <p className="text-xs leading-relaxed text-gray-700 dark:text-gray-300 sm:text-base">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* PARTNERS / TRUST */}
        <section className="bg-green-50/70 py-10 dark:bg-green-950/20 sm:py-16">
          <div className="max-w-6xl mx-auto px-4 text-center sm:px-6">
            <h3 className="mb-5 text-xl font-bold text-gray-800 sm:mb-8 sm:text-2xl">
              Trusted by Leading Organizations & Networks
            </h3>
            <div className="grid grid-cols-3 items-center gap-4 opacity-90 sm:flex sm:flex-wrap sm:justify-center sm:gap-10 md:gap-16">
              <img src="/partners/airtel.png" alt="Airtel Malawi" className="mx-auto h-8 object-contain sm:h-10 md:h-12" loading="lazy" />
              <img src="/partners/tnm.png" alt="TNM" className="mx-auto h-8 object-contain sm:h-10 md:h-12" loading="lazy" />
              <img src="/partners/agcom.png" alt="Farmers Union" className="mx-auto h-8 object-contain sm:h-10 md:h-12" loading="lazy" />
              <img src="/partners/malawi.jpg" alt="Government of Malawi" className="mx-auto h-8 object-contain sm:h-10 md:h-12" loading="lazy" />
              <img src="/partners/IFAD.png" alt="IFAD" className="mx-auto h-8 object-contain sm:h-10 md:h-12" loading="lazy" />
              <img src="/partners/fao.webp" alt="FAO" className="mx-auto h-8 object-contain sm:h-10 md:h-12" loading="lazy" />
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
        <footer className="bg-white py-10 text-gray-600 [&_a]:text-gray-600 [&_h4]:text-gray-900 [&_p]:text-gray-600 dark:bg-gray-900 dark:text-gray-300 dark:[&_a]:text-gray-300 dark:[&_h4]:text-white dark:[&_p]:text-gray-400 sm:py-16">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 sm:grid-cols-2 sm:gap-10 sm:px-6 md:grid-cols-4 lg:gap-12">
            {/* Brand */}
            <div>
              <div className="mb-3 flex items-center gap-2 sm:mb-6 sm:gap-3">
                <Leaf className="text-green-500" size={32} />
                <span className="text-base font-bold text-gray-900 dark:text-white sm:text-2xl">MlimiConnect</span>
              </div>
              <p className="mb-3 text-xs leading-relaxed text-gray-400 sm:mb-6 sm:text-sm">
                Connecting Malawian farmers, buyers and transporters for better prices, secure payments and reliable logistics.
              </p>
              <Link to="/contact" className="text-sm font-semibold text-green-400 transition-colors hover:text-green-300">Contact our team</Link>
            </div>

            {/* Company */}
            <div>
              <h4 className="mb-3 text-base font-semibold text-white sm:mb-6 sm:text-lg">Company</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/about" className="hover:text-green-400 transition-colors">About</Link></li>
                <li><a href="#features" className="hover:text-green-400 transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-green-400 transition-colors">Pricing</Link></li>
                <li><Link to="/blog" className="hover:text-green-400 transition-colors">Blog</Link></li>
              </ul>
            </div>

            {/* Support & Legal */}
            <div>
              <h4 className="mb-3 text-base font-semibold text-white sm:mb-6 sm:text-lg">Support</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/faq" className="hover:text-green-400 transition-colors">FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-green-400 transition-colors">Contact Us</Link></li>
              </ul>

              <h4 className="mb-3 mt-5 text-base font-semibold text-white sm:mb-6 sm:mt-8 sm:text-lg">Legal</h4>
              <ul className="space-y-3 text-sm">
                <li><Link to="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link></li>
                <li><Link to="/disclaimer" className="hover:text-green-400 transition-colors">Disclaimer</Link></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div>
              <h4 className="mb-3 text-base font-semibold text-white sm:mb-6 sm:text-lg">Follow Us</h4>
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
