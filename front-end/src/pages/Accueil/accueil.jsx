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
        const uniqueZones = [...new Set(data.map((pme) => pme.zone_intervention))];
        setZones(uniqueZones);

        // Extraire les tarifs uniques
        const uniqueTarifs = [...new Set(data.map((pme) => pme.tarif_mensuel))];
        setTarifs(uniqueTarifs);

        // Extraire les notes uniques
        const uniqueNotes = [...new Set(data.map((pme) => pme.rating))];
        setNotes(uniqueNotes);
      })
      .catch((error) => {
        console.error('Error fetching PMEs:', error);
      });
  }, []);

  // Calcul de la pagination basée sur les résultats filtrés
  const indexOfLastPme = currentPage * pmesPerPage;
  const indexOfFirstPme = indexOfLastPme - pmesPerPage;
  const currentPmes = filteredPmes.slice(indexOfFirstPme, indexOfLastPme);

  const totalPages = Math.ceil(filteredPmes.length / pmesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredPmes]);

  return (
    <div className="home">
      {/* Section de bienvenue */}
      <section className="welcome-section">
        <h1>Bienvenue sur Ville Propre</h1>
        <p>
          Nous sommes fiers de connecter les entreprises de gestion des déchets avec les ménages
          et les PME pour rendre notre ville plus propre et plus écologique.
        </p>
      </section>

      {/* Filtre et cartes PME */}
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

      {filteredPmes.length === 0 && (
        <div className='inexistant'>
          <p>Aucune PME ne correspond à votre recherche.</p>
        </div>
      )}


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

      {/* À propos de nous */}
      <section className="about-section">
        <h2>À propos de nous</h2>
        <p>
          Ville Propre est une plateforme dédiée à améliorer la gestion des déchets
          dans les zones urbaines. Nous collaborons avec de nombreuses PME et entreprises
          locales pour offrir des services fiables et accessibles à tous.
        </p>
      </section>

      {/* Nos services */}
      <section className="services-section">
        <h2>Nos services</h2>
        <div className="services-list">
          <div className="service">
            <h3>Gestion des Déchets Ménagers</h3>
            <p>Un service de collecte adapté aux besoins des ménages, simple et abordable.</p>
          </div>
          <div className="service">
            <h3>Collecte pour PME</h3>
            <p>Solutions sur mesure pour les petites et moyennes entreprises.</p>
          </div>
          <div className="service">
            <h3>Recyclage et Réutilisation</h3>
            <p>Promouvoir des pratiques de recyclage responsables pour un avenir durable.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Accueil;
