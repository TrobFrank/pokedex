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
                return <div key={id} className={`listItem display-flex align-items-center`}>
                    <span className={`listNumber`}>{findNumber}</span>
                    <Link to={`/pokemon/${findNumber}/${li.name}`} onClick={handleCloseList}>
                        {li.name}
                    </Link>
                </div>
            });
            setSpeciesHTML(filteredList); 
        }
    }

    function handleCloseList(){
        document.getElementById('speciesHTML').scrollTo(0,0);
        setShowingSpeciesList(false);
        setFilterVal('')
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
            <div id={`speciesHTML`} className={`speciesHTML animate-in left ${showingSpeciesList ? `show` : `hide`}`}> 
                <div className={`display-flex align-items-center`}>
                    <input className={`speciesFilter`} type="text" placeholder={`Pokemon Name or ID`} value={filterVal} onChange={(e)=>setFilterVal(e.target.value.toLowerCase())} />
                    <button className={`close`} onClick={handleCloseList}>&times;</button>
                </div>
                <div className={`speciesColumn`}>
                    {speciesHTML}
                </div>
            </div>
        </div>
    )
}