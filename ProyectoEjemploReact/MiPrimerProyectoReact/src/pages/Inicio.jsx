/* import Contador from "../components/Contador.jsx";

export default function Inicio() {
  return (
    <>
      <h1>Inicio</h1>

      <p>
        Esta es la primera página de nuestra aplicación React.
      </p>

      {/* Insertamos un componente dentro de la página.
      <Contador />
    </>
  );
} */

import Contador from "../components/Contador.jsx";

export default function Inicio({ usuario }) {
  return (
    <>
      <h1>Bienvenido {usuario}</h1>

      <p>Esta es la primera página de nuestra aplicación React.</p>

      <Contador />
    </>
  );
}
