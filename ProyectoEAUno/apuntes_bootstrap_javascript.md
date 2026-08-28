# Introducción a Bootstrap y JavaScript

Apuntes de apoyo para estructura, componentes, espaciado, alineación y
organización básica de un proyecto web.

## 1. Implementar Bootstrap 5

En el `<head>` agregamos el CSS de Bootstrap:

```html
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>
```

Al final del `<body>` agregamos el JavaScript de Bootstrap:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"></script>
```

Si además tienes tu propio `style.css`, colócalo después de Bootstrap:

```html
<!-- Bootstrap -->
<link
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
  rel="stylesheet"
/>

<!-- Mi CSS -->
<link rel="stylesheet" href="css/style.css" />
```

## 2. Principales elementos de una página web

Elemento Bootstrap ¿Para qué se usa?

---

```text
| Elemento       | Bootstrap            | ¿Para qué se usa?                 |
| -------------- | -------------------- | --------------------------------- |
| **Navbar**     | `.navbar`            | Barra de navegación               |
| **Container**  | `.container`         | Contenedor principal de la página |
| **Grid**       | `.row`, `.col-*`     | Organizar contenido en columnas   |
| **Buttons**    | `.btn`               | Botones                           |
| **Forms**      | `.form-control`      | Formularios                       |
| **Cards**      | `.card`              | Mostrar contenido agrupado        |
| **Alerts**     | `.alert`             | Mensajes al usuario               |
| **Tables**     | `.table`             | Mostrar datos tabulares           |
| **Modal**      | `.modal`             | Ventanas emergentes               |
| **List Group** | `.list-group`        | Listados                          |
| **Badge**      | `.badge`             | Etiquetas/estados                 |
| **Pagination** | `.pagination`        | Navegación entre páginas          |
| **Dropdown**   | `.dropdown`          | Menús desplegables                |
| **Accordion**  | `.accordion`         | Contenido expandible              |
| **Carousel**   | `.carousel`          | Galería/slideshow de imágenes     |
| **Footer**     | Utilidades Bootstrap | Pie de página                     |
```

## Estructura de la pagina web:

<html>
│
├── <head>
│      Configuración
│      CSS
│      título
│
└── <body>  ← TODO el contenido de la página
       │
       ├── <header>
       │      └── <nav>
       │
       ├── <main>  ← CONTENIDO PRINCIPAL
       │      └── <div class="container">
       │
       └── <footer>

```text
| Elemento     | Tecnología     | Función                                   |
| ------------ | -------------- | ----------------------------------------- |
| `<body>`     | HTML           | Contiene todo el cuerpo de la página      |
| `<main>`     | HTML semántico | Identifica el contenido principal         |
| `.container` | Bootstrap      | Controla el ancho y organiza el contenido |
| `.row`       | Bootstrap      | Crea una fila del Grid                    |
| `.col-*`     | Bootstrap      | Divide la fila en columnas                |
```

### Ejemplo de estructura visual

```text
┌─────────────────────────────────────────────┐
│ NAVBAR                                      │
├─────────────────────────────────────────────┤
│                                             │
│ CONTAINER                                   │
│                                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ CARD     │  │ CARD     │  │ CARD     │   │
│  │          │  │          │  │          │   │
│  │ BUTTON   │  │ BUTTON   │  │ BUTTON   │   │
│  └──────────┘  └──────────┘  └──────────┘   │
│                                             │
│ FORMULARIO                                  │
│ ┌─────────────────────────────────────────┐ │
│ │ INPUT                                   │ │
│ └─────────────────────────────────────────┘ │
│                                             │
│ BUTTON                                      │
│                                             │
├─────────────────────────────────────────────┤
│ FOOTER                                      │
└─────────────────────────────────────────────┘
```

```text
┌──────────────────────────────────────────────┐
│ NAVBAR                                       │
│   ┌─────────── CONTAINER ────────────────┐   │
│   │ Logo                    Menú         │   │
│   └──────────────────────────────────────┘   │
├──────────────────────────────────────────────┤
│                                              │
│   ┌─────────── CONTAINER ────────────────┐   │
│   │                                      │   │
│   │       Contenido principal            │   │
│   │                                      │   │
│   └──────────────────────────────────────┘   │
│                                              │
│   ┌─────────── CONTAINER ────────────────┐   │
│   │       Otra sección                   │   │
│   └──────────────────────────────────────┘   │
│                                              │
├──────────────────────────────────────────────┤
│ FOOTER                                       │
│   ┌─────────── CONTAINER ────────────────┐   │
│   │ Copyright              Contacto      │   │
│   └──────────────────────────────────────┘   │
└──────────────────────────────────────────────┘
```

## GRID

las grillas (Grid) de Bootstrap son el sistema que permite organizar el contenido de una página en filas y columnas, además de hacer que esa distribución sea responsive.

Bootstrap divide una fila en 12 columnas:

```text
┌─────────────────────────────────────────────────────┐
│                    CONTAINER                        │
│                                                     │
│  ┌──────────────────── ROW ──────────────────────┐  │
│  │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │12 │  │
│  └───────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Estructura básica

