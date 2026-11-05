/* ===== VERSIÓN ORIGINAL DE MiPrimerProyectoReact/src/components/Navbar.jsx (NO BORRAR) =====
import { Link, useNavigate } from "react-router";

export default function Navbar({ usuario, onLogout }) {
  const navigate = useNavigate();

  function cerrarSesion() {
    onLogout();

    navigate("/login");
  }

  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          React desde Cero
        </Link>

        <div className="d-flex gap-2 align-items-center">
          <Link className="btn btn-outline-light" to="/">
            Inicio
          </Link>

          <Link className="btn btn-outline-light" to="/productos">
            Productos
          </Link>

          <Link className="btn btn-outline-light" to="/contacto">
            Contacto
          </Link>

          <span className="text-white">Hola {usuario}</span>

          <button className="btn btn-danger" onClick={cerrarSesion}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
===== FIN DEL CÓDIGO ORIGINAL ===== */

// ===== NUEVA IMPLEMENTACIÓN PARA LA INTEGRACIÓN REST =====
import { Link, useNavigate } from "react-router";

// NUEVO: se recibe rol, además de usuario y onLogout.
export default function Navbar({ usuario, rol, onLogout }) {
  const navigate = useNavigate();
  function cerrarSesion() {
    onLogout();
    navigate("/login");
  }
  return (
    <nav className="navbar navbar-dark bg-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          React desde Cero
        </Link>
        <div className="d-flex flex-wrap gap-2 align-items-center">
          <Link className="btn btn-outline-light" to="/">
            Inicio
          </Link>
          <Link className="btn btn-outline-light" to="/productos">
            Productos
          </Link>
          <Link className="btn btn-outline-light" to="/contacto">
            Contacto
          </Link>
          {/* NUEVO: solo ADMIN ve enlaces a los mantenedores. */}
          {rol === "ADMIN" && (
            <>
              <Link className="btn btn-warning" to="/admin/productos">
                Mant. productos
              </Link>
              <Link className="btn btn-warning" to="/admin/usuarios">
                Mant. usuarios
              </Link>
            </>
          )}
          <span className="text-white">
            Hola {usuario} ({rol})
          </span>
          <button className="btn btn-danger" onClick={cerrarSesion}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
