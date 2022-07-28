import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { displayTypes } from './Pokedex';
import { PokemonSummary } from './PokemonSummary';
import Loader from './Loader';

function EvolutionChain(props){
    let { chain } = props.evolution;

    return (
        <div className="evolutions">
            {chain.evolves_to.length > 0 ? 
                <div className="evolutions_inner">
                    {chain.species.name}
                </div>
            : ''}
        </div>
    )
}

export default EvolutionChain;