/* ===== VERSIÓN ORIGINAL DE MiPrimerProyectoReact/src/App.jsx (NO BORRAR) =====
import { useState } from "react";
import { Routes, Route, Navigate } from "react-router";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";

import Login from "./pages/Login.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import Contacto from "./pages/Contacto.jsx";

// Solo para demostración local. No usar así en producción.
// ANTES: credenciales fijas dentro de React.
const USUARIO_VALIDO = "Admin";
const PASSWORD_VALIDO = "123456";

// ANTES: if (usuario === USUARIO_VALIDO &&
//           password === PASSWORD_VALIDO) {...}

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
===== FIN DEL CÓDIGO ORIGINAL ===== */

// ===== NUEVA IMPLEMENTACIÓN PARA LA INTEGRACIÓN REST =====
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import Login from "./pages/Login.jsx";
import Inicio from "./pages/Inicio.jsx";
import Productos from "./pages/Productos.jsx";
import Contacto from "./pages/Contacto.jsx";
// NUEVO: páginas y servicios de autenticación.
import MantenedorProductos from "./pages/MantenedorProductos.jsx";
import MantenedorUsuarios from "./pages/MantenedorUsuarios.jsx";
import usuarioService from "./services/usuarioService.js";
import {
  cerrarSesionGuardada,
  guardarSesion,
  leerSesion,
} from "./services/sesion.js";

// ANTES: const USUARIO_VALIDO = "Admin" y PASSWORD_VALIDO = "123456".
// NUEVO: el backend verifica email y password y devuelve JWT.
export default function App() {
  const [sesion, setSesion] = useState(() => leerSesion());
  const autenticado = Boolean(sesion?.token);
  const esAdmin = sesion?.rol === "ADMIN";

  useEffect(() => {
    function manejarExpiracion() {
      setSesion(null);
    }
    window.addEventListener("sesion-expirada", manejarExpiracion);
    return () =>
      window.removeEventListener("sesion-expirada", manejarExpiracion);
  }, []);

  async function handleLogin(email, password) {
    // POST http://localhost:8082/api/auth/login
    const respuesta = await usuarioService.login(email, password);
    const nuevaSesion = { ...respuesta, email };
    guardarSesion(nuevaSesion);
    setSesion(nuevaSesion);
    return true;
  }

  function handleLogout() {
    cerrarSesionGuardada();
    setSesion(null);
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {autenticado && (
        <Navbar
          usuario={sesion.nombre}
          rol={sesion.rol}
          onLogout={handleLogout}
        />
      )}
      <main className="container py-4 flex-grow-1">
        <Routes>
          <Route
            path="/login"
            element={
              autenticado ? (
                <Navigate to="/" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/"
            element={
              autenticado ? (
                <Inicio usuario={sesion.nombre} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/productos"
            element={
              autenticado ? <Productos /> : <Navigate to="/login" replace />
            }
          />
          <Route
            path="/contacto"
            element={
              autenticado ? <Contacto /> : <Navigate to="/login" replace />
            }
          />
          {/* NUEVO: el rol controla la navegación; el backend protege el API. */}
          <Route
            path="/admin/productos"
            element={
              esAdmin ? (
                <MantenedorProductos />
              ) : (
                <Navigate to={autenticado ? "/" : "/login"} replace />
              )
            }
          />
          <Route
            path="/admin/usuarios"
            element={
              esAdmin ? (
                <MantenedorUsuarios />
              ) : (
                <Navigate to={autenticado ? "/" : "/login"} replace />
              )
            }
          />
          <Route
            path="*"
            element={<Navigate to={autenticado ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>
      {autenticado && <Footer />}
    </div>
  );
}
