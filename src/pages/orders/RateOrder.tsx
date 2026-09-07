// src/pages/orders/RateOrder.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Star, Send } from "lucide-react";
import api, { getApiError } from "../../lib/api";

export default function RateOrder() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [items, setItems] = useState<Array<{ listing_id: number; name: string; seller: string }>>([]);
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const listings = useMemo(
    () => Array.from(new Map(items.map(item => [item.listing_id, item])).values()),
    [items],
  );

  useEffect(() => {
    if (!id) return;
    let active = true;
    api.get(`/api/marketplace/orders/${id}/`)
      .then(({ data }) => {
        if (!active) return;
        const orderItems = Array.isArray(data?.items) ? data.items : [];
        setItems(orderItems);
        const firstListing = orderItems[0]?.listing_id;
        if (typeof firstListing === "number") setSelectedListing(firstListing);
      })
      .catch(requestError => {
        if (active) setError(getApiError(requestError, "The order could not be loaded."));
      })
      .finally(() => {
        if (active) setLoadingOrder(false);
      });
    return () => { active = false; };
  }, [id]);

  const submitReview = async () => {
    if (!id || !rating || !selectedListing) return;
    setSubmitting(true); setError("");
    try {
      await api.post("/api/marketplace/order-reviews/", {
        order: Number(id),
        listing: selectedListing,
        rating,
        comment: comment.trim(),
      });
      navigate(`/app/orders/${id}`, { replace: true });
    } catch (requestError) {
      setError(getApiError(requestError, "The review could not be submitted."));
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Rate Order #{id}</h1>
        <Card className="p-6">
          {error && <p role="alert" className="mb-5 rounded-lg bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
          <div className="space-y-6">
            {listings.length > 1 && (
              <div>
                <label htmlFor="review-listing" className="block text-sm font-medium mb-2">Product to review</label>
                <select
                  id="review-listing"
                  value={selectedListing ?? ""}
                  onChange={event => setSelectedListing(Number(event.target.value))}
                  className="w-full px-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                >
                  {listings.map(item => (
                    <option key={item.listing_id} value={item.listing_id}>{item.name} — {item.seller}</option>
                  ))}
                </select>
              </div>
            )}
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
              disabled={!rating || !selectedListing || submitting || loadingOrder}
            >
              <Send size={18} /> {submitting ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
