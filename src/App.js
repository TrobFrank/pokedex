import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router-dom";
import Pokedex from './components/Pokedex';
import PokedexAPI from './components/PokedexAPI';
import PokemonDetail from './components/PokemonDetail';

function App() {

  const [generationList, setGenerationList] = useState(null);

  useEffect(() => {
    getSetGenerationList();
  }, []);

  const getSetGenerationList = () => {
      return PokedexAPI('generationList').then((generationList) => {
        setGenerationList(generationList.results);
    });    
  }

  if (generationList !== null) {
    return (
      <div className="App">
        <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Pokedex generationList={generationList}/>}>
            <Route path="generation/:generation" element={<Pokedex generationList={generationList}/>} />
          </Route>
          <Route path="pokemon/:name" element={<PokemonDetail />} />
        </Routes>        
        </div>
      </div>
    );
  } else {
    return (<div>Loading...</div>)
  }

}

export default App;
