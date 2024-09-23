import React, { useState, useEffect, useMemo, useCallback } from 'react';
import profilImg from '../../assets/moi.png';

const Abonnes = () => {
  const [abonnes, setAbonnes] = useState([]);
  const [clientQuartiers, setClientQuartiers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedAbonne, setSelectedAbonne] = useState(null);
  const [showCommentsPopup, setShowCommentsPopup] = useState(false);
  const [showAddCommentPopup, setShowAddCommentPopup] = useState(false);
  const [commentaires, setCommentaires] = useState({});
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [chargement, setChargement] = useState(true);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    return parts.length === 2 ? parts.pop().split(';').shift() : null;
  };

  useEffect(() => {
    const userIdFromCookie = getCookie('userId');
    const tokenFromCookie = getCookie('authToken');
    if (userIdFromCookie) setUserId(userIdFromCookie);
    if (tokenFromCookie) setAccessToken(tokenFromCookie);
  }, []);

  useEffect(() => {
    const fetchMonAbonnement = async () => {
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
          throw new Error(`Erreur réseau lors de la récupération de l'abonnement. Code: ${response.status}`);
        }
  
        const data = await response.json();
        console.log(data); 
        console.log("===============DONNE RECU DANS DATA=================")
        if (Array.isArray(data)) {
          setAbonnes(data);
        } else {
          console.error('Les données reçues ne sont pas un tableau:', data);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnements:', error.message);
      } finally {
        setChargement(false);
      }
    };
  
    fetchMonAbonnement();
  }, [userId, accessToken]);
  
  // Filtrage
  const filteredAbonnes = useMemo(() => {
    if (!abonnes || abonnes.length === 0) {
      console.log('Aucun abonné trouvé');
      return [];
    }
  
    return abonnes.filter((abonne) => {
      const nomPrenom = abonne.utilisateur?.nom_prenom?.toLowerCase() || '';
      const tel = abonne.utilisateur?.tel?.toLowerCase() || '';
      const searchTermLower = searchTerm.toLowerCase();
      
      // Vérification que le status_abonnement est actif
      const isAbonnementActif = abonne.status_abonnement === 'actif';
  
      return isAbonnementActif && (nomPrenom.includes(searchTermLower) || tel.includes(searchTermLower));
    });
  }, [abonnes, searchTerm]);
    

  useEffect(()=>{
    console.log(abonnes);
    console.log("===============DONNE RECU DANS ABONNEMENT=================")
  },[abonnes])


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

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleDetailler = useCallback((index) => {
    setSelectedAbonne(filteredAbonnes[index]);
    setPopupVisible(true);
    setShowCommentsPopup(false);
    setShowAddCommentPopup(false);
  }, [filteredAbonnes]);

  const handleAnnulerAbonnement = useCallback((index) => {
    // setSelectedAbonne(filteredAbonnes[index]);
    // setPopupVisible(true);
    // setShowCommentsPopup(false);
    // setShowAddCommentPopup(false);
    alert("Abonnement annuler");
  }, []);

  const closeAllPopups = useCallback(() => {
    setPopupVisible(false);
    setSelectedAbonne(null);
  }, []);

  const handleShowComments = useCallback(() => {
    setShowCommentsPopup(true);
  }, []);

  const handleAddComment = useCallback(() => {
    setShowAddCommentPopup(true);
  }, []);

  const handleNewCommentChange = useCallback((event) => {
    setNewComment(event.target.value);
  }, []);

  const handleAddCommentSubmit = useCallback(() => {
    if (!newComment.trim()) {
      alert('Le commentaire ne peut pas être vide.');
      return;
    }
    if (selectedAbonne) {
      const abonneEmail = selectedAbonne.Email;
      setCommentaires((prev) => ({
        ...prev,
        [abonneEmail]: [...(prev[abonneEmail] || []), newComment],
      }));
      setNewComment('');
    }
  }, [newComment, selectedAbonne]);

  return (
    <div className={`abonnesConteneur ${popupVisible || showCommentsPopup || showAddCommentPopup ? 'blurBackground' : ''}`}>
      <div className='divRechercher'>
        <form className='formulaireRechercheAbonnes'>
          <input
            type="text"
            placeholder='Rechercher ...'
            className='txtRechercherAbonne'
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      <div className='divDonnes'>
        {chargement ? (
          <p className="chargementMessageAbonnes">Veuillez patienter quelques secondes...</p>
        ) : filteredAbonnes.length > 0 ? (
          filteredAbonnes.map((abonne, index) => (
            <div className='donnees' key={index}>
              <div className='divImageProfil'>
                <img src={abonne.utilisateur.copie_pi} alt="profil" />
              </div>
              <p>{abonne.utilisateur.nom_prenom}</p>
              <address>{getQuartierNameById(abonne.utilisateur.quartier_id)}</address>
              <p>{abonne.utilisateur.tel}</p>
              <p>{abonne.utilisateur.role}</p>
              <div className='divBtnDetails'>
                <button onClick={() => handleDetailler(index)} className='btnDetails'>Détails</button>
                <button onClick={() => handleAnnulerAbonnement(index)} className='btnAnnulerAbonnement'>Annuler</button>
              </div>
            </div>
          ))
        ) : (
          <p className='abonneNonTrouve'>Aucun utilisateur trouvé</p>
        )}
      </div>

      {popupVisible && selectedAbonne && (
        <div className='popup'>
          <div className='popupContent'>
            <span className='closePopup' onClick={closeAllPopups}>&times;</span>
            <div className='voirImages'>
              <div className='detailsImage'>
                <img src={selectedAbonne.utilisateur.copie_pi || profilImg} alt="profil" />
              </div>
              <p className='nomAbonne'>{selectedAbonne.utilisateur.nom_prenom}</p>
              <p className='telAbonne'>{selectedAbonne.utilisateur.tel}</p>
              <p className='roleAbonne'>{selectedAbonne.utilisateur.role}</p>
              <button onClick={handleShowComments}>Voir Commentaires</button>
              <button onClick={handleAddComment}>Ajouter Commentaire</button>
            </div>
            {showCommentsPopup && (
              <div className='divCommentaires'>
                <h3>Commentaires :</h3>
                <ul>
                  {(commentaires[selectedAbonne.Email] || []).map((commentaire, index) => (
                    <li key={index}>{commentaire}</li>
                  ))}
                </ul>
                <button onClick={() => setShowCommentsPopup(false)}>Fermer</button>
              </div>
            )}
            {showAddCommentPopup && (
              <div className='ajouterCommentaire'>
                <textarea
                  value={newComment}
                  onChange={handleNewCommentChange}
                  placeholder='Écrire un commentaire...'
                />
                <button onClick={handleAddCommentSubmit}>Ajouter Commentaire</button>
                <button onClick={() => setShowAddCommentPopup(false)}>Annuler</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Abonnes;
