import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";

import "./i18n/config"; // Import to init
import { useTranslation } from "react-i18next";

// In a component or settings page, to change language:
const changeLanguage = (lng: string) => i18n.changeLanguage(lng);

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>
);