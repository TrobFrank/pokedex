import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

function PokemonDetail(){
    let params = useParams();
    const [pokemon, setPokemon] = useState([]);
    const [species, setSpecies] = useState([]);
    const [type, setType] = useState([]);
    const [evolution, setEvolution] = useState([]);

    useEffect(() => {
        getAllPokemonData(params.name);
    }, []);

    function getAllPokemonData(name) {
        let baseURL = 'https://pokeapi.co/api/v2';    
        let basicEndpoints = [];
        let metaEndpoints = [];
        basicEndpoints.push(`${baseURL}/pokemon/${name}`);
        basicEndpoints.push(`${baseURL}/pokemon-species/${name}`);

        Promise.all
            (basicEndpoints.map((endpoint) => axios.get(endpoint)))
            .then((multiResData) => {
                let pokemonRes = multiResData[0].data;
                let speciesRes = multiResData[1].data;
                console.log('data: pokemonRes: ', pokemonRes);
                console.log('data: speciesRes: ', speciesRes);
                metaEndpoints.push(pokemonRes.types[0].type.url);
                metaEndpoints.push(speciesRes.evolution_chain.url);
                setPokemon(pokemonRes);
                setSpecies(speciesRes);
            
                Promise.all
                    (metaEndpoints.map((endpoint) => axios.get(endpoint)))
                    .then((multiResData) => {
                        let typeRes = multiResData[0].data;
                        let evoRes = multiResData[1].data;
                        console.log('data: typeRes: ', typeRes);
                        console.log('data: evoRes: ', evoRes);
                        setType(typeRes);
                        setEvolution(evoRes);
                }).catch(error => console.log(error));   

        }).catch(error => console.log(error));

    }

    if (pokemon.name !== undefined) {
        return (
            <div>
                <h3>#{pokemon.id} - {pokemon.name}</h3>
                <p>{species.flavor_text_entries ? species.flavor_text_entries[0].flavor_text : ''}</p>
                <img src={pokemon.sprites.other['official-artwork'].front_default ? pokemon.sprites.other['official-artwork'].front_default : pokemon.sprites.front_default} alt={pokemon.name} />            
                <Link to="/">Return to Pokedex</Link>
            </div>
        )
    } else {
        return(<h3>loading...</h3>)
    }

}


// function PokemonDetail(){
//     let params = useParams();
//     let [PokeData, setPokeData] = useState([]);

//     useEffect(() => {
//         PokeAPI('name', params.name).then(incomingData => setPokeData(incomingData));
//     }, [setPokeData]);  

//     if (PokeData.name !== undefined) {
//         return (
//             <div>
//                 <div>#{PokeData.id} - {PokeData.name}</div>
//                 <div>{PokeData.height}ft, {PokeData.weight} oz</div>
//                 <img src={PokeData.sprites.front_default} alt={PokeData.name} />
//                 <div>
//                     <p><b>Types:</b></p>
//                     {
//                     PokeData.types.map(thisType => {
//                         return <span key={thisType.type.name} >{thisType.type.name}</span>;
//                     })                        
//                     }                    
//                 </div>
//                 <Link to="/">Return to Pokedex</Link>
//             </div>
//         )
//     } else {
//         return (<h3>Loading...</h3>)
//     }
// }

export default PokemonDetail;