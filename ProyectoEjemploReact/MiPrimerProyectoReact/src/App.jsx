import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Login from "./pages/Login.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import Contacto from "./pages/Contacto.jsx";

// Solo para demostración local. No usar así en producción.
const USUARIO_VALIDO = "Admin";
const PASSWORD_VALIDO = "123456";

export default function App() {
  const [usuarioLogin, setUsuarioLogin] = useState(
    () => sessionStorage.getItem("usuarioLogin") || "",
  );

  function handleLogin(usuario, password) {
    if (usuario === USUARIO_VALIDO && password === PASSWORD_VALIDO) {
      sessionStorage.setItem("usuarioLogin", usuario);
      localStorage.setItem("ultimoUsuario", usuario);

      setUsuarioLogin(usuario);

      return true;
    }

    return false;
  }

  function handleLogout() {
    sessionStorage.removeItem("usuarioLogin");

    setUsuarioLogin("");
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {usuarioLogin && (
        <Navbar usuario={usuarioLogin} onLogout={handleLogout} />
      )}

      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route
            path="/login"
            element={
              usuarioLogin ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          <Route
            path="/"
            element={
              usuarioLogin ? (
                <Inicio usuario={usuarioLogin} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          <Route
            path="/productos"
            element={
              usuarioLogin ? <Productos /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="/contacto"
            element={
              usuarioLogin ? <Contacto /> : <Navigate to="/login" replace />
            }
          />

          <Route
            path="*"
            element={<Navigate to={usuarioLogin ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>

      {usuarioLogin && <Footer />}
    </div>
  );
}
