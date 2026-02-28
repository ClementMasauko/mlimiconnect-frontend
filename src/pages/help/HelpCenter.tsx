// src/pages/Support.tsx  (or wherever this file lives)
import React from "react";
import { Link } from "react-router-dom"; // ← Added this import
import Card from "../../components/ui/Card";
import { HelpCircle, BookOpen, Video, MessageCircle, Smartphone } from "lucide-react";
import Button from "../../components/ui/Button";

const faqs = [
  { q: "How do I create a product listing?", a: "Go to Listings → New Listing. Upload photos, set price & quantity." },
  { q: "How does escrow payment work?", a: "Funds are held until delivery is confirmed – buyer has 24h dispute window." },
  { q: "Can I use the app offline?", a: "Yes – core features work offline and sync when connected." },
  { q: "How do I switch to Chichewa?", a: "Go to Settings → Language and select Chichewa or Chitumbuka." },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center justify-center gap-3">
            <HelpCircle className="text-green-600" size={32} /> Help Center
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-3">
            Guides, FAQs and support for MlimiConnect
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <BookOpen className="text-green-600 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-3">User Guides</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Step-by-step tutorials for farmers and buyers
            </p>
            <Button variant="outline">Browse Guides</Button>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <Video className="text-blue-600 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-3">Video Tutorials</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Short videos in Chichewa & English
            </p>
            <Button variant="outline">Watch Videos</Button>
          </Card>
        </div>

        <Card className="p-6 mb-12">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
            <MessageCircle size={24} /> Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i}>
                <h3 className="font-medium text-lg mb-2">{faq.q}</h3>
                <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 text-center">
          <Smartphone className="mx-auto text-green-600 mb-4" size={48} />
          <h2 className="text-2xl font-semibold mb-4">Still Need Help?</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Contact support or chat with our team
          </p>
          <Link to="/support">
            <Button variant="primary" size="lg">
              Contact Support
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}