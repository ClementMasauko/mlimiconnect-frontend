import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Upload, X, Gavel, ShoppingBag, Clock, HelpCircle } from "lucide-react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { useAuth } from "../../context/AuthContext";
import api, { getApiError } from "../../lib/api";

export default function CreateListing() {
  const navigate = useNavigate();
  const { addListing } = useMarketplace();
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    quantity: "1",
    category: "produce",
    listingType: "fixed-price" as "fixed-price" | "auction",
    condition: "new" as "new" | "used-excellent" | "used-good" | "used-fair",
    durationDays: "5",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const farmerName = user?.username || "John Phiri";
    const farmerLocation = user?.location || "Lilongwe";

    // Set up end date if it is an auction
    let auctionEndStr: string | undefined;
    if (form.listingType === "auction") {
      const days = parseInt(form.durationDays);
      auctionEndStr = new Date(Date.now() + 1000 * 60 * 60 * 24 * days).toISOString();
    }

    const defaultImage = "https://images.unsplash.com/photo-1595914193075-85d013f39a48?w=700&h=500&fit=crop";
    
    const newProductPayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      stock: Number(form.quantity),
      category: form.category,
      farmer: farmerName,
      location: farmerLocation,
      image: preview || defaultImage,
      listingType: form.listingType,
      condition: form.condition,
      auctionEnd: auctionEndStr,
      tag: form.listingType === "auction" ? "Auction" : "New",
    };

    try {
      // 1. Try to post to the actual backend API first
      const payload = new FormData();
      payload.append("name", form.name.trim());
      payload.append("description", form.description.trim());
      payload.append("price", form.price);
      payload.append("quantity", form.quantity);
      payload.append("category", form.category);
      payload.append("listing_type", form.listingType);
      payload.append("condition", form.condition);
      if (form.listingType === "auction") {
        payload.append("duration_days", form.durationDays);
      }
      if (imageFile) payload.append("image", imageFile);

      await api.post("/api/marketplace/listings/", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (requestError: unknown) {
      setError(getApiError(requestError, "The listing could not be published. Please try again."));
      setSubmitting(false);
      return;
    }

    // 2. Always write to client state to guarantee high-fidelity interactivity
    addListing(newProductPayload);
    setSuccess(true);
    setSubmitting(false);

    setTimeout(() => {
      navigate("/app/marketplace");
    }, 2000);
  };

  if (user && user.can_sell === false) return <Card className="mx-auto mt-12 max-w-xl p-8 text-center"><h1 className="text-2xl font-bold">Selling is not enabled</h1><p className="mt-3 text-gray-600">This account is currently configured to buy only. Contact support to request seller verification before publishing products.</p><Button className="mt-6" onClick={() => navigate("/contact")}>Contact support</Button></Card>;
  if (user?.account_type && user.account_type !== "individual" && user.organization_status !== "verified") return <Card className="mx-auto mt-12 max-w-xl p-8 text-center"><h1 className="text-2xl font-bold">Organization verification pending</h1><p className="mt-3 text-gray-600">Your cooperative or company can browse and prepare for trading, but it cannot publish listings until its registration and representative authority are verified.</p><Button className="mt-6" onClick={() => navigate("/app/profile")}>View organization profile</Button></Card>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">Create Listing</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm font-medium">
          List your products in Malawi's prime agricultural marketplace. Support both Buy It Now or Auction formats.
        </p>

        {success ? (
          <Card className="p-12 text-center border border-slate-100 dark:border-gray-800 shadow-xl">
            <div className="text-green-600 text-6xl mb-6">✓</div>
            <h2 className="text-2xl font-black mb-3">Listing Created Successfully!</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-sm font-medium">
              Your item is now live in the marketplace for buyers to bid on or buy instantly.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/app/marketplace">
                <Button className="font-bold bg-green-600 text-white hover:bg-green-700 shadow-md">
                  Browse Marketplace
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-6 md:p-8 border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <p role="alert" className="rounded-lg bg-red-50 p-3 text-xs font-bold text-red-700 dark:bg-red-950/30 dark:text-red-300">
                  ✕ {error}
                </p>
              )}

              {/* Format selection tabs (eBay style!) */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Selling Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, listingType: "fixed-price" })}
                    className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                      form.listingType === "fixed-price"
                        ? "border-green-600 bg-green-50/20 dark:bg-green-950/20"
                        : "border-slate-100 bg-slate-50 dark:border-gray-800 dark:bg-gray-950/20 text-slate-500"
                    }`}
                  >
                    <ShoppingBag className={form.listingType === "fixed-price" ? "text-green-600" : ""} size={20} />
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">Buy It Now (Fixed Price)</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Set a static price. Buyers purchase instantly.</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setForm({ ...form, listingType: "auction", quantity: "1" })}
                    className={`p-4 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                      form.listingType === "auction"
                        ? "border-blue-600 bg-blue-50/20 dark:bg-blue-950/20"
                        : "border-slate-100 bg-slate-50 dark:border-gray-800 dark:bg-gray-950/20 text-slate-500"
                    }`}
                  >
                    <Gavel className={form.listingType === "auction" ? "text-blue-600" : ""} size={20} />
                    <div>
                      <p className="text-sm font-extrabold text-slate-900 dark:text-white">eBay-Style Auction</p>
                      <p className="text-xs text-slate-400 mt-1 font-medium">Set a starting price. Highest bidder wins after countdown.</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Product Image
                </label>
                {preview ? (
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-48 h-48 object-cover rounded-xl border border-slate-200 dark:border-gray-700"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors shadow-md"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-44 border-2 border-dashed border-slate-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-green-500 dark:hover:border-green-500 transition-colors bg-slate-50/50 dark:bg-gray-950/10">
                    <Upload size={28} className="text-slate-400 mb-2" />
                    <span className="text-xs text-slate-500 dark:text-slate-400 font-bold">
                      Click to upload photo
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Product / Item Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Pure Kilombero Aromatic Rice (50kg Bag)"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                  Detailed Item Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe details regarding crop quality, harvest dates, sorting standards, or equipment condition details..."
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* Condition Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Item Condition
                  </label>
                  <select
                    value={form.condition}
                    onChange={(e) => setForm({ ...form, condition: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="new">Brand New / Handpicked Fresh</option>
                    <option value="used-excellent">Pre-owned (Used - Excellent / Like New)</option>
                    <option value="used-good">Pre-owned (Used - Good / Functional)</option>
                    <option value="used-fair">Pre-owned (Used - Fair / Restored)</option>
                  </select>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    Category Selector *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="produce">Produce & Crops</option>
                    <option value="seeds">Seeds & Grains</option>
                    <option value="farm-inputs">Fertilizer & Farm Inputs</option>
                    <option value="tools">Hand Tools</option>
                    <option value="equipment">Farm Equipment</option>
                    <option value="machinery">Machinery & Vehicles</option>
                  </select>
                </div>
              </div>

              {/* Price & Quantity Blocks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 border-t border-slate-100 dark:border-gray-850 pt-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                    {form.listingType === "auction" ? "Starting Bid (MWK) *" : "Buy It Now Price (MWK) *"}
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    placeholder={form.listingType === "auction" ? "350000" : "28500"}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                {form.listingType === "auction" ? (
                  /* Auction Duration Options */
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
                      Auction Duration <Clock size={12} />
                    </label>
                    <select
                      value={form.durationDays}
                      onChange={(e) => setForm({ ...form, durationDays: e.target.value })}
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-xs font-bold outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="1">1 Day Hot Auction (24 Hours)</option>
                      <option value="3">3 Days Standard Auction</option>
                      <option value="5">5 Days Standard Auction</option>
                      <option value="7">7 Days Classic Auction</option>
                    </select>
                  </div>
                ) : (
                  /* Fixed Price Stock Units */
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                      Quantity Available (Units) *
                    </label>
                    <input
                      type="number"
                      value={form.quantity}
                      onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                      placeholder="50"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm font-semibold outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                )}
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-gray-850">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/app/marketplace")}
                  className="font-bold text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submitting}
                  className={`min-w-[160px] font-bold text-xs ${
                    form.listingType === "auction" ? "bg-blue-600 hover:bg-blue-700" : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {submitting ? "Creating Item..." : form.listingType === "auction" ? "Launch Auction" : "Publish Listing"}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </div>
  );
}
