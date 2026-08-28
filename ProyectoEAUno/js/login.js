// Obtenemos el formulario desde el HTML.
const formulario = document.getElementById("formLogin");

// Escuchamos cuando el usuario presiona el botón Ingresar.
formulario.addEventListener("submit", function(evento) {

    // Evita que el formulario recargue la página.
    evento.preventDefault();

    // Obtenemos lo escrito en el campo usuario.
    const usuario = document.getElementById("usuario").value;

    // Obtenemos lo escrito en el campo contraseña.
    const password = document.getElementById("password").value;

    // Validamos los datos.
    if (usuario === "admin@admin.cl" && password === "123456") {

        alert("Ingreso correcto");

        // Redirigimos a la página principal.
        window.location.href = "/pages/principal.html";

    } else {

        alert("Usuario o contraseña incorrectos");

    }

});