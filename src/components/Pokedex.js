import React, { useEffect, useState, useRef } from 'react';
import { orderBy, padStart, random, add, upperFirst } from 'lodash';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PokedexAPI from './PokedexAPI';
import PokemonSummary from './PokemonSummary';
import getAnimationClass from '../assets/getAnimationClass';
import FILTERS from '../assets/filters';

function Pokedex(props){
    let params = useParams();
    let navigate = useNavigate();
    let location = useLocation();

    let limit = 2;

    let refPokedexRange = useRef([]);
    let refOffset = useRef(0);
    let refRenderCount = useRef(0);
        refRenderCount.current = refRenderCount.current + 1;

    let [order, setOrder] = useState('low');
    let [generation, setGeneration] = useState(null);
    let [pokedexRange, setPokedexRange] = useState([]);

    //switching generations
    useEffect(() => {
        refOffset.current = 0;
        refPokedexRange.current = [];
        getGenerationData();
        //console.log('location.pathname changed');
    }, [location.pathname]);

    useEffect(() => {
        refPokedexRange.current = [];
        getRangeFromGeneration(limit, refOffset.current, order);
        //console.log('generation changed');
    }, [generation]);   

    //reorder
    useEffect(() => {
        refOffset.current = 0;
        refPokedexRange.current = [];
        getRangeFromGeneration(limit, refOffset.current, order);
        //console.log('order changed', order );
    }, [order]); 

    useEffect(() => {
        //console.log('pokedexRange changed', pokedexRange );       
    }, [pokedexRange]);

    /* GENERATION FUNCTIONS */
    const switchGeneration = (genName) => {
        navigate(`../generation/${genName}`); 
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

    function loadMorePokemon() {
        refOffset.current = add(refOffset.current, limit);
        getRangeFromGeneration(limit, refOffset.current, order);
    }

    function loadSupriseMe(){
        let surpriseMeRange = 898;
        if (props.speciesCount) {
            surpriseMeRange = props.speciesCount;
        }
        let randomPokemonName = props.speciesList[random(0, surpriseMeRange)].name;
        navigate(`../pokemon/${randomPokemonName}`);
    }

    const getRangeFromGeneration = (limit, offset, order) => {
        const pokemonNameURL = 'https://pokeapi.co/api/v2/pokemon/';
        let arrPokemonEndpoints = []; //reset endpoint array each request
        //console.log('getRangeFromGeneration generation: ', generation);
        //console.log(`limit: ${limit} => offset: ${offset} => order: ${order}`);
        if (generation !== null) {
            let genSorted = sortSpeciesListByURL(generation.pokemon_species, order);
            //console.log('genSorted: ', genSorted);
            let genSliced = genSorted.slice(offset, (limit+offset)); //.slice is dumb
            //console.log('genSliced: ', genSliced);
            genSliced.forEach(pokemon => {
                arrPokemonEndpoints.push(`${pokemonNameURL}${pokemon.name}`);
            })

            //console.log('arrPokemonEndpoints: ', arrPokemonEndpoints);
            Promise.all
                (arrPokemonEndpoints.map((endpoint) => axios.get(endpoint)))
                .then((multiResData) => {
                    multiResData.forEach(function(pokemonResData){
                        refPokedexRange.current.push(pokemonResData.data);
                    })
                    setPokedexRange([...refPokedexRange.current]); //create/pass "new" obj to trigger state render
                }).catch(error => console.log(error)); 
        }
    }

    /* SORTING FUNCTIONS */

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
        // let arrClean = orderBy(arrMod, index => index.sort, ['asc']); //sort by number asc first, then determine 
        // arrClean = setArrayOrder(arrClean, order);
        let arrClean = setArrayOrder(arrMod, order);        
        return arrClean;    
    }    

    return (
        <div className="container">
            <div className="pokedex_results">
                <div className="button-wrapper center">
                    <button className="button-lightblue" onClick={loadSupriseMe}>Surprise Me!</button>
                    <select id="sort" defaultValue={order} onChange={(e) => {setOrder(e.target.value);}
                        }>
                        <option disabled="disabled">Sort results by...</option>
                        <option value={FILTERS.SORT_BY.LOW}>Lowest Number (First)</option>
                        <option value={FILTERS.SORT_BY.HIGH}>Highest Number (First)</option>
                        <option value={FILTERS.SORT_BY.AZ}>A-Z</option>
                        <option value={FILTERS.SORT_BY.ZA}>Z-A</option>
                    </select>
                    <select id="generation" defaultValue={params.generation} onChange={(e) => switchGeneration(e.target.value)}>
                        <option disabled="disabled">Select Generation</option>
                        {displayGenerationList(props.generationList)}
                    </select>    
                    <div>
                        {`This many renders: ${refRenderCount.current}`}
                    </div>                
                </div>   
                {
                pokedexRange.map(function(pokemon, index){
                    let animClass = '';
                    //generate animation class for newly added
                    if (index >= (pokedexRange.length - limit)) {
                        animClass = getAnimationClass();
                    }
                    return <PokemonSummary pokemon={pokemon} key={index} animClass={animClass}/>
                })
                }
                <div className="button-wrapper center">
                    <button className="button-lightblue" data-offset={add(refOffset.current, limit)} onClick={loadMorePokemon}>load more Pokemon</button>
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