/*
 * ARCHIVO: src/services/sesion.js
 *
 * OBJETIVO:
 * Centralizar la administración de la sesión del usuario.
 *
 * Este archivo contiene tres funciones principales:
 *
 * 1. guardarSesion(): almacena la sesión después del login.
 * 2. leerSesion(): recupera la sesión y comprueba si expiró.
 * 3. cerrarSesionGuardada(): elimina la sesión almacenada.
 *
 * La sesión contiene información devuelta por el backend,
 * como el token JWT, nombre, correo y rol del usuario.
 */

// ==========================================================
// 1. CONFIGURACIÓN DE LA CLAVE DE SESIÓN
// ==========================================================

// Definimos una constante con el nombre de la clave que
// utilizaremos para almacenar la sesión en sessionStorage.
//
// "sesionJWT" es un nombre elegido por nosotros.
// No es una palabra reservada de JavaScript.
//
// Utilizar una constante evita escribir repetidamente
// el mismo texto y cometer errores al escribirlo.
const CLAVE_SESION = "sesionJWT";

// ==========================================================
// 2. FUNCIÓN PARA CERRAR LA SESIÓN
// ==========================================================

// export permite utilizar esta función desde otros archivos,
// por ejemplo desde api.js o App.jsx.
//
// Esta función no recibe parámetros.
export function cerrarSesionGuardada() {
  // Eliminamos la sesión almacenada utilizando la clave
  // definida anteriormente ("sesionJWT").
  //
  // removeItem() elimina el elemento del sessionStorage.
  // Si no existe, no provoca un error.
  sessionStorage.removeItem(CLAVE_SESION);

  // Eliminamos también el nombre de usuario almacenado
  // bajo la clave utilizada anteriormente en el curso.
  //
  // De esta forma mantenemos compatibilidad con el
  // manejo de sesión que tenía el proyecto React original.
  sessionStorage.removeItem("usuarioLogin");
}

// ==========================================================
// 3. FUNCIÓN PARA LEER Y VALIDAR LA SESIÓN
// ==========================================================

