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