import axios from "axios";
import { cerrarSesionGuardada, leerSesion } from "./sesion.js";

// NUEVO: un cliente para cada microservicio Spring Boot.
export const productosApi = axios.create({
  baseURL: import.meta.env.VITE_PRODUCTOS_API_URL,
  timeout: 10000,
});

export const usuariosApi = axios.create({
  baseURL: import.meta.env.VITE_USUARIOS_API_URL,
  timeout: 10000,
});

[productosApi, usuariosApi].forEach((cliente) => {
  // NUEVO: agrega Authorization en cada solicitud autenticada.
  cliente.interceptors.request.use((config) => {
    const habiaSesion = Boolean(sessionStorage.getItem("sesionJWT"));
    const sesion = leerSesion();
    if (habiaSesion && !sesion) {
      window.dispatchEvent(new Event("sesion-expirada"));
    }
    if (sesion?.token) {
      config.headers.Authorization = `Bearer ${sesion.token}`;
    }
    return config;
  });

  // NUEVO: una respuesta 401 cierra la sesión vencida.
  cliente.interceptors.response.use(
    (respuesta) => respuesta,
    (error) => {
      if (
        error.response?.status === 401 &&
        sessionStorage.getItem("sesionJWT")
      ) {
        cerrarSesionGuardada();
        window.dispatchEvent(new Event("sesion-expirada"));
      }
      return Promise.reject(error);
    },
  );
});
