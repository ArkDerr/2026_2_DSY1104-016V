import { useState } from "react";

export default function Contador() {
  // numero comienza en 0. setNumero permite cambiarlo.
  const [numero, setNumero] = useState(0);

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h2 className="h5">Componente Contador</h2>

        <p className="fs-4">
          Valor actual: <strong>{numero}</strong>
        </p>

        <button
          className="btn btn-primary"
          onClick={() => setNumero(numero + 1)}
        >
          Aumentar
        </button>

        <p className="text-secondary mt-3 mb-0">
          React actualiza este contenido sin recargar el navegador.
        </p>
      </div>
    </div>
  );
}