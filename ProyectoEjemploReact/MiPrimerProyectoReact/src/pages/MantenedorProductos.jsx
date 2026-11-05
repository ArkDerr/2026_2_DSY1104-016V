/*
 * ARCHIVO: src/pages/MantenedorProductos.jsx
 *
 * OBJETIVO:
 * Construir una página para administrar los productos
 * almacenados en nuestro microservicio Spring Boot.
 *
 * OPERACIONES:
 * GET:    Consultar todos los productos.
 * POST:   Crear un producto.
 * PUT:    Modificar un producto existente.
 * DELETE: Eliminar un producto.
 *
 * Utilizaremos:
 * - useState: para administrar los estados del componente.
 * - useEffect: para cargar los productos al abrir la página.
 * - useCallback: para conservar la referencia de la función
 *   que utilizamos para consultar productos.
 * - productoService: para comunicarnos con Spring Boot.
 */

// ==========================================================
// 1. IMPORTACIONES
// ==========================================================

// Importamos los Hooks que utilizaremos desde React.
import { useCallback, useEffect, useState } from "react";

// Importamos el servicio que contiene los métodos REST.
// Este servicio utiliza Axios para comunicarse con Spring Boot.
import productoService from "../services/productoService.js";

// ==========================================================
// 2. CONFIGURACIÓN DEL FORMULARIO
// ==========================================================

// Definimos un objeto con los valores iniciales del formulario.
//
// Lo utilizaremos:
// 1. Cuando abrimos el mantenedor.
// 2. Cuando queremos crear un producto nuevo.
// 3. Cuando limpiamos el formulario.
//
// Los valores se almacenan como texto porque los inputs
// HTML entregan sus valores como cadenas.
const FORMULARIO_VACIO = {
  nombre: "",
  descripcion: "",
  precio: "",
  stock: "",
  imagen: "",
};

// ==========================================================
// 3. COMPONENTE PRINCIPAL
// ==========================================================

