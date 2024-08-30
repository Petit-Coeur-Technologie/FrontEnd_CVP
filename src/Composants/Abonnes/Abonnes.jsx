import React, { useState } from 'react'; // Importe React et le hook useState
// Importe une image de profil par défaut
import profilImg from '../../assets/moi.png'

// Déclare le composant principal "Abonnes"
const Abonnes = () => {
  // Déclaration des états
  const [tousDonnees, settousDonnees] = useState(''); // État pour gérer le texte de recherche
  const [popupVisible, setPopupVisible] = useState(false); // État pour contrôler la visibilité du popup de détails
  const [selectedAbonne, setSelectedAbonne] = useState(null); // État pour stocker l'abonné sélectionné
  const [showCommentsPopup, setShowCommentsPopup] = useState(false); // État pour afficher le popup des commentaires
  const [showAddCommentPopup, setShowAddCommentPopup] = useState(false); // État pour afficher le popup pour ajouter un commentaire
  const [commentaires, setCommentaires] = useState({}); // État pour stocker les commentaires par abonné
  const [newComment, setNewComment] = useState(''); // État pour gérer le texte du nouveau commentaire

  // Données statiques des abonnés (à remplacer par des données dynamiques si nécessaire)
  const abonnes = [
    // Liste d'objets représentant les abonnés avec leurs informations
      { Nom_complet: 'Alpha Sény Camara', Tel: '611 58 07 55', addresse: 'Enta fassa', Type: 'Ménage', profil: profilImg, Genre: 'Homme', Email: 'alphaseny.camara.224@gmail.com' },
      { Nom_complet: 'Fatoumata Kourouma', Tel: '666 87 11 40', addresse: 'Matoto', Type: 'Ménage', profil: profilImg, Genre: 'Femme', Email: 'fatoumata12@gmail.com' },
      { Nom_complet: 'Alya Yattara', Tel: '655 78 56 19', addresse: 'Matam', Type: 'Entreprise', profil: profilImg, Genre: 'Homme', Email: 'alya.655@gmail.com' },
      { Nom_complet: 'Mamoudou komara', Tel: '611 67 87 34', addresse: 'Madina', Type: 'Ménage', profil: profilImg, Genre: 'Homme' },
      { Nom_complet: 'Fodé bamba', Tel: '624 56 11 91', addresse: 'Lambangni', Type: 'Ménage', profil: profilImg, Genre: 'Homme', Email: 'fode.bamba624@gmail.com' },
      { Nom_complet: 'Boutouraby cissé', Tel: '622 87 34 11', addresse: 'Enta fassa', Type: 'Entreprise', profil: profilImg },
      { Nom_complet: 'Alimatou Bah', Tel: '666 45 33 18', addresse: 'Dubréka', Type: 'Ménage', profil: profilImg },
      { Nom_complet: 'Kadiatou camara', Tel: '610 99 10 31', addresse: 'Dixinn', Type: 'Entreprise', profil: profilImg, Genre: 'Femme', Email: 'kadiatou.cra.610@gmail.com' },
      { Nom_complet: 'Idrissa camara', Tel: '610 98 66 12', addresse: 'Dubréka', Type: 'Entreprise', profil: profilImg },
      { Nom_complet: 'Anette kader ermer', Tel: '664 75 93 61', addresse: 'Kipé', Type: 'Ménage', profil: profilImg, Genre: 'Femme' },
      { Nom_complet: 'Thierno souleymane diallo', Tel: '610 83 53 36', addresse: 'Cosa', Type: 'Ménage', profil: profilImg, Genre: 'Homme', Email: 'baillo30387@gmail.com' },
      { Nom_complet: 'Fatoumata binta diallo', Tel: '611 76 34 00', addresse: 'Ratoma', Type: 'Ménage', profil: profilImg, Genre: 'Femme', Email: 'fatoumatabinta611@gmail.com' }
    ];

  // Filtrer les abonnés en fonction du texte de recherche
  const filteredAbonnes = abonnes.filter((abonne) =>
    abonne.Nom_complet.toLowerCase().includes(tousDonnees.toLowerCase()) ||
    abonne.Tel.toLowerCase().includes(tousDonnees.toLowerCase())
  );

  // Gérer les changements dans le champ de recherche
  const handleSearchChange = (event) => {
    settousDonnees(event.target.value); // Met à jour l'état du texte de recherche
  };

  // Afficher le popup avec les détails de l'abonné sélectionné
  const handleDetailler = (index) => {
    setSelectedAbonne(abonnes[index]); // Sélectionne l'abonné à afficher
    setPopupVisible(true); // Affiche le popup de détails
    setShowCommentsPopup(false); // Masque les autres popups
    setShowAddCommentPopup(false); 
  };

  // Fermer tous les popups
  const closeAllPopups = () => {
    setPopupVisible(false); // Masque le popup de détails
    setSelectedAbonne(null); // Réinitialise l'abonné sélectionné
  };

  // Fermer le popup pour ajouter un commentaire
  const fermerPopupCommentaire = () => {
    setShowAddCommentPopup(false); 
  };

  // Fermer le popup des commentaires
  const fermerPopupVoirCommentaire = () => {
    setShowCommentsPopup(false); 
  };

  // Ouvrir le popup des commentaires
  const handleShowComments = () => {
    setShowCommentsPopup(true);
  };

  // Ouvrir le popup pour ajouter un commentaire
  const handleAddComment = () => {
    setShowAddCommentPopup(true);
  };

  // Gérer les changements dans le champ de texte pour un nouveau commentaire
  const handleNewCommentChange = (event) => {
    setNewComment(event.target.value); // Met à jour l'état du nouveau commentaire
  };

  // Ajouter un commentaire pour l'abonné sélectionné
  const handleAddCommentSubmit = () => {
    if (selectedAbonne) {
      const abonneEmail = selectedAbonne.Email; // Récupère l'email de l'abonné pour identifier les commentaires
      setCommentaires(prevCommentaires => ({
        ...prevCommentaires, // Conserve les anciens commentaires
        [abonneEmail]: [...(prevCommentaires[abonneEmail] || []), newComment] // Ajoute le nouveau commentaire
      }));
      setNewComment(''); // Réinitialise le champ de texte du commentaire
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
            value={tousDonnees} // Lier la valeur de l'input à l'état "tousDonnees"
            onChange={handleSearchChange} // Appelle la fonction de recherche lorsqu'on tape dans l'input
          />
        </form>
      </div>

      {/* Liste des abonnés filtrés */}
      <div className='divDonnes'>
        {filteredAbonnes.map((abonne, index) => (
          <div className='donnees' key={index}>
            <div className='divImageProfil'>
              <img src={abonne.profil} alt="profil" /> {/* Image de profil de l'abonné */}
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
                <img src={selectedAbonne.profil} alt="profil" /> {/* Image du profil dans le popup */}
              </div>
            </div>
            <p><span className='label'>Nom complet:</span> {selectedAbonne.Nom_complet}</p>
            <p><span className='label'>Adresse:</span> {selectedAbonne.addresse}</p>
            <p><span className='label'>Téléphone:</span> {selectedAbonne.Tel}</p>
            <p><span className='label'>Type:</span> {selectedAbonne.Type}</p>
            <p><span className='label'>Genre:</span> {selectedAbonne.Genre || 'Non spécifié'}</p>
            <p><span className='label'>Email:</span> {selectedAbonne.Email || 'Non spécifié'}</p>
            <div className='divBtnVoirEnvoyer'>
              <button type="button" className='voirCommentaire' onClick={handleShowComments}>commentaires</button>
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
            <h4 className='h4commentaire'>Commentaires pour {selectedAbonne.Nom_complet}</h4>
            <div className='commentsList'>
              {(commentaires[selectedAbonne.Email] || []).map((comment, index) => (
                <p key={index}>{comment}</p> // Affiche chaque commentaire
              ))}
            </div>
            <div>
              <button type="button" className='modifierCommentaire'>Modifier</button>
              <button type="button" className='supprimerCommentaire'>Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* Popup pour ajouter un commentaire */}
      {showAddCommentPopup && selectedAbonne && (
        <div className='popup popupCommentaireAbonnee'>
          <div className='popupContent'>
            <span className='closePopup' onClick={fermerPopupCommentaire}>&times;</span>
            <h4 className='h4commentaire'>Commentaire pour {selectedAbonne.Nom_complet}</h4>
            <textarea
              value={newComment} // Lie la valeur du textarea à l'état "newComment"
              onChange={handleNewCommentChange} // Met à jour le texte du commentaire lorsqu'il change
              placeholder='Écrire un commentaire...'
              className='textareaEcrireCommentaire'
            />
              <div>
                <button type="button" className='btnEnvoyerCommentaire' onClick={handleAddCommentSubmit}>Envoyer</button> {/* Bouton pour soumettre le commentaire */}
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Exporte le composant Abonnes
export default Abonnes;
