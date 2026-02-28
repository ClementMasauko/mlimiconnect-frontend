// src/pages/marketplace/Cart.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Trash2, Plus, Minus } from "lucide-react";

const mockCart = {
  items: [
    { id: 1, product: { id: 1, name: "Fresh Maize (50kg bag)", price: 28500 }, qty: 2 },
    { id: 3, product: { id: 3, name: "Tomatoes (10kg crate)", price: 15000 }, qty: 1 },
  ],
  subtotal: 72000,
};

export default function Cart() {
  const [cart, setCart] = useState(mockCart);
  const [removed, setRemoved] = useState<number | null>(null);

  const updateQty = (id: number, change: number) => {
    setCart(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.product.id === id ? { ...item, qty: Math.max(1, item.qty + change) } : item
      ),
      subtotal: prev.subtotal + change * prev.items.find(i => i.product.id === id)!.product.price
    }));
  };

  const removeItem = (id: number) => {
    setRemoved(id);
    setTimeout(() => {
      setCart(prev => ({
        ...prev,
        items: prev.items.filter(item => item.product.id !== id),
        subtotal: prev.subtotal - prev.items.find(i => i.product.id === id)!.product.price * prev.items.find(i => i.product.id === id)!.qty
      }));
      setRemoved(null);
    }, 300);
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <Card className="p-12">
            <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">Start shopping and add some fresh produce!</p>
            <Link to="/app/marketplace">
              <Button size="lg">Browse Products</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <Card key={item.product.id} className={`flex items-center gap-4 p-4 transition-all ${removed === item.product.id ? 'opacity-0 scale-95' : ''}`}>
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-20 h-20 flex-shrink-0" />
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.product.name}</h3>
                  <p className="text-green-700 dark:text-green-500 font-medium">
                    MWK {item.product.price.toLocaleString()} each
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => updateQty(item.product.id, -1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Minus size={18} />
                  </button>
                  <span className="font-medium w-8 text-center">{item.qty}</span>
                  <button onClick={() => updateQty(item.product.id, 1)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                    <Plus size={18} />
                  </button>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">MWK {(item.qty * item.product.price).toLocaleString()}</p>
                </div>
                <button
                  onClick={() => removeItem(item.product.id)}
                  className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </Card>
            ))}
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">MWK {cart.subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery</span>
                  <span className="text-sm text-gray-500">To be calculated</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-green-700 dark:text-green-500">MWK {cart.subtotal.toLocaleString()}</span>
                  </div>
                </div>
                <Link to="/app/marketplace/checkout" className="block">
                  <Button size="lg" className="w-full mt-4">Proceed to Checkout</Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}