Normalmente trabajamos con tres niveles:

<div class="container">
    <div class="row">
        <div class="col">
            Columna 1
        </div>
        <div class="col">
            Columna 2
        </div>
    </div>
</div>

Podremos verlo de esta forma:
container
│
└── row
│
├── col
│
└── col

.container → contiene el contenido.
.row → crea una fila.
.col → crea una columna.

### Las 12 columnas de Bootstrap

```text
             12 columnas disponibles
┌──────────────────────┬──────────────────────┐
│       col-6          │        col-6         │
│                      │                      │
│      Izquierda       │       Derecha        │
└──────────────────────┴──────────────────────┘
          6                       6

                  6 + 6 = 12
```

### Podemos hacer columnas de diferentes tamaños

Ej:

<div class="row">
    <div class="col-4">Menú</div>
    <div class="col-8">Contenido</div>
</div>
```text
┌──────────────┬──────────────────────────────┐
│    col-4     │            col-8             │
│              │                              │
│     Menú     │          Contenido           │
│              │                              │
└──────────────┴──────────────────────────────┘
```
       4                     8

                 4 + 8 = 12

### Tres columnas iguales

EJ:

<div class="row">
    <div class="col-4">Card 1</div>
    <div class="col-4">Card 2</div>
    <div class="col-4">Card 3</div>
</div>
```text
┌──────────────┬──────────────┬──────────────┐
│    col-4     │    col-4     │    col-4     │
│              │              │              │
│    Card 1    │    Card 2    │    Card 3    │
└──────────────┴──────────────┴──────────────┘
```
      4              4              4

               4 + 4 + 4 = 12

### No es obligatorio especificar el número

EJ:

<div class="row">
    <div class="col">Uno</div>
    <div class="col">Dos</div>
    <div class="col">Tres</div>
</div>

Bootstrap automáticamente divide el espacio disponible entre las columnas:

```text
┌──────────────┬──────────────┬──────────────┐
│     col      │     col      │     col      │
│     Uno      │     Dos      │     Tres     │
└──────────────┴──────────────┴──────────────┘
```

### Lo más importante: Responsive

Ej:

<div class="row">
    <div class="col-12 col-md-4">
        Card 1
    </div>
    <div class="col-12 col-md-4">
        Card 2
    </div>
    <div class="col-12 col-md-4">
        Card 3
    </div>
</div>

col-12
│
└── ocupa 12 columnas normalmente

col-md-4
│ │
│ └── ocupa 4 columnas
│
└───── desde tamaño "md"

### Breakpoints

```text
| Clase       | Desde aproximadamente | Uso típico            |
| ----------- | --------------------: | --------------------- |
| `col-*`     |                  0 px | Celulares             |
| `col-sm-*`  |                576 px | Celulares grandes     |
| `col-md-*`  |                768 px | Tablets               |
| `col-lg-*`  |                992 px | Notebook/escritorio   |
| `col-xl-*`  |               1200 px | Pantallas grandes     |
| `col-xxl-*` |               1400 px | Pantallas muy grandes |
```