// export default permite importar este componente
// desde App.jsx para incorporarlo a las rutas.
//
// La función devuelve JSX con el formulario y la tabla.
export default function MantenedorProductos() {
  // ========================================================
  // 4. ESTADOS DEL COMPONENTE
  // ========================================================

  // Almacena la lista de productos recibidos desde Spring Boot.
  // Inicialmente es un arreglo vacío.
  const [productos, setProductos] = useState([]);

  // Almacena los valores que el usuario escribe en el formulario.
  //
  // El operador spread (...) copia las propiedades
  // del objeto FORMULARIO_VACIO.
  const [formulario, setFormulario] = useState({
    ...FORMULARIO_VACIO,
  });

  // Almacena el ID del producto que estamos editando.
  //
  // null significa que NO estamos editando:
  // el formulario se utilizará para CREAR.
  //
  // Si contiene un ID, el formulario se utilizará
  // para ACTUALIZAR ese producto.
  const [idEdicion, setIdEdicion] = useState(null);

  // Indica si estamos esperando la lista de productos.
  // Inicialmente es true porque todavía no consultamos la API.
  const [cargando, setCargando] = useState(true);

  // Indica si estamos guardando un producto.
  // Lo utilizamos para deshabilitar el botón Guardar
  // mientras se ejecuta POST o PUT.
  const [guardando, setGuardando] = useState(false);

  // Almacena mensajes de error para mostrarlos al usuario.
  const [error, setError] = useState("");

  // Almacena mensajes de éxito, por ejemplo:
  // "Producto creado correctamente".
  const [mensaje, setMensaje] = useState("");

  // ========================================================
  // 5. CONSULTAR PRODUCTOS (GET)
  // ========================================================

  // useCallback conserva la referencia de esta función
  // entre renderizaciones, mientras sus dependencias
  // no cambien.
  //
  // async indica que la función realizará operaciones
  // asíncronas mediante await.
  //
  // El arreglo [] significa que no depende de valores
  // reactivos cambiantes.
  const cargarProductos = useCallback(async () => {
    // try permite intentar ejecutar instrucciones
    // que podrían generar un error.
    try {
      // Llamamos al método listar() de productoService.js.
      //
      // Este método realiza un GET al microservicio:
      // http://localhost:8081/api/productos
      //
      // await espera la resolución de la promesa.
      //
      // En nuestra implementación, listar() devuelve
      // directamente los datos de los productos.
      const datos = await productoService.listar();

      // Guardamos la lista recibida en el estado productos.
      // React actualizará automáticamente la tabla.
      setProductos(datos);

      // Limpiamos cualquier error anterior.
      setError("");
    } catch {
      // Si ocurre un error, mostramos un mensaje.
      setError("No se pudo obtener la lista de productos.");
    } finally {
      // finally se ejecuta tanto si la consulta
      // terminó correctamente como si falló.
      //
      // Indicamos que terminó la carga.
      setCargando(false);
    }
  }, []);

  // ========================================================
  // 6. EJECUTAR GET AL ABRIR EL COMPONENTE
  // ========================================================

  // useEffect ejecuta el efecto cuando React monta
  // el componente y cuando cambian sus dependencias.
  useEffect(() => {
    // Llamamos a la función que consulta los productos.
    //
    // void indica que deliberadamente ignoramos
    // el valor devuelto por la función asíncrona.
    // NO significa que la función no se ejecute.
    void cargarProductos();

    // Este arreglo indica que el efecto depende
    // de la referencia de cargarProductos.
    //
    // Como utilizamos useCallback(..., []),
    // normalmente esa referencia se mantiene estable.
  }, [cargarProductos]);

  // ========================================================
  // 7. ACTUALIZAR LOS CAMPOS DEL FORMULARIO
  // ========================================================

  // Esta función se ejecuta cuando el usuario escribe
  // en cualquiera de los inputs o en el textarea.
  //
  // evento representa el evento generado por el navegador.
  function cambiarCampo(evento) {
    // evento.target representa el input que cambió.
    //
    // name: nombre del campo HTML.
    // value: valor que escribió el usuario.
    //
    // Ejemplo:
    // evento.target.name  = "nombre"
    // evento.target.value = "Teclado Gamer"
    //
    // Utilizamos desestructuración para obtener ambos.
    const { name, value } = evento.target;

    // Actualizamos el estado formulario.
    //
    // anterior contiene los valores previos.
    //
    // ...anterior copia todos esos valores.
    //
    // [name]: value modifica únicamente la propiedad
    // cuyo nombre coincide con el atributo name del input.
    //
    // Ejemplo:
    // Si name = "precio" y value = "39990",
    // solamente se actualiza formulario.precio.
    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  }

  // ========================================================
  // 8. LIMPIAR EL FORMULARIO
  // ========================================================

  function limpiarFormulario() {
    // Restablecemos todos los campos a sus valores iniciales.
    setFormulario({ ...FORMULARIO_VACIO });

    // Eliminamos el ID de edición.
    //
    // Al quedar null, el formulario vuelve
    // a funcionar en modo CREAR.
    setIdEdicion(null);
  }

  // ========================================================
  // 9. PREPARAR LA EDICIÓN DE UN PRODUCTO
  // ========================================================

  // Recibimos como parámetro el producto seleccionado
  // desde una fila de la tabla.
  function comenzarEdicion(producto) {
    // Guardamos su ID para saber qué producto modificaremos.
    setIdEdicion(producto.id);

    // Cargamos los datos seleccionados en el formulario.
    setFormulario({
      // El operador ?? utiliza "" cuando el valor
      // es null o undefined.
      nombre: producto.nombre ?? "",

      descripcion: producto.descripcion ?? "",

      // String() convierte el precio a texto.
      // Los inputs trabajan con valores de tipo string.
      precio: String(producto.precio ?? ""),

      // Convertimos el stock a texto.
      stock: String(producto.stock ?? ""),

      imagen: producto.imagen ?? "",
    });

    // Limpiamos mensajes anteriores.
    setMensaje("");
    setError("");
  }

  // ========================================================
  // 10. CREAR O ACTUALIZAR PRODUCTO (POST / PUT)
  // ========================================================

  // Esta función se ejecuta al enviar el formulario.
  //
  // async permite esperar las respuestas HTTP con await.
  async function guardar(evento) {
    // Evita que el navegador recargue la página
    // al enviar el formulario HTML.
    evento.preventDefault();

    // Limpiamos los mensajes anteriores.
    setError("");
    setMensaje("");

    // Construimos el objeto que enviaremos al backend.
    const producto = {
      // Copiamos los campos del formulario.
      ...formulario,

      // trim() elimina espacios al inicio y final.
      nombre: formulario.nombre.trim(),

      // Number() convierte los textos a números.
      // Esto es necesario porque los inputs HTML
      // entregan sus valores como cadenas.
      precio: Number(formulario.precio),

      stock: Number(formulario.stock),
    };

    // ======================================================
    // 10.1. VALIDAR LOS DATOS
    // ======================================================

    // Verificamos:
    //
    // !producto.nombre:
    // El nombre no puede quedar vacío.
    //
    // producto.precio < 0:
    // El precio no puede ser negativo.
    //
    // !Number.isFinite(producto.precio):
    // El precio debe ser un número finito.
    //
    // !Number.isInteger(producto.stock):
    // El stock debe ser un número entero.
    //
    // producto.stock < 0:
    // El stock no puede ser negativo.
    //
    // || significa OR: basta una condición verdadera
    // para considerar inválido el producto.
    if (
      !producto.nombre ||
      producto.precio < 0 ||
      !Number.isFinite(producto.precio) ||
      !Number.isInteger(producto.stock) ||
      producto.stock < 0
    ) {
      // Mostramos un mensaje de validación.
      setError("Revisa el nombre, el precio y el stock.");

      // Detenemos la función: NO enviamos la petición HTTP.
      return;
    }

    // ======================================================
    // 10.2. INDICAR QUE ESTAMOS GUARDANDO
    // ======================================================

    // Cambiamos el estado a true.
    // El botón Guardar quedará deshabilitado.
    setGuardando(true);

    // ======================================================
    // 10.3. EJECUTAR POST O PUT
    // ======================================================

    try {
      // Comprobamos si estamos creando o editando.
      if (idEdicion === null) {
        // No existe ID de edición:
        // enviamos POST para crear un producto nuevo.
        await productoService.crear(producto);

        // Informamos que el producto fue creado.
        setMensaje("Producto creado correctamente.");
      } else {
        // Existe un ID:
        // enviamos PUT para modificar ese producto.
        await productoService.actualizar(idEdicion, producto);

        // Informamos que se actualizó correctamente.
        setMensaje("Producto actualizado correctamente.");
      }

      // Si la petición fue exitosa, limpiamos el formulario.
      limpiarFormulario();

      // Ejecutamos nuevamente GET para obtener la
      // lista actualizada de productos desde Spring Boot.
      //
      // Así actualizamos la tabla sin recargar el navegador.
      await cargarProductos();
    } catch (errorPeticion) {
      // Si la operación HTTP falla, analizamos el error.
      //
      // errorPeticion.response?.status:
      // Obtiene el código HTTP si existe una respuesta.
      //
      // HTTP 403 normalmente indica que el usuario
      // autenticado no tiene permisos suficientes.
      setError(
        errorPeticion.response?.status === 403
          ? "No tienes permisos ADMIN para guardar productos."
          : "No se pudo guardar el producto.",
      );
    } finally {
      // Terminó el intento de guardado.
      //
      // React volverá a habilitar el botón.
      setGuardando(false);
    }
  }

  // ========================================================
  // 11. ELIMINAR PRODUCTO (DELETE)
  // ========================================================

  // Recibimos el producto seleccionado de la tabla.
  async function eliminar(producto) {
    // Mostramos una ventana de confirmación.
    //
    // window.confirm() devuelve:
    // true: usuario acepta.
    // false: usuario cancela.
    //
    // Si cancela, ! invierte false a true
    // y return termina inmediatamente la función.
    if (!window.confirm(`¿Eliminar ${producto.nombre}?`)) {
      return;
    }

    // Limpiamos los mensajes anteriores.
    setError("");
    setMensaje("");

    try {
      // Solicitamos al backend eliminar el producto.
      //
      // Se realiza:
      // DELETE /api/productos/{id}
      await productoService.eliminar(producto.id);

      // Si estábamos editando el mismo producto
      // que acabamos de eliminar, limpiamos el formulario.
      if (idEdicion === producto.id) {
        limpiarFormulario();
      }

      // Consultamos nuevamente los productos registrados.
      // Así desaparece el producto eliminado de la tabla.
      await cargarProductos();

      // Mostramos el mensaje de éxito.
      setMensaje("Producto eliminado correctamente.");
    } catch {
      // Mostramos un mensaje si la eliminación falla.
      setError("No fue posible eliminar el producto.");
    }
  }

  // ========================================================
  // 12. INTERFAZ VISUAL (JSX)
  // ========================================================

  // return devuelve los elementos que React mostrará.
  return (
    // section agrupa todo el contenido del mantenedor.
    <section className="mantenedor">
      <h1>Mantenedor de productos</h1>

      {/* Clase Bootstrap mb-3: margen inferior. */}
      <p className="mb-3">Administración mediante GET, POST, PUT y DELETE.</p>

      {/* ================================================== */}
      {/* 12.1. MOSTRAR MENSAJES                            */}
      {/* ================================================== */}

      {/* Si error contiene texto, mostramos una alerta roja. */}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Si mensaje contiene texto, mostramos alerta verde. */}
      {mensaje && <div className="alert alert-success">{mensaje}</div>}

      {/* ================================================== */}
      {/* 12.2. FORMULARIO DE PRODUCTOS                     */}
      {/* ================================================== */}

      {/* onSubmit={guardar} indica que React ejecutará
          guardar(evento) al enviar el formulario. */}
      <form className="card card-body mb-4" onSubmit={guardar}>
        {/* El título cambia dependiendo del modo.
            null = Crear.
            Un ID = Editar. */}
        <h2 className="h5">
          {idEdicion === null ? "Crear producto" : "Editar producto"}
        </h2>

        {/* Sistema de filas y columnas de Bootstrap. */}
        <div className="row g-3">
          {/* ============================================== */}
          {/* CAMPO NOMBRE                                   */}
          {/* ============================================== */}

          <div className="col-md-6">
            <label htmlFor="prod-nombre" className="form-label">
              Nombre *
            </label>

            <input
              // id identifica el input y lo relaciona con label.
              id="prod-nombre"
              // name identifica la propiedad del formulario.
              name="nombre"
              // Aplica los estilos de Bootstrap.
              className="form-control"
              // Input controlado: su valor viene del estado.
              value={formulario.nombre}
              // Ejecuta cambiarCampo al escribir.
              onChange={cambiarCampo}
              // Campo obligatorio en la validación HTML.
              required
            />
          </div>

          {/* ============================================== */}
          {/* CAMPO IMAGEN                                   */}
          {/* ============================================== */}

          <div className="col-md-6">
            <label htmlFor="prod-imagen" className="form-label">
              URL de imagen
            </label>

            <input
              id="prod-imagen"
              name="imagen"
              className="form-control"
              value={formulario.imagen}
              onChange={cambiarCampo}
            />
          </div>

          {/* ============================================== */}
          {/* CAMPO DESCRIPCIÓN                              */}
          {/* ============================================== */}

          <div className="col-12">
            <label htmlFor="prod-descripcion" className="form-label">
              Descripción
            </label>

            {/* textarea permite ingresar texto multilínea.
                rows="2" establece dos filas visibles. */}
            <textarea
              id="prod-descripcion"
              name="descripcion"
              className="form-control"
              value={formulario.descripcion}
              onChange={cambiarCampo}
              rows="2"
            />
          </div>

          {/* ============================================== */}
          {/* CAMPO PRECIO                                   */}
          {/* ============================================== */}

          <div className="col-md-6">
            <label htmlFor="prod-precio" className="form-label">
              Precio *
            </label>

            <input
              id="prod-precio"
              name="precio"
              // type="number" permite ingresar números.
              type="number"
              // No permite valores negativos en la
              // validación nativa del navegador.
              min="0"
              // Permite incrementos de 0.01.
              step="0.01"
              className="form-control"
              value={formulario.precio}
              onChange={cambiarCampo}
              required
            />
          </div>

          {/* ============================================== */}
          {/* CAMPO STOCK                                    */}
          {/* ============================================== */}

          <div className="col-md-6">
            <label htmlFor="prod-stock" className="form-label">
              Stock *
            </label>

            <input
              id="prod-stock"
              name="stock"
              type="number"
              // El stock no puede ser negativo.
              min="0"
              // Incrementos de una unidad.
              step="1"
              className="form-control"
              value={formulario.stock}
              onChange={cambiarCampo}
              required
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* 12.3. BOTONES DEL FORMULARIO                      */}
        {/* ================================================= */}

        <div className="d-flex gap-2 mt-3">
          {/* Botón principal del formulario. */}
          <button
            className="btn btn-primary"
            // Mientras guardando sea true, se deshabilita.
            disabled={guardando}
            // submit ejecuta el onSubmit del formulario.
            type="submit"
          >
            {/* Operador ternario:
                Si guardando es true, mostramos "Guardando".
                Si no, comprobamos idEdicion:
                - null: "Crear"
                - un ID: "Guardar cambios" */}
            {guardando
              ? "Guardando..."
              : idEdicion === null
                ? "Crear"
                : "Guardar cambios"}
          </button>

          {/* Botón para cancelar la edición o limpiar. */}
          <button
            className="btn btn-secondary"
            // type="button" evita enviar el formulario.
            type="button"
            // Ejecuta la función que limpia el formulario.
            onClick={limpiarFormulario}
          >
            Cancelar / limpiar
          </button>
        </div>
      </form>

      {/* ================================================== */}
      {/* 12.4. TABLA DE PRODUCTOS                          */}
      {/* ================================================== */}

      <h2 className="h4">Productos registrados</h2>

      {/* Operador ternario:
          Si cargando = true mostramos "Cargando".
          Si cargando = false mostramos la tabla. */}
      {cargando ? (
        <p>Cargando...</p>
      ) : (
        // Bootstrap permite desplazamiento horizontal
        // de la tabla cuando la pantalla es pequeña.
        <div className="table-responsive">
          <table className="table table-striped table-bordered align-middle">
            {/* Encabezados de la tabla. */}
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {/* map() recorre el arreglo de productos
                  y genera una fila por cada producto. */}
              {productos.map((producto) => (
                // key permite a React identificar cada fila.
                <tr key={producto.id}>
                  <td>{producto.id}</td>

                  <td>{producto.nombre}</td>

                  {/* Convertimos el precio a Number y
                      lo formateamos según es-CL. */}
                  <td>${Number(producto.precio).toLocaleString("es-CL")}</td>

                  <td>{producto.stock}</td>

                  <td>
                    {/* Botón Editar:
                        envía el producto seleccionado a
                        comenzarEdicion(). */}
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => comenzarEdicion(producto)}
                    >
                      Editar
                    </button>

                    {/* Botón Eliminar:
                        envía el producto seleccionado a
                        eliminar(). */}
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => eliminar(producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}

              {/* Si el arreglo está vacío,
                  mostramos una fila informativa. */}
              {productos.length === 0 && (
                <tr>
                  {/* colSpan="5" ocupa las cinco columnas. */}
                  <td colSpan="5">No existen productos registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
