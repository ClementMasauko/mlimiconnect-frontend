// src/context/MarketplaceContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

export interface Bid {
  id: string;
  bidderName: string;
  amount: number;
  timestamp: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  timestamp: string;
  productName: string;
  farmerName: string;
}

export interface Product {
  id: number;
  name: string;
  price: number; // For Fixed Price, or Starting Price for Auction
  description: string;
  farmer: string;
  location: string;
  rating: number;
  reviewsCount: number;
  stock: number;
  image: string;
  tag: string;
  category: string;
  
  // eBay-Style Bidding / Auction Fields
  listingType: "fixed-price" | "auction" | "both";
  currentBid?: number;
  bidsCount?: number;
  auctionEnd?: string; // ISO string
  reservePrice?: number;
  bids?: Bid[];
  isClosed?: boolean;
  winner?: string;
  condition?: "new" | "used-excellent" | "used-good" | "used-fair";
}

export interface FarmerProfile {
  name: string;
  avatar?: string;
  location: string;
  memberSince: string;
  about: string;
  specialties: string[];
  isVerified: boolean;
  isTopRated: boolean;
  shippingRating: number;      // 1-5 scale
  communicationRating: number; // 1-5 scale
  accuracyRating: number;      // 1-5 scale
}

interface MarketplaceContextValue {
  products: Product[];
  listingsLoading: boolean;
  hasMoreListings: boolean;
  loadMoreListings: () => Promise<void>;
  reviews: Review[];
  farmers: Record<string, FarmerProfile>;
  addBid: (productId: number, bidderName: string, amount: number) => { success: boolean; error?: string };
  addReview: (productId: number, review: Omit<Review, "id" | "timestamp" | "productName" | "farmerName">) => void;
  addListing: (newProduct: Omit<Product, "id" | "rating" | "reviewsCount" | "bids" | "bidsCount" | "currentBid" | "isClosed">) => Product;
  getSellerStats: (farmerName: string) => { positivePercentage: number; totalReviews: number; averageRating: number };
  getFarmerReviews: (farmerName: string) => Review[];
}

const MarketplaceContext = createContext<MarketplaceContextValue | undefined>(undefined);
const MARKETPLACE_STORAGE_KEY = "mc_marketplace_products";
const REVIEWS_STORAGE_KEY = "mc_marketplace_reviews";
const demoDataEnabled = import.meta.env.VITE_DEMO_DATA_ENABLED === "true";
const normalizeProducts = (items: Array<Product & { price: string | number }>) => items.map(product => ({ ...product, price: Number(product.price), image: product.image || "/logo.png" }));

// Default Initial Farmers
const DEFAULT_FARMERS: Record<string, FarmerProfile> = {
  "John Phiri": {
    name: "John Phiri",
    location: "Lilongwe",
    memberSince: "May 2022",
    about: "John is a multi-generational farmer specializing in sustainable grain production and certified crop seeds. He operates a 15-hectare farm in Lilongwe utilizing solar-powered irrigation.",
    specialties: ["Maize", "Soybeans", "Grains"],
    isVerified: true,
    isTopRated: true,
    shippingRating: 4.9,
    communicationRating: 4.8,
    accuracyRating: 5.0,
  },
  "Mary Banda": {
    name: "Mary Banda",
    location: "Kasungu",
    memberSince: "Oct 2023",
    about: "Mary operates Banda Legacy Farms, focusing on top-tier high-protein groundnuts and legume varieties. Committed to organic composting and eco-friendly packaging.",
    specialties: ["Groundnuts", "Legumes", "Organic Produce"],
    isVerified: true,
    isTopRated: true,
    shippingRating: 4.7,
    communicationRating: 4.9,
    accuracyRating: 4.8,
  },
  "Peter Moyo": {
    name: "Peter Moyo",
    location: "Zomba",
    memberSince: "Jan 2024",
    about: "Moyo Fresh Farm delivers vine-ripened tomatoes and greenhouse vegetables. Known for extremely fast same-day regional logistics and cold-chain distribution.",
    specialties: ["Tomatoes", "Vegetables", "Greenhouse Farming"],
    isVerified: true,
    isTopRated: false,
    shippingRating: 4.5,
    communicationRating: 4.6,
    accuracyRating: 4.7,
  },
  "Grace Nkhoma": {
    name: "Grace Nkhoma",
    location: "Mzuzu",
    memberSince: "Aug 2021",
    about: "Grace runs Mzuzu Highlands Agricultural Co-op, specializing in wholesale clean soybeans and premium high-altitude beans. Recipient of Malawian Farmer of the Year awards.",
    specialties: ["Soybeans", "Dry Beans", "High-altitude Seeds"],
    isVerified: true,
    isTopRated: true,
    shippingRating: 5.0,
    communicationRating: 5.0,
    accuracyRating: 5.0,
  },
  "James Chisi": {
    name: "James Chisi",
    location: "Dedza",
    memberSince: "Mar 2022",
    about: "Dedza Potato Gardens is the leading producer of Irish Potatoes. James focuses on nutrient-dense root crops, utilizing biological pest control and strict quality testing.",
    specialties: ["Irish Potatoes", "Root Crops", "Seeds"],
    isVerified: false,
    isTopRated: false,
    shippingRating: 4.6,
    communicationRating: 4.7,
    accuracyRating: 4.8,
  },
  "Fatima Ali": {
    name: "Fatima Ali",
    location: "Salima",
    memberSince: "Nov 2022",
    about: "Salima Valley Rice Growers offers high-aromatic Kilombero and superfine rice grades. Fatima coordinates local smallholder partnerships to ensure clean milling.",
    specialties: ["Aromatic Rice", "Cereals"],
    isVerified: true,
    isTopRated: true,
    shippingRating: 4.8,
    communicationRating: 4.8,
    accuracyRating: 4.9,
  }
};

