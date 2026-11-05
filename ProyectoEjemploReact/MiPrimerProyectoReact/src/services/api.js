/*
 * ARCHIVO: src/services/api.js
 *
 * OBJETIVO:
 * Centralizar la configuración de Axios para comunicarnos
 * con los microservicios Spring Boot.
 *
 * También configuramos interceptores para:
 * 1. Agregar automáticamente el token JWT a las peticiones.
 * 2. Detectar sesiones expiradas o rechazadas por el servidor.
 */

// Importamos la biblioteca Axios para realizar peticiones HTTP.
import axios from "axios";

// Importamos funciones que permiten gestionar la sesión del usuario.
// leerSesion(): recupera y comprueba la sesión almacenada.
// cerrarSesionGuardada(): elimina los datos de la sesión.
import { cerrarSesionGuardada, leerSesion } from "./sesion.js";

// ==========================================================
// 1. CONFIGURACIÓN DE LOS CLIENTES AXIOS
// ==========================================================

// Creamos una instancia de Axios para productos.
// axios.create() permite establecer una configuración reutilizable.
export const productosApi = axios.create({
  // Dirección base del microservicio de productos.
  // Se obtiene del archivo .env del proyecto Vite.
  // Ejemplo: http://localhost:8081
  baseURL: import.meta.env.VITE_PRODUCTOS_API_URL,

  // Tiempo máximo de espera de cada petición HTTP.
  // 10000 milisegundos equivalen a 10 segundos.
  timeout: 10000,
});

// Creamos otra instancia de Axios para el microservicio de usuarios.
export const usuariosApi = axios.create({
  // Dirección base del microservicio de usuarios.
  // Ejemplo: http://localhost:8082
  baseURL: import.meta.env.VITE_USUARIOS_API_URL,

  // Tiempo máximo de espera: 10 segundos.
  timeout: 10000,
});

// ==========================================================
// 2. REGISTRO DE LOS INTERCEPTORES
// ==========================================================

// Creamos un arreglo con los dos clientes Axios.
//
// forEach() recorre cada elemento del arreglo:
// Primera iteración: cliente = productosApi
// Segunda iteración: cliente = usuariosApi
//
// De esta manera configuramos los mismos interceptores
// sin tener que repetir el código para cada microservicio.
[productosApi, usuariosApi].forEach((cliente) => {
  // ========================================================
  // 3. INTERCEPTOR DE PETICIONES (REQUEST)
  // ========================================================

  // request.use() registra una función que Axios ejecutará
  // automáticamente ANTES de enviar cada petición HTTP.
  //
  // config representa la configuración de la petición:
  // URL, método HTTP, encabezados, datos enviados, etc.
  cliente.interceptors.request.use((config) => {
    // Revisamos si existe información de sesión almacenada.
    //
    // "sesionJWT" es la clave que utilizamos en sessionStorage.
    // Es un nombre definido por nosotros, no por JavaScript.
    //
    // getItem() devuelve:
    // - Un string si existe la clave.
    // - null si no existe.
    //
    // Boolean() convierte el resultado en true o false.
    const habiaSesion = Boolean(sessionStorage.getItem("sesionJWT"));

    // Recuperamos la sesión utilizando leerSesion().
    //
    // Esta función está definida en sesion.js.
    // Permite recuperar la información de sesión
    // y comprobar su validez según la lógica implementada.
    //
    // Si no existe una sesión válida, devuelve null.
    const sesion = leerSesion();

    // Comprobamos dos condiciones:
    //
    // habiaSesion: existía información almacenada.
    // !sesion: no fue posible obtener una sesión válida.
    //
    // Si ambas condiciones son verdaderas,
    // debemos avisar que la sesión expiró o es inválida.
    if (habiaSesion && !sesion) {
      // Creamos y emitimos un evento personalizado del navegador.
      //
      // "sesion-expirada" es un nombre definido por nosotros.
      //
      // Los componentes que escuchen este evento
      // podrán actualizar el estado de autenticación
      // y, por ejemplo, mostrar nuevamente el Login.
      //
      // IMPORTANTE:
      // Este evento no cambia de página por sí solo.
      window.dispatchEvent(new Event("sesion-expirada"));
    }

    // Verificamos si recuperamos una sesión con un token.
    //
    // El operador ?. se llama optional chaining.
    // Evita un error si sesion es null o undefined.
    if (sesion?.token) {
      // Agregamos el JWT al encabezado Authorization.
      //
      // Bearer es el esquema de autenticación utilizado.
      //
      // Ejemplo del encabezado resultante:
      // Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
      //
      // Las comillas invertidas permiten insertar
      // el valor de sesion.token mediante ${...}.
      config.headers.Authorization = `Bearer ${sesion.token}`;
    }

    // Devolvemos la configuración de la petición.
    //
    // Axios utiliza este objeto para continuar
    // con el envío de la solicitud al microservicio.
    return config;
  });

  // ========================================================
  // 4. INTERCEPTOR DE RESPUESTAS (RESPONSE)
  // ========================================================

  // response.use() registra dos funciones:
  //
  // 1. Una para respuestas exitosas.
  // 2. Otra para respuestas rechazadas o errores.
  //
  // Este interceptor se ejecuta cuando Axios
  // procesa la respuesta del microservicio.
  cliente.interceptors.response.use(
    // PRIMERA FUNCIÓN: RESPUESTA EXITOSA
    //
    // Recibimos la respuesta HTTP y la devolvemos
    // sin realizar ninguna modificación.
    //
    // Esto permite que el componente React
    // continúe utilizando respuesta.data.
    (respuesta) => respuesta,

    // SEGUNDA FUNCIÓN: RESPUESTA CON ERROR
    //
    // Axios ejecuta esta función cuando la promesa
    // es rechazada, por ejemplo ante un HTTP 401.
    (error) => {
      // Comprobamos dos condiciones:
      //
      // 1. El servidor respondió con HTTP 401.
      // 2. Existe información de sesión almacenada.
      //
      // HTTP 401 significa que la solicitud no
      // cuenta con autenticación válida.
      //
      // Puede ocurrir si el JWT expiró,
      // es incorrecto o fue rechazado.
      //
      // error.response?.status:
      // Utilizamos ?. porque en un error de red
      // puede no existir una respuesta HTTP.
      if (
        error.response?.status === 401 &&
        sessionStorage.getItem("sesionJWT")
      ) {
        // Eliminamos la información de sesión guardada.
        //
        // Esta función está implementada en sesion.js.
        cerrarSesionGuardada();

        // Avisamos a React que la sesión dejó de ser válida.
        //
        // Algún componente, como App.jsx, debe escuchar
        // este evento para reaccionar.
        window.dispatchEvent(new Event("sesion-expirada"));
      }

      // Propagamos el error original.
      //
      // Promise.reject(error) devuelve una promesa
      // rechazada para que el componente que realizó
      // la petición pueda manejar el error.
      //
      // Por ejemplo, mediante:
      // .catch((error) => { ... })
      //
      // O mediante try/catch cuando utiliza await.
      return Promise.reject(error);
    },
  );
});
