import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, ShieldCheck, SlidersHorizontal, Star, Gavel, Clock, ShoppingBag } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";
import { useMarketplace, type Product } from "../../context/MarketplaceContext";

export default function Products() {
  const { products, getSellerStats } = useMarketplace();
  const { addItem } = useCart();
  const [notice, setNotice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("best-match");
  
  // Local state to trigger rerender for countdowns every minute
  const [, setTimeTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTimeTick(t => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const add = (product: Product) => {
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      category: "produce", 
      image: product.image 
    });
    setNotice(`${product.name} was added to your cart.`);
    window.setTimeout(() => setNotice(""), 2600);
  };

  const getRemainingTimeText = (endTimeStr?: string) => {
    if (!endTimeStr) return "";
    const diff = new Date(endTimeStr).getTime() - Date.now();
    if (diff <= 0) return "Auction Ended";
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

  // Categories list
  const categories = [
    { id: "all", label: "All Items" },
    { id: "produce", label: "Produce" },
    { id: "seeds", label: "Seeds & Grains" },
    { id: "equipment", label: "Farm Equipment" },
  ];

  // Filter and Sort Products
  const filteredProducts = products.filter(p => {
    if (selectedCategory === "all") return true;
    return p.category === selectedCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "newest") {
      return b.id - a.id;
    }
    if (sortBy === "price-low") {
      const aPrice = a.listingType === "auction" ? (a.currentBid || a.price) : a.price;
      const bPrice = b.listingType === "auction" ? (b.currentBid || b.price) : b.price;
      return aPrice - bPrice;
    }
    if (sortBy === "price-high") {
      const aPrice = a.listingType === "auction" ? (a.currentBid || a.price) : a.price;
      const bPrice = b.listingType === "auction" ? (b.currentBid || b.price) : b.price;
      return bPrice - aPrice;
    }
    // Best match default
    return b.rating - a.rating;
  });

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <section className="overflow-hidden rounded-2xl bg-slate-950 text-white shadow-xl">
        <div className="relative grid min-h-58 items-center gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1fr_420px] lg:px-12">
          <div className="relative z-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-green-400">
              Malawi's Premier Agricultural Marketplace
            </p>
            <h1 className="max-w-xl text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              Buy fresh. Bid smart. <span className="text-green-400">Grow together.</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm text-slate-300 leading-relaxed">
              Explore buy-it-now farm produce, or place your bids in our exciting crop & machinery auctions. Secure escrow trading with certified local farmers.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/app/marketplace/search">
                <Button className="bg-green-600 text-white hover:bg-green-700 font-bold px-6 py-3 shadow-lg">
                  Advanced Search
                </Button>
              </Link>
              <Link to="/app/listings/new" className="rounded-lg border border-white/20 bg-white/5 px-5 py-2.5 text-sm font-semibold hover:bg-white/15 transition-all flex items-center gap-2">
                <Gavel size={16} /> Start Selling
              </Link>
            </div>
          </div>
          <div className="hidden lg:block h-full">
            <div className="absolute inset-y-0 right-0 w-5/12 bg-[url('/hero.png')] bg-cover bg-center opacity-40 mix-blend-overlay rounded-r-2xl" />
          </div>
        </div>
      </section>

      {/* Categories & Filter Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-slate-200 dark:border-gray-800 pb-5">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-green-600 text-white shadow-md shadow-green-600/15"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-2 self-end md:self-auto">
          <Link to="/app/marketplace/search">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
              <SlidersHorizontal size={16} /> Advanced Filters
            </button>
          </Link>
          <select
            aria-label="Sort products"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="best-match">Best Match</option>
            <option value="newest">Newest Listed</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {notice && (
        <div role="status" className="fixed right-5 top-32 z-50 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-2xl border border-slate-800 animate-slide-in">
          {notice}
        </div>
      )}

      {/* Product Listings Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sortedProducts.map((product) => {
          const sellerStats = getSellerStats(product.farmer);
          const isAuction = product.listingType === "auction";
          const isClosed = product.isClosed || (isAuction && product.auctionEnd && new Date(product.auctionEnd) < new Date());
          
          return (
            <Card 
              key={product.id} 
              className="group overflow-hidden p-0 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-white dark:bg-gray-900 border border-slate-100 dark:border-gray-800 flex flex-col h-full"
            >
              {/* Product Image & Badges */}
              <div className="relative overflow-hidden aspect-[4/3] bg-slate-100 dark:bg-gray-850">
                <Link to={`/app/marketplace/product/${product.id}`} className="block h-full">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
                  />
                </Link>
                
                {/* eBay Style Formats Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                  {isAuction ? (
                    <span className={`rounded-full px-3 py-1 text-[11px] font-bold shadow-md text-white flex items-center gap-1 ${isClosed ? "bg-red-600" : "bg-blue-600 animate-pulse"}`}>
                      <Gavel size={11} /> {isClosed ? "Auction Ended" : "eBay Auction"}
                    </span>
                  ) : (
                    <span className="rounded-full bg-green-600 px-3 py-1 text-[11px] font-bold shadow-md text-white flex items-center gap-1">
                      <ShoppingBag size={11} /> Buy It Now
                    </span>
                  )}
                  {product.tag && (
                    <span className="rounded-full bg-white/95 text-slate-800 px-2.5 py-0.5 text-[10px] font-extrabold shadow-sm w-fit dark:bg-slate-900/95 dark:text-slate-100">
                      {product.tag}
                    </span>
                  )}
                </div>

                <button 
                  className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/95 text-slate-700 shadow-md hover:text-red-500 transition-colors dark:bg-gray-800 dark:text-gray-300" 
                  aria-label={`Save ${product.name}`}
                >
                  <Heart size={18} />
                </button>
              </div>

              {/* Product Info Card Details */}
              <div className="p-5 flex flex-col flex-1">
                <Link 
                  to={`/app/marketplace/product/${product.id}`} 
                  className="line-clamp-1 text-lg font-extrabold text-slate-900 hover:text-green-700 dark:text-white dark:hover:text-green-400 transition-colors"
                >
                  {product.name}
                </Link>
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium capitalize">Condition: <strong className="text-slate-800 dark:text-slate-200">{product.condition?.replace("-", " ") || "New"}</strong></span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div>
                    {isAuction ? (
                      <>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Bid</p>
                        <p className="text-2xl font-black text-blue-600 dark:text-blue-400">
                          MWK {(product.currentBid || product.price).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Gavel size={12} /> {product.bidsCount || 0} {(product.bidsCount === 1) ? "bid" : "bids"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Price</p>
                        <p className="text-2xl font-black text-slate-900 dark:text-white">
                          MWK {product.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          In stock: {product.stock} units
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className="flex items-center gap-1 text-sm font-bold text-amber-600 dark:text-amber-500">
                      <Star size={15} fill="currentColor" /> {product.rating}
                    </span>
                    <p className="flex items-center gap-1 text-xs text-slate-500">
                      <MapPin size={13} /> {product.location}
                    </p>
                  </div>
                </div>

                {/* Auction Countdown Timer */}
                {isAuction && !isClosed && (
                  <div className="mt-3.5 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 py-1.5 px-3 rounded-lg text-xs font-bold flex items-center gap-1.5 border border-blue-100/30">
                    <Clock size={13} className="animate-spin-slow" /> {getRemainingTimeText(product.auctionEnd)}
                  </div>
                )}

                {/* Farmer Public Storefront Link & Action Button */}
                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-gray-850 flex items-center justify-between gap-2">
                  <div className="flex flex-col">
                    <Link 
                      to={`/app/marketplace/seller/${product.farmer}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:underline"
                    >
                      <ShieldCheck size={14} className="text-green-600" /> 
                      <span className="line-clamp-1">{product.farmer}</span>
                    </Link>
                    <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {sellerStats.positivePercentage}% Feedback
                    </span>
                  </div>

                  {isAuction ? (
                    <Link to={`/app/marketplace/product/${product.id}`}>
                      <Button size="sm" className="bg-blue-600 text-white hover:bg-blue-700 shadow-md">
                        {isClosed ? "View Results" : "Place Bid"}
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => add(product)}
                      className="bg-green-600 hover:bg-green-700 shadow-md"
                    >
                      Buy Now
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
