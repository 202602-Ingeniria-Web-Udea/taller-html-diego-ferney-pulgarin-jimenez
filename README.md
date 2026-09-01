# PokéApp — PokéAPI

## Descripción

Mini aplicación web interactiva que permite buscar y explorar Pokémon utilizando
los datos oficiales de la [PokéAPI](https://pokeapi.co). Al abrir la página se
muestran los 10 primeros Pokémon y, mediante un campo de búsqueda, se puede
consultar cualquier Pokémon por su nombre. Cada resultado muestra la imagen, el
nombre y los tipos del Pokémon, todo renderizado dinámicamente desde JavaScript.

## Tecnologías

* HTML5
* CSS3
* JavaScript (ES6+)
* PokéAPI

## Funcionalidades

* Carga inicial de al menos 10 Pokémon con imagen, nombre y tipos.
* Búsqueda de Pokémon por nombre (ignora espacios y mayúsculas/minúsculas).
* Búsqueda ejecutable con el botón "Buscar" o presionando `Enter`.
* Mensajes de error amigables para búsquedas vacías, Pokémon inexistentes y
  errores de conexión.
* Estado de carga con indicador visual mientras se consulta la API.
* Diseño responsive (escritorio, tablet y móvil).
* Tipos mostrados como insignias con colores según el tipo.
* Contador de Pokémon mostrados.
* Botón "Mostrar todos" para volver a la lista inicial.
* Animación de aparición de las tarjetas.

## API utilizada

Se consume la [PokéAPI](https://pokeapi.co), una API REST pública y gratuita de
Pokémon. La documentación oficial está disponible en
<https://pokeapi.co/docs/v2>.

Endpoints usados:

* `GET https://pokeapi.co/api/v2/pokemon?limit=10` → lista inicial.
* `GET https://pokeapi.co/api/v2/pokemon/{id}` → detalles (imagen y tipos).
* `GET https://pokeapi.co/api/v2/pokemon/{name}` → búsqueda por nombre.

## Ejecución

Al ser una página web estática, no requiere instalación de dependencias ni
servidor. Basta con:

1. Descargar o clonar el proyecto.
2. Abrir el archivo `index.html` en un navegador web moderno.

Opcionalmente, se puede servir con cualquier servidor estático sencillo, por
ejemplo:

```bash
python3 -m http.server
```

y luego abrir `http://localhost:8000`.

## Estructura del proyecto

```text
/
├── index.html          # Estructura HTML de la aplicación
├── css/
│   └── styles.css      # Estilos y diseño responsive
├── js/
│   └── app.js          # Lógica: consumo de la API y renderizado
└── README.md
```

## Manejo de errores

* **Búsqueda vacía**: si el campo está vacío (o solo contiene espacios), se
  muestra el mensaje "Por favor, ingresa el nombre de un Pokémon.".
* **Pokémon inexistente**: si la API responde con un error 404, se muestra
  "No encontramos ese Pokémon. Verifica el nombre e inténtalo nuevamente.".
* **Errores de red**: si no es posible conectarse, se muestra "No fue posible
  conectarse con PokéAPI. Intenta nuevamente.".
* **Errores inesperados**: toda la lógica asíncrona está envuelta en bloques
  `try/catch`. Los detalles técnicos se registran con `console.error()` y nunca
  se muestran al usuario, evitando romper la interfaz.

## Características adicionales

* **Insignias de tipo con colores**: cada tipo se muestra con un color
  representativo (fuego, agua, eléctrico, planta, etc.).
* **Contador de resultados**: indica cuántos Pokémon se están mostrando.
* **Botón "Mostrar todos"**: restaura la lista inicial de Pokémon.
* **Animación de aparición**: las tarjetas aparecen con una transición suave.
* **Bloqueo de búsquedas simultáneas**: evita ejecutar varias peticiones a la
  vez para mantener la interfaz consistente.
