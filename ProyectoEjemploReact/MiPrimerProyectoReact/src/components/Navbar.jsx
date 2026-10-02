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
