import React, { useEffect, useState } from 'react';
import { Routes, Route, useParams, Navigate } from "react-router-dom";
import Pokedex from './components/Pokedex';
import PokedexAPI from './components/PokedexAPI';
import PokemonDetail from './components/PokemonDetail';
import Loader from './components/Loader';
import { ENDPOINTS } from './assets/utils';

function App() {

  let params = useParams();
  const [generationList, setGenerationList] = useState(null);
  const [typeList, setTypeList] = useState(null);
  const [speciesData, setSpeciesData] = useState(null);

  useEffect(() => {
    getSetGenerationList();
    getSetTypeList();
    getSetSpeciesData();
  }, []);

  const getSetGenerationList = () => {
      return PokedexAPI('generationList', ENDPOINTS.generation).then((generationList) => {
        setGenerationList(generationList.results);       
    });    
  }

  const getSetTypeList = () => {
    return PokedexAPI('typeList', ENDPOINTS.type).then((typeList) => {
      setTypeList(typeList.results);
    });    
  }  

  const getSetSpeciesData = () => {
    return PokedexAPI('speciesData', ENDPOINTS.species, null, null, 9999, 0).then((speciesData) => {
      setSpeciesData(speciesData);
    });    
  }   

    return (
      <div className="App">
        <div className="content-wrapper">

        {(
          generationList && typeList && speciesData ? 
          <Routes>
            <Route path="generation/:generation" element={
              <Pokedex 
              generationList  = {generationList}
              typeList        = {typeList}
              speciesList     = {speciesData.results}
              speciesCount    = {speciesData.count}
              />
            } />
            <Route path="pokemon/:id" element={
              <PokemonDetail 
              speciesList     = {speciesData.results}
              typeList        = {typeList}
              />
            } />
            <Route path="pokemon/:id/:name" element={
              <PokemonDetail 
              speciesList     = {speciesData.results}
              typeList        = {typeList}
              />
              } />
            <Route path="*" element={<Navigate to={`generation/${generationList[0].name}`} />} />
          </Routes> 
          : 
          <Loader/>
        )}
        </div>
        <footer>
          <p>Made by <a href="https://www.robertfranks.info" target="_blank">Rob Frank</a> using <a href="https://pokeapi.co/" target="_blank">PokeAPI</a></p>
        </footer>
      </div>
    );

}

export default App;
