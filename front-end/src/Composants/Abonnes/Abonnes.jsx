import React, { useState, useEffect } from 'react';
import profilImg from '../../assets/moi.png'; // Importe une image de profil par défaut

const Abonnes = ({ pme_id }) => {
  const [abonnes, setAbonnes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [popupVisible, setPopupVisible] = useState(false);
  const [selectedAbonne, setSelectedAbonne] = useState(null);
  const [showCommentsPopup, setShowCommentsPopup] = useState(false);
  const [showAddCommentPopup, setShowAddCommentPopup] = useState(false);
  const [commentaires, setCommentaires] = useState({});
  const [newComment, setNewComment] = useState('');
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [localPmeId, setLocalPmeId] = useState(pme_id); // Nouvel état pour stocker pme_id

  useEffect(() => {
    // Fonction pour obtenir les cookies
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const fetchUserData = () => {
      const userIdFromCookie = getCookie('userId');
      const tokenFromCookie = getCookie('authToken');

      if (userIdFromCookie) {
        setUserId(userIdFromCookie);
        setLocalPmeId(userIdFromCookie); // Met à jour l'état localPmeId
      }
      
      if (tokenFromCookie) {
        setAccessToken(tokenFromCookie);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userId || !accessToken) return;
  
    const fetchAbonnes = async () => {
      try {
        const response = await fetch(`https://ville-propre.onrender.com/abonnement/${localPmeId}/pme`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Erreur réseau lors de la récupération des abonnés.');
        }
  
        const data = await response.json();
        const filteredData = data.filter(abonne => abonne.user_id === userId); 
        setAbonnes(filteredData);
        console.log('Récupération des abonnés réussie...');
      } catch (error) {
        console.error('Erreur lors de la récupération des abonnés:', error.message);
      }
    };
  
    fetchAbonnes();
  }, [userId, accessToken, localPmeId]);
  

  useEffect(() => {
    console.log("ID "+userId);
    console.log("Token : "+accessToken);
    console.log("l'id de pme_id : "+localPmeId); // Utilisez localPmeId ici
  });

  // Filtre les abonnés en fonction du terme de recherche
  const filteredAbonnes = abonnes.filter((abonne) =>
    abonne.Nom_complet.toLowerCase().includes(searchTerm.toLowerCase()) ||
    abonne.Tel.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gère le changement du terme de recherche
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Gère la sélection d'un abonné pour afficher les détails
  const handleDetailler = (index) => {
    setSelectedAbonne(filteredAbonnes[index]);
    setPopupVisible(true);
    setShowCommentsPopup(false);
    setShowAddCommentPopup(false);
  };

  // Ferme tous les popups
  const closeAllPopups = () => {
    setPopupVisible(false);
    setSelectedAbonne(null);
  };

  // Ferme le popup d'ajout de commentaire
  const fermerPopupCommentaire = () => {
    setShowAddCommentPopup(false);
  };

  // Ferme le popup des commentaires
  const fermerPopupVoirCommentaire = () => {
    setShowCommentsPopup(false);
  };

  const handleShowComments = () => {
    setShowCommentsPopup(true);
  };

  const handleAddComment = () => {
    setShowAddCommentPopup(true);
  };

  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleAddCommentSubmit = () => {
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
  };


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
        {filteredAbonnes.map((abonne, index) => (
          <div className='donnees' key={index}>
            <div className='divImageProfil'>
              <img src={abonne.profil || profilImg} alt="profil" /> {/* Utilisation d'une image par défaut si aucune image de profil n'est fournie */}
            </div>
            <p>{abonne.Nom_complet}</p> {/* Nom de l'abonné */}
            <address>{abonne.addresse}</address> {/* Adresse */}
            <p>{abonne.Tel}</p> {/* Numéro de téléphone */}
            <p>{abonne.Type}</p> {/* Type (Ménage, Entreprise, etc.) */}
            <button onClick={() => handleDetailler(index)} className='btnDetails'>Détails</button> {/* Bouton pour voir les détails */}
          </div>
        ))}
      </div>

      {/* Popup des détails de l'abonné */}
      {popupVisible && selectedAbonne && (
        <div className='popup'>
          <div className='popupContent'>
            <span className='closePopup' onClick={closeAllPopups}>&times;</span> {/* Bouton pour fermer le popup */}
            <div className='voirImages'>
              <div className='detailsImage'>
                <img src={selectedAbonne.profil || profilImg} alt="profil" /> {/* Utilisation d'une image par défaut si aucune image de profil n'est fournie */}
              </div>
            </div>
            <p><span className='label'>Nom complet:</span> {selectedAbonne.Nom_complet}</p>
            <p><span className='label'>Adresse:</span> {selectedAbonne.addresse}</p>
            <p><span className='label'>Téléphone:</span> {selectedAbonne.Tel}</p>
            <p><span className='label'>Type:</span> {selectedAbonne.Type}</p>
            <p><span className='label'>Genre:</span> {selectedAbonne.Genre || 'Non spécifié'}</p>
            <p><span className='label'>Email:</span> {selectedAbonne.Email || 'Non spécifié'}</p>
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
