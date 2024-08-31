import React, { useState, useEffect } from 'react';
import './accueil.css';
import { Link } from 'react-router-dom';
import PmeCard from '../../Composants/PmeCard/PmeCard';
import Filtre from '../../Composants/Filtre/Filtre';

function Accueil() {
  const [pmes, setPmes] = useState([]);
  const [filteredPmes, setFilteredPmes] = useState([]);

  useEffect(() => {
    fetch('https://ville-propre.onrender.com/pmes')
      .then((response) => response.json())
      .then((data) => {
        setPmes(data);
        setFilteredPmes(data); // Par défaut, afficher toutes les PMEs
      })
      .catch((error) => {
        console.error('Error fetching PMEs:', error);
      });
  }, []);

  return (
    <div className="home">
      <Filtre list={pmes} setFilteredResults={setFilteredPmes} />
      <div className="cards-container">
        {filteredPmes.slice(0, 10).map((pme) => (
          <PmeCard key={pme.id} pme={pme} />
        ))}
      </div>
      <div className="voir-plus-container">
        <Link to="/pmes">
          <button type="button" className="voir-plus-button">Voir plus</button>
        </Link>
      </div>
    </div>
  );
}

export default Accueil;