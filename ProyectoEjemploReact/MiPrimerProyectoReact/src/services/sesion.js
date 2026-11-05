// NUEVO: centraliza la sesión que devuelve el backend.
const CLAVE_SESION = "sesionJWT";

export function cerrarSesionGuardada() {
  sessionStorage.removeItem(CLAVE_SESION);
  sessionStorage.removeItem("usuarioLogin");
}

export function leerSesion() {
  const texto = sessionStorage.getItem(CLAVE_SESION);
  if (!texto) return null;

  try {
    const sesion = JSON.parse(texto);
    // JWT: encabezado.payload.firma; exp indica vencimiento.
    const parte = sesion.token.split(".")[1];
    const normalizada = parte.replace(/-/g, "+").replace(/_/g, "/");
    const payload = JSON.parse(atob(normalizada));

    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      cerrarSesionGuardada();
      return null;
    }
    return sesion;
  } catch {
    cerrarSesionGuardada();
    return null;
  }
}

export function guardarSesion(sesion) {
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
  // Se conserva la clave anterior como referencia del curso.
  sessionStorage.setItem("usuarioLogin", sesion.nombre);
  localStorage.setItem("ultimoUsuario", sesion.email);
}