// Default Initial Products (including Auctions!)
const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Fresh Maize, Grade A",
    price: 28500,
    description: "High-quality yellow maize harvested this week. Carefully sorted, clean and ready for household or commercial use. Guaranteed premium moisture content below 12.5%.",
    farmer: "John Phiri",
    location: "Lilongwe",
    rating: 4.8,
    reviewsCount: 3,
    stock: 48,
    image: "https://images.unsplash.com/photo-1627920748119-7f6d4e73d961?w=700&h=500&fit=crop",
    tag: "Popular",
    category: "produce",
    listingType: "fixed-price",
    condition: "new"
  },
  {
    id: 2,
    name: "Premium Groundnuts",
    price: 42000,
    description: "Extra large premium Malawian groundnuts, shelled and hand-sorted. Ideal for roasting, oil pressing, or wholesale seed stocking. Stored in high-grade breathable sacks.",
    farmer: "Mary Banda",
    location: "Kasungu",
    rating: 4.8,
    reviewsCount: 2,
    stock: 20,
    image: "https://images.unsplash.com/photo-1574323347407-8b21d98f4e84?w=700&h=500&fit=crop",
    tag: "Verified farm",
    category: "produce",
    listingType: "fixed-price",
    condition: "new"
  },
  {
    id: 3,
    name: "Vine-ripened Tomatoes",
    price: 15000,
    description: "Juicy, firm, vine-ripened tomatoes. Handpicked at sunrise and dispatched on the same day in durable ventilated crates. Best quality in the region.",
    farmer: "Peter Moyo",
    location: "Zomba",
    rating: 4.7,
    reviewsCount: 1,
    stock: 15,
    image: "https://images.unsplash.com/photo-1561136594-7f684b9e67b0?w=700&h=500&fit=crop",
    tag: "Fresh today",
    category: "produce",
    listingType: "fixed-price",
    condition: "new"
  },
  {
    id: 4,
    name: "Clean Soybeans",
    price: 58000,
    description: "Cleaned, polished, and moisture-controlled soybeans. Ideal for industrial oil milling or high-protein feed formulation. Certified non-GMO product.",
    farmer: "Grace Nkhoma",
    location: "Mzuzu",
    rating: 5.0,
    reviewsCount: 2,
    stock: 60,
    image: "https://images.unsplash.com/photo-1625246332058-6e9e9d307a1b?w=700&h=500&fit=crop",
    tag: "Top rated",
    category: "produce",
    listingType: "fixed-price",
    condition: "new"
  },
  // ── AUCTION PRODUCT 1 ──
  {
    id: 5,
    name: "Vintage Massey Ferguson 135 Tractor",
    price: 4500000, // Starting price
    description: "Classic Massey Ferguson 135 utility tractor. Fully operational, meticulously serviced engine, excellent tire treads. Ideal for small-to-medium farm operations. High power-to-weight ratio and simple mechanical maintenance. Solid dual-clutch transmission.",
    farmer: "James Chisi",
    location: "Dedza",
    rating: 4.8,
    reviewsCount: 2,
    stock: 1,
    image: "https://images.unsplash.com/photo-1595914193075-85d013f39a48?w=700&h=500&fit=crop",
    tag: "Auction",
    category: "equipment",
    listingType: "auction",
    condition: "used-excellent",
    currentBid: 4850000,
    bidsCount: 4,
    auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3).toISOString(), // 3 days from now
    bids: [
      { id: "b1", bidderName: "farmer_brian", amount: 4600000, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
      { id: "b2", bidderName: "lilo_foods", amount: 4700000, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
      { id: "b3", bidderName: "mw_agri_corp", amount: 4800000, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() },
      { id: "b4", bidderName: "demo_buyer", amount: 4850000, timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString() }
    ]
  },
  // ── AUCTION PRODUCT 2 ──
  {
    id: 6,
    name: "High-Capacity Solar Irrigation Pump Set",
    price: 350000, // Starting price
    description: "Eco-friendly solar-powered submersible water pump kit. Includes 300W monocrystalline panels, digital pump controller, 50m heavy-duty hose, and premium accessories. Capable of pumping 5,000 liters per hour with up to 40m total dynamic head.",
    farmer: "John Phiri",
    location: "Lilongwe",
    rating: 4.9,
    reviewsCount: 4,
    stock: 1,
    image: "https://images.unsplash.com/photo-1508962914676-134849a727f0?w=700&h=500&fit=crop",
    tag: "Hot Bid",
    category: "equipment",
    listingType: "auction",
    condition: "new",
    currentBid: 390000,
    bidsCount: 3,
    auctionEnd: new Date(Date.now() + 1000 * 60 * 60 * 18).toISOString(), // 18 hours from now
    bids: [
      { id: "b5", bidderName: "green_valley", amount: 360000, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString() },
      { id: "b6", bidderName: "mzuzu_gardener", amount: 380000, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString() },
      { id: "b7", bidderName: "kasungu_coop", amount: 390000, timestamp: new Date(Date.now() - 1000 * 60 * 10).toISOString() }
    ]
  },
  // ── AUCTION PRODUCT 3 (Closed) ──
  {
    id: 7,
    name: "Bulk High-Grade Soya Feed (10 Tons)",
    price: 1200000, // Starting price
    description: "Premium soybean meal/cake for livestock feed formulation. Professionally crushed and heat-treated to ensure maximum protein digestibility of 46%+. Handled in sterile environments.",
    farmer: "Grace Nkhoma",
    location: "Mzuzu",
    rating: 5.0,
    reviewsCount: 1,
    stock: 1,
    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?w=700&h=500&fit=crop",
    tag: "Ended",
    category: "produce",
    listingType: "auction",
    condition: "new",
    currentBid: 1450000,
    bidsCount: 2,
    auctionEnd: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Ended 2 hours ago
    isClosed: true,
    winner: "lilo_foods",
    bids: [
      { id: "b8", bidderName: "kasungu_coop", amount: 1300000, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString() },
      { id: "b9", bidderName: "lilo_foods", amount: 1450000, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString() }
    ]
  },
  {
    id: 8,
    name: "Irish Potatoes",
    price: 22000,
    description: "Crisp and earthy Irish potatoes harvested from high altitude fields of Dedza. Highly rated for starch texture, perfect for table consumption and seed breeding.",
    farmer: "James Chisi",
    location: "Dedza",
    rating: 4.8,
    reviewsCount: 1,
    stock: 35,
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=700&h=500&fit=crop",
    tag: "In season",
    category: "produce",
    listingType: "fixed-price",
    condition: "new"
  },
  {
    id: 9,
    name: "Aromatic Rice",
    price: 38000,
    description: "Pure Kilombero aromatic rice from the Salima river plains. High swelling capacity, fluffy structure, and delicious natural scent. Double milled and polished.",
    farmer: "Fatima Ali",
    location: "Salima",
    rating: 4.9,
    reviewsCount: 2,
    stock: 40,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=700&h=500&fit=crop",
    tag: "Verified farm",
    category: "produce",
    listingType: "fixed-price",
    condition: "new"
  }
];

