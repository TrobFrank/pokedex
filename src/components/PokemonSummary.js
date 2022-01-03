import { Link } from 'react-router-dom';
import { useState } from 'react';
import { upperFirst, padStart, random, add, union, orderBy } from 'lodash';
import { displayTypes } from './Pokedex';
import { useEffect } from 'react/cjs/react.development';

function PokemonSummary(props){
    let pokemon;
    let animClass;
    if (props.pokemon) {
        pokemon = props.pokemon;
        animClass = props.animClass;
    }

    const [needsAnimation, setNeedsAnimation] = useState(true);

    function removeAnimation(){
        setNeedsAnimation(false);
    }

    if (pokemon.name && pokemon.id) {
        return (
        <div className={`pokedex_pokemon pokemon_summary ${needsAnimation ? animClass : ''}`} key={pokemon.id} onMouseEnter={removeAnimation}>
            <div className="detail-top">
                <Link to={`../pokemon/${pokemon.name}`}>
                    {/* <img src={pokemon.sprites.other['official-artwork'].front_default ? pokemon.sprites.other['official-artwork'].front_default : pokemon.sprites.front_default} alt={pokemon.name} />             */}
                    <img src={pokemon.sprites.front_default} alt={pokemon.name} />                         
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
    }

}

export default PokemonSummary;