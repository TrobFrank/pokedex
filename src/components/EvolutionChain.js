import React, { useState, useEffect, useRef } from 'react';
import PokedexAPI from './PokedexAPI';
import { ENDPOINTS } from '../assets/utils';
import { sortSpeciesListByURL } from './Pokedex';
import PokemonSummary from './PokemonSummary';

function EvolutionChain(props){
    let { chain } = props.evolution;
    let maxEvoStage = useRef(0);

    const [evolution, setEvolution] = useState([]);

    useEffect(()=>{
        getEvolvesTo(chain, 0);
    }, [])

    function getEvolutionData(species, evoStage){
        //console.log(evolution);
        console.log(species.name, evoStage);
        PokedexAPI('name', ENDPOINTS.pokemon, species.name).then(pokemon => {
            pokemon.url = species.url; //allows sorting via sortSpeciesListByURL
            pokemon.evoStage = evoStage;
            setEvolution(evolution => [...evolution, pokemon]);
        })
    }

    function getEvolvesTo(chain, evoStage){
        getEvolutionData(chain.species, evoStage);
        if (chain.evolves_to.length > 0){
            evoStage++;
            maxEvoStage.current = evoStage;
            chain.evolves_to.forEach(evoChain => {
                if (evoChain.evolves_to.length > 0){
                    getEvolvesTo(evoChain, evoStage);
                } else {
                    getEvolutionData(evoChain.species, evoStage);
                }
            })
        }
    }

    if (evolution.length > 0){
        let sortedEvo;
        let evoArrow = true;
        if (evolution.length > 0)   { sortedEvo = sortSpeciesListByURL(evolution, 'low');} 
        else                        { sortedEvo = evolution }
        console.log(sortedEvo);
        return (
            <div className="evolutions">
                <div className="header">
                    <h3>Evolutions</h3>
                    {sortedEvo.length == 1 ? <p>This Pokémon does not evolve.</p>: ''}
                </div>
                <div className="evolution_details display-flex flex-row flex-wrap w-100">
                {
                sortedEvo.map(evo =>{
                    if (evo.evoStage == maxEvoStage.current){evoArrow = false;}
                    return <PokemonSummary pokemon={evo} key={evo.id} evoStage={evo.evoStage} evoArrow={evoArrow}/>
                })
                }
                </div>
            </div>
        )
    } else {
        return (<></>)
    }

}

export default EvolutionChain;