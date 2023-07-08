const pokemonPerPage = 20; // Cantidad de Pokémon por página
let offset = 0; // Desplazamiento inicial
const container = document.getElementById("root");
const loadMoreButton = createLoadMoreButton();
container.appendChild(loadMoreButton);

document.addEventListener("DOMContentLoaded", function () {
  const url = `https://pokeapi.co/api/v2/pokemon?limit=${pokemonPerPage}&offset=${offset}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const pokemonList = data.results; // Obtener la lista de Pokémon de la página actual

      const pokemonDataPromises = pokemonList.map((pokemon) =>
        fetch(pokemon.url).then((response) => response.json())
      );

      Promise.all(pokemonDataPromises)
        .then((pokemonDataArray) => {
          pokemonDataArray.forEach((pokemonData) => {
            const formattedPokemon = formatPokemonData(pokemonData);
            renderPokemon(formattedPokemon);
          });
        })
        .catch((error) => {
          console.log("Error:", error);
        });
    })
    .catch((error) => {
      console.log("Error:", error);
    });
});

function formatPokemonData(pokemonData) {
  return {
    id: pokemonData.id,
    img: pokemonData.sprites.other["official-artwork"].front_default,
    name: pokemonData.name,
    height: pokemonData.height,
    weight: pokemonData.weight,
    types: pokemonData.types.map((type) => type.type.name),
  };
}

function loadNextPage() {
  offset += pokemonPerPage;
  fetchPokemonData();
}
function createLoadMoreButton() {
  const loadMoreButton = document.createElement("button");
  loadMoreButton.textContent = "Cargar más";
  loadMoreButton.addEventListener("click", loadNextPage);
  return loadMoreButton;
}
function createPokemonCard(pokemon) {
  const card = document.createElement("div");
  card.innerHTML = `
      <div>
        <h2>${pokemon.name}</h2>
        <img src="${pokemon.img}" alt="${pokemon.name}" />
        <p>ID: ${pokemon.id}</p>
        <p>Height: ${pokemon.height}</p>
        <p>Weight: ${pokemon.weight}</p>
        <p>Types: ${pokemon.types.join(", ")}</p>
      </div>
    `;
  return card;
}

function renderPokemon(pokemon) {
  const card = createPokemonCard(pokemon);
  container.appendChild(card);
}
