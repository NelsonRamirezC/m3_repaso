async function getPokemon(id) {
    try {
        let url = "https://pokeapi.co/api/v2/pokemon/" + id;
        let response = await fetch(url);
        if (response.status == 200) {
            let pokemon = await response.json();
            console.log(pokemon);
        } else {
            let data = await response.text();
            alert(data);
        }
    } catch (error) {
        /* console.log("Algo ha salido mal."); */
        console.log(error);
    }
}

getPokemon("pikachu");
