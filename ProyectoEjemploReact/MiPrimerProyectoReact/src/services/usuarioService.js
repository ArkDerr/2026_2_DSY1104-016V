import { usuariosApi } from "./api.js";

const usuarioService = {
  // NUEVO: login NO utiliza credenciales locales.
  async login(email, password) {
    const respuesta = await usuariosApi.post("/api/auth/login", {
      email,
      password,
    });
    return respuesta.data; // { token, nombre, rol }
  },
  async listar() {
    const respuesta = await usuariosApi.get("/api/usuarios");
    return respuesta.data;
  },
  async buscar(id) {
    const respuesta = await usuariosApi.get(`/api/usuarios/${id}`);
    return respuesta.data;
  },
  async crear(usuario) {
    const respuesta = await usuariosApi.post("/api/usuarios", usuario);
    return respuesta.data;
  },
  async actualizar(id, usuario) {
    const respuesta = await usuariosApi.put(`/api/usuarios/${id}`, usuario);
    return respuesta.data;
  },
  async eliminar(id) {
    await usuariosApi.delete(`/api/usuarios/${id}`);
  },
};

export default usuarioService;
