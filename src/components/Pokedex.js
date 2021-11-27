import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { upperFirst, padStart, random, add, union, orderBy } from 'lodash';
import axios from 'axios';
import PokedexAPI from './PokedexAPI';
import { isCompositeComponent } from 'react-dom/test-utils';

function Pokedex(){

    let arrCurrentPokemon = [];
    let pokemonDisplay = <div></div>;

    let [PokedexRange, setPokedexRange] = useState([]);
    let [offset, setOffset] = useState(0);
    let [order, setOrder] = useState('first_low');
    let limit = 2;
    let orderMax = 898; //get from pokemon-species endpoint
    let arrPokemonData = [];

    useEffect(() => {
        getOrderedPokemonRange(limit, offset, order);
        displayFromState();
    }, [offset]);      

    useEffect(() => {
        let newOrder = sortCurrentPokemonRange(PokedexRange, order);
        setPokedexRange(newOrder);
        displayFromState();
        console.log(order);
    }, [order]); 

    // const getRandomPokemonRange = (limit, offset, order) => {
    //     console.log('nyi');
    // }

    //idea: sort by generation first. search limited to name/id
    

    //sorting issue:
    /* 
        lowest number works by default
        highest number sorts currently loaded..
            1. make all new request to sort from pokemon?limit={x}&offset={(orderMax - limit)}
            2. then sorting into "order" (desc by ID)
            3. update "load more pokemon" button to work backwards, beginning from max
        a-z... not sure if possible, without going by an entire generation
        z-a... not sure if possible, without going by an entire generation
    */

    const getOrderedPokemonRange = (limit, offset, order) => {
        PokedexAPI('range', false, false, limit, offset).then((incomingPokemon => {
            let arrPokemonEndpoints = []; //reset endpoint array each request
            incomingPokemon.results.forEach(pokemon => {
                arrPokemonEndpoints.push(pokemon.url);
            })
            Promise.all
                (arrPokemonEndpoints.map((endpoint) => axios.get(endpoint)))
                .then((multiResData) => {
                    multiResData.forEach(function(pokemonResData){
                        arrPokemonData.push(pokemonResData.data);
                    })
                    console.log('UNSORTED arrPokemonData: ', arrPokemonData);
                    arrPokemonData = setArrayOrder(union(PokedexRange, arrPokemonData), order); //dedupe and order
                    console.log('ORDERED arrPokemonData: ', arrPokemonData);
                    setPokedexRange(arrPokemonData);
            }).catch(error => console.log(error));            
        }));
    }

    const sortCurrentPokemonRange = (range, order) => {
        return setArrayOrder(range, order);
    }

    const displayFromState = () => {
        console.log('here displayFromState PokedexRange: ', PokedexRange)
        if (PokedexRange !== []) {
            arrCurrentPokemon = Array.from(PokedexRange);
            pokemonDisplay = arrCurrentPokemon.map(function(pokemon){
                //console.log('pokedex_pokemon data: ', pokemon);
                return (
                    <div className="pokedex_pokemon" key={pokemon.id}>
                        <div className="detail-top">
                            <Link to={`pokemon/${pokemon.name}`}>
                                <img src={pokemon.sprites.other['official-artwork'].front_default ? pokemon.sprites.other['official-artwork'].front_default : pokemon.sprites.front_default} alt={pokemon.name} />            
                            </Link>
                        </div>
                        <div className="detail-bottom">
                            <p className="pokedex_pokemon-id">#{padStart(pokemon.id, 3, '00')}</p>
                            <h3 className="pokedex_pokemon-title">{upperFirst(pokemon.name)}</h3>
                            <div className="pokedex_pokemon-types">
                                {displayTypes(pokemon)}
                            </div>
                        </div>
                    </div>
                )
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
                default:     arrSorted = orderBy(array, index => index.id, ['asc']); break;
                case 'high': arrSorted = orderBy(array, index => index.id, ['desc']); break;
                case 'az':   arrSorted = orderBy(array, index => index.name, ['asc']); break;
                case 'za':   arrSorted = orderBy(array, index => index.name, ['desc']); break;                                        
            } 
            //console.log('arrSorted: ', arrSorted);
            return arrSorted;
    }

    return (
        <div className="container">
            <div className="pokedex_results">
                <div className="button-wrapper center">
                    {/* <button className="button-lightblue" onClick={() => getRandomPokemonRange()}>Surprise Me!</button> */}
                    <select id="sort" onChange={(e) => setOrder(e.target.value)}>
                        <option disabled="disabled">Sort results by...</option>
                        <option value="low">Lowest Number (First)</option>
                        <option value="high">Highest Number (First)</option>
                        <option value="az">A-Z</option>
                        <option value="za">Z-A</option>
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
        return <span key={type.name} className={`type-emblem type-emblem_sm background-color-${type.type.name}`}>{upperFirst(type.type.name)}</span>
    })
    return typesHMTL;
}


export default Pokedex;