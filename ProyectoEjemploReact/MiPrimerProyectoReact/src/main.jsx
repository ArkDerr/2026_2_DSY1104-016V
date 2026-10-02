import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";

// Bootstrap queda disponible para toda la aplicación.
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* BrowserRouter permite que App trabaje con rutas. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);