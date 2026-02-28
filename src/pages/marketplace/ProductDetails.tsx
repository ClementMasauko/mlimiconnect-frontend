// src/pages/marketplace/ProductDetails.tsx
import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { MapPin, User, Package, Star, ShoppingCart } from "lucide-react";

const mockProduct = {
  id: 1,
  name: "Fresh Maize (50kg bag)",
  price: 28500,
  description:
    "High-quality yellow maize harvested this week. Perfect for nsima or animal feed. Organically grown with no chemicals. Stored in cool, dry conditions.",
  farmer: "John Phiri",
  location: "Lilongwe, Area 25",
  rating: 4.8,
  reviewsCount: 24,
  stock: 48,
  image: "https://images.unsplash.com/photo-1627920748119-7f6d4e73d961?w=800&h=600&fit=crop",
};

const mockReviews = [
  {
    id: 1,
    name: "Mary Banda",
    rating: 5,
    date: "Feb 10, 2026",
    comment: "Excellent quality maize. Very clean and well-dried. Will buy again!",
  },
  {
    id: 2,
    name: "Thomas K.",
    rating: 4,
    date: "Jan 28, 2026",
    comment: "Good price and fast delivery. Only issue was the transport took 2 days longer.",
  },
  {
    id: 3,
    name: "Aisha Mwale",
    rating: 5,
    date: "Jan 15, 2026",
    comment: "Perfect for my restaurant. Consistent quality every time. Highly recommended.",
  },
  {
    id: 4,
    name: "Kelvin J.",
    rating: 5,
    date: "Dec 20, 2025",
    comment: "Best maize I've bought this season. Farmer is very responsive.",
  },
  {
    id: 5,
    name: "Grace T.",
    rating: 4,
    date: "Nov 30, 2025",
    comment: "Great product, just wish there was more stock available.",
  },
];

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const addToCart = () => {
    setAdded(true);
    // Here you would normally update global cart state
    setTimeout(() => setAdded(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left: Product Image */}
          <div className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <img
              src={mockProduct.image}
              alt={mockProduct.name}
              className="w-full h-auto object-cover aspect-[4/3] lg:aspect-auto"
            />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                {mockProduct.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <Star className="text-yellow-500 fill-current" size={22} />
                  <span className="font-bold text-xl">{mockProduct.rating}</span>
                  <span className="text-gray-500 dark:text-gray-400 text-lg">
                    ({mockProduct.reviewsCount} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Price – very prominent */}
            <div className="text-5xl md:text-6xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
              MWK {mockProduct.price.toLocaleString()}
            </div>

            <p className="text-lg leading-relaxed text-gray-700 dark:text-gray-300">
              {mockProduct.description}
            </p>

            {/* Seller & Stock Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-base">
              <div className="flex items-center gap-3">
                <User size={20} className="text-gray-500" />
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Sold by</span>
                  <p className="font-medium text-gray-900 dark:text-white">{mockProduct.farmer}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin size={20} className="text-gray-500" />
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Location</span>
                  <p className="font-medium text-gray-900 dark:text-white">{mockProduct.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Package size={20} className="text-gray-500" />
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Stock</span>
                  <p className="font-medium text-emerald-600 dark:text-emerald-400">
                    {mockProduct.stock} bags available
                  </p>
                </div>
              </div>
            </div>

            {/* Quantity Selector + Add to Cart */}
            <div className="flex flex-col sm:flex-row items-stretch gap-4 mt-10">
              <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-4 text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  −
                </button>
                <span className="px-8 py-4 text-2xl font-semibold min-w-[80px] text-center">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-4 text-xl font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                  disabled={quantity >= mockProduct.stock}
                >
                  +
                </button>
              </div>

              <Button
                onClick={addToCart}
                size="lg"
                className="flex-1 flex items-center justify-center gap-3 text-lg shadow-lg hover:shadow-xl"
                disabled={added || mockProduct.stock === 0}
              >
                <ShoppingCart size={22} />
                {added ? "Added to Cart!" : "Add to Cart"}
              </Button>
            </div>

            {/* Always-visible View Cart link */}
            <Link to="/app/marketplace/cart" className="block mt-4">
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3 text-lg border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
              >
                <ShoppingCart size={20} />
                View Cart
              </Button>
            </Link>

            {/* Reviews Section */}
            <Card className="mt-16 p-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-4">
                <Star className="text-yellow-500 fill-current" size={28} />
                Customer Reviews ({mockReviews.length})
              </h2>

              <div className="space-y-8">
                {mockReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 dark:border-gray-700 pb-8 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold text-lg">
                          {review.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{review.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={20}
                            className={
                              i < review.rating
                                ? "text-yellow-500 fill-current"
                                : "text-gray-300 dark:text-gray-600"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{review.comment}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}