// PokéApp — Lógica de la aplicación. Consume la PokéAPI usando fetch() y renderiza las tarjetas dinámicamente.

const API_BASE_URL = "https://pokeapi.co/api/v2";
const INITIAL_POKEMON_COUNT = 10;

const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const showAllButton = document.getElementById("show-all-button");
const resultsContainer = document.getElementById("results-container");
const resultsCounter = document.getElementById("results-counter");
const messageElement = document.getElementById("message");
const loadingElement = document.getElementById("loading");

// Bloquea búsquedas simultáneas para evitar estados inconsistentes.
let isRequestInProgress = false;

// Mapa de colores por tipo para las insignias.
const typeColors = {
  normal: "#a8a878",
  fire: "#f08030",
  water: "#6890f0",
  electric: "#f8d030",
  grass: "#78c850",
  ice: "#98d8d8",
  fighting: "#c03028",
  poison: "#a040a0",
  ground: "#e0c068",
  flying: "#a890f0",
  psychic: "#f85888",
  bug: "#a8b820",
  rock: "#b8a038",
  ghost: "#705898",
  dragon: "#7038f8",
  dark: "#705848",
  steel: "#b8b8d0",
  fairy: "#ee99ac",
};

// Comunicación con la API

// Obtiene un Pokémon específico por nombre desde la PokéAPI.
async function fetchPokemonByName(name) {
  const response = await fetch(`${API_BASE_URL}/pokemon/${encodeURIComponent(name)}`);
  return handleApiResponse(response);
}

// Obtiene la lista inicial de Pokémon.
async function fetchPokemonList(limit) {
  const response = await fetch(`${API_BASE_URL}/pokemon?limit=${limit}`);
  return handleApiResponse(response);
}

// Obtiene los detalles (imagen y tipos).
async function fetchPokemonDetails(url) {
  const response = await fetch(url);
  return handleApiResponse(response);
}

// Obtiene los datos de la especie (generación, legendario, cadena evolutiva).
async function fetchPokemonSpecies(url) {
  const response = await fetch(url);
  return handleApiResponse(response);
}

// Convierte una respuesta de fetch en datos o lanza un error descriptivo.
async function handleApiResponse(response) {
  if (!response.ok) {
    // 404 significa que el Pokémon no existe.
    if (response.status === 404) {
      const error = new Error("Not Found");
      error.isNotFound = true;
      throw error;
    }
    throw new Error(`Error de la API: ${response.status}`);
  }
  return response.json();
}

// Extracción de datos

// Normaliza los datos de la API (Pokémon + especie) a un objeto simple.
function mapPokemonData(data, species) {
  return {
    name: data.name,
    image: getPokemonImage(data),
    types: data.types.map((typeEntry) => typeEntry.type.name),
    generation: getGenerationName(species),
  };
}

// Consulta la especie y arma el objeto final de un Pokémon.
async function fetchAndMapPokemon(data) {
  const species = await fetchPokemonSpecies(data.species.url);
  return mapPokemonData(data, species);
}

// Convierte "generation-i" en "I", "generation-ii" en "II", etc.
function getGenerationName(species) {
  const name = species?.generation?.name || "";
  return name.replace("generation-", "").toUpperCase();
}

// Prioriza el arte oficial; si no existe, usa el sprite frontal clásico.
function getPokemonImage(data) {
  return (
    data.sprites?.other?.["official-artwork"]?.front_default ||
    data.sprites?.front_default ||
    ""
  );
}

// Renderizado del DOM

// Muestra la lista completa de Pokémon en el grid.
function renderPokemonList(pokemonList) {
  clearResults();
  pokemonList.forEach((pokemon) => {
    resultsContainer.appendChild(createPokemonCard(pokemon));
  });
  updateCounter(pokemonList.length);
}

