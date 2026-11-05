import { productosApi } from "./api.js";

// NUEVO: cada método corresponde a una operación HTTP REST.
const productoService = {
  async listar() {
    const respuesta = await productosApi.get("/api/productos");
    return respuesta.data;
  },
  async buscar(id) {
    const respuesta = await productosApi.get(`/api/productos/${id}`);
    return respuesta.data;
  },
  async crear(producto) {
    const respuesta = await productosApi.post("/api/productos", producto);
    return respuesta.data;
  },
  async actualizar(id, producto) {
    const respuesta = await productosApi.put(`/api/productos/${id}`, producto);
    return respuesta.data;
  },
  async eliminar(id) {
    await productosApi.delete(`/api/productos/${id}`);
  },
};

export default productoService;