const DEFAULT_REVIEWS: Review[] = [
  { id: "r1", reviewerName: "lilo_foods", rating: 5, comment: "Outstanding grade of maize! Zero foreign matter, perfect dryness. Prompt shipping.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), productName: "Fresh Maize, Grade A", farmerName: "John Phiri" },
  { id: "r2", reviewerName: "buyer_chiza", rating: 4, comment: "Decent maize bags. Very friendly communication from Phiri.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(), productName: "Fresh Maize, Grade A", farmerName: "John Phiri" },
  { id: "r3", reviewerName: "mw_agri_corp", rating: 5, comment: "Extremely reliable groundnuts. Best peanut butter production yield we've had.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(), productName: "Premium Groundnuts", farmerName: "Mary Banda" },
  { id: "r4", reviewerName: "seed_grower_mw", rating: 5, comment: "Very high germination rating on these soybeans. Highly recommended.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), productName: "Clean Soybeans", farmerName: "Grace Nkhoma" },
  { id: "r5", reviewerName: "blantyre_grocer", rating: 4, comment: "Fresh and flavorful tomatoes, arrived on time in clean crates. Minor bruising on a few.", timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), productName: "Vine-ripened Tomatoes", farmerName: "Peter Moyo" }
];

export const MarketplaceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(MARKETPLACE_STORAGE_KEY);
      return demoDataEnabled ? (saved ? JSON.parse(saved) : DEFAULT_PRODUCTS) : [];
    } catch {
      return demoDataEnabled ? DEFAULT_PRODUCTS : [];
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return demoDataEnabled ? (saved ? JSON.parse(saved) : DEFAULT_REVIEWS) : [];
    } catch {
      return demoDataEnabled ? DEFAULT_REVIEWS : [];
    }
  });

  const [farmers, setFarmers] = useState<Record<string, FarmerProfile>>(DEFAULT_FARMERS);
  const [listingsLoading, setListingsLoading] = useState(!demoDataEnabled);
  const [nextListingsUrl, setNextListingsUrl] = useState<string | null>(null);

  useEffect(() => {
    if (demoDataEnabled) return;
    setListingsLoading(true);
    api.get<Array<Product & { price: string | number }> | { results: Array<Product & { price: string | number }>; next: string | null }>("/api/marketplace/public-listings/", { params: { page_size: 24 } })
      .then(({ data }) => { if (Array.isArray(data)) { setProducts(normalizeProducts(data)); setNextListingsUrl(null); } else { setProducts(normalizeProducts(data.results)); setNextListingsUrl(data.next); } })
      .catch(() => setProducts([]))
      .finally(() => setListingsLoading(false));
  }, []);

  const loadMoreListings = async () => {
    if (!nextListingsUrl || listingsLoading) return;
    setListingsLoading(true);
    try {
      const { data } = await api.get<{ results: Array<Product & { price: string | number }>; next: string | null }>(nextListingsUrl);
      setProducts(current => { const known = new Set(current.map(item => item.id)); return [...current, ...normalizeProducts(data.results).filter(item => !known.has(item.id))]; });
      setNextListingsUrl(data.next);
    } finally { setListingsLoading(false); }
  };

  // Sync to local storage
  useEffect(() => {
    if (demoDataEnabled) localStorage.setItem(MARKETPLACE_STORAGE_KEY, JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    if (demoDataEnabled) localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
  }, [reviews]);

  // Place a Bid on an Auction Item
  const addBid = (productId: number, bidderName: string, amount: number) => {
    let success = false;
    let errorMsg = "";

    setProducts((currentProducts) => {
      return currentProducts.map((p) => {
        if (p.id !== productId) return p;
        if (p.listingType !== "auction") {
          errorMsg = "This is not an auction listing.";
          return p;
        }
        if (p.isClosed || (p.auctionEnd && new Date(p.auctionEnd) < new Date())) {
          errorMsg = "This auction has already ended.";
          return p;
        }

        const minNextBid = p.currentBid 
          ? p.currentBid + Math.max(500, Math.ceil(p.currentBid * 0.01)) // 1% minimum bid increment
          : p.price;

        if (amount < minNextBid) {
          errorMsg = `Your bid must be at least MWK ${minNextBid.toLocaleString()}`;
          return p;
        }

        success = true;
        const newBid: Bid = {
          id: `b_${Date.now()}`,
          bidderName,
          amount,
          timestamp: new Date().toISOString()
        };

        const updatedBids = [newBid, ...(p.bids || [])];
        return {
          ...p,
          currentBid: amount,
          bidsCount: (p.bidsCount || 0) + 1,
          bids: updatedBids,
          tag: "Hot Bid"
        };
      });
    });

    return { success, error: errorMsg || undefined };
  };

  // Add Product and Farmer review
  const addReview = (productId: number, newReview: Omit<Review, "id" | "timestamp" | "productName" | "farmerName">) => {
    const p = products.find((prod) => prod.id === productId);
    if (!p) return;

    const fullReview: Review = {
      ...newReview,
      id: `r_${Date.now()}`,
      timestamp: new Date().toISOString(),
      productName: p.name,
      farmerName: p.farmer
    };

    setReviews((current) => [fullReview, ...current]);

    // Update product overall rating
    setProducts((currentProducts) => {
      return currentProducts.map((prod) => {
        if (prod.id !== productId) return prod;
        const currentCount = prod.reviewsCount || 0;
        const currentRating = prod.rating || 5;
        const newCount = currentCount + 1;
        const newRating = parseFloat(((currentRating * currentCount + newReview.rating) / newCount).toFixed(1));
        return {
          ...prod,
          rating: newRating,
          reviewsCount: newCount
        };
      });
    });
  };

  // Add a new Listing from Farmer
  const addListing = (newProduct: Omit<Product, "id" | "rating" | "reviewsCount" | "bids" | "bidsCount" | "currentBid" | "isClosed">) => {
    const nextId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    
    // Set up bidding fields if it's an auction
    const hasAuction = newProduct.listingType === "auction";
    const createdProduct: Product = {
      ...newProduct,
      id: nextId,
      rating: 5.0,
      reviewsCount: 0,
      bidsCount: hasAuction ? 0 : undefined,
      currentBid: hasAuction ? newProduct.price : undefined,
      bids: hasAuction ? [] : undefined,
      isClosed: hasAuction ? false : undefined,
      tag: hasAuction ? "Auction" : "New"
    };

    setProducts((current) => [createdProduct, ...current]);

    // Add farmer to records if they don't exist
    if (!farmers[newProduct.farmer]) {
      setFarmers((currentFarmers) => ({
        ...currentFarmers,
        [newProduct.farmer]: {
          name: newProduct.farmer,
          location: newProduct.location,
          memberSince: "Just Joined",
          about: `Welcome to the official farmer profile of ${newProduct.farmer}. Contact me for bulk listings and specialized contracts.`,
          specialties: [newProduct.category],
          isVerified: false,
          isTopRated: false,
          shippingRating: 4.5,
          communicationRating: 4.5,
          accuracyRating: 4.5
        }
      }));
    }

    return createdProduct;
  };

  // Get Seller Performance Statistics
  const getSellerStats = (farmerName: string) => {
    const sellerReviews = reviews.filter((r) => r.farmerName === farmerName);
    const totalReviews = sellerReviews.length;
    
    if (totalReviews === 0) {
      return { positivePercentage: 100, totalReviews: 0, averageRating: 5.0 };
    }

    const positiveCount = sellerReviews.filter((r) => r.rating >= 4).length;
    const positivePercentage = Math.round((positiveCount / totalReviews) * 100);
    const sumRatings = sellerReviews.reduce((acc, r) => acc + r.rating, 0);
    const averageRating = parseFloat((sumRatings / totalReviews).toFixed(1));

    return { positivePercentage, totalReviews, averageRating };
  };

  // Get all reviews for a farmer
  const getFarmerReviews = (farmerName: string) => {
    return reviews.filter((r) => r.farmerName === farmerName);
  };

  const value = {
    products,
    listingsLoading,
    hasMoreListings: Boolean(nextListingsUrl),
    loadMoreListings,
    reviews,
    farmers,
    addBid,
    addReview,
    addListing,
    getSellerStats,
    getFarmerReviews
  };

  return <MarketplaceContext.Provider value={value}>{children}</MarketplaceContext.Provider>;
};

export const useMarketplace = () => {
  const context = useContext(MarketplaceContext);
  if (!context) {
    throw new Error("useMarketplace must be used within a MarketplaceProvider");
  }
  return context;
};
