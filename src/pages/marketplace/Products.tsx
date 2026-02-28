// src/pages/marketplace/Products.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Package, MapPin } from "lucide-react";


// Update in Products.tsx (add to top)
import AdvancedSearch from "./AdvancedSearch"; // if separate, or inline filters

// In return, before grid:
<div className="mb-8">
  <AdvancedSearch /> // Or inline search + filters here
</div>

const mockProducts = [
  { id: 1, name: "Fresh Maize (50kg bag)", price: 28500, farmer: "John Phiri", location: "Lilongwe", image: "https://images.unsplash.com/photo-1627920748119-7f6d4e73d961?w=400&h=300&fit=crop" },
  { id: 2, name: "Groundnuts (20kg)", price: 42000, farmer: "Mary Banda", location: "Kasungu", image: "https://images.unsplash.com/photo-1574323347407-8b21d98f4e84?w=400&h=300&fit=crop" },
  { id: 3, name: "Tomatoes (10kg crate)", price: 15000, farmer: "Peter Moyo", location: "Zomba", image: "https://images.unsplash.com/photo-1561136594-7f684b9e67b0?w=400&h=300&fit=crop" },
  { id: 4, name: "Soybeans (50kg)", price: 58000, farmer: "Grace Nkhoma", location: "Mzuzu", image: "https://images.unsplash.com/photo-1625246332058-6e9e9d307a1b?w=400&h=300&fit=crop" },
  { id: 5, name: "Irish Potatoes (20kg)", price: 22000, farmer: "James Chisi", location: "Dedza", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400&h=300&fit=crop" },
  { id: 6, name: "Rice (25kg)", price: 38000, farmer: "Fatima Ali", location: "Salima", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=300&fit=crop" },
];

export default function Products() {
  const [cartMessage, setCartMessage] = useState("");

  const addToCart = (name: string) => {
    setCartMessage(`${name} added to cart!`);
    setTimeout(() => setCartMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Marketplace</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">Buy directly from Malawian farmers</p>
        </div>

        {cartMessage && (
          <div className="fixed top-20 right-8 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse">
            {cartMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockProducts.map((p) => (
            <Card key={p.id} className="overflow-hidden hover:shadow-xl transition-shadow">
              <Link to={`/app/marketplace/product/${p.id}`}>
                <img src={p.image} alt={p.name} className="w-full h-48 object-cover" />
              </Link>
              <div className="p-5">
                <Link to={`/app/marketplace/product/${p.id}`} className="block">
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white hover:text-green-700 dark:hover:text-green-400">
                    {p.name}
                  </h3>
                </Link>
                <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400 mt-1">
                  <MapPin size={14} />
                  <span>{p.farmer} • {p.location}</span>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-2xl font-bold text-green-700 dark:text-green-500">
                    MWK {p.price.toLocaleString()}
                  </div>
                  <Button onClick={() => addToCart(p.name)} size="sm">
                    Add to Cart
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}