import { useState } from "react";

export default function Contacto() {
  const [nombre, setNombre] = useState("");

  return (
    <>
      <h1>Contacto</h1>

      <p>Escribe tu nombre:</p>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre
        </label>

        <input
          id="nombre"
          className="form-control"
          value={nombre}
          onChange={(event) => setNombre(event.target.value)}
          placeholder="Escribe tu nombre"
        />
      </div>

      {/* Solo se muestra si nombre contiene texto. */}
      {nombre && (
        <div className="alert alert-info">
          Hola, {nombre}.
        </div>
      )}
    </>
  );
}