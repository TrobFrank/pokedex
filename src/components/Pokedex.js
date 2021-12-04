import React, { useEffect, useState } from 'react';
import { orderBy, padStart, union, add, upperFirst } from 'lodash';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PokedexAPI from './PokedexAPI';
import PokemonSummary from './PokemonSummary';

function Pokedex(props){
    let params = useParams();
    let navigate = useNavigate();
    let location = useLocation();

    let [PokedexRange, setPokedexRange] = useState([]);
    let [offset, setOffset] = useState(0);
    let [order, setOrder] = useState('first_low');
    let [generation, setGeneration] = useState(null);

    let pokemonDisplay = <div></div>;

    let limit = 2;
    let orderMax = 898; //gets updated with first request to pokemon-species, which returns the accurate number
    let arrPokemonData = []; 

    //switching generations
    useEffect(() => {
        setOffset(0);
        getGenerationData();
    }, [location.pathname]);

    useEffect(() => {
        //this could be turned into getInitGeneration type of function
        getRangeFromGeneration(limit, offset, order);
        //console.log(`GENERATION WAS CHANGED: limit: ${limit}, offset: ${offset}, order: ${order}}`);
    }, [generation, offset]);   

    //reorder
    useEffect(() => {
        setOffset(0);
        getRangeFromGeneration(limit, offset, order);
    }, [order]); 

    useEffect(() => {
        displayFromState();
    },[PokedexRange])

    //sorting issue:
    /* 
        lowest number works by default
        highest number sorts currently loaded..
            1. make all new request to sort from pokemon?limit={x}&offset={(orderMax - limit)}
            2. then sorting into "order" (desc by ID)
            3. update "load more pokemon" button to work backwards, beginning from max
        a-z... can only be done by generation
        z-a... can only be done by generation
    */

    /* GENERATION FUNCTIONS */
    const switchGeneration = (genName) => {
        //triggers useEffect for location.pathname that gets new gen data}
        arrPokemonData = [];
        setPokedexRange([]);
        setTimeout(function(){
            navigate(`../generation/${genName}`);
        },500)
                
    } 

    const displayGenerationList = (genList) => {
        return (
            genList.map(function(gen){
                return (<option key={gen.name} value={gen.name} selected={params.generation == gen.name ? 'selected': null } >{gen.name}</option>)
            })
        )
    }

    const getGenerationData = () => {
        return PokedexAPI('generation', false, params.generation).then((genData) => {
            setGeneration(genData);
            return genData;
        });        
    }

    const getRangeFromGeneration = (limit, offset, order) => {
        const pokemonNameURL = 'https://pokeapi.co/api/v2/pokemon/';
        //console.log('getRangeFromGeneration generation: ', generation);
        //console.log(`limit: ${limit} => offset: ${offset} => order: ${order}`);
        if (generation !== null) {
            let genSorted = sortSpeciesListByURL(generation.pokemon_species, order);
            console.log('genSorted: ', genSorted);
            let genSliced = genSorted.slice(offset, (limit+offset)); //.slice is dumb
            //console.log('genSliced: ', genSliced);
            let arrPokemonEndpoints = []; //reset endpoint array each request
            genSliced.forEach(pokemon => {
                arrPokemonEndpoints.push(`${pokemonNameURL}${pokemon.name}`);
            })

            //console.log('arrPokemonEndpoints: ', arrPokemonEndpoints);
            Promise.all
                (arrPokemonEndpoints.map((endpoint) => axios.get(endpoint)))
                .then((multiResData) => {
                    multiResData.forEach(function(pokemonResData){
                        arrPokemonData.push(pokemonResData.data);
                    })
                    //console.log('arrPokemonData: ', arrPokemonData);
                    arrPokemonData = union(PokedexRange, arrPokemonData); //dedupe + add to existing state arr
                    setPokedexRange(arrPokemonData);
            }).catch(error => console.log(error)); 
        }
    }

    /* SORTING FUNCTIONS */

    // const getOrderedPokemonRange = (limit, offset, order) => {
    //     PokedexAPI('range', false, false, limit, offset).then((incomingPokemon => {
    //         orderMax = incomingPokemon.count;
    //         let arrPokemonEndpoints = []; //reset endpoint array each request
    //         incomingPokemon.results.forEach(pokemon => {
    //             arrPokemonEndpoints.push(pokemon.url);
    //         })
    //         Promise.all
    //             (arrPokemonEndpoints.map((endpoint) => axios.get(endpoint)))
    //             .then((multiResData) => {
    //                 multiResData.forEach(function(pokemonResData){
    //                     arrPokemonData.push(pokemonResData.data);
    //                 })
    //                 console.log('UNSORTED arrPokemonData: ', arrPokemonData);
    //                 arrPokemonData = setArrayOrder(union(PokedexRange, arrPokemonData), order); //dedupe and order
    //                 console.log('ORDERED arrPokemonData: ', arrPokemonData);
    //                 setPokedexRange(arrPokemonData);
    //         }).catch(error => console.log(error));            
    //     }));
    // }

    const displayFromState = () => {
        //console.log('here displayFromState PokedexRange: ', PokedexRange)
        let arrCurrentPokemon = [];
        if (PokedexRange !== []) {
            arrCurrentPokemon = Array.from(PokedexRange);
            pokemonDisplay = arrCurrentPokemon.map(function(pokemon, index){
                //console.log('pokedex_pokemon data: ', pokemon);
                return (<PokemonSummary pokemon={pokemon} key={index} />)
            });
            return pokemonDisplay;
        } else {
            return (<div>Loading...</div>)
        }
    }

    const setArrayOrder = (array, order) => {
        let arrSorted = []
        //console.log('array passed: ', array);
        switch(order) {
            case 'low':
            default:     arrSorted = orderBy(array, index => index.sort, ['asc']); break;
            case 'high': arrSorted = orderBy(array, index => index.sort, ['desc']); break;
            case 'az':   arrSorted = orderBy(array, index => index.name, ['asc']); break;
            case 'za':   arrSorted = orderBy(array, index => index.name, ['desc']); break;                                        
        } 
        //console.log('arrSorted: ', arrSorted);
        return arrSorted;
    }

    function sortSpeciesListByURL(arrDirty, order){
        let arrMod = arrDirty.map((index) => {
            var pathList    = index.url.split('/');
            var idFromURL   = pathList[pathList.length - 1] < 1 ? pathList[pathList.length - 2] : pathList[pathList.length - 1] ; //trailing slash or not
            return arrDirty = {...index, "sort": padStart(idFromURL, 3, '00')}
        });
        let arrClean = orderBy(arrMod, index => index.sort, ['asc']); //sort by number asc first, then determine 
        arrClean = setArrayOrder(arrClean, order);
        return arrClean;    
    }    

    return (
        <div className="container">
            <div className="pokedex_results">
                <div className="button-wrapper center">
                    {/* <button className="button-lightblue" onClick={() => getRandomPokemonRange()}>Surprise Me!</button> */}
                    <select id="sort" onChange={
                        (e) => {
                            arrPokemonData = [];
                            setPokedexRange([]);
                            setTimeout(function(){
                                setOrder(e.target.value)
                            },500);
                        }
                        }>
                        <option disabled="disabled">Sort results by...</option>
                        <option value="low">Lowest Number (First)</option>
                        <option value="high">Highest Number (First)</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
                    </select>
                    <select id="generation" onChange={(e) => switchGeneration(e.target.value)}>
                        <option disabled="disabled">Select Generation</option>
                        {displayGenerationList(props.generationList)}
                    </select>                    
                </div>   
                {displayFromState()}
                <div className="button-wrapper center">
                    <button className="button-lightblue" data-offset={add(offset,limit)} onClick={() => setOffset(add(offset,limit))}>load more Pokemon</button>
                </div>                
            </div>
        </div>
    )
}

function displayTypes(pokemonData) {
    //takes pokemon response from /pokemon/:name and returns formatted types html with colors, etc
    let typesHMTL = pokemonData.types.map(type => {
        return <span className={`type-emblem type-emblem_sm background-color-${type.type.name}`}>{upperFirst(type.type.name)}</span>
    })
    return typesHMTL;
}

export default Pokedex;
export { displayTypes };