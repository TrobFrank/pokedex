import React, { useEffect, useState, useRef } from 'react';
import { orderBy, padStart, random, add, upperFirst } from 'lodash';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import PokedexAPI from './PokedexAPI';
import PokemonSummary from './PokemonSummary';
import getAnimationClass from '../assets/getAnimationClass';
import { FILTERS, ENDPOINTS, fnGetIdFromURL } from '../assets/utils';

function Pokedex(props){
    let params = useParams();
    let navigate = useNavigate();
    let location = useLocation();

    let limit = 12;

    let refPokedexRange = useRef([]);
    let refOffset = useRef(0);
    let refRenderCount = useRef(0);
        refRenderCount.current = refRenderCount.current + 1;
        //console.log(`This many renders: ${refRenderCount.current}`);

    let [order, setOrder] = useState('low');
    let [generation, setGeneration] = useState(null);
    let [pokedexRange, setPokedexRange] = useState([]);

    //switching generations
    useEffect(() => {
        refOffset.current = 0;
        refPokedexRange.current = [];
        getGenerationData();
        //console.log('location.pathname changed');
        
        document.title = `${upperFirst(params.generation)} | Pokedex`;
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
                return (<option key={gen.name} value={gen.name} defaultValue={params.generation == gen.name ? gen.name: null } >{gen.name}</option>)
            })
        )
    }

    const getGenerationData = () => {
        return PokedexAPI('generation', ENDPOINTS.generation, false, params.generation).then((genData) => {
            setGeneration(genData);
            return genData;
        });        
    }

    function loadMorePokemon() {
        refOffset.current = add(refOffset.current, limit);
        getRangeFromGeneration(limit, refOffset.current, order);
    }

    const getRangeFromGeneration = (limit, offset, order) => {
        let arrPokemonEndpoints = [];
        //console.log('getRangeFromGeneration generation: ', generation);
        //console.log(`limit: ${limit} => offset: ${offset} => order: ${order}`);
        if (generation !== null) {
            let genSorted = sortSpeciesListByURL(generation.pokemon_species, order);
            //console.log('genSorted: ', genSorted);
            let genSliced = genSorted.slice(offset, (limit+offset)); //.slice is dumb
            //console.log('genSliced: ', genSliced);
            genSliced.forEach(pokemon => {
                //console.log(pokemon);
                arrPokemonEndpoints.push(`${ENDPOINTS.baseURL}${ENDPOINTS.pokemon}/${pokemon.id}`);//pokemon (sprites, etc)
            })
            //console.log('arrPokemonEndpoints: ', arrPokemonEndpoints);
            Promise.all
                (arrPokemonEndpoints.map((endpoint) => axios.get(endpoint)))
                .then((multiResData) => {
                    //console.log('multiResData: ', multiResData);
                    multiResData.forEach(function(pokemonResData){
                        //console.log('pokemonResData: ', pokemonResData);
                        refPokedexRange.current.push(pokemonResData.data);
                    })
                    setPokedexRange([...refPokedexRange.current]); //create/pass "new" obj to trigger state render
                }).catch(error => console.log(error)); 
        }
    }

    return (
        <div className="container">
            <div className="pokedex_results">
                <div className="toggle-controls display-flex flex-wrap justify-content-center align-items-center">
                    <select id="generation" defaultValue={params.generation} onChange={(e) => switchGeneration(e.target.value)} className="color-bg color-black">
                        <option disabled="disabled">Select Generation</option>
                        {displayGenerationList(props.generationList)}
                    </select>                       
                    <select id="sort" defaultValue={order} onChange={(e) => {setOrder(e.target.value);}} className="color-bg color-black">
                        <option disabled="disabled">Sort results by...</option>
                        <option value={FILTERS.SORT_BY.LOW}>Lowest Number (First)</option>
                        <option value={FILTERS.SORT_BY.HIGH}>Highest Number (First)</option>
                        <option value={FILTERS.SORT_BY.AZ}>A-Z</option>
                        <option value={FILTERS.SORT_BY.ZA}>Z-A</option>
                    </select>
                </div>
                {
                    pokedexRange.map(function(pokemon, index){
                        let animClass = '';
                        //generate animation class for newly added
                        if (index >= (pokedexRange.length - limit)) {
                            animClass = getAnimationClass();
                        }
                        return <PokemonSummary pokemon={pokemon} key={pokemon.id} animClass={animClass}/>
                    })
                }
                <div className="button-wrapper center">
                    <button className="btn button-lightblue" data-offset={add(refOffset.current, limit)} onClick={loadMorePokemon}>load more Pokemon</button>
                </div>                
            </div>
        </div>
    )
}


function displayTypes(pokemonTypes) {
    let typesHMTL = pokemonTypes.map((type, i) => {
        let dataRef = type;
        if (type.hasOwnProperty('type')){dataRef = type.type;}
        return <span className={`type-emblem type-emblem_sm background-color-${dataRef.name}`} key={i}>{upperFirst(dataRef.name)}</span>
    })
    return typesHMTL;
}

/* SORTING FUNCTIONS */
function setArrayOrder(array, order) {
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
        let idFromURL = fnGetIdFromURL(index.url);
        return arrDirty = {...index, "sort": padStart(idFromURL, 3, '00'), "id": idFromURL}
    });
    // let arrClean = orderBy(arrMod, index => index.sort, ['asc']); //sort by number asc first, then determine 
    // arrClean = setArrayOrder(arrClean, order);
    let arrClean = setArrayOrder(arrMod, order);        
    return arrClean;    
}    

export default Pokedex;
export { displayTypes, sortSpeciesListByURL };