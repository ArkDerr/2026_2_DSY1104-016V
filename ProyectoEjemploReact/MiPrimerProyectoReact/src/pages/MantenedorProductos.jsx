import { useCallback, useEffect, useState } from "react";
import productoService from "../services/productoService.js";

const FORMULARIO_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: "",
};

// NUEVO: página completa del mantenedor de productos.
export default function MantenedorProductos() {
  const [productos, setProductos] = useState([]);
  const [formulario, setFormulario] = useState({ ...FORMULARIO_VACIO });
  const [idEdicion, setIdEdicion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  // GET: consultar productos en el microservicio (puerto 8081).
  const cargarProductos = useCallback(async () => {
    try {
      const datos = await productoService.listar();
      setProductos(datos);
      setError("");
    } catch {
      setError("No se pudo obtener la lista de productos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    void cargarProductos();
  }, [cargarProductos]);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    setFormulario((anterior) => ({ ...anterior, [name]: value }));
  }

  function limpiarFormulario() {
    setFormulario({ ...FORMULARIO_VACIO });
    setIdEdicion(null);
  }

  function comenzarEdicion(producto) {
    setIdEdicion(producto.id);
    setFormulario({
      nombre: producto.nombre ?? "",
      descripcion: producto.descripcion ?? "",
      precio: String(producto.precio ?? ""),
      stock: String(producto.stock ?? ""),
      imagen: producto.imagen ?? "",
    });
    setMensaje("");
    setError("");
  }

  // POST o PUT: depende de si existe idEdicion.
  async function guardar(evento) {
    evento.preventDefault();
    setError("");
    setMensaje("");
    const producto = {
      ...formulario,
      nombre: formulario.nombre.trim(),
      precio: Number(formulario.precio),
      stock: Number(formulario.stock),
    };
    if (
      !producto.nombre ||
      producto.precio < 0 ||
      !Number.isFinite(producto.precio) ||
      !Number.isInteger(producto.stock) ||
      producto.stock < 0
    ) {
      setError("Revisa el nombre, el precio y el stock.");
      return;
    }

    setGuardando(true);
    try {
      if (idEdicion === null) {
        await productoService.crear(producto);
        setMensaje("Producto creado correctamente.");
      } else {
        await productoService.actualizar(idEdicion, producto);
        setMensaje("Producto actualizado correctamente.");
      }
      limpiarFormulario();
      await cargarProductos();
    } catch (errorPeticion) {
      setError(
        errorPeticion.response?.status === 403
          ? "No tienes permisos ADMIN para guardar productos."
          : "No se pudo guardar el producto.",
      );
    } finally {
      setGuardando(false);
    }
  }

  // DELETE: confirmar y solicitar eliminación al backend.
  async function eliminar(producto) {
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) return;
    setError("");
    setMensaje("");
    try {
      await productoService.eliminar(producto.id);
      if (idEdicion === producto.id) limpiarFormulario();
      await cargarProductos();
      setMensaje("Producto eliminado correctamente.");
    } catch {
      setError("No fue posible eliminar el producto.");
    }
  }

  return (
    <section className="mantenedor">
      <h1>Mantenedor de productos</h1>
      <p className="mb-3">Administración mediante GET, POST, PUT y DELETE.</p>
      {error && <div className="alert alert-danger">{error}</div>}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      <form className="card card-body mb-4" onSubmit={guardar}>
        <h2 className="h5">
          {idEdicion === null ? "Crear producto" : "Editar producto"}
        </h2>
        <div className="row g-3">
          <div className="col-md-6">
            <label htmlFor="prod-nombre" className="form-label">
              Nombre *
            </label>
            <input
              id="prod-nombre"
              name="nombre"
              className="form-control"
              value={formulario.nombre}
              onChange={cambiarCampo}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="prod-imagen" className="form-label">
              URL de imagen
            </label>
            <input
              id="prod-imagen"
              name="imagen"
              className="form-control"
              value={formulario.imagen}
              onChange={cambiarCampo}
            />
          </div>
          <div className="col-12">
            <label htmlFor="prod-descripcion" className="form-label">
              Descripción
            </label>
            <textarea
              id="prod-descripcion"
              name="descripcion"
              className="form-control"
              value={formulario.descripcion}
              onChange={cambiarCampo}
              rows="2"
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="prod-precio" className="form-label">
              Precio *
            </label>
            <input
              id="prod-precio"
              name="precio"
              type="number"
              min="0"
              step="0.01"
              className="form-control"
              value={formulario.precio}
              onChange={cambiarCampo}
              required
            />
          </div>
          <div className="col-md-6">
            <label htmlFor="prod-stock" className="form-label">
              Stock *
            </label>
            <input
              id="prod-stock"
              name="stock"
              type="number"
              min="0"
              step="1"
              className="form-control"
              value={formulario.stock}
              onChange={cambiarCampo}
              required
            />
          </div>
        </div>
        <div className="d-flex gap-2 mt-3">
          <button
            className="btn btn-primary"
            disabled={guardando}
            type="submit"
          >
            {guardando
              ? "Guardando..."
              : idEdicion === null
                ? "Crear"
                : "Guardar cambios"}
          </button>
          <button
            className="btn btn-secondary"
            type="button"
            onClick={limpiarFormulario}
          >
            Cancelar / limpiar
          </button>
        </div>
      </form>

      <h2 className="h4">Productos registrados</h2>
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto) => (
                <tr key={producto.id}>
                  <td>{producto.id}</td>
                  <td>{producto.nombre}</td>
                  <td>${Number(producto.precio).toLocaleString("es-CL")}</td>
                  <td>{producto.stock}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => comenzarEdicion(producto)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminar(producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
              {productos.length === 0 && (
                <tr>
                  <td colSpan="5">No existen productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
