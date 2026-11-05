/* ===== VERSIÓN ORIGINAL DE MiPrimerProyectoReact/src/components/LoginForm.jsx (NO BORRAR) =====
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
===== FIN DEL CÓDIGO ORIGINAL ===== */

// ===== NUEVA IMPLEMENTACIÓN PARA LA INTEGRACIÓN REST =====
import { useState } from "react";

export default function LoginForm({ onLogin }) {
  // Se conserva el último dato ingresado; ahora será un correo electrónico.
  const [usuario, setUsuario] = useState(() => {
    const recordado = localStorage.getItem("ultimoUsuario") || "";
    // ANTES se guardaba "Admin"; ahora solo recordamos correos.
    return recordado.includes("@") ? recordado : "";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  // ANTES: handleSubmit era síncrono y comparaba credenciales locales.
  // NUEVO: se espera una respuesta HTTP del backend.
  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const correcto = await onLogin(usuario.trim(), password);
      if (!correcto) setError("Usuario o contraseña incorrectos");
    } catch (errorPeticion) {
      if (errorPeticion.response?.status === 401) {
        setError("Correo o contraseña incorrectos");
      } else {
        setError("No fue posible conectar con el microservicio de usuarios.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="usuario" className="form-label">
          Correo electrónico
        </label>
        <input
          id="usuario"
          type="email"
          className="form-control"
          value={usuario}
          onChange={(e) => setUsuario(e.target.value)}
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
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <div className="alert alert-danger">{error}</div>}
      <button
        type="submit"
        className="btn btn-primary w-100"
        disabled={enviando}
      >
        {enviando ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
