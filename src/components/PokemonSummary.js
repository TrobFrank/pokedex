import { Link } from 'react-router-dom';
import { useState } from 'react';
import { upperFirst, padStart } from 'lodash';
import { displayTypes } from './Pokedex';
import Loader from './Loader';
import Image from './Image';

function PokemonSummary(props){
    let pokemon, animClass, inEvoChain, evoStage, evoArrow;
    if (props.pokemon) {
        pokemon = props.pokemon;
        animClass = props.animClass;
        inEvoChain = props.inEvoChain;
        evoStage = props.evoStage >= 0 ? props.evoStage : 0;
        evoArrow = props.evoArrow;
    }

    const [needsAnimation, setNeedsAnimation] = useState(true);

    function removeAnimation(){
        setNeedsAnimation(false);
    }

    if (pokemon.name && pokemon.id) {
        let classList = `${needsAnimation && animClass ? animClass : ``} evoStage-${evoStage} ${evoArrow ? `evolution_arrow`: ''}`;
        return (
        <>
            <div className={`pokedex_pokemon pokemon_summary ${classList}`} onMouseEnter={removeAnimation}>
                <div className="detail-top">
                    <Link to={`../pokemon/${pokemon.id}/${pokemon.name}`}>
                        {/* <img src={pokemon.sprites.other['official-artwork'].front_default ? pokemon.sprites.other['official-artwork'].front_default : pokemon.sprites.front_default} alt={pokemon.name} />             */}
                        <Image altTxt={pokemon.name} source={inEvoChain ? pokemon.sprites.front_default : pokemon.sprites.other['official-artwork'].front_default} />                    
                    </Link>
                </div>
                <div className="detail-bottom">
                    <p className="pokedex_pokemon-id">#{padStart(pokemon.id, 3, '00')}</p>
                    <h3 className="pokedex_pokemon-title">{upperFirst(pokemon.name)}</h3>
                    <div className="display-flex flex-row flex-nowrap justify-content-flex-start pokedex_pokemon-types">
                        {displayTypes(pokemon.types)}
                    </div>
                </div>
            </div>  
            
        </>
        )      
    } else {
        return (<Loader/>)
    }

}

export default PokemonSummary;