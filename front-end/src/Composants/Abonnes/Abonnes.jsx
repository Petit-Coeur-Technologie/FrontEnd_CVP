import React, { useState, useEffect, useMemo, useCallback, Suspense, lazy } from 'react';
import profilImg from '../../assets/moi.png'; // Importe une image de profil par défaut

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
    })

  useEffect(()=>{
    console.log("L'id de l'utilisateur recupérer dans abonnés : "+userId);
    console.log("Le token de l'utilisateur recupérer dans abonnés : "+accessToken);
  })
  

  // Récupération des abonnés
  useEffect(() => {
    if (!userId || !accessToken) return;
  
    const fetchAbonnes = async () => {
      try {
        const response = await fetch(`https://ville-propre.onrender.com/abonnement/${userId}/client`, {
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
        console.log('Données reçues:', data); // Vérifie la structure des données
        setAbonnes(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnés:', error.message);
      }
    };
  
    fetchAbonnes();
  }, [userId, accessToken]);
  
  
  
  // Récupération des quartiers
  useEffect(() => {
    if (!userId) return;

    const fetchQuartiers = async () => {
      try {
        const response = await fetch(`https://ville-propre.onrender.com/quartiers`);
        if (!response.ok) {
          throw new Error(`Erreur réseau lors de la récupération des quartiers. Code: ${response.status}`);
        }
        const quartiers = await response.json();
        setClientQuartiers(quartiers);
        console.log('Récupération des quartiers réussie...');
        console.log(quartiers);
      } catch (error) {
        console.error('Erreur lors de la récupération des quartiers:', error.message);
      }
    };
    fetchQuartiers();
  }, [userId]);


  // Comparer les quartiers des abonnés avec les quartiers récupérés
  useEffect(() => {
    if (abonnes.length > 0 && clientQuartiers.length > 0) {
      abonnes.forEach((abonne) => {
        const quartierId = abonne.utilisateur.quartier_id;
        const quartier = clientQuartiers.find(q => q.id === quartierId);
        if (quartier) {
          console.log(`L'abonné ${abonne.utilisateur.nom_prenom} est dans le quartier : ${quartier.quartier}`);
        }
      });
    }
  }, [abonnes, clientQuartiers]);

  // Fonction pour obtenir le nom du quartier à partir de l'ID
  const getQuartierNameById = useCallback((quartierId) => {
    const quartier = clientQuartiers.find(q => q.id === quartierId);
    return quartier ? quartier.quartier : 'Inconnu'; // Retourne 'Inconnu' si le quartier n'est pas trouvé
  }, [clientQuartiers]);

  // Filtre les abonnés en fonction du terme de recherche
  const filteredAbonnes = useMemo(() => {
    return abonnes.filter((abonne) => {
      const nomPrenom = abonne.utilisateur.nom_prenom.toLowerCase();
      const tel = abonne.utilisateur.tel.toLowerCase();
      const searchTermLower = searchTerm.toLowerCase();
      
      return nomPrenom.includes(searchTermLower) || tel.includes(searchTermLower);
    });
  }, [abonnes, searchTerm]);

  const URL_COPIE_PIECE = "https://github.com/Petit-Coeur-Technologie/con_vi_propre_API/blob/main/static/Uploads/copie_pi/";

  // Gère le changement du terme de recherche
  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  // Gère la sélection d'un abonné pour afficher les détails
  const handleDetailler = useCallback((index) => {
    setSelectedAbonne(abonnes[index]);
    setPopupVisible(true);
    setShowCommentsPopup(false);
    setShowAddCommentPopup(false);
  }, [abonnes]);

  // Ferme tous les popups
  const closeAllPopups = useCallback(() => {
    setPopupVisible(false);
    setSelectedAbonne(null);
  }, []);

  // Ferme le popup d'ajout de commentaire
  const fermerPopupCommentaire = useCallback(() => {
    setShowAddCommentPopup(false);
  }, []);

  // Ferme le popup des commentaires
  const fermerPopupVoirCommentaire = useCallback(() => {
    setShowCommentsPopup(false);
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
      setCommentaires((prevCommentaires) => ({
        ...prevCommentaires,
        [abonneEmail]: [...(prevCommentaires[abonneEmail] || []), newComment]
      }));
      setNewComment('');
    }
  }, [newComment, selectedAbonne]);


  return (
    <div className={`abonnesConteneur ${popupVisible || showCommentsPopup || showAddCommentPopup ? 'blurBackground' : ''}`}>
      {/* Barre de recherche */}
      <div className='divRechercher'>
        <form className='formulaireRechercheAbonnes'>
          <input
            type="text"
            placeholder='Rechercher ...'
            className='txtRechercher inputAbonnes'
            value={searchTerm} // Corrigé : Liaison avec l'état "searchTerm"
            onChange={handleSearchChange} // Appelle la fonction de recherche lorsqu'on tape dans l'input
          />
        </form>
      </div>

      {/* Liste des abonnés filtrés */}
      <div className='divDonnes'>
        {filteredAbonnes.length > 0 ? (
          filteredAbonnes.map((abonne, index) => (
            <div className='donnees' key={index}>
              <div className='divImageProfil'>
                <img src={`${URL_COPIE_PIECE}${abonne.utilisateur.copie_pi}`} alt="profil" />
              </div>
              <p>{abonne.utilisateur.nom_prenom}</p>
              <address>{getQuartierNameById(abonne.utilisateur.quartier_id)}</address>
              <p>{abonne.utilisateur.tel}</p>
              <p>{abonne.utilisateur.role}</p>
              <div className='divBtnDetails'><button onClick={() => handleDetailler(index)} className='btnDetails'>Détails</button></div>
            </div>
          ))
        ) : (
          <p className='abonneNonTrouve'>Aucun utilisateur trouvé</p>
        )}
      </div>

      {/* Popup des détails de l'abonné */}
      {popupVisible && selectedAbonne && (
        <div className='popup'>
          <div className='popupContent'>
            <span className='closePopup' onClick={closeAllPopups}>&times;</span> {/* Bouton pour fermer le popup */}
            <div className='voirImages'>
              <div className='detailsImage'>
                <img src={`${URL_COPIE_PIECE}${selectedAbonne.profil}`} alt="profil" />
                {/* Utilisation d'une image par défaut si aucune image de profil n'est fournie */}
              </div>
            </div>
            <p><span className='label'>Nom complet:</span> {selectedAbonne.utilisateur.nom_prenom}</p>
            <p><span className='label'>Adresse:</span> {getQuartierNameById(selectedAbonne.utilisateur.quartier_id)}</p>
            <p><span className='label'>Téléphone:</span> {selectedAbonne.utilisateur.tel}</p>
            <p><span className='label'>Type:</span> {selectedAbonne.utilisateur.role}</p>
            <p><span className='label'>Genre:</span> {selectedAbonne.utilisateur.genre || 'Non spécifié'}</p>
            <p><span className='label'>Email:</span> {selectedAbonne.utilisateur.email || 'Non spécifié'}</p>
            <div className='divBtnVoirEnvoyer'>
              <button type="button" className='voirCommentaire' onClick={handleShowComments}>Commentaires</button>
              <button type="button" className='envoyeCommentaire' onClick={handleAddComment}>Envoyer un commentaire</button>
            </div>
          </div>
        </div>
)}

      {/* Popup pour voir les commentaires */}
      {showCommentsPopup && selectedAbonne && (
        <div className='popup popupCommentaireAbonnee'>
          <div className='popupContent'>
            <span className='closePopup' onClick={fermerPopupVoirCommentaire}>&times;</span>
            <h4 className='h4commentaire'>Commentaires pour {selectedAbonne.Email}:</h4>
            {commentaires[selectedAbonne.Email]?.map((comment, index) => (
              <p key={index} className='commentaire'>{comment}</p>
            ))}
          </div>
        </div>
      )}

      {/* Popup pour ajouter un commentaire */}
      {showAddCommentPopup && selectedAbonne && (
        <div className='popup'>
          <div className='popupContent'>
            <span className='closePopup' onClick={fermerPopupCommentaire}>&times;</span>
            <h4 className='h4commentaire'>Ajouter un commentaire pour {selectedAbonne.Email}:</h4>
            <textarea
              value={newComment}
              onChange={handleNewCommentChange}
              placeholder='Écrire un commentaire...'
            />
            <button onClick={handleAddCommentSubmit}>Ajouter</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Abonnes;
