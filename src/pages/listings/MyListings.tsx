// src/pages/listings/MyListings.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Edit, Trash2, Eye, Package, PlusCircle } from "lucide-react";

// Mock listings data (farmer's own products)
const mockListings = [
  {
    id: 101,
    name: "Fresh Maize (50kg bag)",
    price: 28500,
    quantity: 48,
    status: "active",
    views: 124,
    created_at: "2025-02-05",
    image: "https://images.unsplash.com/photo-1627920748119-7f6d4e73d961?w=400&h=300&fit=crop",
  },
  {
    id: 102,
    name: "Groundnuts (20kg)",
    price: 42000,
    quantity: 15,
    status: "active",
    views: 87,
    created_at: "2025-02-03",
    image: "https://images.unsplash.com/photo-1574323347407-8b21d98f4e84?w=400&h=300&fit=crop",
  },
  {
    id: 103,
    name: "Tomatoes (10kg crate)",
    price: 15000,
    quantity: 0,
    status: "out_of_stock",
    views: 210,
    created_at: "2025-01-28",
    image: "https://images.unsplash.com/photo-1561136594-7f684b9e67b0?w=400&h=300&fit=crop",
  },
];

export default function MyListings() {
  const [listings] = useState(mockListings);

  const getStatusBadge = (status: string) => {
    const styles = {
      active: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      out_of_stock: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    };

    return (
      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800"}`}>
        {status.replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Listings</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage the products you're selling</p>
          </div>
          <Link to="/app/listings/new">
            <Button variant="primary" size="lg" className="flex items-center gap-2">
              <PlusCircle size={18} /> Create New Listing
            </Button>
          </Link>
        </div>

        {listings.length === 0 ? (
          <Card className="p-12 text-center">
            <Package className="mx-auto text-gray-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold mb-3">No listings yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start selling by creating your first product listing.
            </p>
            <Link to="/app/listings/new">
              <Button size="lg">Add Your First Product</Button>
            </Link>
          </Card>
        ) : (
          <div className="space-y-5">
            {listings.map((listing) => (
              <Card key={listing.id} className="p-5 hover:shadow-lg transition-shadow">
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link to={`/app/marketplace/product/${listing.id}`} className="flex-shrink-0">
                    <img
                      src={listing.image}
                      alt={listing.name}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </Link>

                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <Link
                          to={`/app/marketplace/product/${listing.id}`}
                          className="block text-xl font-semibold hover:text-green-700 dark:hover:text-green-400"
                        >
                          {listing.name}
                        </Link>
                        <div className="flex items-center gap-3 mt-2">
                          {getStatusBadge(listing.status)}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {listing.quantity} in stock
                          </span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-700 dark:text-green-500">
                          MWK {listing.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          {listing.views} views
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link to={`/app/listings/${listing.id}/edit`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                          <Edit size={14} /> Edit
                        </Button>
                      </Link>
                      <Button variant="outline" size="sm" className="flex items-center gap-1.5 text-red-600 hover:text-red-700">
                        <Trash2 size={14} /> Remove
                      </Button>
                      <Link to={`/app/marketplace/product/${listing.id}`}>
                        <Button variant="outline" size="sm" className="flex items-center gap-1.5">
                          <Eye size={14} /> View in Marketplace
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}