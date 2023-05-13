function Pokedex() {
    this.pokemones = [];
}

Pokedex.prototype.agregarPokemon = function (pokemon) {
    let pokemonBuscado = this.pokemones.find(
        (elementPokemon) => elementPokemon.pokedex == pokemon.pokedex
    );
    if (pokemonBuscado) {
        alert("pokemon ya existe en registro.");
    } else {
        this.pokemones.push(pokemon);
    }
};

let miPokedex = new Pokedex();
let currentPokemon;

function Pokemon(pokedex, nombre, peso, imagen) {
    this.pokedex = pokedex;
    this.nombre = nombre;
    this.peso = peso;
    this.imagen = imagen;
}

async function getPokemon(id) {
    try {
        let url = "https://pokeapi.co/api/v2/pokemon/" + id;
        let response = await fetch(url);
        if (response.status == 200) {
            let pokemon = await response.json();
            let { id, name, weight, sprites } = pokemon;
            let image = sprites.other["official-artwork"].front_default;

            let nuevoPokemon = new Pokemon(id, name, weight, image);
            currentPokemon = nuevoPokemon;
            cargarCard(nuevoPokemon);

            //console.log(pokemon);
            //console.log(nuevoPokemon);
        } else {
            let data = await response.text();
            alert(data);
        }
    } catch (error) {
        /* console.log("Algo ha salido mal."); */
        console.log(error);
    }
}

formPokemon.addEventListener("submit", function (event) {
    event.preventDefault(); // previene las acciones por defecto del formulario: enviar los datos - actualizar la página
    getPokemon(idPokemon.value);
});

function cargarCard(pokemon) {
    nombrePokemon.innerText = pokemon.nombre;
    pesoPokemon.innerText = pokemon.peso;
    imagenPokemon.setAttribute("src", pokemon.imagen);
    imagenPokemon.setAttribute("alt", pokemon.nombre);
}

btnAgregarPokemon.addEventListener("click", function (event) {
    if (currentPokemon) {
        miPokedex.agregarPokemon(currentPokemon);
    } else {
        alert("No existe un pokémon para agregar.");
    }
});
