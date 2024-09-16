import React, { useState, useEffect } from 'react';
import './pmes.css';
import PmeCard from '../../Composants/PmeCard/PmeCard';
import Filtre from '../../Composants/Filtre/Filtre';

function Pmes() {
  const [pmes, setPmes] = useState([]);
  const [filteredPmes, setFilteredPmes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pmesPerPage = 10;

  const [zones, setZones] = useState([]);
  const [tarifs, setTarifs] = useState([]);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    // Récupération des données depuis l'API
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
        console.error('Erreur lors de la récupération des PMEs:', error);
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
    <div className="pmes">
      {/* Composant de filtre */}
      <Filtre 
        list={pmes} 
        setFilteredResults={setFilteredPmes} 
        zones={zones} 
        tarifs={tarifs} 
        notes={notes} 
      />
      
      {/* Affichage des cartes PMEs */}
      <div className="cardspmes">
        {currentPmes.map((pme) => (
          <PmeCard key={pme.id} pme={pme} />
        ))}
      </div>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePageChange(index + 1)}
            className={`Btnpage ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Pmes;
