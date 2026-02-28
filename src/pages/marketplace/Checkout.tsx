// src/pages/marketplace/Checkout.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import { Truck, CreditCard, Phone } from "lucide-react";

export default function Checkout() {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setPaying(true);
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      setTimeout(() => setPaid(false), 5000);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Truck className="text-green-600" />
                Delivery Address
              </h2>
              <div className="space-y-3 text-gray-700 dark:text-gray-300">
                <p><strong>Clement</strong></p>
                <p>Area 18, Lilongwe</p>
                <p>Phone: +265 999 123 456</p>
                <Link to="/profile/edit" className="text-green-700 dark:text-green-400 text-sm hover:underline">
                  Change address
                </Link>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <CreditCard className="text-green-600" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-green-500">
                  <input type="radio" name="payment" defaultChecked className="text-green-600" />
                  <Phone size={20} className="text-green-600" />
                  <div>
                    <div className="font-medium">Airtel Money</div>
                    <div className="text-sm text-gray-500">+265 999 123 456</div>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:border-green-500">
                  <input type="radio" name="payment" className="text-green-600" />
                  <Phone size={20} className="text-blue-600" />
                  <div>
                    <div className="font-medium">TNM Mpamba</div>
                    <div className="text-sm text-gray-500">Instant payment</div>
                  </div>
                </label>
              </div>
            </Card>
          </div>

          <div>
            <Card className="p-6 sticky top-24">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span>Fresh Maize (50kg bag) × 2</span>
                  <span>MWK 57,000</span>
                </div>
                <div className="flex justify-between">
                  <span>Tomatoes (10kg crate) × 1</span>
                  <span>MWK 15,000</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-green-700 dark:text-green-500">MWK 72,000</span>
                  </div>
                </div>
              </div>

              {paid ? (
                <div className="text-center py-8">
                  <div className="text-green-600 text-6xl mb-4">✓</div>
                  <h3 className="text-2xl font-bold mb-2">Payment Successful!</h3>
                  <p className="text-gray-600 dark:text-gray-400">Your order has been placed.</p>
                  <Link to="/app/orders" className="mt-6 inline-block">
                    <Button>View Orders</Button>
                  </Link>
                </div>
              ) : (
                <Button
                  onClick={handlePay}
                  size="lg"
                  className="w-full"
                  disabled={paying}
                >
                  {paying ? "Processing Payment..." : "Pay MWK 72,000"}
                </Button>
              )}

              <p className="text-xs text-gray-500 text-center mt-4">
                You will receive a payment request on your phone
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}