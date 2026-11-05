import { useCallback, useEffect, useState } from "react";
import usuarioService from "../services/usuarioService.js";
import { leerSesion } from "../services/sesion.js";

const FORMULARIO_VACIO = {
  nombre: "",
  email: "",
  password: "",
  rol: "USER",
};

// NUEVO: página de administración del microservicio de usuarios.
export default function MantenedorUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [formulario, setFormulario] = useState({ ...FORMULARIO_VACIO });
  const [idEdicion, setIdEdicion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const correoActual = leerSesion()?.email;

  const cargarUsuarios = useCallback(async () => {
    try {
      setUsuarios(await usuarioService.listar());
      setError("");
    } catch {
      setError("No se pudo obtener la lista de usuarios.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarUsuarios();
  }, [cargarUsuarios]);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  function limpiarFormulario() {
    setFormulario({ ...FORMULARIO_VACIO });
    setIdEdicion(null);
  }

  function comenzarEdicion(usuario) {
    setIdEdicion(usuario.id);
    setFormulario({
      nombre: usuario.nombre ?? "",
      email: usuario.email ?? "",
      password: "", // El servidor no devuelve contraseñas ni hashes.
      rol: usuario.rol ?? "USER",
    });
    setError("");
    setMensaje("");
  }

  async function guardar(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");
    if (!formulario.nombre.trim() || !formulario.email.trim()) {
      setError("Nombre y correo electrónico son obligatorios.");
      return;
    }
    if (idEdicion === null && !formulario.password) {
      setError("La contraseña es obligatoria al crear un usuario.");
      return;
    }

    const datos = {
      nombre: formulario.nombre.trim(),
      email: formulario.email.trim(),
      rol: formulario.rol,
      // Al editar, vacío significa conservar la contraseña actual.
      password: formulario.password || null,
    };
    setGuardando(true);
    try {
      if (idEdicion === null) {
        await usuarioService.crear(datos);
        setMensaje("Usuario creado correctamente.");
      } else {
        await usuarioService.actualizar(idEdicion, datos);
        setMensaje("Usuario actualizado correctamente.");
      }
      limpiarFormulario();
      await cargarUsuarios();
    } catch (errorPeticion) {
      const estado = errorPeticion.response?.status;
      setError(
        estado === 409
          ? "El correo ya está registrado."
          : estado === 403
            ? "Esta operación requiere rol ADMIN."
            : "No se pudo guardar el usuario. Revisa los datos.",
      );
    } finally {
      setGuardando(false);
    }
  }

  async function eliminar(usuario) {
    if (usuario.email === correoActual) {
      setError("No elimines tu propia cuenta mientras administras usuarios.");
      return;
    }
    if (!window.confirm(`¿Eliminar a ${usuario.nombre}?`)) return;
    setError("");
    setMensaje("");
    try {
      await usuarioService.eliminar(usuario.id);
      if (idEdicion === usuario.id) limpiarFormulario();
      await cargarUsuarios();
      setMensaje("Usuario eliminado correctamente.");
    } catch {
      setError("No fue posible eliminar al usuario.");
    }
  }

  return (
    <section className="mantenedor">
      <h1>Mantenedor de usuarios</h1>
      <p className="mb-3">Solo un administrador puede realizar este CRUD.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <form className="card card-body mb-4" onSubmit={guardar}>
        <h2 className="h5">
          {idEdicion === null ? "Crear usuario" : "Editar usuario"}
        </h2>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="user-nombre" className="form-label">
              Nombre *
            </label>
            <input
              id="user-nombre"
              name="nombre"
              className="form-control"
              value={formulario.nombre}
              onChange={cambiarCampo}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="user-email" className="form-label">
              Correo *
            </label>
            <input
              id="user-email"
              name="email"
              type="email"
              className="form-control"
              value={formulario.email}
              onChange={cambiarCampo}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="user-password" className="form-label">
              {idEdicion === null
                ? "Contraseña *"
                : "Nueva contraseña (opcional)"}
            </label>
            <input
              id="user-password"
              name="password"
              type="password"
              className="form-control"
              value={formulario.password}
              onChange={cambiarCampo}
              required={idEdicion === null}
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="user-rol" className="form-label">
              Rol *
            </label>
            <select
              id="user-rol"
              name="rol"
              className="form-select"
              value={formulario.rol}
              onChange={cambiarCampo}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </div>
        </div>
        <div className="d-flex gap-2 mt-3">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : idEdicion === null
                ? "Crear"
                : "Guardar cambios"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={limpiarFormulario}
          >
            Cancelar / limpiar
          </button>
        </div>
      </form>

      <h2 className="h4">Usuarios registrados</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => comenzarEdicion(usuario)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      disabled={usuario.email === correoActual}
                      onClick={() => eliminar(usuario)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {usuarios.length === 0 && (
                <tr>
                  <td colSpan="5">No existen usuarios registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
