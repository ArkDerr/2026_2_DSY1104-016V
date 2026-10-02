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