// Crea una tarjeta individual (article) a partir de los datos del Pokémon.
function createPokemonCard(pokemon) {
  const card = document.createElement("article");
  card.classList.add("card");

  const image = document.createElement("img");
  image.classList.add("card__image");
  image.src = pokemon.image;
  image.alt = `Imagen de ${pokemon.name}`;
  image.loading = "lazy";

  const body = document.createElement("div");
  body.classList.add("card__body");

  const name = document.createElement("h3");
  name.classList.add("card__name");
  name.textContent = pokemon.name;

  const generation = document.createElement("p");
  generation.classList.add("card__generation");
  generation.textContent = `Gen ${pokemon.generation}`;

  const typesContainer = document.createElement("div");
  typesContainer.classList.add("card__types");

  pokemon.types.forEach((type) => {
    const badge = document.createElement("span");
    badge.classList.add("badge");
    badge.textContent = capitalize(type);
    badge.style.backgroundColor = typeColors[type] || "#9ca3af";
    typesContainer.appendChild(badge);
  });

  body.append(name, generation, typesContainer);
  card.append(image, body);
  return card;
}

// Actualiza el contador de Pokémon mostrados.
function updateCounter(count) {
  resultsCounter.textContent = count === 1 ? "Mostrando 1 Pokémon" : `Mostrando ${count} Pokémon`;
}

// Estados de la interfaz

function showLoading() {
  loadingElement.hidden = false;
  hideMessage();
  clearResults();
  updateCounter(0);
}

function hideLoading() {
  loadingElement.hidden = true;
}

// Muestra un mensaje informativo o de error según corresponda.
function showError(text) {
  messageElement.textContent = text;
  messageElement.classList.add("message--error", "message--visible");
}

function hideMessage() {
  messageElement.textContent = "";
  messageElement.classList.remove("message--error", "message--visible");
}

function clearResults() {
  resultsContainer.innerHTML = "";
}

// Habilita o deshabilita los controles durante una petición.
function setControlsDisabled(disabled) {
  searchInput.disabled = disabled;
  showAllButton.disabled = disabled;
  searchForm.querySelector('button[type="submit"]').disabled = disabled;
}

// Flujos principales

// Carga inicial: pide la lista y luego los detalles de cada Pokémon.
async function loadInitialPokemon() {
  showLoading();
  setControlsDisabled(true);
  isRequestInProgress = true;
  try {
    const list = await fetchPokemonList(INITIAL_POKEMON_COUNT);
    const details = await Promise.all(
      list.results.map((item) => fetchPokemonDetails(item.url))
    );
    const pokemonList = await Promise.all(details.map(fetchAndMapPokemon));
    renderPokemonList(pokemonList);
  } catch (error) {
    console.error("Error al cargar la lista inicial:", error);
    showError("No fue posible conectarse con la PokéAPI. Intenta nuevamente.");
  } finally {
    hideLoading();
    setControlsDisabled(false);
    isRequestInProgress = false;
  }
}

// Búsqueda por nombre: normaliza la entrada y consulta la API.
async function handleSearch(event) {
  event.preventDefault();

  if (isRequestInProgress) {
    return;
  }

  const query = normalizeQuery(searchInput.value);

  if (!query) {
    showError("Por favor, ingresa el nombre de un Pokémon.");
    clearResults();
    updateCounter(0);
    return;
  }

  showLoading();
  setControlsDisabled(true);
  isRequestInProgress = true;
  try {
    const data = await fetchPokemonByName(query);
    const pokemon = await fetchAndMapPokemon(data);
    renderPokemonList([pokemon]);
  } catch (error) {
    console.error("Error al buscar el Pokémon:", error);
    if (error.isNotFound) {
      showError("No encontramos ese Pokémon. Verifica el nombre e inténtalo nuevamente.");
    } else {
      showError("No fue posible conectarse con PokéAPI. Intenta nuevamente.");
    }
    clearResults();
    updateCounter(0);
  } finally {
    hideLoading();
    setControlsDisabled(false);
    isRequestInProgress = false;
  }
}

// Quita espacios sobrantes y normaliza mayúsculas/minúsculas.
function normalizeQuery(value) {
  return value.trim().toLowerCase();
}

// Vuelve a mostrar la lista inicial de Pokémon.
function handleShowAll() {
  if (isRequestInProgress) {
    return;
  }
  searchInput.value = "";
  hideMessage();
  loadInitialPokemon();
}

// Convierte la primera letra en mayúscula (para nombres de tipos).
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

// Inicialización

searchForm.addEventListener("submit", handleSearch);
showAllButton.addEventListener("click", handleShowAll);

loadInitialPokemon();
