// src/components/Footer.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Leaf, Mail, Phone, Facebook, Twitter, Instagram, Send } from "lucide-react";
import Button from "./Button"; // Assuming this is your custom Button component

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          {/* Brand & Mission */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500/20 transition-colors">
                <Leaf className="h-8 w-8 text-emerald-500" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">MlimiConnect</span>
            </Link>
            <p className="text-gray-400 leading-relaxed text-base">
              Connecting Malawi's smallholder farmers to fair markets, real-time knowledge, and secure payments.
            </p>
            <div className="flex gap-5">
              <a
                href="https://facebook.com/mlimiconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition-colors transform hover:scale-110"
                aria-label="Facebook"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://twitter.com/mlimiconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition-colors transform hover:scale-110"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="https://instagram.com/mlimiconnect"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-emerald-400 transition-colors transform hover:scale-110"
                aria-label="Instagram"
              >
                <Instagram size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">Quick Links</h3>
            <ul className="space-y-4 text-base">
              {[
                { to: "/about", label: "About Us" },
                { to: "/support", label: "Help Center" },
                { to: "/faq", label: "FAQs" },
                { to: "/privacy", label: "Privacy Policy" },
                { to: "/terms", label: "Terms & Conditions" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-gray-400 hover:text-emerald-400 transition-colors hover:translate-x-1 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">Contact Us</h3>
            <ul className="space-y-5">
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Mail size={20} className="text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">support@mlimiconnect.mw</p>
                  <p className="text-sm text-gray-500 mt-1">Response within 2–4 hours</p>
                </div>
              </li>
              <li className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-emerald-500/10">
                  <Phone size={20} className="text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-200">+265 999 123 456</p>
                  <p className="text-sm text-gray-500 mt-1">Mon–Sat, 7AM–6PM CAT</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6 tracking-wide">Stay Updated</h3>
            <p className="text-gray-400 mb-5 text-base">
              Get market prices, weather alerts, and platform news straight to your inbox.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-5 py-3.5 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                required
                aria-required="true"
              />
              <Button
                variant="primary"
                size="lg"
                className="w-full py-3.5 text-base font-medium shadow-md hover:shadow-lg transition-all"
              >
                <Send size={18} className="mr-2" />
                Subscribe
              </Button>
            </form>
            <p className="text-xs text-gray-500 mt-4">
              We respect your privacy – unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-500">
          <p>© {currentYear} MlimiConnect. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <Link to="/privacy" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
            <Link to="/support" className="hover:text-emerald-400 transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}