// src/pages/orders/RateOrder.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Star, Send, X } from "lucide-react";

export default function RateOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const submitReview = () => {
    // POST /api/marketplace/orders/{id}/review/ { rating, comment }
    alert("Review submitted! (Mock)");
    navigate(`/app/order/${id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Rate Order #{id}</h1>
        <Card className="p-6">
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-4">How was your experience?</h2>
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-4xl transition-colors ${
                      star <= rating ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    <Star fill={star <= rating ? "currentColor" : "none"} />
                  </button>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-2">{rating ? `${rating} stars` : "Select rating"}</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Comment (optional)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                rows={4}
                placeholder="Share your thoughts about the product and seller..."
                className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
              />
            </div>

            <Button
              variant="primary"
              className="w-full py-6 text-lg flex items-center justify-center gap-2"
              onClick={submitReview}
              disabled={!rating}
            >
              <Send size={18} /> Submit Review
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}