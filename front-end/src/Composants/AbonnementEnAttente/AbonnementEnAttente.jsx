import React, { useState, useEffect, useCallback } from 'react';
import './AbonnementEnAttente.css';

const Abonnes = () => {
  const [abonnes, setAbonnes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [clientQuartiers, setClientQuartiers] = useState([]);
  const [accessToken, setAccessToken] = useState('');

  // Obtention des cookies
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };
    const userIdFromCookie = getCookie('userId');
    const tokenFromCookie = getCookie('authToken');
  
    if (userIdFromCookie) setUserId(userIdFromCookie);
    if (tokenFromCookie) setAccessToken(tokenFromCookie);
  }, []);

  useEffect(() => {
    console.log("L'id de l'utilisateur récupéré dans abonnés : " + userId);
    console.log("Le token de l'utilisateur récupéré dans abonnés : " + accessToken);
  }, [userId, accessToken]);

  // Récupération des abonnés
  useEffect(() => {
    if (!userId || !accessToken) return;
  
    const fetchAbonnes = async () => {
      try {
        const response = await fetch(`https://ville-propre.onrender.com/abonnements/${userId}/clients`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error(`Erreur réseau lors de la récupération des abonnés. Code: ${response.status}`);
        }
  
        const data = await response.json();
        setAbonnes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnés:', error.message);
      }
    };
  
    fetchAbonnes();
  }, [userId, accessToken]);

  useEffect(() => {
    console.log(abonnes);
  }, [abonnes]);

  useEffect(() => {
    if (!userId) return;

    const fetchQuartiers = async () => {
      try {
        const response = await fetch(`https://ville-propre.onrender.com/quartiers`);
        if (!response.ok) throw new Error(`Erreur réseau: ${response.status}`);
        const quartiers = await response.json();
        setClientQuartiers(quartiers);
      } catch (error) {
        console.error('Erreur lors de la récupération des quartiers:', error.message);
      }
    };

    fetchQuartiers();
  }, [userId]);

  const getQuartierNameById = useCallback((quartierId) => {
    const quartier = clientQuartiers.find(q => q.id === quartierId);
    return quartier ? quartier.quartier : 'Inconnu';
  }, [clientQuartiers]);

  return (
    <div>
      <div className='divDonnesAbonnementEnAttente'>
        {abonnes.length > 0 ? (
          abonnes
            .filter((abonne) => abonne.status_abonnement === "pending")
            .map((abonne, index) => (
              <div className='donneesAbonnementEnAttenteMere'>
                  <div className='donneesAbonnementEnAttente' key={index}>
                    <div className='divImageProfil'>
                      <img src={abonne.utilisateur.copie_pi} alt="profil" />
                    </div>
                    <div className='autreInfos'>
                      <p>{abonne.utilisateur.nom_prenom}</p>
                      <address>{getQuartierNameById(abonne.utilisateur.quartier_id)}</address>
                      <p>{abonne.utilisateur.tel}</p>
                      <p>{abonne.utilisateur.role}</p>
                    </div>
                </div>
                <div className='divValidation'>
                    <button type='button' className='btnAccepter'>Accepter</button>
                    <button type='button' className='btnRefuser'>Refuser</button>
                </div>
              </div>
            ))
        ) : (
          <p className='abonneNonTrouve'>Aucun utilisateur trouvé</p>
        )}
      </div>
    </div>
  );
};

export default Abonnes;
