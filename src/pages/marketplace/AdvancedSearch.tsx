import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, MapPin, Star, Gavel, ShoppingBag, ArrowUpDown, ShieldCheck } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useMarketplace, type Product } from "../../context/MarketplaceContext";
import api from "../../lib/api";

export default function AdvancedSearch() {
  const { products, getSellerStats } = useMarketplace();
  const [serverProducts, setServerProducts] = useState<Product[]>(products);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    location: "",
    priceMin: "",
    priceMax: "",
    purchaseType: "all", // 'all' | 'auction' | 'fixed-price'
    condition: "", // '' | 'new' | 'used'
    minRating: "0",
  });

  const resetFilters = () => {
    setFilters({
      category: "",
      location: "",
      priceMin: "",
      priceMax: "",
      purchaseType: "all",
      condition: "",
      minRating: "0",
    });
    setSearchQuery("");
  };
  const saveSearch=async()=>{await api.post("/api/marketplace/searches/saved/",{name:searchQuery.trim()||`Marketplace search ${new Date().toLocaleDateString()}`,filters:{q:searchQuery,...filters}});};

  useEffect(()=>{const timer=window.setTimeout(()=>{api.get("/api/marketplace/public-listings/",{params:{q:searchQuery,category:filters.category||undefined,location:filters.location||undefined,normalized_price_min:filters.priceMin||undefined,normalized_price_max:filters.priceMax||undefined,listing_type:filters.purchaseType==="all"?undefined:filters.purchaseType,condition:filters.condition||undefined,page_size:100}}).then(({data})=>{const rows=Array.isArray(data)?data:data.results;setServerProducts(rows.map((p:Product&{price:string|number})=>({...p,price:Number(p.price),image:p.image||"/logo.png"})));});},300);return()=>window.clearTimeout(timer);},[searchQuery,filters]);
  const filteredProducts = serverProducts;

  const uniqueLocations = Array.from(new Set(products.map((p) => p.location)));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Breadcrumbs */}
        <div className="mb-8">
          <Link
            to="/app/marketplace"
            className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-1.5 mb-4 text-sm font-bold"
          >
            ← Back to Marketplace
          </Link>
          <h1 className="text-3xl font-black text-gray-900 dark:text-white flex items-center gap-3">
            <Search className="text-green-600" size={32} /> Advanced Search Engine
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm font-medium">
            Find exactly what you need with practical search filters designed for Malawi's agricultural marketplace.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Filters Sidebar */}
          <Card className="p-6 lg:col-span-1 h-fit sticky top-8 border border-slate-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 dark:border-gray-800 pb-3">
              <h2 className="text-lg font-extrabold flex items-center gap-2 text-slate-800 dark:text-white">
                <SlidersHorizontal size={18} /> Search Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-slate-400 hover:text-green-600 hover:bg-transparent font-bold">
                Reset All
              </Button>
              <Button variant="outline" size="sm" onClick={()=>void saveSearch()}>Save</Button>
            </div>

            <div className="space-y-6 text-sm">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500 text-xs font-semibold"
                >
                  <option value="">All Categories</option>
                  <option value="produce">Produce</option>
                  <option value="seeds">Seeds & Grains</option>
                  <option value="equipment">Farm Equipment</option>
                  <option value="tools">Hand Tools</option>
                  <option value="machinery">Machinery & Vehicles</option>
                  <option value="farm-inputs">Fertilizer & Farm Inputs</option>
                </select>
              </div>

              {/* Purchase Type Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Buying Format</label>
                <div className="space-y-2 font-semibold">
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="purchaseType"
                      value="all"
                      checked={filters.purchaseType === "all"}
                      onChange={(e) => setFilters({ ...filters, purchaseType: e.target.value })}
                      className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span>All Formats</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="purchaseType"
                      value="auction"
                      checked={filters.purchaseType === "auction"}
                      onChange={(e) => setFilters({ ...filters, purchaseType: e.target.value })}
                      className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="flex items-center gap-1"><Gavel size={13} className="text-blue-600" /> Auction / Bids</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="purchaseType"
                      value="fixed-price"
                      checked={filters.purchaseType === "fixed-price"}
                      onChange={(e) => setFilters({ ...filters, purchaseType: e.target.value })}
                      className="h-4 w-4 text-green-600 rounded focus:ring-green-500"
                    />
                    <span className="flex items-center gap-1"><ShoppingBag size={13} className="text-green-600" /> Buy It Now</span>
                  </label>
                </div>
              </div>

              {/* Condition Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters({ ...filters, condition: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500 text-xs font-semibold"
                >
                  <option value="">Any Condition</option>
                  <option value="new">Brand New</option>
                  <option value="used">Pre-owned / Used</option>
                </select>
              </div>

              {/* Location Selector */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Location / Region</label>
                <select
                  value={filters.location}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500 text-xs font-semibold"
                >
                  <option value="">All Regions</option>
                  {uniqueLocations.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Price Range (MWK)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={(e) => setFilters({ ...filters, priceMin: e.target.value })}
                    placeholder="Min MWK"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white outline-none text-xs font-semibold focus:ring-2 focus:ring-green-500"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={(e) => setFilters({ ...filters, priceMax: e.target.value })}
                    placeholder="Max MWK"
                    className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white outline-none text-xs font-semibold focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>

              {/* Seller Rating Filter */}
              <div>
                <label className="block text-xs font-bold uppercase text-slate-400 mb-2">Seller Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-gray-700 rounded-lg dark:bg-gray-800 dark:text-white outline-none focus:ring-2 focus:ring-green-500 text-xs font-semibold"
                >
                  <option value="0">Any Seller</option>
                  <option value="4">4.0+ Stars Rating</option>
                  <option value="4.5">4.5+ Stars Rating</option>
                  <option value="5">Top Rated Plus Sellers (95%+ Feedback)</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Search Input and Results */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search query input field */}
            <Card className="p-4 border border-slate-100 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-900">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter keywords, crop names, or farm machinery models..."
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500 outline-none text-sm font-medium"
                />
              </div>
            </Card>

            <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400 px-1 font-semibold">
              <span>Found {filteredProducts.length} results matching filters</span>
              <span className="flex items-center gap-1 text-xs"><ArrowUpDown size={14} /> Relevance Sort</span>
            </div>

            {/* Results Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500 dark:text-gray-400 border-2 border-dashed border-slate-200/50 dark:border-gray-800 rounded-xl">
                <SlidersHorizontal size={40} className="mx-auto text-slate-300 mb-3" />
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white">No items match your filters</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">Try loosening your price bounds, changing regions, or broadening your keywords.</p>
                <Button variant="ghost" className="mt-4 text-green-600 font-bold" onClick={resetFilters}>Clear All Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map((product) => {
                  const isAuction = product.listingType === "auction";
                  const sellerStats = getSellerStats(product.farmer);
                  
                  return (
                    <motion.div 
                      key={product.id} 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="h-full"
                    >
                      <Card className="p-5 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 h-full flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-extrabold text-lg text-slate-950 dark:text-white line-clamp-1 hover:text-green-600">
                              <Link to={`/app/marketplace/product/${product.id}`}>{product.name}</Link>
                            </h3>
                            {isAuction ? (
                              <span className="bg-blue-100 text-blue-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-blue-200/20">
                                Auction
                              </span>
                            ) : (
                              <span className="bg-green-100 text-green-800 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider border border-green-200/20">
                                Buy Now
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs text-gray-500 mt-1.5 flex items-center gap-1.5 font-semibold">
                            <Link to={`/app/marketplace/seller/${product.farmer}`} className="hover:underline text-slate-700 dark:text-gray-300 flex items-center gap-1">
                              <ShieldCheck size={14} className="text-green-600" /> {product.farmer}
                            </Link> 
                            <span>•</span> 
                            <span className="flex items-center gap-0.5"><MapPin size={12} /> {product.location}</span>
                          </p>
                          
                          <p className="mt-3 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                            {product.description}
                          </p>
                        </div>

                        <div className="mt-6">
                          <div className="flex justify-between items-end border-t border-slate-100 dark:border-gray-850 pt-4">
                            <div>
                              <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider">
                                {isAuction ? "Current Bid" : "Price"}
                              </p>
                              <p className="text-xl font-black text-slate-900 dark:text-white mt-0.5">
                                MWK {(isAuction ? (product.currentBid || product.price) : product.price).toLocaleString()}
                              </p>
                              <span className="text-[10px] text-slate-400 font-bold">
                                {isAuction ? `${product.bidsCount || 0} bids placed` : `Stock: ${product.stock} bags`}
                              </span>
                            </div>
                            
                            <div className="text-right flex flex-col items-end">
                              <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                                <Star size={13} fill="currentColor" /> {product.rating}
                              </span>
                              <span className="text-[10px] text-green-600 font-extrabold mt-0.5">
                                {sellerStats.positivePercentage}% Feedback
                              </span>
                            </div>
                          </div>

                          <Link to={`/app/marketplace/product/${product.id}`} className="mt-4 block">
                            <Button variant="outline" size="sm" className="w-full font-bold">
                              {isAuction ? "View Bidding details" : "View product details"}
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
