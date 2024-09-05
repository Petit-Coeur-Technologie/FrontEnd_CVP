import React, { useState, useEffect } from 'react';
import './accueil.css';
import { Link } from 'react-router-dom';
import PmeCard from '../../Composants/PmeCard/PmeCard';
import Filtre from '../../Composants/Filtre/Filtre';

function Accueil() {
  const [pmes, setPmes] = useState([]);
  const [filteredPmes, setFilteredPmes] = useState([]);
  const [zones, setZones] = useState([]);
  const [tarifs, setTarifs] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    fetch('https://ville-propre.onrender.com/pmes')
      .then((response) => response.json())
      .then((data) => {
        setPmes(data);
        setFilteredPmes(data); // Par défaut, afficher toutes les PMEs
        
        // Extraire les zones uniques
        const uniqueZones = [...new Set(data.map(pme => pme.zone_intervention))];
        setZones(uniqueZones);

        // Extraire les tarifs uniques
        const uniqueTarifs = [...new Set(data.map(pme => pme.tarif_mensuel))];
        setTarifs(uniqueTarifs);

        // Extraire les notes uniques
        const uniqueNotes = [...new Set(data.map(pme => pme.rating))];
        setNotes(uniqueNotes);
      })
      .catch((error) => {
        console.error('Error fetching PMEs:', error);
      });
  }, []);

  return (
    <div className="home">
      <Filtre 
        list={pmes} 
        setFilteredResults={setFilteredPmes} 
        zones={zones} 
        tarifs={tarifs} 
        notes={notes} 
      />
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