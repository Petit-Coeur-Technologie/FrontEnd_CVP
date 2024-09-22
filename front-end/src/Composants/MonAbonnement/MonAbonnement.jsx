import React, { useState, useEffect } from 'react';
import './monAbonnement.css';
import { Link } from 'react-router-dom'; 

const MonAbonnement = () => {
  const [monAbonnement, setMonAbonnement] = useState([]);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
      return null;
    };

    const userIdFromCookie = getCookie('userId');
    const tokenFromCookie = getCookie('authToken');

    if (userIdFromCookie) setUserId(userIdFromCookie);
    if (tokenFromCookie) setAccessToken(tokenFromCookie);
  }, []);

  
  

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <div className='divDonnesMonAbonnementMere'>
      {chargement ? (
        <p className="chargementMessage">Veuillez patienter quelques secondes...</p>
      ) : monAbonnement.length > 0 ? (
        monAbonnement.map((abonne, index) => (
          <div className='donneesMonAbonnement' key={index}>
            <div className='divImageProfilMonAbonnement'>
              <img src={abonne.pme.logo_pme} alt="profil" />
            </div>
            <div className='detailsMonAbonnement'>
              <p className='numAbonnement'>N° Abonnement : {abonne.num_abonnement}</p>
              <Link title={`Clicker pour voir plus de détail sur la pme ${abonne.pme.nom_pme}`} to={`/${userId}`} className='nomPme'>{abonne.pme.nom_pme}</Link>
              <p className='description'>{abonne.pme.description}</p>
              <address className='zoneIntervention'>Zone intervention : {abonne.pme.zone_intervention}</address>
              <p className='date'>Date abonnement : {formatDate(abonne.debut_abonnement)}</p>
              <p className='tarifMensuel'>Tarif mensuel : {abonne.pme.tarif_mensuel}</p>
              <p className='tarifAbonnement'>Tarif abonnement : {abonne.pme.tarif_abonnement}</p>
              <p className='statusAbonnement'>Status abonnement : {abonne.status_abonnement}</p>
            </div>
          </div>
        ))
      ) : (
        <p>Aucun abonnement trouvé</p>
      )}
    </div>
  );
};

export default MonAbonnement;
