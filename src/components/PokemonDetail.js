import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { upperFirst } from 'lodash';
import axios from 'axios';
import { ENDPOINTS, MAXCOUNT } from '../assets/utils';
import { displayTypes } from './Pokedex';
import Stats  from './Stats';
import EvolutionChain from './EvolutionChain';
import Loader from './Loader';
import Image from './Image';

function PokemonDetail(props){
    let params = useParams();
    let navigate = useNavigate();
    const [pokemon, setPokemon] = useState([]);
    const [species, setSpecies] = useState([]);
    const [type, setType] = useState([]);
    const [evolution, setEvolution] = useState([]);
    const [nextPokemon, setNextPokemon] = useState({});
    const [prevPokemon, setPrevPokemon] = useState({});
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        if (params.id && !params.name){
            let pokemonName = props.speciesList[params.id - 1].name;
            if (pokemonName !== undefined){
                navigate(`../pokemon/${params.id}/${pokemonName}`); 
            }
        }
        getAllPokemonData();
    }, [params.id]);

    useEffect(()=> {

        if (pokemon.id - 1 > 0){
            let prevPokemonData = props.speciesList[pokemon.id - 2];
            if (prevPokemonData !== undefined){
                prevPokemonData.id = pokemon.id - 1;
                setPrevPokemon(prevPokemonData);
            }
        }
        if (pokemon.id + 1 <= MAXCOUNT){
            let nextPokemonData = props.speciesList[pokemon.id];
            if (nextPokemonData !== undefined){
                nextPokemonData.id = pokemon.id + 1;
                setNextPokemon(nextPokemonData);
            }                    
        }

    }, [pokemon])
    
    function stopLoaderAfterMinimum(duration = 1000){
        setTimeout(function(){
            setLoading(false);
        }, duration)
    }

    function getAllPokemonData() {
        setLoading(true);
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
                        stopLoaderAfterMinimum(500);
                }).catch(error => console.log(error));   

        }).catch(error => console.log(error));

    }

    function calculateGenderRates(rate){
        let rates = {};
        if (rate > 0){
            rates.female = (rate/8)*100;
        } else if (rate === -1 || rate === 0){
            rates.female = 100;         
        }
        rates.male = 100 - rates.female;  
        return rates;
    }

    function localeSpeciesGenera(arrGenera, locale){
        let localeIndex = arrGenera.findIndex(function(genera) {
            return genera.language.name == locale;
        });
        return <p className="text-capitalize">{arrGenera[localeIndex].genus}</p>;
    }

    function localeSpeciesFlavorText(arrText, locale){
        let arrFlavorText = arrText.filter(function(txt) {
            return txt.language.name == locale;
        });
        
        let newestTwo = [arrFlavorText[arrFlavorText.length - 1], arrFlavorText[arrFlavorText.length - 2]]
        
        return newestTwo.map((txt, i) => {
            return <p key={i}>{txt.flavor_text} ({txt.version.name})</p>
        })
    }

    if (loading){
        return(<Loader/>)
    } else {
        let flavorText = localeSpeciesFlavorText(species.flavor_text_entries, "en");
        let genderRates = calculateGenderRates(species.gender_rate);
        return (
            <div className="container">
                <div className="container-inner">
                    <div className="pokemon_detail display-flex flex-column">
                        <div className="pokemon_header display-flex align-items-center">
                            {Object.keys(prevPokemon).length > 0 ? <Link className="pokemon_next-prev-link" to={`../pokemon/${prevPokemon.id}/${prevPokemon.name}`}><span>#{prevPokemon.id} {upperFirst(prevPokemon.name)}</span></Link> : ''}
                            {Object.keys(nextPokemon).length > 0 ? <Link className="pokemon_next-prev-link" to={`../pokemon/${nextPokemon.id}/${nextPokemon.name}`}><span>{upperFirst(nextPokemon.name)} #{nextPokemon.id}</span></Link> : ''}
                        </div>
                        <h3 className="pokemon_detail-title"> {upperFirst(pokemon.name)} #{pokemon.id}</h3>
                        <div className="pokemon_detail-body display-flex flex-row flex-wrap">
                            <div className="detail_left">
                                <div className="pokemon_profle">
                                    <Image altTxt={pokemon.name} source={pokemon.sprites.other['official-artwork'].front_default ? pokemon.sprites.other['official-artwork'].front_default : pokemon.sprites.front_default} /> 
                                </div>
                                {/* stats */}
                                {pokemon.stats.length > 0 ? <Stats pokemonStats={pokemon.stats} /> :''}
                            </div>
                            <div className="detail_right">
                                <div>
                                    {flavorText}
                                </div>  

                                {/* size etc */}     
                                <div className="display-flex pokemon_detail-highlights flex-wrap">
                                    <div className="detail_left">
                                        <div className="detail_group">
                                            <span>Height</span>
                                            <p>{pokemon.height}</p>
                                        </div>
                                        <div className="detail_group">
                                            <span>Weight</span>
                                            <p>{pokemon.weight}</p>
                                        </div>
                                        <div className="detail_group">
                                            <span>Gender</span>
                                            <p>
                                                {`${genderRates.male}% Male`}<br/>
                                                {`${genderRates.female}% Female`}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="detail_right">
                                        <div className="detail_group">
                                            <span>Category</span>
                                            {localeSpeciesGenera(species.genera, "en")}
                                        </div>
                                        <div className="detail_group">
                                            <span>Abilities</span>
                                            <div>
                                            {
                                            pokemon.abilities.map(i => {
                                                return <p key={i.ability.name} className="text-capitalize">{i.ability.name}</p>
                                            })
                                            }
                                            </div>
                                        </div>
                                    </div>
                                </div>{/* pokemon_detail */}  
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
                            <div className="detail_bottom">
                                <div className="button-wrapper center">
                                    <EvolutionChain evolution={evolution}/>
                                    <Link className="btn button-lightblue" to={`../generation/${species.generation.name}`}>Return to Pokedex</Link>
                                </div>                                
                            </div>{/* detail_bottom */}
                        </div>
                    </div>{/* pokemon_detail */}
                </div>
            </div>
        )
    }

}

export default PokemonDetail;