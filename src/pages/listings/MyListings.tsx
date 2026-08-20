import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Edit, Trash2, Eye, Package, PlusCircle, Gavel, ShoppingBag, Clock, Sparkles } from "lucide-react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { useAuth } from "../../context/AuthContext";

export default function MyListings() {
  const { products, getSellerStats } = useMarketplace();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"fixed-price" | "auction" | "ended">("fixed-price");

  // Determine current active farmer to show listings for
  const currentFarmerName = user?.username || "John Phiri";

  // Filter listings for this farmer
  const myAllProducts = products.filter((p) => p.farmer === currentFarmerName);

  // Time Tick for countdown updates
  const [, setTimeTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTimeTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const getRemainingTimeText = (endTimeStr?: string) => {
    if (!endTimeStr) return "";
    const diff = new Date(endTimeStr).getTime() - Date.now();
    if (diff <= 0) return "Ended";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) {
      const mins = Math.floor(diff / (1000 * 60));
      return `${mins}m left`;
    }
    if (hours < 24) {
      return `${hours}h left`;
    }
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return `${days}d ${remHours}h left`;
  };

  // Group listings
  const fixedPriceListings = myAllProducts.filter((p) => p.listingType === "fixed-price");
  const activeAuctions = myAllProducts.filter(
    (p) => p.listingType === "auction" && !(p.isClosed || (p.auctionEnd && new Date(p.auctionEnd) < new Date()))
  );
  const endedAuctions = myAllProducts.filter(
    (p) => p.listingType === "auction" && (p.isClosed || (p.auctionEnd && new Date(p.auctionEnd) < new Date()))
  );

  const stats = getSellerStats(currentFarmerName);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
              Seller Hub Dashboard
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm font-medium">
              Manage your agricultural inventory, active auctions, and review your bidding success.
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to="/app/listings/new">
              <Button className="bg-green-600 hover:bg-green-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-green-600/10">
                <PlusCircle size={18} /> Create New Listing
              </Button>
            </Link>
          </div>
        </div>

        {/* Farmer Performance / Seller Rating Stats Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 text-center flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Positive Feedback</span>
            <span className="text-2xl font-black text-green-600 dark:text-green-400 mt-1">{stats.positivePercentage}%</span>
          </Card>
          
          <Card className="p-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 text-center flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Customer Ratings</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{stats.totalReviews} total</span>
          </Card>

          <Card className="p-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 text-center flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Active Auctions</span>
            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{activeAuctions.length} item(s)</span>
          </Card>

          <Card className="p-4 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 text-center flex flex-col justify-center">
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Buy It Now Items</span>
            <span className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{fixedPriceListings.length} active</span>
          </Card>
        </div>

        {/* eBay Hub Style Sub Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-gray-800 mb-6 font-semibold text-sm">
          <button
            onClick={() => setActiveTab("fixed-price")}
            className={`pb-3 border-b-2 px-2 transition-all flex items-center gap-1.5 ${
              activeTab === "fixed-price"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ShoppingBag size={15} /> Fixed Price ({fixedPriceListings.length})
          </button>
          
          <button
            onClick={() => setActiveTab("auction")}
            className={`pb-3 border-b-2 px-2 transition-all flex items-center gap-1.5 ${
              activeTab === "auction"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Gavel size={15} /> Active Auctions ({activeAuctions.length})
          </button>

          <button
            onClick={() => setActiveTab("ended")}
            className={`pb-3 border-b-2 px-2 transition-all flex items-center gap-1.5 ${
              activeTab === "ended"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Clock size={15} /> Completed Auctions ({endedAuctions.length})
          </button>
        </div>

        {/* Listings rendering logic */}
        {activeTab === "fixed-price" && (
          <div className="space-y-4 animate-fade-in">
            {fixedPriceListings.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200/50 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
                <Package className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white">No active Buy It Now listings</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Create fixed-price listings for seeds, produce, or machinery that buyers can purchase immediately.</p>
                <Link to="/app/listings/new" className="mt-4 inline-block">
                  <Button size="sm">Create Fixed Price Listing</Button>
                </Link>
              </div>
            ) : (
              fixedPriceListings.map((listing) => (
                <Card key={listing.id} className="p-5 hover:shadow-lg transition-all duration-200 border border-slate-100 dark:border-gray-850 bg-white dark:bg-gray-900 flex flex-col sm:flex-row gap-5">
                  <div className="flex-shrink-0">
                    <img src={listing.image} alt={listing.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-100 dark:border-gray-800" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <Link to={`/app/marketplace/product/${listing.id}`} className="block text-lg font-extrabold text-slate-900 hover:text-green-700 dark:text-white">
                            {listing.name}
                          </Link>
                          <p className="text-xs text-slate-400 font-bold capitalize mt-1">Condition: {listing.condition?.replace("-", " ") || "New"}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-xl font-black text-green-700 dark:text-green-500">MWK {listing.price.toLocaleString()}</p>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 dark:bg-gray-800/40 px-2 py-0.5 rounded-full inline-block mt-1">
                            {listing.stock > 0 ? "In Stock" : "Sold Out"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-50 dark:border-gray-850 justify-between items-center text-xs font-bold text-slate-500">
                      <div>Stock: <strong className="text-slate-800 dark:text-slate-200">{listing.stock} bags</strong></div>
                      
                      <div className="flex gap-2">
                        <Link to={`/app/marketplace/product/${listing.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1">
                            <Eye size={13} /> View Listing
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "auction" && (
          <div className="space-y-4 animate-fade-in">
            {activeAuctions.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200/50 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
                <Gavel className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white">No active agricultural auctions</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Create high-demand crop or equipment auctions to generate competitive bidding from nationwide buyers.</p>
                <Link to="/app/listings/new" className="mt-4 inline-block">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">Create Auction Listing</Button>
                </Link>
              </div>
            ) : (
              activeAuctions.map((listing) => (
                <Card key={listing.id} className="p-5 hover:shadow-lg transition-all duration-200 border border-slate-100 dark:border-gray-850 bg-white dark:bg-gray-900 flex flex-col sm:flex-row gap-5">
                  <div className="flex-shrink-0">
                    <img src={listing.image} alt={listing.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-100 dark:border-gray-800" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <Link to={`/app/marketplace/product/${listing.id}`} className="block text-lg font-extrabold text-slate-900 hover:text-green-700 dark:text-white">
                            {listing.name}
                          </Link>
                          <p className="text-xs text-slate-400 font-bold capitalize mt-1">Condition: {listing.condition?.replace("-", " ") || "New"}</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Current Highest Bid</p>
                          <p className="text-xl font-black text-blue-600 dark:text-blue-400">MWK {(listing.currentBid || listing.price).toLocaleString()}</p>
                          <span className="text-[10px] text-blue-600 dark:text-blue-400 font-extrabold bg-blue-50 dark:bg-blue-950/20 px-2 py-0.5 rounded-full inline-block mt-1">
                            {listing.bidsCount || 0} bids placed
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-50 dark:border-gray-850 justify-between items-center text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                        <Clock size={13} className="animate-pulse" /> Timer: {getRemainingTimeText(listing.auctionEnd)}
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/app/marketplace/product/${listing.id}`}>
                          <Button variant="outline" size="sm" className="flex items-center gap-1 border-blue-200 dark:border-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-50/20">
                            <Eye size={13} /> Bid Logs / History
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === "ended" && (
          <div className="space-y-4 animate-fade-in">
            {endedAuctions.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200/50 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900 text-slate-400 font-medium">
                No completed auctions yet. Closed auctions will display final winners here.
              </div>
            ) : (
              endedAuctions.map((listing) => (
                <Card key={listing.id} className="p-5 border border-slate-100 dark:border-gray-850 bg-slate-50/20 dark:bg-gray-900/10 flex flex-col sm:flex-row gap-5">
                  <div className="flex-shrink-0">
                    <img src={listing.image} alt={listing.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl grayscale opacity-75 border border-slate-100" />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                        <div>
                          <Link to={`/app/marketplace/product/${listing.id}`} className="block text-lg font-extrabold text-slate-500 hover:text-green-700 dark:text-slate-400">
                            {listing.name}
                          </Link>
                          <p className="text-xs text-slate-400 font-bold mt-1 uppercase">Auction Completed</p>
                        </div>
                        <div className="sm:text-right">
                          <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">Final Sold Price</p>
                          <p className="text-xl font-black text-slate-700 dark:text-slate-300">MWK {(listing.currentBid || listing.price).toLocaleString()}</p>
                          <span className="text-[10px] text-slate-400 font-extrabold bg-slate-100 dark:bg-gray-800 px-2 py-0.5 rounded-full inline-block mt-1">
                            Total {listing.bidsCount || 0} bids
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2 pt-3 border-t border-slate-100 dark:border-gray-850 justify-between items-center text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5 text-green-700 dark:text-green-400">
                        <Sparkles size={14} /> Winner: <strong className="text-slate-900 dark:text-white bg-green-50 dark:bg-green-950/20 px-2 py-0.5 rounded">@{listing.winner || "mw_agri_corp"}</strong>
                      </div>
                      
                      <div className="flex gap-2">
                        <Link to={`/app/marketplace/product/${listing.id}`}>
                          <Button variant="outline" size="sm">
                            View Results
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

      </div>
    </div>
  );
}
