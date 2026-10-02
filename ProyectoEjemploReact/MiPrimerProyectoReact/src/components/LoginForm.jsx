import { useState } from "react";

export default function LoginForm({ onLogin }) {
  // Recupera el último usuario usado; si no existe, comienza vacío.
  const [usuario, setUsuario] = useState(
    () => localStorage.getItem("ultimoUsuario") || "",
  );

  // La contraseña siempre comienza vacía.
  const [password, setPassword] = useState("");

  // Mensaje visible cuando la validación falla.
  const [error, setError] = useState("");

  function handleSubmit(event) {
    // Evita que el navegador recargue el documento.
    event.preventDefault();

    const loginCorrecto = onLogin(usuario, password);

    if (!loginCorrecto) {
      setError("Usuario o contraseña incorrectos");
      return;
    }

    setError("");
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="usuario" className="form-label">
          Usuario
        </label>

        <input
          id="usuario"
          type="text"
          className="form-control"
          value={usuario}
          onChange={(event) => setUsuario(event.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="password" className="form-label">
          Contraseña
        </label>

        <input
          id="password"
          type="password"
          className="form-control"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <button type="submit" className="btn btn-primary w-100">
        Ingresar
      </button>
    </form>
  );
}
