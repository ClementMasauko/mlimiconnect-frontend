import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Heart, MapPin, Minus, Package, Plus, ShieldCheck, Star, User, Gavel, Clock, ShoppingBag, Send } from "lucide-react";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { useCart } from "../../context/CartContext";
import { useMarketplace } from "../../context/MarketplaceContext";
import { useAuth } from "../../context/AuthContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { products, reviews, addBid, addReview, getSellerStats } = useMarketplace();
  const { addItem } = useCart();
  const { user } = useAuth();
  
  const product = products.find((p) => p.id === Number(id));
  const productReviews = reviews.filter((r) => r.productName === product?.name);

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [bidAmount, setBidAmount] = useState("");
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");
  
  // Review form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  // Countdown timer local state
  const [, setTimeTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTimeTick((t) => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!product) {
    return (
      <div className="text-center py-24 max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Product not found</h2>
        <p className="text-slate-500 mt-2">The product you are looking for does not exist or has been removed.</p>
        <Link to="/app/marketplace" className="mt-6 inline-block">
          <Button>Back to Marketplace</Button>
        </Link>
      </div>
    );
  }

  const isAuction = product.listingType === "auction";
  const isClosed = product.isClosed || (isAuction && product.auctionEnd && new Date(product.auctionEnd) < new Date());
  const sellerStats = getSellerStats(product.farmer);

  // Minimum required bid increment
  const minIncrement = product.currentBid 
    ? Math.max(500, Math.ceil(product.currentBid * 0.01)) 
    : 0;
  const minRequiredBid = product.currentBid 
    ? product.currentBid + minIncrement 
    : product.price;

  const getRemainingTimeText = (endTimeStr?: string) => {
    if (!endTimeStr) return "";
    const diff = new Date(endTimeStr).getTime() - Date.now();
    if (diff <= 0) return "Auction Closed";
    
    const sec = Math.floor(diff / 1000) % 60;
    const min = Math.floor(diff / (1000 * 60)) % 60;
    const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days}d ${hours}h ${min}m left`;
    }
    if (hours > 0) {
      return `${hours}h ${min}m ${sec}s left`;
    }
    return `${min}m ${sec}s left`;
  };

  const handleAddToCart = () => {
    addItem({ 
      id: product.id, 
      name: product.name, 
      price: product.price, 
      category: product.category as import("../../context/CartContext").ProductCategory,
      image: product.image 
    }, quantity);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2500);
  };

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");

    const amount = Number(bidAmount);
    if (isNaN(amount) || amount <= 0) {
      setBidError("Please enter a valid positive bid amount.");
      return;
    }

    const bidder = user?.username || "demo_buyer";
    const result = addBid(product.id, bidder, amount);

    if (result.success) {
      setBidSuccess(`Success! Your bid of MWK ${amount.toLocaleString()} is now the highest bid.`);
      setBidAmount("");
    } else {
      setBidError(result.error || "Failed to place bid.");
    }
  };

  const handleAddReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setReviewSuccess("");

    const reviewer = user?.username || "Verified buyer";
    addReview(product.id, {
      reviewerName: reviewer,
      rating: reviewRating,
      comment: reviewComment
    });

    setReviewSuccess("Thank you! Your product and seller review was published.");
    setReviewComment("");
    setReviewRating(5);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
      {/* Breadcrumb Navigation */}
      <Link 
        to="/app/marketplace" 
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-600 hover:text-green-700 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
      >
        <ChevronLeft size={17} /> Back to marketplace
      </Link>
      
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,.8fr)]">
        {/* Left Side: Product Image & Seller Storefront Highlight */}
        <div className="space-y-6">
          <Card className="overflow-hidden p-0 border border-slate-100 dark:border-gray-800 shadow-md">
            <img src={product.image} alt={product.name} className="h-full min-h-[350px] max-h-[500px] w-full object-cover" />
          </Card>

          {/* Seller Storefront Card */}
          <Card className="p-6 border border-slate-100 dark:border-gray-800 shadow-md bg-slate-50/50 dark:bg-gray-900/30">
            <h3 className="font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <User size={18} className="text-green-600" /> Seller Information
            </h3>
            
            <div className="mt-4 flex items-start gap-4">
              <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-950/50 flex items-center justify-center font-bold text-green-700 dark:text-green-400 text-lg shadow-sm">
                {product.farmer.charAt(0)}
              </div>
              <div className="flex-1">
                <Link 
                  to={`/app/marketplace/seller/${product.farmer}`}
                  className="text-base font-extrabold text-slate-900 hover:text-green-600 dark:text-white dark:hover:text-green-400 hover:underline flex items-center gap-1"
                >
                  {product.farmer}
                  {sellerStats.averageRating >= 4.7 && (
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full dark:bg-amber-950/40 dark:text-amber-400">
                      Top Rated
                    </span>
                  )}
                </Link>
                <p className="text-xs text-slate-500 mt-0.5">Location: {product.location}</p>
                <div className="mt-2 flex items-center gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                  <span className="text-green-600 dark:text-green-400">{sellerStats.positivePercentage}% Positive Feedback</span>
                  <span className="text-slate-300 dark:text-gray-700">|</span>
                  <span>{sellerStats.totalReviews} total ratings</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-gray-800 flex justify-between">
              <Link to={`/app/marketplace/seller/${product.farmer}`} className="text-xs font-bold text-green-600 hover:underline">
                View Seller Storefront →
              </Link>
              <Link to={`/app/messages`} className="text-xs font-bold text-slate-500 hover:underline">
                Contact Farmer
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Side: Detailed Stats, Bidding, & Buying Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center gap-2">
              {isAuction ? (
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 tracking-wider border border-blue-200/10">
                  <Gavel size={11} /> eBay Auction
                </span>
              ) : (
                <span className="bg-green-100 text-green-800 dark:bg-green-950/50 dark:text-green-300 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full flex items-center gap-1 tracking-wider border border-green-200/10">
                  <ShoppingBag size={11} /> Buy It Now
                </span>
              )}
              <span className="text-xs text-slate-400 font-bold capitalize">Condition: {product.condition?.replace("-", " ") || "New"}</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mt-3 leading-tight">
              {product.name}
            </h1>
            
            <div className="mt-3 flex items-center gap-4">
              <div className="flex items-center gap-1 text-sm font-bold text-amber-600">
                <Star size={16} fill="currentColor" /> {product.rating}
                <span className="text-slate-400 font-medium ml-1">({productReviews.length} customer ratings)</span>
              </div>
              <span className="text-slate-300 dark:text-gray-700">|</span>
              <p className="flex items-center gap-1 text-xs text-slate-500">
                <MapPin size={14} className="text-green-600" /> {product.location}
              </p>
            </div>

            <p className="mt-6 text-sm text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="mt-6 border-y border-slate-100 dark:border-gray-850 py-4 text-xs font-bold text-slate-500 dark:text-slate-400 grid grid-cols-2 gap-y-2">
              <div className="flex items-center gap-2"><ShieldCheck size={15} className="text-green-600" /> Secure Escrow</div>
              <div className="flex items-center gap-2"><Package size={15} className="text-green-600" /> Quality Certified</div>
              {isAuction ? (
                <div className="flex items-center gap-2 col-span-2 text-blue-600 dark:text-blue-400">
                  <Clock size={15} /> Ending: {new Date(product.auctionEnd || "").toLocaleString()}
                </div>
              ) : (
                <div className="flex items-center gap-2 col-span-2 text-green-600 dark:text-green-400">
                  <Package size={15} /> {product.stock} bags available
                </div>
              )}
            </div>

            {/* Bidding vs Buy-It-Now Section */}
            <div className="mt-6 p-6 rounded-xl border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-900/10">
              {isAuction ? (
                /* Auction System Content */
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current Bid</p>
                      <h2 className="text-4xl font-black text-blue-600 dark:text-blue-400 mt-1">
                        MWK {(product.currentBid || product.price).toLocaleString()}
                      </h2>
                      <p className="text-xs text-slate-400 font-bold mt-1">
                        [ Starting Bid was MWK {product.price.toLocaleString()} ]
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950/50 dark:text-blue-300 text-xs font-bold">
                        {product.bidsCount || 0} {(product.bidsCount === 1) ? "bid" : "bids"}
                      </span>
                    </div>
                  </div>

                  {!isClosed ? (
                    <>
                      {/* Bid Countdown Timer */}
                      <div className="flex items-center gap-2 text-sm font-bold text-red-600 bg-red-50/50 dark:bg-red-950/20 dark:text-red-400 px-3 py-2 rounded-lg w-fit border border-red-100/10">
                        <Clock size={16} className="animate-pulse" /> {getRemainingTimeText(product.auctionEnd)}
                      </div>

                      {/* Place Bid Form */}
                      <form onSubmit={handlePlaceBid} className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">
                            Your Max Bid (Minimum required: MWK {minRequiredBid.toLocaleString()})
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="number"
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              placeholder={minRequiredBid.toString()}
                              className="w-full px-4 py-2.5 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white font-extrabold focus:ring-2 focus:ring-blue-500 outline-none"
                              required
                            />
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6">
                              Place Bid
                            </Button>
                          </div>
                        </div>

                        {bidError && (
                          <p role="alert" className="text-xs font-bold text-red-600 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-100/10">
                            ✕ {bidError}
                          </p>
                        )}
                        {bidSuccess && (
                          <p role="status" className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/30 p-2 rounded border border-green-100/10 animate-pulse">
                            ✓ {bidSuccess}
                          </p>
                        )}
                      </form>
                    </>
                  ) : (
                    <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 font-extrabold text-sm border border-red-100/10 text-center">
                      🔒 This auction is completed. {product.winner ? `Won by user '${product.winner}'` : "No winner was determined."}
                    </div>
                  )}

                  {/* Bid Logs History (eBay Style) */}
                  <div className="pt-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                      <Gavel size={13} /> Bid History Logs
                    </h4>
                    {product.bids && product.bids.length > 0 ? (
                      <div className="max-h-36 overflow-y-auto border border-slate-100 dark:border-gray-800/60 rounded-lg text-xs divide-y divide-slate-100 dark:divide-gray-800/40">
                        {product.bids.map((bid, index) => (
                          <div key={bid.id} className={`p-2.5 flex items-center justify-between ${index === 0 ? "bg-blue-50/30 dark:bg-blue-950/10 font-bold text-blue-700 dark:text-blue-300" : "text-slate-600 dark:text-slate-400"}`}>
                            <div className="flex items-center gap-2">
                              <span>@{bid.bidderName}</span>
                              {index === 0 && <span className="bg-blue-600 text-white text-[9px] px-1 py-0.2 rounded font-extrabold">Highest</span>}
                            </div>
                            <div className="text-right">
                              <span className="font-extrabold">MWK {bid.amount.toLocaleString()}</span>
                              <span className="block text-[9px] text-slate-400 font-normal">{new Date(bid.timestamp).toLocaleTimeString()}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No bids have been placed yet. Be the first to start!</p>
                    )}
                  </div>
                </div>
              ) : (
                /* Buy It Now System Content */
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Buy It Now Price</p>
                    <h2 className="text-4xl font-black text-slate-950 dark:text-white mt-1">
                      MWK {product.price.toLocaleString()}
                      <span className="text-sm font-medium text-slate-400"> / 50 kg bag</span>
                    </h2>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <div className="flex items-center rounded-lg border border-slate-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors" 
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>
                      <span className="w-10 text-center font-bold text-sm">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="p-2.5 hover:bg-slate-100 dark:hover:bg-gray-700 transition-colors" 
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>
                    
                    <Button 
                      onClick={handleAddToCart} 
                      size="lg" 
                      className="flex-1 bg-green-600 text-white hover:bg-green-700 font-bold shadow-lg"
                    >
                      {added ? "Added to cart ✓" : "Add to cart"}
                    </Button>
                  </div>
                  
                  <Link to="/app/marketplace/cart" className="block">
                    <Button variant="outline" className="w-full font-bold">View shopping cart</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer / Buyer Reviews & Feedback Section */}
      <section className="mt-14 max-w-4xl border-t border-slate-200/60 dark:border-gray-800 pt-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Star size={24} fill="currentColor" className="text-amber-500" /> Buyer Feedback ({productReviews.length})
        </h2>

        <div className="grid gap-6 md:grid-cols-2 mt-6 items-start">
          {/* Write a review form */}
          <Card className="p-6 border border-slate-100 dark:border-gray-800 bg-slate-50/50 dark:bg-gray-950/20">
            <h3 className="font-extrabold text-sm uppercase text-slate-500 tracking-wider mb-4">Leave a Review</h3>
            <form onSubmit={handleAddReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Rating</label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`text-2xl transition-colors ${star <= reviewRating ? "text-amber-500" : "text-gray-300"}`}
                    >
                      <Star size={22} fill={star <= reviewRating ? "currentColor" : "none"} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase">Comments</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  required
                  placeholder="Share your experience with this product, delivery speed, and the farmer..."
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white text-sm focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700 flex items-center gap-1.5">
                <Send size={14} /> Submit Feedback
              </Button>

              {reviewSuccess && (
                <p role="status" className="text-xs font-bold text-green-600 bg-green-50 dark:bg-green-950/30 p-2.5 rounded border border-green-100/10">
                  ✓ {reviewSuccess}
                </p>
              )}
            </form>
          </Card>

          {/* List of active product reviews */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
            <h3 className="font-extrabold text-sm uppercase text-slate-500 tracking-wider mb-2">What buyers are saying</h3>
            {productReviews.length > 0 ? (
              productReviews.map((review) => (
                <Card key={review.id} className="p-4 border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-sm text-slate-800 dark:text-slate-200">@{review.reviewerName}</span>
                    <span className="flex text-amber-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star 
                          key={index} 
                          size={13} 
                          fill={index < review.rating ? "currentColor" : "none"} 
                          className={index < review.rating ? "text-amber-500" : "text-gray-300"} 
                        />
                      ))}
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
                    "{review.comment}"
                  </p>
                  <span className="block mt-2 text-[9px] text-slate-400 font-bold">
                    Reviewed on {new Date(review.timestamp).toLocaleDateString()}
                  </span>
                </Card>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No buyer feedback has been posted for this product yet.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