```text
CELULAR

┌─────────────────────────────┐
│          col-12             │
│            100%             │
└─────────────────────────────┘


TABLET

┌──────────────┬──────────────┐
│    col-6     │    col-6     │
│     50%      │     50%      │
└──────────────┴──────────────┘


COMPUTADOR

┌─────────┬─────────┬─────────┐
│  col-4  │  col-4  │  col-4  │
│   33%   │   33%   │   33%   │
└─────────┴─────────┴─────────┘
```

### Mas de 12

Si se superan las 12 la ultima columna queda con menos "espacio" o baja hasta sumar 12

### g-\*: espacio entre columnas

EJ:

<div class="row g-3">
    <div class="col-4">
        Card 1
    </div>
    <div class="col-4">
        Card 2
    </div>
    <div class="col-4">
        Card 3
    </div>
</div>

Existe:
g-_ → separación general
gx-_ → separación horizontal
gy-\* → separación vertical

### Entructura HTML

<html>
│
├── <head>
│      Configuración
│      CSS
│      título
│
└── <body>  ← TODO el contenido de la página
       │
       ├── <header>
       │      └── <nav>
       │
       ├── <main>  ← CONTENIDO PRINCIPAL
       │      └── <div class="container">
       │
       └── <footer>

## 3. Márgenes de elementos

```text
                     mt
                 margin-top
                      ↑
                      │
              ┌───────────────┐
              │               │
     ms  ←────│    ELEMENTO   │────→  me
              │               │
              └───────────────┘
                      │
                      ↓
                     mb
                margin-bottom
```

Clase Significado CSS equivalente

---

`m` Todos los lados `margin`
`mt` Arriba `margin-top`
`mb` Abajo `margin-bottom`
`ms` Izquierda / inicio `margin-left`
`me` Derecha / final `margin-right`
`mx` Horizontal ↔ izquierda + derecha
`my` Vertical ↕ arriba + abajo

> **Recordemos:** Bootstrap se trabaja principalmente mediante clases.

## 4. Ordenar y alinear elementos

Antes de elegir una clase conviene preguntarse:

- ¿Quiero alinear horizontalmente o verticalmente?
- ¿Quiero mover un elemento o distribuir varios?

### 4.1. `d-flex`: activar Flexbox

```html
<div class="d-flex">
  <button class="btn btn-primary">Guardar</button>
  <button class="btn btn-danger">Eliminar</button>
</div>
```

### 4.2. Alinear horizontalmente: `justify-content-*`

**Inicio:**

```html
<div class="d-flex justify-content-start"></div>
```

```text
┌──────────────────────────────────────────┐
│ [Uno] [Dos] [Tres]                       │
└──────────────────────────────────────────┘
```

**Centro:**

```html
<div class="d-flex justify-content-center"></div>
```

```text
┌──────────────────────────────────────────┐
│            [Uno] [Dos] [Tres]            │
└──────────────────────────────────────────┘
```

**Final:**

```html
<div class="d-flex justify-content-end"></div>
```

```text
┌──────────────────────────────────────────┐
│                       [Uno] [Dos] [Tres] │
└──────────────────────────────────────────┘
```

### 4.3. Separar elementos

**`justify-content-between`:**

```html
<div class="d-flex justify-content-between">
  <button class="btn btn-primary">Anterior</button>
  <button class="btn btn-primary">Siguiente</button>
</div>
```

```text
┌──────────────────────────────────────────┐
│ [Anterior]                    [Siguiente]│
└──────────────────────────────────────────┘
```

**`justify-content-around`:** agrega espacio alrededor.

```html
<div class="d-flex justify-content-around"></div>
```

```text
┌──────────────────────────────────────────┐
│   [Uno]       [Dos]       [Tres]         │
└──────────────────────────────────────────┘
```

**`justify-content-evenly`:** distribuye el espacio uniformemente.

```html
<div class="d-flex justify-content-evenly"></div>
```

```text
┌──────────────────────────────────────────┐
│    [Uno]      [Dos]      [Tres]          │
└──────────────────────────────────────────┘
```

### 4.4. Alinear verticalmente: `align-items-*`

