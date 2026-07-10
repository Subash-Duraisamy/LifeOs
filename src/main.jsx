import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import { Toaster } from "react-hot-toast";

import App from "./App";
import AuthProvider from "./context/AuthProvider";

import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>

    <BrowserRouter>

      <AuthProvider>

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={12}
          toastOptions={{
            duration: 3500,

            style: {
              background: "#1f2937",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "14px",
              padding: "14px 18px",
              fontSize: "14px",
              boxShadow: "0 10px 30px rgba(0,0,0,.25)",
            },

            success: {
              iconTheme: {
                primary: "#22c55e",
                secondary: "#ffffff",
              },
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },

            loading: {
              iconTheme: {
                primary: "#7c5cff",
                secondary: "#ffffff",
              },
            },
          }}
        />

        <App />

      </AuthProvider>

    </BrowserRouter>

  </React.StrictMode>
);