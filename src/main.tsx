import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";
import "./index.css";
import { applyDataPreferences } from "./lib/lowData";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { MarketplaceProvider } from "./context/MarketplaceContext";
import { applyTheme, getTheme } from "./lib/theme";
import AppErrorBoundary from "./components/AppErrorBoundary";
import { initializeMonitoring } from "./lib/monitoring";
import ServiceWorkerUpdate from "./components/ServiceWorkerUpdate";

import "./i18n/config"; // Import to init

applyTheme(getTheme());
initializeMonitoring();
applyDataPreferences();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <ServiceWorkerUpdate />
      <AuthProvider>
        <MarketplaceProvider>
          <CartProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CartProvider>
        </MarketplaceProvider>
      </AuthProvider>
    </AppErrorBoundary>
  </React.StrictMode>
);
