import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, ShieldCheck, SlidersHorizontal, Star, Gavel, Clock, ShoppingBag } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";
import { useMarketplace, type Product } from "../../context/MarketplaceContext";
import { useTranslation } from "react-i18next";
import type { ProductCategory } from "../../context/CartContext";
import api,{getApiError}from"../../lib/api";
import SmartImage from "../../components/SmartImage";

export default function Products() {
  const { t } = useTranslation();
  const { products, getSellerStats, listingsLoading, hasMoreListings, loadMoreListings } = useMarketplace();
  const { addItem } = useCart();
  const [notice, setNotice] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("best-match");
  const [visibleCount, setVisibleCount] = useState(12);
  const [compareIds,setCompareIds]=useState<number[]>([]);
  const favourite=async(product:Product)=>{try{await api.post("/api/marketplace/favourites/",{listing_id:product.id});setNotice(`${product.name} saved to favourites.`);}catch(e){setNotice(getApiError(e,"Favourite could not be saved."));}};
  
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
      category: product.category as ProductCategory,
      image: product.image 
    });
    setNotice(t("addedToCart", { name: product.name }));
    window.setTimeout(() => setNotice(""), 2600);
  };

  const getRemainingTimeText = (endTimeStr?: string) => {
    if (!endTimeStr) return "";
    const diff = new Date(endTimeStr).getTime() - Date.now();
    if (diff <= 0) return t("auctionEnded");
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) {
      const mins = Math.floor(diff / (1000 * 60));
      return t("minutesLeft", { count: mins });
    }
    if (hours < 24) {
      return t("hoursLeft", { count: hours });
    }
    const days = Math.floor(hours / 24);
    const remHours = hours % 24;
    return t("daysHoursLeft", { days, hours: remHours });
  };

  // Categories list
  const categories = [
    { id: "all", label: t("allItems") },
    { id: "produce", label: t("produce") },
    { id: "seeds", label: t("seedsGrains") },
    { id: "equipment", label: t("farmEquipment") },
    { id: "tools", label: "Hand tools" },
    { id: "machinery", label: "Machinery" },
    { id: "farm-inputs", label: t("farmInputs") },
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
  const visibleProducts = sortedProducts.slice(0, visibleCount);

  useEffect(() => setVisibleCount(12), [selectedCategory, sortBy]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Hero Banner */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-900 shadow-xl dark:border-slate-800 dark:bg-slate-950 dark:text-white">
        <div className="relative grid min-h-44 items-center gap-6 px-4 py-6 sm:min-h-58 sm:px-10 sm:py-10 lg:grid-cols-[1fr_420px] lg:px-12">
          <div className="relative z-10">
            <p className="mb-3 text-xs font-bold uppercase tracking-[.2em] text-green-700 dark:text-green-400">
              {t("marketplaceTagline")}
            </p>
            <h1 className="max-w-xl text-2xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
              <span className="text-slate-900 dark:text-white">{t("marketplaceHeadline")}</span>
            </h1>
            <p className="mt-4 max-w-lg text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              {t("marketplaceDescription")}
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
              <Link to="/app/marketplace/search">
                <Button className="w-full bg-green-700 px-3 font-bold text-white hover:bg-green-800 sm:px-6">
                  {t("advancedSearch")}
                </Button>
              </Link>
              <Link to="/app/listings/new" className="flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 text-center text-sm font-semibold text-slate-800 transition-all hover:bg-slate-100 sm:px-5 dark:border-white/20 dark:bg-white/5 dark:text-white dark:hover:bg-white/15">
                <Gavel size={16} /> {t("startSelling")}
              </Link>
              <Link to="/app/marketplace/library" className="flex min-h-11 items-center justify-center rounded-lg border px-4 text-sm font-semibold">Favourites, recent and wanted</Link>
            </div>
          </div>
          <div className="hidden lg:block h-full">
            <div className="absolute inset-y-0 right-0 w-5/12 rounded-r-2xl bg-[url('/hero.png')] bg-cover bg-center opacity-20 dark:opacity-40 dark:mix-blend-overlay" />
          </div>
        </div>
      </section>

      {/* Categories & Filter Controls */}
      <div className="sticky top-[124px] z-20 -mx-3 flex flex-col gap-3 border-b border-slate-200 bg-slate-50/95 px-3 pb-3 pt-1 backdrop-blur sm:static sm:mx-0 sm:bg-transparent sm:px-0 sm:pb-5 md:flex-row md:items-center md:justify-between dark:border-gray-800 dark:bg-gray-950/95 sm:dark:bg-transparent">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`min-h-10 shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-green-600 text-white shadow-md shadow-green-600/15"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-2 items-center gap-2 md:flex">
          <Link to="/app/marketplace/search" className="block">
            <button className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200">
              <SlidersHorizontal size={16} /> {t("advancedFilters")}
            </button>
          </Link>
          <select
            aria-label={t("sortProducts")}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="min-h-11 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200"
          >
            <option value="best-match">{t("bestMatch")}</option>
            <option value="newest">{t("newestListed")}</option>
            <option value="price-low">{t("priceLowHigh")}</option>
            <option value="price-high">{t("priceHighLow")}</option>
          </select>
        </div>
      </div>

      {notice && (
        <div role="status" className="fixed right-5 top-32 z-50 rounded-lg bg-slate-900 px-5 py-3 text-sm font-bold text-white shadow-2xl border border-slate-800 animate-slide-in">
          {notice}
        </div>
      )}
      {compareIds.length>=2&&<Link to={`/app/marketplace/compare?ids=${compareIds.join(",")}`} className="fixed bottom-5 right-5 z-40 rounded-full bg-blue-700 px-5 py-3 font-bold text-white shadow-xl">Compare {compareIds.length} products</Link>}

      {/* Product Listings Grid */}
      {listingsLoading && products.length === 0 && <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-3" aria-label="Loading listings">{Array.from({ length: 6 }, (_, index) => <div key={index} className="aspect-[3/4] animate-pulse rounded-xl bg-slate-200 dark:bg-gray-800" />)}</div>}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-5 lg:grid-cols-3">
        {visibleProducts.map((product) => {
          const sellerStats = getSellerStats(product.farmer);
          const isAuction = product.listingType === "auction";
          const isClosed = product.isClosed || (isAuction && product.auctionEnd && new Date(product.auctionEnd) < new Date());
          
          return (
            <Card 
              key={product.id} 
              data-listing-card="true"
              className="product-card group flex h-full flex-col overflow-hidden border border-slate-200 bg-white p-0 transition-all duration-200 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Product Image & Badges */}
              <div data-listing-image="true" className="relative aspect-square overflow-hidden bg-slate-100 sm:aspect-[4/3] dark:bg-gray-850">
                <Link to={`/app/marketplace/product/${product.id}`} className="block h-full">
                  <SmartImage
                    src={product.image} 
                    alt={product.name} 
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105" 
                  />
                </Link>
                
                {/* eBay Style Formats Badges */}
                <div className="absolute left-3 top-3 flex flex-col gap-1.5">
                  {isAuction ? (
                    <span className={`flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-bold text-white shadow-sm sm:px-3 sm:text-[11px] ${isClosed ? "bg-red-600" : "bg-amber-600"}`}>
                      <Gavel size={11} /> {isClosed ? t("auctionEnded") : t("auction")}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-green-700 px-2 py-1 text-[10px] font-bold text-white shadow-sm sm:px-3 sm:text-[11px]">
                      <ShoppingBag size={11} /> {t("buyItNow")}
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
                  aria-label={t("saveProduct", { name: product.name })}
                  onClick={()=>void favourite(product)}
                >
                  <Heart size={18} />
                </button>
              </div>

              {/* Product Info Card Details */}
              <div className="product-card-body flex flex-1 flex-col p-4 sm:p-5">
                <Link 
                  to={`/app/marketplace/product/${product.id}`} 
                  className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors hover:text-green-700 sm:text-lg sm:font-extrabold dark:text-white dark:hover:text-green-400"
                >
                  {product.name}
                </Link>
                <label className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" checked={compareIds.includes(product.id)} onChange={e=>setCompareIds(ids=>e.target.checked?[...ids,product.id].slice(-4):ids.filter(id=>id!==product.id))}/>Compare</label>
                <div className="product-secondary mt-1 flex items-center gap-2">
                  <span className="text-xs text-slate-500 font-medium capitalize">{t("condition")}: <strong className="text-slate-800 dark:text-slate-200">{product.condition?.replace("-", " ") || t("new")}</strong></span>
                </div>

                <div className="mt-3 flex flex-col items-start justify-between gap-2 sm:mt-4 sm:flex-row sm:items-end">
                  <div>
                    {isAuction ? (
                      <>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("currentBid")}</p>
                        <p className="product-price text-lg font-black text-slate-900 sm:text-2xl dark:text-white">
                          MWK {(product.currentBid || product.price).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-1">
                          <Gavel size={12} /> {t("bid", { count: product.bidsCount || 0 })}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{t("priceLabel")}</p>
                        <p className="product-price text-lg font-black text-slate-900 sm:text-2xl dark:text-white">
                          MWK {product.price.toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {t("inStock", { count: product.stock })}
                        </p>
                      </>
                    )}
                  </div>
                  
                  <div className="product-secondary text-right sm:flex sm:flex-col sm:items-end sm:gap-1">
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
                <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4 dark:border-gray-850">
                  <div className="product-secondary flex-col sm:flex">
                    <Link 
                      to={`/app/marketplace/seller/${product.farmer}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-green-600 dark:text-gray-300 dark:hover:text-green-400 hover:underline"
                    >
                      <ShieldCheck size={14} className="text-green-600" /> 
                      <span className="line-clamp-1">{product.farmer}</span>
                    </Link>
                    <span className="text-[10px] text-slate-400 font-bold mt-0.5">
                      {t("feedback", { percent: sellerStats.positivePercentage })}
                    </span>
                  </div>

                  {isAuction ? (
                    <Link to={`/app/marketplace/product/${product.id}`}>
                      <Button size="sm" className="w-full bg-green-700 text-white hover:bg-green-800 sm:w-auto">
                        {isClosed ? t("viewResults") : t("placeBid")}
                      </Button>
                    </Link>
                  ) : (
                    <Button 
                      size="sm" 
                      onClick={() => add(product)}
                      className="w-full bg-green-700 hover:bg-green-800 sm:w-auto"
                    >
                      {t("buyNow")}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {(visibleCount < sortedProducts.length || hasMoreListings) && <div className="flex flex-col items-center gap-2 border-t border-slate-200 pt-5 dark:border-gray-800"><p className="text-sm text-slate-500">Showing {Math.min(visibleCount, sortedProducts.length)} loaded listings</p><Button variant="outline" disabled={listingsLoading} onClick={async () => { if (visibleCount >= sortedProducts.length && hasMoreListings) await loadMoreListings(); setVisibleCount(count => count + 12); }}>{listingsLoading ? "Loading listings…" : "Load more listings"}</Button></div>}
      {!listingsLoading && sortedProducts.length === 0 && <Card className="p-8 text-center"><ShoppingBag className="mx-auto text-slate-400" size={40} /><h2 className="mt-3 text-xl font-bold">No listings in this category yet</h2><p className="mt-1 text-sm text-slate-500">Be the first verified seller to list an item.</p><Link to="/app/listings/new"><Button className="mt-4">Create a listing</Button></Link></Card>}
    </div>
  );
}
