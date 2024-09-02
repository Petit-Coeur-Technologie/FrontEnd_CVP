import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

const Details = () => {
  const { index } = useParams();
  const location = useLocation();
  const abonne = location.state?.abonne;

  return (
    <div>
      <h1>Détails de l'abonné</h1>
      <div>
        <div className='divImageProfil'>
          <img src={abonne.profil} alt="profil" />
        </div>
        <p>{abonne.Nom_complet}</p>
        <address>{abonne.addresse}</address>
        <p>{abonne.Tel}</p>
        <p>{abonne.Type}</p>
        <p>{abonne.Genre}</p>
        <p>{abonne.Email}</p>
      </div>
    </div>
  );
};

export default Details;
