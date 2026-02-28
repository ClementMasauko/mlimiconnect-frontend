import React from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { HelpCircle, BookOpen, Video, MessageCircle, Smartphone, Mail, Phone, Clock } from "lucide-react";

const faqs = [
  {
    q: "How do I create a product listing?",
    a: "Navigate to 'Listings' in the sidebar → click 'New Listing'. Upload high-quality photos, set your price per unit or per bag, add quantity available, and publish. Listings are visible to verified buyers instantly."
  },
  {
    q: "How does the escrow payment system work?",
    a: "Buyers pay into a secure escrow wallet. Funds are held until the farmer confirms delivery. The buyer has a 24-hour dispute window. Once confirmed, funds are released to the farmer's wallet minus platform commission."
  },
  {
    q: "Can I use the platform offline?",
    a: "Yes – many features (view saved listings, draft orders, read cached advisory content) work offline. Data syncs automatically when you reconnect."
  },
  {
    q: "How do I change the language to Chichewa?",
    a: "Go to Profile → Settings → Language. Select 'Chichewa' (or Chitumbuka if preferred). The entire app switches instantly, including voice input recognition."
  },
];

export default function Support() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
            <HelpCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Help & Support Center
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Everything you need to get the most out of MlimiConnect – from FAQs to direct support
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Link to="/support/guides">
            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 group">
              <BookOpen className="mx-auto h-10 w-10 text-green-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">User Guides</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Step-by-step tutorials</p>
            </Card>
          </Link>

          <Link to="/support/videos">
            <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 group">
              <Video className="mx-auto h-10 w-10 text-blue-600 mb-4 group-hover:scale-110 transition-transform" />
              <h3 className="font-semibold text-lg mb-2">Video Tutorials</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Watch in Chichewa & English</p>
            </Card>
          </Link>

          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 group">
            <MessageCircle className="mx-auto h-10 w-10 text-purple-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">Talk to support now</p>
          </Card>

          <Card className="p-6 text-center hover:shadow-xl transition-all duration-300 group">
            <Smartphone className="mx-auto h-10 w-10 text-amber-600 mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-semibold text-lg mb-2">USSD & SMS</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">No internet needed</p>
          </Card>
        </div>

        {/* FAQ Section */}
        <Card className="p-8 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-3">
            <MessageCircle className="text-green-600" size={28} />
            Frequently Asked Questions
          </h2>
          <div className="space-y-8">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0">
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Mail className="h-7 w-7 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Email Support</h3>
                <p className="text-gray-600 dark:text-gray-400">support@mlimiconnect.mw</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Send us a detailed message. We usually respond within 2–4 hours during business days.
            </p>
            <Button variant="outline" className="w-full">Send Email</Button>
          </Card>

          <Card className="p-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Phone className="h-7 w-7 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Phone & WhatsApp</h3>
                <p className="text-gray-600 dark:text-gray-400">+265 999 123 456</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Call or WhatsApp us Monday–Saturday, 7:00 AM – 6:00 PM CAT.
            </p>
            <Button variant="outline" className="w-full">Start WhatsApp Chat</Button>
          </Card>
        </div>

        {/* USSD Quick Access */}
        <Card className="p-8 text-center">
          <Smartphone className="mx-auto text-green-600 mb-6" size={64} />
          <h2 className="text-2xl md:text-3xl font-bold mb-4">No Internet? Use USSD</h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            Dial <span className="font-mono font-bold text-green-700 dark:text-green-300">*1399#</span> from any Airtel or TNM line to access prices, weather, pest advice, and more — no data needed.
          </p>
          <Link to="/support/ussd">
            <Button variant="primary" size="lg" className="px-10">
              View USSD Guide
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}