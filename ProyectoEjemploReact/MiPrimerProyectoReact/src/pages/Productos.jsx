/* ===== VERSIÓN ORIGINAL DE MiPrimerProyectoReact/src/pages/Productos.jsx (NO BORRAR) =====
import ProductoCard from "../components/ProductoCard.jsx";

const productos = [
  { id: 1, nombre: "Teclado Gamer", precio: 39990 },
  { id: 2, nombre: "Mouse Gamer", precio: 24990 },
  { id: 3, nombre: "Audífonos Gamer", precio: 49990 },
];

export default function Productos() {
  return (
    <>
      <h1>Productos</h1>

      <p>
        Un mismo componente se reutiliza con diferentes datos.
      </p>

      <div className="row g-3">
        {productos.map((producto) => (
          <div className="col-12 col-md-4" key={producto.id}>
            <ProductoCard
              nombre={producto.nombre}
              precio={producto.precio}
            />
          </div>
        ))}
      </div>
    </>
  );
}
===== FIN DEL CÓDIGO ORIGINAL ===== */

// ===== NUEVA IMPLEMENTACIÓN PARA LA INTEGRACIÓN REST =====
import { useEffect, useState } from "react";
import ProductoCard from "../components/ProductoCard.jsx";
import productoService from "../services/productoService.js";

// ANTES: aquí había un arreglo const productos = [...] con datos fijos.
// NUEVO: los datos se recuperan mediante GET /api/productos.
export default function Productos() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let activo = true;
    async function cargarProductos() {
      try {
        const datos = await productoService.listar();
        if (activo) setProductos(datos);
      } catch {
        if (activo) setError("No se pudieron cargar los productos.");
      } finally {
        if (activo) setCargando(false);
      }
    }
    cargarProductos();
    return () => {
      activo = false;
    };
  }, []);

  return (
    <>
      <h1>Productos</h1>
      <p>Productos obtenidos desde el microservicio Spring Boot.</p>

      {cargando && <div className="alert alert-info">Cargando...</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      {!cargando && !error && productos.length === 0 && (
        <p>No existen productos registrados.</p>
      )}

      <div className="row g-3 mt-2">
        {productos.map((producto) => (
          <div className="col-12 col-md-4" key={producto.id}>
            <ProductoCard
              nombre={producto.nombre}
              precio={producto.precio}
              descripcion={producto.descripcion}
              stock={producto.stock}
              imagen={producto.imagen}
            />
          </div>
        ))}
      </div>
    </>
  );
}
