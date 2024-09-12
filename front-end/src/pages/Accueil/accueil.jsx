import React, { useState, useEffect } from 'react';
import './accueil.css';
import PmeCard from '../../Composants/PmeCard/PmeCard';
import Filtre from '../../Composants/Filtre/Filtre';

function Accueil() {
  const [pmes, setPmes] = useState([]);
  const [filteredPmes, setFilteredPmes] = useState([]);
  const [zones, setZones] = useState([]);
  const [tarifs, setTarifs] = useState([]);
  const [notes, setNotes] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pmesPerPage = 10;

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

    // Calcul de la pagination basée sur les résultats filtrés
    const indexOfLastPme = currentPage * pmesPerPage;
    const indexOfFirstPme = indexOfLastPme - pmesPerPage;
    const currentPmes = filteredPmes.slice(indexOfFirstPme, indexOfLastPme); // Utiliser les PMEs filtrées pour la pagination
  
    const totalPages = Math.ceil(filteredPmes.length / pmesPerPage); // Basé sur les PMEs filtrées
  
    // Fonction pour changer de page
    const handlePageChange = (pageNumber) => {
      setCurrentPage(pageNumber);
    };
  
    // Chaque fois que les résultats filtrés changent, on remet la pagination à la première page
    useEffect(() => {
      setCurrentPage(1);
    }, [filteredPmes]);

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
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={currentPage === index + 1 ? 'active' : ''}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Accueil;