// Esta función recupera la información del usuario.
//
// También revisa si el token JWT tiene una fecha
// de expiración y si esa fecha ya fue superada.
export function leerSesion() {
  // Recuperamos el valor asociado a "sesionJWT".
  //
  // sessionStorage almacena valores como texto (string).
  //
  // Si no existe la clave, getItem() devuelve null.
  const texto = sessionStorage.getItem(CLAVE_SESION);

  // Si no existe información de sesión, devolvemos null.
  //
  // El operador ! significa negación lógica.
  //
  // Es equivalente a:
  //
  // if (!texto) {
  //   return null;
  // }
  //
  // Se utiliza una forma abreviada (early return).
  if (!texto) return null;

  // Utilizamos try/catch porque la conversión del JSON,
  // la lectura del JWT o su decodificación podrían fallar.
  try {
    // ------------------------------------------------------
    // 3.1. CONVERTIR EL TEXTO EN UN OBJETO JAVASCRIPT
    // ------------------------------------------------------

    // JSON.parse() transforma una cadena JSON en un objeto.
    //
    // Por ejemplo, si sessionStorage contiene:
    //
    // '{"nombre":"Administrador","rol":"ADMIN","token":"..."}'
    //
    // JSON.parse() permite acceder a sus propiedades:
    //
    // sesion.nombre
    // sesion.rol
    // sesion.token
    const sesion = JSON.parse(texto);

    // ------------------------------------------------------
    // 3.2. OBTENER EL PAYLOAD DEL JWT
    // ------------------------------------------------------

    // Un JWT normalmente tiene tres partes separadas
    // mediante puntos:
    //
    // ENCABEZADO.PAYLOAD.FIRMA
    //
    // El payload contiene las declaraciones (claims)
    // del token, como la fecha de expiración "exp".
    //
    // split(".") divide la cadena en un arreglo.
    //
    // Por ejemplo:
    // ["encabezado", "payload", "firma"]
    //
    // [1] selecciona la segunda posición del arreglo,
    // ya que los índices comienzan desde cero.
    const parte = sesion.token.split(".")[1];

    // ------------------------------------------------------
    // 3.3. NORMALIZAR EL PAYLOAD
    // ------------------------------------------------------

    // Los JWT utilizan Base64URL.
    //
    // La función atob() trabaja con Base64.
    //
    // Por eso reemplazamos algunos caracteres:
    //
    // "-" por "+"
    // "_" por "/"
    //
    // /-/g significa buscar todas las apariciones de "-".
    // /_/g significa buscar todas las apariciones de "_".
    //
    // La letra "g" significa global.
    const normalizada = parte.replace(/-/g, "+").replace(/_/g, "/");

    // ------------------------------------------------------
    // 3.4. DECODIFICAR EL PAYLOAD
    // ------------------------------------------------------

    // atob() decodifica el contenido Base64.
    //
    // El resultado es una cadena JSON.
    //
    // JSON.parse() convierte ese texto en un objeto
    // JavaScript que podemos consultar.
    //
    // Por ejemplo:
    //
    // {
    //   "sub": "admin@duoc.cl",
    //   "rol": "ADMIN",
    //   "exp": 1794000000
    // }
    //
    // IMPORTANTE:
    // Decodificar un JWT NO significa verificar su firma.
    // La validación de autenticidad corresponde al backend.
    const payload = JSON.parse(atob(normalizada));

    // ------------------------------------------------------
    // 3.5. COMPROBAR LA EXPIRACIÓN DEL JWT
    // ------------------------------------------------------

    // payload.exp contiene la fecha de expiración.
    //
    // Según el formato JWT, exp se expresa como
    // una marca de tiempo en segundos.
    //
    // Date.now() devuelve la fecha y hora actuales
    // en milisegundos desde el 01-01-1970 UTC.
    //
    // Por eso multiplicamos exp por 1000:
    // convertimos segundos a milisegundos.
    //
    // Comprobamos dos condiciones:
    //
    // !payload.exp:
    //   No existe una fecha de expiración.
    //
    // payload.exp * 1000 <= Date.now():
    //   El token ya alcanzó o superó su vencimiento.
    //
    // El operador || significa OR (o lógico).
    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      // Si el JWT no tiene exp o ya venció,
      // eliminamos los datos de sesión almacenados.
      cerrarSesionGuardada();

      // Devolvemos null para indicar que no existe
      // una sesión utilizable.
      return null;
    }

    // ------------------------------------------------------
    // 3.6. DEVOLVER LA SESIÓN
    // ------------------------------------------------------

    // Si llegamos hasta esta línea, significa que:
    //
    // 1. Existía información de sesión almacenada.
    // 2. Pudimos convertirla a un objeto JavaScript.
    // 3. Pudimos leer y decodificar el payload.
    // 4. El campo exp existe y aún no ha vencido.
    //
    // Devolvemos el objeto de sesión.
    return sesion;
  } catch {
    // ------------------------------------------------------
    // 3.7. MANEJAR ERRORES
    // ------------------------------------------------------

    // Si ocurre cualquier error durante la lectura,
    // conversión o decodificación, llegamos a este bloque.
    //
    // Por ejemplo:
    // - El texto almacenado no contiene JSON válido.
    // - sesion.token no existe.
    // - El JWT tiene un formato incorrecto.
    // - El payload no puede decodificarse.
    //
    // Por seguridad, eliminamos la sesión almacenada.
    cerrarSesionGuardada();

    // Devolvemos null para indicar que no existe
    // una sesión utilizable.
    return null;
  }
}

// ==========================================================
// 4. FUNCIÓN PARA GUARDAR LA SESIÓN
// ==========================================================

// Esta función recibe un objeto llamado "sesion".
//
// Por ejemplo:
//
// {
//   token: "eyJhbGciOiJIUzI1NiJ9...",
//   nombre: "Administrador",
//   email: "admin@duoc.cl",
//   rol: "ADMIN"
// }
//
// Normalmente la llamaremos cuando el microservicio
// confirme que el inicio de sesión fue correcto.
export function guardarSesion(sesion) {
  // sessionStorage solo almacena cadenas de texto.
  //
  // JSON.stringify() convierte un objeto JavaScript
  // en una cadena con formato JSON.
  //
  // Guardamos la información utilizando la clave
  // definida en CLAVE_SESION ("sesionJWT").
  sessionStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));

  // Conservamos el nombre del usuario en la clave
  // que utilizaba el proyecto React original.
  //
  // Esto permite mantener compatibilidad con
  // componentes que consultan "usuarioLogin".
  sessionStorage.setItem("usuarioLogin", sesion.nombre);

  // Guardamos el correo utilizado en el último login.
  //
  // A diferencia de sessionStorage, localStorage
  // permanece almacenado aunque se cierre
  // la pestaña o se reinicie el navegador,
  // hasta que se elimine explícitamente.
  //
  // Esto permite recordar el último correo utilizado,
  // sin almacenar la contraseña.
  localStorage.setItem("ultimoUsuario", sesion.email);
}
