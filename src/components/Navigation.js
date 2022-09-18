import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { fnGetIdFromURL } from '../assets/utils';
import BtnSupriseMe from './BtnSupriseMe';
import logo from '../assets/img/logo.png';

export default function Navigation(props){

    const [showingSpeciesList, setShowingSpeciesList] = useState(false);
    const [speciesHTML, setSpeciesHTML] = useState('');
    const [filterVal, setFilterVal] = useState('');

    useEffect(()=>{
        handleFilterChange(filterVal);
    }, [filterVal])

    useEffect(()=>{
        if (showingSpeciesList === false){
            setFilterVal('')
        }
    }, [showingSpeciesList])

    const speciesKeys = ["name", "url"];

    function handleFilterChange(val){
        if (props.speciesData.results.length > 0){
            let filteredList = props.speciesData.results.filter((li) =>
                speciesKeys.some((key)=> li[key].toLowerCase().includes(val))
            ).map((li, id) =>{
                let findNumber = fnGetIdFromURL(li.url);
                return <Link key={id} to={`/pokemon/${findNumber}/${li.name}`} style={{'paddingLeft':'0.5em'}}>{li.name}</Link>
            });
            setSpeciesHTML(filteredList); 
        }
    }

    return (
        <div className={`nav`}> 
            <img className={`logo`} src={logo} alt="PokeAPI" />
            <div className={`button-wrapper left`}>
                <button className={`btn button-lightblue`} onClick={() => setShowingSpeciesList(!showingSpeciesList)} style={{'marginBottom':0}}>
                    {showingSpeciesList ? 'Hide List' : 'View List'}
                </button>
                <BtnSupriseMe speciesList={props.speciesData.results}/>
            </div>
            <div className={`speciesHTML animate-in left ${showingSpeciesList ? `show` : `hide`}`}> 
                <input className={`speciesFilter`} placeholder={`Name or ID`} value={filterVal} onChange={(e)=>setFilterVal(e.target.value.toLowerCase())} />
                {speciesHTML}
            </div>
        </div>
    )
}