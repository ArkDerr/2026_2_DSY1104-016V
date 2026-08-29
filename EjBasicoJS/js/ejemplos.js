const nombreuno = "Camila";
let edaduno = 10;
const altura = 1.68;
const estudiante = true;
let curso;

edaduno = edaduno + 1;

console.log(nombreuno);
console.log("La edad es: " + edaduno);


if (edaduno >= 18) {
    console.log("Es mayor de edad");
} else {
    console.log("Es menor de edad");
}

function sumar(num1, num2){
    return num1+num2;
}

const total = sumar(1,3);
console.log("El total de la suma es: " + total);

const titulo = document.getElementById("titulo");
console.log(titulo);

const parrafo = document.querySelector(".description");
console.log(parrafo);

const butonuno = document.getElementById("btnSaludar");
const saludo = document.getElementById("mensajeSaludar");

butonuno.addEventListener("click", function(){
    saludo.textContent = "HOLA DANIEL";
})

const tarjeta = document.getElementById("tarjeta");

tarjeta.addEventListener("mouseover", function(){
    tarjeta.style.backgroundColor = "red";
    tarjeta.textContent = "El mouse activo la funcion"
})

tarjeta.addEventListener("mouseout", function(){
    tarjeta.style.backgroundColor = "white";
    tarjeta.textContent = "Pasa el mouse sobre este texto"
})

const btnMostrar = document.getElementById("btnMostrar");
const txtImput = document.getElementById("txtNombre");
const salidaParrafo = document.getElementById("TextoSalida");

btnMostrar.addEventListener("click", function(){
    let elTexto = txtImput.value.trim();
    
    if (elTexto === "") {
        salidaParrafo.textContent = "Debes escribir algo en el imput"
    } else {
        salidaParrafo.textContent = "Esto es lo que escribiste " + elTexto;
    }
});

const btnCambiar = document.getElementById("btnCambiar");
const txtTitulo = document.getElementById("textoCambiar");

btnCambiar.addEventListener("click", function(){
    txtTitulo.textContent = "Nuevo Titulo";
    btnCambiar.textContent = "Accion Realizada";
    btnCambiar.disabled = true;
});

const btnAgregar = document.getElementById("btnAgregar");
const nuevaTarea = document.getElementById("nuevaTarea");
const listaTareas = document.getElementById("listaTareas");

btnAgregar.addEventListener("click", function(){
    const texto = nuevaTarea.value.trim();

    if (texto === "") {
        return;
    }

    const item = document.createElement("li");
    item.textContent = texto;

    item.addEventListener("click", function(){
        item.remove;
    });
    listaTareas.appendChild(item);
        nuevaTarea.value = "";
    }
);