Clases principales:

```text
align-items-start
align-items-center
align-items-end
```

Ejemplo:

```html
<div class="d-flex align-items-center" style="height: 200px;">
  <button class="btn btn-primary">Guardar</button>
</div>
```

```text
┌───────────────────────────────┐
│                               │
│                               │
│        [ Guardar ]            │ ← centro vertical
│                               │
│                               │
└───────────────────────────────┘
```

### 4.5. Centrar completamente un elemento

```html
<div class="d-flex justify-content-center align-items-center">
  <button class="btn btn-primary">Guardar</button>
</div>
```

Para centrarlo respecto de toda la pantalla:

```html
<div class="d-flex justify-content-center align-items-center min-vh-100">
  <button class="btn btn-primary">Guardar</button>
</div>
```

```text
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│                                         │
│              [ Guardar ]                │
│                                         │
│                                         │
│                                         │
└─────────────────────────────────────────┘
```

### 4.6. `gap-*`: separar elementos

```html
<div class="d-flex gap-3">
  <button class="btn btn-primary">Guardar</button>
  <button class="btn btn-danger">Eliminar</button>
</div>
```

```text
[Uno]   [Dos]   [Tres]   [Cuatro]
      ↑       ↑        ↑
             gap-3
```

### 4.7. Cambiar la dirección

Por defecto `d-flex` coloca los elementos en una fila:

```html
<div class="d-flex"></div>
```

```text
[Uno] [Dos] [Tres]
```

Para colocarlos verticalmente:

```html
<div class="d-flex flex-column"></div>
```

```text
[Uno]
[Dos]
[Tres]
```

## 5. Estructura sencilla de un proyecto HTML

```text
mi-proyecto/
│
├── index.html
│
├── pages/
│   ├── login.html
│   ├── registro.html
│   └── contacto.html
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
├── img/
│   ├── logo.png
│   ├── banner.jpg
│   └── productos/
│       ├── producto1.jpg
│       └── producto2.jpg
│
└── README.md
```

Elemento Contenido

---

```text
| Elemento     | Contenido                              |
| ------------ | -------------------------------------- |
| `index.html` | Página principal del sitio             |
| `pages/`     | Páginas HTML secundarias               |
| `css/`       | Hojas de estilo CSS                    |
| `js/`        | Archivos JavaScript                    |
| `img/`       | Imágenes                               |
| `README.md`  | Información/documentación del proyecto |
```

## 6. JavaScript

**JavaScript (JS)** es un lenguaje de programación utilizado
principalmente para agregar comportamiento e interactividad a las
páginas web.

Tecnología Función Ejemplo

---

```text
| Tecnología          | Función        | Ejemplo                            |
| ------------------- | -------------- | ---------------------------------- |
| **HTML**            | Estructura     | Botones, títulos, formularios      |
| **CSS / Bootstrap** | Apariencia     | Colores, tamaños, posiciones       |
| **JavaScript**      | Comportamiento | Validar, calcular, mostrar/ocultar |
```

### Ejemplo

HTML crea el botón:

```html
<button id="btnSaludar" class="btn btn-primary">Saludar</button>
```

JavaScript puede hacer que ocurra algo cuando se presiona:

```javascript
document.getElementById("btnSaludar").addEventListener("click", function () {
  alert("¡Hola!");
});
```

Podemos pensarlo así:

```text
HTML                  CSS / Bootstrap              JavaScript
  │                          │                          │
  ▼                          ▼                          ▼
¿Qué hay?              ¿Cómo se ve?               ¿Qué hace?

<button>                btn-primary               click
<input>                 mt-3                      validar
<h1>                    text-center               modificar
<form>                  container                 enviar
```

### ¿Qué podemos hacer con JavaScript?

- Detectar cuando el usuario presiona un botón.
- Validar los datos de un formulario.
- Realizar cálculos.
- Cambiar contenido HTML.
- Mostrar u ocultar elementos.
- Cambiar estilos.
- Crear elementos dinámicamente.
- Consumir información de una API.
- Actualizar partes de una página sin recargarla completamente.
