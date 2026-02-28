// src/pages/Blog.tsx
import React from "react";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { Calendar, Clock, User, ArrowRight, Link } from "lucide-react";

const mockPosts = [
  {
    title: "How to Get 30% Higher Prices for Your Maize This Season",
    excerpt: "Learn the best times to sell, how to use price alerts, and tips from top farmers in Lilongwe and Mzimba.",
    author: "Dr. Chimwemwe Banda",
    date: "Feb 18, 2026",
    readTime: "6 min",
    image: "/blog/maize-field.jpg",
  },
  {
    title: "Organic Pest Control: 5 Natural Methods That Actually Work",
    excerpt: "Save money and protect your crops using neem, chili, and ash mixtures – tested by farmers in Zomba.",
    author: "Grace Mwale",
    date: "Feb 10, 2026",
    readTime: "8 min",
    image: "/blog/pest-control.jpg",
  },
  {
    title: "Escrow Explained: Why Farmers Love Secure Payments",
    excerpt: "No more chasing buyers for payment – understand how escrow protects both sides and builds trust.",
    author: "Kelvin Phiri",
    date: "Jan 29, 2026",
    readTime: "5 min",
    image: "/blog/escrow.jpg",
  },
  {
    title: "USSD Guide: Access Prices & Weather Without Internet",
    excerpt: "Dial *1399# from any basic phone – get market updates, forecasts, and wallet balance instantly.",
    author: "Aisha Mwale",
    date: "Jan 15, 2026",
    readTime: "4 min",
    image: "/blog/ussd.jpg",
  },
];

export default function Blog() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            MlimiConnect Blog
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Farming tips, market insights, success stories, and platform updates from Malawi's leading agritech team.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockPosts.map((post, i) => (
            <Card key={i} className="overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${post.image})` }} />
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <User size={16} />
                      {post.author}
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} />
                      {post.date}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    {post.readTime}
                  </div>
                </div>
                <Button variant="outline" size="sm" className="mt-6 w-full">
                  Read More <ArrowRight size={16} className="ml-2" />
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="text-center mt-16">
          <Button variant="primary" size="lg" asChild>
            <Link to="/blog">View All Articles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}