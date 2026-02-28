import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Search, Filter, SlidersHorizontal, X } from "lucide-react";

const mockProducts = [
  { id: 1, name: "Maize (Grade A)", farmer: "John Phiri", location: "Lilongwe", price: 28000, quantity: "50kg", organic: true },
  { id: 2, name: "Fresh Tomatoes", farmer: "Mary Banda", location: "Mzuzu", price: 4500, quantity: "120kg", organic: false },
  { id: 3, name: "Groundnuts", farmer: "Peter Mwale", location: "Blantyre", price: 15000, quantity: "80kg", organic: true },
];

export default function AdvancedSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    crop: "",
    location: "",
    priceMin: "",
    priceMax: "",
    organic: false,
  });

  const filteredProducts = mockProducts.filter(p => {
    const matchesQuery = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCrop = !filters.crop || p.name.toLowerCase().includes(filters.crop.toLowerCase());
    const matchesLocation = !filters.location || p.location.toLowerCase().includes(filters.location.toLowerCase());
    const matchesPrice = 
      (!filters.priceMin || p.price >= Number(filters.priceMin)) &&
      (!filters.priceMax || p.price <= Number(filters.priceMax));
    const matchesOrganic = !filters.organic || p.organic;

    return matchesQuery && matchesCrop && matchesLocation && matchesPrice && matchesOrganic;
  });

  const resetFilters = () => setFilters({ crop: "", location: "", priceMin: "", priceMax: "", organic: false });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <Link
            to="/app/marketplace"
            className="text-green-600 dark:text-green-400 hover:underline flex items-center gap-2 mb-4"
          >
            ← Back to Marketplace
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Search className="text-green-600" size={32} /> Advanced Search
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Find exactly what you need with powerful filters
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <Card className="p-6 lg:col-span-1 h-fit sticky top-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <SlidersHorizontal size={20} /> Filters
              </h2>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Crop Type</label>
                <input
                  type="text"
                  value={filters.crop}
                  onChange={e => setFilters({ ...filters, crop: e.target.value })}
                  placeholder="e.g. Maize"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={filters.location}
                  onChange={e => setFilters({ ...filters, location: e.target.value })}
                  placeholder="e.g. Lilongwe"
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Price Range (MWK)</label>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    value={filters.priceMin}
                    onChange={e => setFilters({ ...filters, priceMin: e.target.value })}
                    placeholder="Min"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                  <input
                    type="number"
                    value={filters.priceMax}
                    onChange={e => setFilters({ ...filters, priceMax: e.target.value })}
                    placeholder="Max"
                    className="w-full px-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={filters.organic}
                  onChange={e => setFilters({ ...filters, organic: e.target.checked })}
                  className="h-5 w-5 text-green-600 rounded"
                />
                <label className="text-sm font-medium">Organic Certified Only</label>
              </div>
            </div>
          </Card>

          {/* Results */}
          <div className="lg:col-span-3 space-y-6">
            <Card className="p-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 border rounded-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:ring-2 focus:ring-green-500"
                />
              </div>
            </Card>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                No products match your filters. Try adjusting them.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProducts.map(product => (
                  <motion.div key={product.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <Card className="p-6 hover:shadow-lg transition-shadow">
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        By {product.farmer} • {product.location}
                      </p>
                      <div className="mt-4 flex justify-between items-end">
                        <div>
                          <p className="text-2xl font-bold text-green-600">
                            MWK {product.price.toLocaleString()}
                          </p>
                          <p className="text-sm text-gray-500">per {product.quantity}</p>
                        </div>
                        {product.organic && (
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-3 py-1 rounded-full">
                            Organic
                          </span>
                        )}
                      </div>
                      <Button variant="outline" className="w-full mt-4">
                        View Details
                      </Button>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}