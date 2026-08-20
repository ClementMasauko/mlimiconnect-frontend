import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MapPin, Star, ShieldCheck, Calendar, Gavel, ShoppingBag, Clock, BookOpen, MessageSquare, Award } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useMarketplace } from "../../context/MarketplaceContext";

export default function SellerStorefront() {
  const { farmerName } = useParams();
  const { products, getSellerStats, getFarmerReviews, farmers } = useMarketplace();

  const [activeTab, setActiveTab] = useState<"listings" | "feedback" | "about">("listings");

  // Find farmer profile
  const farmer = farmers[farmerName || ""] || {
    name: farmerName || "Unknown Farmer",
    location: "Malawi",
    memberSince: "Aug 2024",
    about: "Dedicated local agriculturalist committed to premium crop yields and trustworthy wholesale distribution.",
    specialties: ["Produce"],
    isVerified: false,
    isTopRated: false,
    shippingRating: 4.5,
    communicationRating: 4.5,
    accuracyRating: 4.5
  };

  // Farmer's active items
  const activeProducts = products.filter((p) => p.farmer === farmer.name);

  // Farmer's reviews
  const reviews = getFarmerReviews(farmer.name);
  const stats = getSellerStats(farmer.name);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-gray-950/20 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Link */}
        <Link 
          to="/app/marketplace" 
          className="text-sm font-bold text-green-600 dark:text-green-400 hover:underline mb-6 inline-flex items-center gap-1.5"
        >
          ← Back to Marketplace
        </Link>

        {/* Farmer Header Hero Profile (eBay Seller Hub style) */}
        <Card className="p-6 md:p-8 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 shadow-md mb-8">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
              {/* Profile Avatar */}
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-full bg-green-100 dark:bg-green-950/60 text-green-700 dark:text-green-400 flex items-center justify-center font-black text-2xl sm:text-3xl shadow-inner border-2 border-green-500/20">
                {farmer.name.charAt(0)}
              </div>
              
              {/* Profile Details */}
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-950 dark:text-white tracking-tight">
                    {farmer.name}
                  </h1>
                  
                  {/* Badges */}
                  <div className="flex items-center gap-1.5">
                    {farmer.isVerified && (
                      <span className="bg-green-50 text-green-700 border border-green-200/50 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 dark:bg-green-950/30 dark:text-green-400 dark:border-green-800/40">
                        <ShieldCheck size={11} /> Verified Farmer
                      </span>
                    )}
                    {farmer.isTopRated && (
                      <span className="bg-amber-50 text-amber-700 border border-amber-200/50 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full flex items-center gap-0.5 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40">
                        <Award size={11} className="text-amber-500" /> Top Rated Seller
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1"><MapPin size={14} className="text-green-600" /> {farmer.location}</span>
                  <span className="text-slate-300 dark:text-gray-700">|</span>
                  <span className="flex items-center gap-1"><Calendar size={14} /> Member since {farmer.memberSince}</span>
                </div>

                {/* Rating Score */}
                <div className="pt-2 flex flex-wrap items-center gap-2 text-sm font-bold">
                  <span className="flex items-center gap-0.5 text-amber-500">
                    <Star size={16} fill="currentColor" /> {stats.averageRating}
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-extrabold">{stats.positivePercentage}% Positive Feedback</span>
                  <span className="text-slate-400 font-medium">({stats.totalReviews} customer feedback ratings)</span>
                </div>
              </div>
            </div>

            {/* Seller Contact & Stats Overview */}
            <div className="flex gap-2 w-full md:w-auto">
              <Link to="/app/messages" className="flex-1 md:flex-none">
                <Button variant="outline" size="sm" className="w-full font-bold">Contact Seller</Button>
              </Link>
              <div className="bg-slate-50 dark:bg-gray-850 px-4 py-2 rounded-lg border border-slate-100 dark:border-gray-800 text-center flex flex-col justify-center min-w-[110px]">
                <span className="text-xl font-black text-green-600 dark:text-green-400">{activeProducts.length}</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Active Items</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Tab Selection */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-gray-800 mb-8 font-semibold text-sm">
          <button
            onClick={() => setActiveTab("listings")}
            className={`pb-3 border-b-2 px-2 transition-all ${
              activeTab === "listings"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Active Listings ({activeProducts.length})
          </button>
          
          <button
            onClick={() => setActiveTab("feedback")}
            className={`pb-3 border-b-2 px-2 transition-all ${
              activeTab === "feedback"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            Feedback Profile ({reviews.length})
          </button>

          <button
            onClick={() => setActiveTab("about")}
            className={`pb-3 border-b-2 px-2 transition-all ${
              activeTab === "about"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            About Farm
          </button>
        </div>

        {/* Tab View Contents */}
        <div>
          {/* Active Listings Tab */}
          {activeTab === "listings" && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {activeProducts.length > 0 ? (
                activeProducts.map((p) => {
                  const isAuction = p.listingType === "auction";
                  return (
                    <Card key={p.id} className="group overflow-hidden p-0 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 flex flex-col h-full">
                      <div className="relative overflow-hidden aspect-[4/3] bg-slate-100">
                        <Link to={`/app/marketplace/product/${p.id}`} className="block h-full">
                          <img src={p.image} alt={p.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                        </Link>
                        
                        <div className="absolute left-3 top-3">
                          {isAuction ? (
                            <span className="rounded-full bg-blue-600 px-3 py-1 text-[11px] font-bold shadow-md text-white flex items-center gap-1">
                              <Gavel size={11} /> eBay Auction
                            </span>
                          ) : (
                            <span className="rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold shadow-md text-white flex items-center gap-1">
                              <ShoppingBag size={11} /> Buy It Now
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 flex flex-col flex-1">
                        <Link to={`/app/marketplace/product/${p.id}`} className="line-clamp-1 text-base font-extrabold text-slate-900 hover:text-green-700 dark:text-white">
                          {p.name}
                        </Link>
                        <p className="text-xs text-slate-400 font-bold capitalize mt-1">Condition: {p.condition?.replace("-", " ") || "New"}</p>

                        <div className="mt-4 flex items-end justify-between">
                          <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{isAuction ? "Current Bid" : "Price"}</p>
                            <p className="text-xl font-black text-slate-950 dark:text-white">
                              MWK {(isAuction ? (p.currentBid || p.price) : p.price).toLocaleString()}
                            </p>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              {isAuction ? `${p.bidsCount || 0} bids` : `Stock: ${p.stock} units`}
                            </span>
                          </div>

                          <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star size={14} fill="currentColor" /> {p.rating}
                          </span>
                        </div>

                        <Link to={`/app/marketplace/product/${p.id}`} className="mt-4 block pt-2 border-t border-slate-100 dark:border-gray-850">
                          <Button size="sm" variant="outline" className="w-full font-bold">
                            {isAuction ? "Place a Bid" : "Buy It Now"}
                          </Button>
                        </Link>
                      </div>
                    </Card>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-12 text-slate-400 font-medium">
                  This farmer has no active items listed in the marketplace.
                </div>
              )}
            </div>
          )}

          {/* Feedback Profile Tab */}
          {activeTab === "feedback" && (
            <div className="grid gap-8 lg:grid-cols-3">
              {/* Seller Ratings Breakdown (eBay style!) */}
              <div className="lg:col-span-1 space-y-6">
                <Card className="p-5 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 shadow-sm h-fit">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-base border-b border-slate-100 dark:border-gray-800 pb-3">
                    Detailed Seller Ratings
                  </h3>

                  <div className="space-y-4 pt-4 text-xs font-bold text-slate-500">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Item Description Accuracy</span>
                        <span className="text-slate-800 dark:text-slate-200">★ {farmer.accuracyRating.toFixed(1)} / 5</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(farmer.accuracyRating / 5) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Communication</span>
                        <span className="text-slate-800 dark:text-slate-200">★ {farmer.communicationRating.toFixed(1)} / 5</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(farmer.communicationRating / 5) * 100}%` }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span>Shipping / Delivery Speed</span>
                        <span className="text-slate-800 dark:text-slate-200">★ {farmer.shippingRating.toFixed(1)} / 5</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(farmer.shippingRating / 5) * 100}%` }}></div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Feedback Comment Logs */}
              <div className="lg:col-span-2 space-y-4">
                <h3 className="font-extrabold text-sm uppercase text-slate-500 tracking-wider flex items-center gap-1 mb-2">
                  <MessageSquare size={16} /> Buyer Review Logs
                </h3>
                
                {reviews.length > 0 ? (
                  reviews.map((rev) => (
                    <Card key={rev.id} className="p-4 border border-slate-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">@{rev.reviewerName}</span>
                        <span className="flex text-amber-500">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "text-amber-500" : "text-gray-300"} />
                          ))}
                        </span>
                      </div>
                      
                      <p className="mt-2 text-xs font-semibold text-slate-500 capitalize">
                        Item: <span className="text-green-600 dark:text-green-400">{rev.productName}</span>
                      </p>
                      
                      <p className="mt-1.5 text-xs text-slate-600 dark:text-gray-300 font-medium italic">
                        "{rev.comment}"
                      </p>
                      
                      <span className="block mt-2.5 text-[9px] text-slate-400 font-bold">
                        Submitted on {new Date(rev.timestamp).toLocaleDateString()}
                      </span>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No buyer feedback comments have been left for this farmer yet.</p>
                )}
              </div>
            </div>
          )}

          {/* About Farm Tab */}
          {activeTab === "about" && (
            <Card className="p-6 md:p-8 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 shadow-sm max-w-3xl">
              <h3 className="font-extrabold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-gray-800 pb-3 flex items-center gap-2">
                <BookOpen size={18} className="text-green-600" /> Farm Profile & Vision
              </h3>
              
              <p className="mt-4 text-sm leading-relaxed text-slate-600 dark:text-gray-300 font-medium">
                {farmer.about}
              </p>

              <div className="mt-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Agricultural Specialties</h4>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {farmer.specialties.map((spec) => (
                    <span 
                      key={spec} 
                      className="bg-green-50 text-green-700 text-xs font-extrabold px-3 py-1 rounded-full dark:bg-green-950/20 dark:text-green-400 border border-green-100/10"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
