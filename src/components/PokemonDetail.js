import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINTS, MAXCOUNT } from '../assets/utils';
import { displayTypes } from './Pokedex';
import Loader from './Loader';

function PokemonDetail(props){
    let params = useParams();
    const [pokemon, setPokemon] = useState([]);
    const [species, setSpecies] = useState([]);
    const [type, setType] = useState([]);
    const [evolution, setEvolution] = useState([]);

    useEffect(() => {
        getAllPokemonData();
    }, [params.id]);

    function getAllPokemonData() {
        let basicEndpoints = [];
        let metaEndpoints = [];
        basicEndpoints.push(`${ENDPOINTS.baseURL}${ENDPOINTS.pokemon}/${params.id}`);
        basicEndpoints.push(`${ENDPOINTS.baseURL}${ENDPOINTS.species}/${params.id}`);
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

    if (pokemon.name !== undefined && type.name !== undefined && evolution.chain !== undefined) {
        return (
            <div className="container">
                <div className="container-inner">
                    <div className="pokemon_detail display-flex flex-column">
                        <div className="pokemon_header display-flex align-items-center">
                            {pokemon.id - 1 > 0 ? <Link to={`../pokemon/${pokemon.id - 1}`}>Previous</Link> : ''}
                            <h3> {pokemon.name} #{pokemon.id}</h3>
                            {pokemon.id + 1 <= MAXCOUNT ? <Link to={`../pokemon/${pokemon.id + 1}`}>Next</Link> : ''}
                        </div>
                        <div className="display-flex flex-row flex-wrap">
                            <div className="detail_left">
                                <img src={pokemon.sprites.other['official-artwork'].front_default ? pokemon.sprites.other['official-artwork'].front_default : pokemon.sprites.front_default} alt={pokemon.name} />            
                                {/* stats */}
                            </div>
                            <div className="detail_right">
                                <p>{species.flavor_text_entries ? species.flavor_text_entries[0].flavor_text : ''}</p>    
                                {/* size */}                        
                                <div className="pokedex_pokemon-types display-flex flex-column justify-content-flex-start">
                                    <div className="display-flex flex-column">
                                        <h4>Type:</h4>
                                        <div className="display-flex flex-row">{displayTypes(pokemon.types)}</div>
                                    </div>
                                    <div className="display-flex flex-column">
                                        <h4>Weaknesses:</h4>
                                        <div className="display-flex flex-row">{displayTypes(type.damage_relations.double_damage_from)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link to="/">Return to Pokedex</Link>
                    </div>{/* pokemon_detail */}
                </div>
            </div>
        )
    } else {
        return(<Loader/>)
    }

}

export default PokemonDetail;