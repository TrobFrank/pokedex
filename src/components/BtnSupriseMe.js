import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MAXCOUNT } from '../assets/utils';
import { random } from 'lodash';


function BtnSupriseMe(props){

    let navigate = useNavigate();
    function loadSupriseMe(){
        let surpriseMeRange = MAXCOUNT;
        let randomWIthinMax = random(0, surpriseMeRange);
        let randomPokemonSpecies = props.speciesList[randomWIthinMax - 1];
        navigate(`../pokemon/${randomWIthinMax}/${randomPokemonSpecies.name}`);
    }

    return (
        <div className="button-wrapper center">
            <button className="btn button-lightblue" onClick={loadSupriseMe}>Surprise Me!</button>
        </div>
    )
}


export default BtnSupriseMe;