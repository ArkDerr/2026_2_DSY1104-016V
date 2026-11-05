/* ===== VERSIÓN ORIGINAL DE MiPrimerProyectoReact/src/components/ProductoCard.jsx (NO BORRAR) =====
export default function ProductoCard({ nombre, precio }) {
  return (
    <div className="card h-100">
      <div className="card-body">
        <h2 className="h5">{nombre}</h2>

        <p>
          ${precio.toLocaleString("es-CL")}
        </p>

        <button className="btn btn-success">
          Ver producto
        </button>
      </div>
    </div>
  );
}
===== FIN DEL CÓDIGO ORIGINAL ===== */

// ===== NUEVA IMPLEMENTACIÓN PARA LA INTEGRACIÓN REST =====
// NUEVO: se agregan propiedades opcionales sin quitar nombre ni precio.
export default function ProductoCard({
  nombre,
  precio,
  descripcion,
  stock,
  imagen,
}) {
  return (
    <div className="card h-100">
      {imagen && (
        <img
          src={imagen}
          className="card-img-top"
          alt={nombre}
          style={{ height: "170px", objectFit: "contain" }}
        />
      )}
      <div className="card-body d-flex flex-column">
        <h2 className="h5">{nombre}</h2>
        {descripcion && <p className="card-text">{descripcion}</p>}
        <p className="fw-bold">${Number(precio).toLocaleString("es-CL")}</p>
        {stock !== undefined && <p>Stock: {stock}</p>}
        <button type="button" className="btn btn-success mt-auto">
          Ver producto
        </button>
      </div>
    </div>
  );
}
