import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Clock, CheckCircle, Truck, AlertCircle, Package, Gavel, ShoppingBag, Eye } from "lucide-react";
import { useMarketplace } from "../../context/MarketplaceContext";
import { useAuth } from "../../context/AuthContext";
import api, { getApiError } from "../../lib/api";

// Mock orders data
const mockOrders = [
  {
    id: 4782,
    created_at: "2025-02-08",
    status: "completed",
    total: 185000,
    items_count: 1,
  },
  {
    id: 4781,
    created_at: "2025-02-07",
    status: "in_transit",
    total: 72000,
    items_count: 2,
  },
  {
    id: 4779,
    created_at: "2025-02-05",
    status: "pending_payment",
    total: 95000,
    items_count: 1,
  },
];

export default function MyOrders() {
  const { products } = useMarketplace();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState<"purchases" | "bids">("purchases");
  const [orders, setOrders] = useState(mockOrders);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (import.meta.env.VITE_DEMO_DATA_ENABLED === "true") return;
    api.get("/api/marketplace/orders/")
      .then(({ data }) => {
        const rows = Array.isArray(data) ? data : data.results ?? [];
        setOrders(rows.map((order: { id: number; created_at: string; status: string; total: string | number; items?: unknown[] }) => ({
          id: order.id,
          created_at: order.created_at,
          status: order.status,
          total: Number(order.total),
          items_count: order.items?.length ?? 0,
        })));
      })
      .catch((error) => {
        setOrders([]);
        setLoadError(getApiError(error, "Orders could not be loaded."));
      });
  }, []);

  // Time Tick for countdowns
  const [, setTimeTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setTimeTick((t) => t + 1), 60000);
    return () => clearInterval(timer);
  }, []);

  const currentUsername = user?.username || "demo_buyer";

  // Filter auctions where this user has placed a bid
  const myBiddedAuctions = products.filter((p) => {
    if (p.listingType !== "auction" || !p.bids) return false;
    return p.bids.some((b) => b.bidderName === currentUsername);
  });

  const getStatusBadge = (status: string) => {
    const styles = {
      completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      in_transit: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      pending_payment: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      processing: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };

    const icons = {
      completed: <CheckCircle size={14} />,
      in_transit: <Truck size={14} />,
      pending_payment: <Clock size={14} />,
      processing: <Package size={14} />,
      cancelled: <AlertCircle size={14} />,
    };

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
        {icons[status as keyof typeof icons]}
        {status.replace("_", " ")}
      </span>
    );
  };

  const getAuctionBidStatusBadge = (product: typeof products[number]) => {
    const isEnded = product.isClosed || (product.auctionEnd && new Date(product.auctionEnd) < new Date());
    
    // Check if user is the highest bidder
    const isHighest = product.bids && product.bids.length > 0 && product.bids[0].bidderName === currentUsername;

    if (isEnded) {
      if (isHighest) {
        return (
          <span className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 text-xs font-extrabold px-2.5 py-1 rounded-full">
            🏆 Won
          </span>
        );
      } else {
        return (
          <span className="bg-slate-100 text-slate-800 dark:bg-gray-800 dark:text-gray-400 text-xs font-extrabold px-2.5 py-1 rounded-full">
            Ended
          </span>
        );
      }
    }

    if (isHighest) {
      return (
        <span className="bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 text-xs font-extrabold px-2.5 py-1 rounded-full animate-pulse">
          🟢 Highest Bidder
        </span>
      );
    } else {
      return (
        <span className="bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 text-xs font-extrabold px-2.5 py-1 rounded-full">
          🔴 Outbid
        </span>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Buyer Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1.5 text-sm font-medium">
            Monitor your purchase status, check active bids, and manage won agricultural lots.
          </p>
        </div>

        {/* Dashboard Tabs */}
        <div className="flex gap-4 border-b border-slate-200 dark:border-gray-800 mb-6 font-semibold text-sm">
          <button
            onClick={() => setActiveTab("purchases")}
            className={`pb-3 border-b-2 px-2 transition-all flex items-center gap-1.5 ${
              activeTab === "purchases"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <ShoppingBag size={15} /> Purchases ({orders.length})
          </button>
          
          <button
            onClick={() => setActiveTab("bids")}
            className={`pb-3 border-b-2 px-2 transition-all flex items-center gap-1.5 ${
              activeTab === "bids"
                ? "border-green-600 text-green-600"
                : "border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            <Gavel size={15} /> Bids & Auctions ({myBiddedAuctions.length})
          </button>
        </div>

        {/* Purchases Tab Content */}
        {activeTab === "purchases" && (
          <div className="space-y-4 animate-fade-in">
            {loadError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300">{loadError}</p>}
            {orders.length === 0 ? (
              <Card className="p-12 text-center border border-slate-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm">
                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                <h3 className="text-base font-extrabold mb-1">No orders yet</h3>
                <p className="text-xs text-slate-400 mb-6">When you buy an item, it will appear here.</p>
                <Link to="/app/marketplace">
                  <Button size="sm">Start Shopping</Button>
                </Link>
              </Card>
            ) : (
              orders.map((order) => (
                <Card
                  key={order.id}
                  className="p-5 hover:shadow-lg transition-all duration-200 border border-slate-100 dark:border-gray-850 bg-white dark:bg-gray-900 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
                          Order #{order.id}
                        </h3>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-xs text-slate-400 font-semibold">
                        Placed on {new Date(order.created_at).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-slate-500 font-bold mt-1">
                        {order.items_count} item{order.items_count !== 1 ? "s" : ""}
                      </p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-lg font-black text-green-600 dark:text-green-400">
                          MWK {order.total.toLocaleString()}
                        </p>
                      </div>
                      <Link to={`/app/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="font-bold">
                          View Details
                        </Button>
                      </Link>
                      <Link to={`/app/orders/${order.id}/delivery`}>
                        <Button variant="outline" size="sm" className="font-bold">Delivery</Button>
                      </Link>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Bidding Hub Tab Content */}
        {activeTab === "bids" && (
          <div className="space-y-4 animate-fade-in">
            {myBiddedAuctions.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-slate-200/50 dark:border-gray-800 rounded-2xl bg-white dark:bg-gray-900">
                <Gavel className="mx-auto text-slate-300 mb-3" size={48} />
                <h3 className="text-base font-extrabold text-slate-800 dark:text-white">No active bids</h3>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">You haven't placed bids on any auctions. Bid on farm equipment or produce to watch them here.</p>
                <Link to="/app/marketplace" className="mt-4 inline-block">
                  <Button size="sm">Browse Bidding Auctions</Button>
                </Link>
              </div>
            ) : (
              myBiddedAuctions.map((product) => {
                const userBid = product.bids?.find((b) => b.bidderName === currentUsername)?.amount || 0;
                const isWinner = product.bids && product.bids.length > 0 && product.bids[0].bidderName === currentUsername;
                const isEnded = product.isClosed || (product.auctionEnd && new Date(product.auctionEnd) < new Date());
                
                return (
                  <Card
                    key={product.id}
                    className="p-5 hover:shadow-lg transition-all duration-200 border border-slate-100 dark:border-gray-850 bg-white dark:bg-gray-900 shadow-sm flex flex-col sm:flex-row gap-5"
                  >
                    <div className="flex-shrink-0">
                      <img src={product.image} alt={product.name} className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl border border-slate-100 dark:border-gray-800" />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                          <div>
                            <Link to={`/app/marketplace/product/${product.id}`} className="block text-lg font-extrabold hover:text-green-700 dark:text-white">
                              {product.name}
                            </Link>
                            <p className="text-xs text-slate-400 font-semibold mt-1">Sold by: <strong>{product.farmer}</strong></p>
                          </div>
                          
                          <div className="flex flex-row sm:flex-col gap-3 sm:gap-0 sm:text-right items-center sm:items-end">
                            {getAuctionBidStatusBadge(product)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 pt-3 border-t border-slate-50 dark:border-gray-850 justify-between items-center text-xs font-bold text-slate-500">
                        <div className="flex gap-4">
                          <div>
                            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Your Highest Bid</span>
                            <span className="text-slate-900 dark:text-slate-100">MWK {userBid.toLocaleString()}</span>
                          </div>
                          <div className="border-l pl-4 border-slate-100 dark:border-gray-850">
                            <span className="text-slate-400 block text-[9px] uppercase tracking-wider">Current Lot Bid</span>
                            <span className="text-blue-600 dark:text-blue-400 font-extrabold">MWK {(product.currentBid || product.price).toLocaleString()}</span>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Link to={`/app/marketplace/product/${product.id}`}>
                            <Button variant="outline" size="sm" className="font-bold flex items-center gap-1">
                              <Eye size={13} /> View Auction
                            </Button>
                          </Link>
                          
                          {isEnded && isWinner && (
                            <Link to={`/app/marketplace/checkout?checkout_auction=${product.id}`}>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white font-bold">
                                Pay Now
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })
            )}
          </div>
        )}

      </div>
    </div>
  );
}
