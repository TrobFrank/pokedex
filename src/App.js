import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Pokedex from './components/Pokedex';
import PokedexAPI from './components/PokedexAPI';
import PokemonDetail from './components/PokemonDetail';
import Loader from './components/Loader';

function App() {

  const [generationList, setGenerationList] = useState(null);
  const [typeList, setTypeList] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);

  useEffect(() => {
    getSetGenerationList();
    getSetTypeList();
    getSetSpeciesData();
  }, []);

  const getSetGenerationList = () => {
      return PokedexAPI('generationList').then((generationList) => {
        setGenerationList(generationList.results);
    });    
  }

  const getSetTypeList = () => {
    return PokedexAPI('typeList').then((typeList) => {
      setTypeList(typeList.results);
    });    
  }  

  const getSetSpeciesData = () => {
    return PokedexAPI('speciesData', null, null, 9999, 0).then((speciesData) => {
      setSpeciesData(speciesData);
    });    
  }   

  if (generationList && typeList && speciesData) {
    return (
      <div className="App">
        <div className="content-wrapper">
        <Routes>
          <Route path="generation/:generation" element={
            <Pokedex 
            generationList  = {generationList}
            typeList        = {typeList}
            speciesList     = {speciesData.results}
            speciesCount    = {speciesData.count}
            />
          } />
          <Route path="pokemon/:name" element={<PokemonDetail />} />
        </Routes>        
        </div>
        <footer>
          <p>Made by <a href="https://www.robertfranks.info" target="_blank">Rob Frank</a> using <a href="https://pokeapi.co/" target="_blank">PokeAPI</a></p>
        </footer>
      </div>
    );
  } else {
    return (<Loader />)
  }

}

export default App;
