import React, { useState, useEffect, useCallback } from 'react';
import './AbonnementEnAttente.css';

const AbonnementsEnAttente = () => {
  const [abonnes, setAbonnes] = useState([]);
  const [userId, setUserId] = useState(null);
  const [clientQuartiers, setClientQuartiers] = useState([]);
  const [accessToken, setAccessToken] = useState('');
  const [abonnementAccepter] = useState('accepted');
  const [abonnementReffuser] = useState('rejected');
  const [chargement, setChargement] = useState(true);
  
  // Fonction pour obtenir les cookies
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  // Récupérer les cookies dès le montage du composant
  useEffect(() => {
    const userIdFromCookie = getCookie('userId');
    const tokenFromCookie = getCookie('authToken');
  
    if (userIdFromCookie) setUserId(userIdFromCookie);
    if (tokenFromCookie) setAccessToken(tokenFromCookie);
  }, []);

  // ========================= POUR RECUPERER LES ABONNEMENTS EN ATTENTE =======================
  useEffect(() => {
    if (!userId || !accessToken) return;
  
    const fetchAbonnes = async () => {
      if (!userId || !accessToken) {
        setChargement(false);
        return;
      }
      setChargement(true);
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
        console.log(data);
        setAbonnes(data);

      } catch (error) {
        console.error('Erreur lors de la récupération des abonnés:', error.message);
      }finally {
      setChargement(false);
    }
    };
  
    fetchAbonnes();
  }, [userId, accessToken ]);

  // ========================= POUR RECUPERER LES QUARTIERS =======================
  useEffect(() => {
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
  }, []);

  // ========================= POUR REMPLACER LES QUARTIER ID PAR LEURS NOMS =======================
  const getQuartierNameById = useCallback((quartierId) => {
    const quartier = clientQuartiers.find(q => q.id === quartierId);
    return quartier ? quartier.quartier : 'Inconnu';
  }, [clientQuartiers]);

  
  // ========================= POUR VALIDER LES ABONNEMENTS EN ATTENTE =======================
  const handleAcceptAbonnement = async (idAbonnement) => {
    console.log("ID de l'abonnement accepté:", idAbonnement);

    try {
      const response = await fetch(`https://ville-propre.onrender.com/abonnements/${idAbonnement}/${abonnementAccepter}`, {
        method: 'PUT', 
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status_abonnement: 'actif' // Nouvelle valeur pour le statut
        })
      });      

      if (!response.ok) {
        throw new Error(`Erreur lors de l'acceptation de l'abonnement. Code: ${response.status}`);
      }

      // Mettre à jour l'état local après la validation de l'abonnement
      setAbonnes((prevAbonnes) =>
        prevAbonnes.map((abonne) =>
          abonne.id === idAbonnement ? { ...abonne, status_abonnement: 'actif' } : abonne
        )
      );

    } catch (error) {
      console.error('Erreur lors de l\'acceptation de l\'abonnement:', error.message);
    }
  };

  // ========================= POUR ANNULER LES ABONNEMENTS EN ATTENTE =======================
  const handleRefuseAbonnement = async (idAbonnement) => {
  console.log("ID de l'abonnement refusé:", idAbonnement);

  try {
    const response = await fetch(`https://ville-propre.onrender.com/abonnements/${idAbonnement}/${abonnementReffuser}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        status_abonnement: 'rejected' // Nouvelle valeur pour le statut
      })
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du refus de l'abonnement. Code: ${response.status}`);
    }

    // Mettre à jour l'état local après le refus de l'abonnement
    setAbonnes((prevAbonnes) =>
      prevAbonnes.filter((abonne) => abonne.id !== idAbonnement) // Supprimer l'abonné de la liste
    );

  } catch (error) {
    console.error('Erreur lors du refus de l\'abonnement:', error.message);
  }
};

  return (
    <div>
     <div className='divDonnesAbonnementEnAttente'>
  {chargement ? (
    <p className="chargementMessageAbonnes">Veuillez patienter quelques secondes...</p>
  ) : (
    <>
      {abonnes.length > 0 ? (
        abonnes.filter((abonne) => abonne.status_abonnement === "pending").length > 0 ? (
          abonnes.filter((abonne) => abonne.status_abonnement === "pending").map((abonne, index) => (
              <div className='donneesAbonnementEnAttenteMere' key={index}>
                <div className='donneesAbonnementEnAttente'>
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
                  <button
                    type='button'
                    className='btnAccepter'
                    onClick={() => handleAcceptAbonnement(abonne.id)}
                  >
                    Accepter
                  </button>
                  <button
                    type='button'
                    onClick={() => handleRefuseAbonnement(abonne.id)}
                    className='btnRefuser'
                  >
                    Refuser
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className='abonneNonTrouve'>Aucun utilisateur trouvé</p>
          )
      ) : (
        <p className='abonneNonTrouve'>Aucun utilisateur trouvé</p>
      )}
    </>
  )}
</div>
    </div>
  );
};

export default AbonnementsEnAttente;
