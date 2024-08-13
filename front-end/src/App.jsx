import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Inscription from './pages/inscription/inscription.jsx';
import './App.css';

function App() {
  return (
    <Routes>
      <Route path='/inscription' element={<Inscription />} />
    </Routes>
  );
}

export default App;