import React from 'react';
import { Routes, Route } from "react-router-dom";
import Pokedex from './components/Pokedex';
import PokemonDetail from './components/PokemonDetail';

function App() {

  return (
      <div className="App">
        <div className="content-wrapper">
        <Routes>
          <Route path="/" element={<Pokedex />} />
          <Route path="pokemon/:name" element={<PokemonDetail />} />
        </Routes>        
        </div>
      </div>
  );

}

export default App;
