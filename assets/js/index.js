function Pokedex() {
    this.pokemones = [];
}

Pokedex.prototype.pokemonesOrdenados = function () {
    return this.pokemones.sort(function (a, b) {
        return a.pokedex - b.pokedex;
    });
};

Pokedex.prototype.agregarPokemon = function (pokemon) {
    let pokemonBuscado = this.pokemones.find(
        (elementPokemon) => elementPokemon.pokedex == pokemon.pokedex
    );
    if (pokemonBuscado) {
        return false;
    } else {
        this.pokemones.push(pokemon);
    }
};

Pokedex.prototype.eliminarPokemon = function (numeroPokedex) {
    let pokemon = this.pokemones.find((elementPokemon, index) => {
        if (elementPokemon.pokedex == numeroPokedex) {
            elementPokemon.indice = index;
            return elementPokemon;
        }
    });

    if (pokemon) {
        this.pokemones.splice(pokemon.index, 1);
        return true;
    } else {
        return false;
    }
};

Pokedex.prototype.filtrarPokemones = function (nombre) {
    return this.pokemones.filter((pokemon) => pokemon.nombre.includes(nombre));
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
        let resultado = miPokedex.agregarPokemon(currentPokemon);

        if (resultado == false) {
            alert("Pokémon ya se encuentra en la lista.");
        } else {
            alert("Pokémon agregado con éxito.");
            cargarTabla(miPokedex.pokemonesOrdenados());
        }
    } else {
        alert("No existe un pokémon para agregar.");
    }
});

function cargarTabla(arrayPokemones) {
    try {
        let filas = "";
        arrayPokemones.forEach((pokemon) => {
            filas += `
                <tr>
                    <th scope="row">${pokemon.pokedex}</th>
                    <td><img src="${pokemon.imagen}" alt="${pokemon.nombre}" style="width:100px;"></td>
                    <td>${pokemon.nombre}</td>
                    <td>${pokemon.peso}</td>
                    <td><button class="btn btn-danger deleteButtons" data-pokedex="${pokemon.pokedex}">Eliminar</button></td>
                </tr>
            `;
        });
        cuerpoTablaPokemones.innerHTML = filas;
    } catch (error) {
        alert("Error al cargar la tabla.");
    }
}

$("#cuerpoTablaPokemones").on("click", ".deleteButtons", function (event) {
    let boton = event.target;
    let numeroPokedex = boton.dataset.pokedex;
    let resultado = miPokedex.eliminarPokemon(numeroPokedex);
    if (resultado) {
        alert("Pokémon eliminado con éxito");
        cargarTabla(miPokedex.pokemones);
    } else {
        alert("Pokémon no se pudo eliminar.");
    }
});

searchNombrePokemon.addEventListener("keyup", function () {
    let elementos = miPokedex.filtrarPokemones(searchNombrePokemon.value);
    cargarTabla(elementos);
});
