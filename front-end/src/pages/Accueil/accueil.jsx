import React, { useState, useEffect } from 'react';
import './accueil.css';
import PmeCard from '../../Composants/PmeCard/PmeCard';
import Filtre from '../../Composants/Filtre/Filtre';
import abonnement from '/src/assets/abonnement.png';
import gestion from '/src/assets/gestion.png';
import payement from '/src/assets/payement.png';
import sensibilisation from '/src/assets/sensibilisation.png';
import loading from '/src/assets/loading.png';
import PageErreur from '../PageErreur/pageErreur';

function Accueil() {
  const [pmes, setPmes] = useState([]); // Toutes les PME non filtrées
  const [filteredPmes, setFilteredPmes] = useState([null]); // PME filtrées
  const [zones, setZones] = useState([]);
  const [tarifs, setTarifs] = useState([]);
  const [notes, setNotes] = useState([]);
  const [erreur, setErreur] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const pmesPerPage = 10;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('https://ville-propre.onrender.com/pmes')
      .then((response) => response.json())
      .then((data) => {
        setPmes(data); // Charge toutes les PME
        setFilteredPmes(data); // Initialise les PME filtrées avec toutes les PME
        setIsLoading(false);

        // Extraire les valeurs uniques pour les filtres
        setZones([...new Set(data.map((pme) => pme.zone_intervention))]);
        setTarifs([...new Set(data.map((pme) => pme.tarif_mensuel))]);
        setNotes([...new Set(data.map((pme) => pme.rating))]);
      })
      .catch((error) => {
        console.error('Error fetching PMEs:', error);
        setIsLoading(false);
        setErreur(true);
      });
  }, []);

  // Pagination des PME filtrées
  const indexOfLastPme = currentPage * pmesPerPage;
  const indexOfFirstPme = indexOfLastPme - pmesPerPage;
  const currentPmes = filteredPmes.slice(indexOfFirstPme, indexOfLastPme);
  const totalPages = Math.ceil(filteredPmes.length / pmesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({
      top: 300,
      behavior: "smooth",
    });    
  };

  // Méthode pour filtrer les PME
  const handleFilter = (filteredResults) => {
    setFilteredPmes(filteredResults);
    setCurrentPage(1); // Réinitialiser à la première page après filtrage
  };

  const handleReload = () => {
    setIsLoading(true);
    setErreur(false);

    //Refetch les données sans recharger toute la page
    fetch('https://ville-propre.onrender.com/pmes')
      .then((response) => response.json())
      .then((data) => {
        setPmes(data);
        setFilteredPmes(data);
        setIsLoading(false);

        //Réinitialiser les filtres
        setZones([...new Set(data.map((pme) => pme.zone_intervention))]);
        setTarifs([...new Set(data.map((pme) => pme.tarif_mensuel))]);
        setNotes([...new Set(data.map((pme) => pme.rating))]);
      })
      .catch((error) => {
        console.error('Erreur lors de la tentative de rechargement:', error);
        setIsLoading(false);
        setErreur(true);
      })
  };


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

      {/* Affichage des PME */}
      {isLoading ? (
        <div className='loading'>
          <img src={loading} className='loadingSpin' alt='Chargement...' />
          <span>Chargement des pmes en cours...</span>
        </div>
      ) : (
        <>
          {erreur ? (
            <PageErreur onReload={handleReload} />
          ) : (
            <>
              {/* Filtre et cartes PME */}
              <Filtre
                list={pmes} // Passer la liste complète des PME
                setFilteredResults={handleFilter} // Utiliser la méthode de filtrage
                zones={zones}
                tarifs={tarifs}
                notes={notes}
              />
              <div className="cards-container">
                {filteredPmes.length === 0 ? (
                  <div className='inexistant'>
                    <p>Aucune PME ne correspond à votre recherche.</p>
                  </div>
                ) : (
                  currentPmes.map((pme) => (
                    <PmeCard key={pme.id} pme={pme} />
                  ))
                )}
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
            </>
          )}
        </>
      )}

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