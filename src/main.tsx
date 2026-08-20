import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import { applyTheme, getTheme } from "./lib/theme";

import "./i18n/config"; // Import to init

applyTheme(getTheme());

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => void navigator.serviceWorker.register("/sw.js"));
}

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <MarketplaceProvider>
        <CartProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </MarketplaceProvider>
    </AuthProvider>
  </React.StrictMode>
);
