import { Link } from 'react-router-dom';
import { upperFirst, padStart, random, add, union, orderBy } from 'lodash';
import { displayTypes } from './Pokedex';

function PokemonSummary(props){
    let pokemon;
    if (props.pokemon) {
        pokemon = props.pokemon;
    }

    if (pokemon.name && pokemon.id) {
        return (
        <div className="pokedex_pokemon pokemon_summary" key={pokemon.id}>
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