import React, { useState, useEffect } from 'react';
import './accueil.css';
import PmeCard from '../../Composants/PmeCard/PmeCard';
import Filtre from '../../Composants/Filtre/Filtre';
import abonnement from '/src/assets/abonnement.png'
import gestion from '/src/assets/gestion.png'
import payement from '/src/assets/payement.png'
import sensibilisation from '/src/assets/sensibilisation.png'


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
          pour rendre notre ville plus propre et plus écologique.
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
        <h2>Ville propre: Ensemble pour un avenir plus vert</h2>
        <p>
          Ville Propre est une plateforme dédiée à améliorer la gestion des déchets
          dans les zones urbaines. Nous collaborons avec de nombreuses entreprises
          locales pour offrir des services fiables et accessibles à tous.
        </p>
      </section>

      {/* Nos services */}
      <section className="services-section">
        <h2>Nos services</h2>
        <div className="services-list">
          <div className="service">
            <img src={abonnement} alt="" />
            <div className='details'>
              <h3>Abonnement</h3>
              <p>Abonnez-vous facilement à des services adaptés à vos besoins et suivez vos abonnements en toute simplicité.</p>
            </div>
          </div>
          <div className="service">
            <img src={payement} alt="" />
            <div className='details'>
              <h3>Paiement et suivi automatisé</h3>
              <p>Bénéficiez d'une gestion et d'un suivi instantané des paiements en toute sécurité.</p>
            </div>
          </div>
          <div className="service">
            <img src={gestion} alt="" />
            <div className='details'>
              <h3>Gestion des déchets ménagers</h3>
              <p>Optimisez la gestion des collectes en suivant les passages réguliers et assurez une collecte efficace. </p>
            </div>
          </div>
          <div className="service">
            <img src={sensibilisation} alt="" />
            <div className='details'>
              <h3>Recyclage et Réutilisation</h3>
              <p>Informez-vous sur les bonnes pratiques de recyclage pour un avenir durable et contribuez à un environnement plus propre.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Accueil;
