import React, { useState, useEffect } from 'react';
import './Profil.css';
import toast from 'react-hot-toast';

export default function Profil() {
  // État pour stocker les informations de l'utilisateur
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [pmeId, setPmeId] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});
  const [profileImage, setProfileImage] = useState("src/Fichiers/imageProfil.png");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Hook useEffect pour récupérer les données de l'utilisateur à partir des cookies lors du chargement initial
  useEffect(() => {
  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const fetchUserData = () => {
    const userIdFromCookie = getCookie('userId');
    const tokenFromCookie = getCookie('authToken'); // Assurez-vous que le nom du cookie est correct
    const pmeIdFromCookie = getCookie('pmeId');

    if (userIdFromCookie) setUserId(userIdFromCookie);
    if (tokenFromCookie) setAccessToken(tokenFromCookie);
    if (pmeIdFromCookie) setPmeId(pmeIdFromCookie);
  };

  fetchUserData();
}, []);


  // Hook useEffect pour récupérer les informations du profil lorsque les dépendances changent
  useEffect(() => {
    const fetchProfileInfo = async () => {
      if (!accessToken || !userId || !pmeId) return;

      setLoading(true);
      setError(null);

      try {
        // Appel API pour obtenir les informations du profil
        const response = await fetch(`https://ville-propre.onrender.com/pme/${pmeId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        });

        // Gestion des erreurs HTTP
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        setProfileInfo(data);
        setProfileImage(data.profileImage || "src/Fichiers/imageProfil.png");
        console.log(data);
        setFormData(data); // Initialiser les données du formulaire avec les données du profil
      } catch (error) {
        setError('Erreur lors de la récupération des informations du profil.');
        console.error('Erreur lors de la récupération des informations du profil :', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileInfo();
  }, [accessToken, userId, pmeId]);

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Fonction pour basculer entre le mode édition et le mode affichage
  const handleEditToggle = () => {
    setIsEditing((prev) => !prev);
  };

  // Fonction pour sauvegarder les modifications dans le profil
  const handleSave = async () => {
    if (!accessToken || !pmeId) {
      console.error('Token d\'accès ou ID PME manquant.');
      return;
    }
  
    // Prépare les données du formulaire avec la date de mise à jour
    const updatedFormData = {
      ...formData,
      utilisateur: {
        ...formData.utilisateur,
        update_at: new Date().toISOString(), // Date actuelle au format ISO
      },
    };
  
    console.log('FormData avant envoi :', updatedFormData);
  
    try {
      const response = await fetch(`https://ville-propre.onrender.com/pme/${pmeId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedFormData),
      });
  
      if (!response.ok) {
        const errorDetails = await response.json();
        console.error('Erreur API:', errorDetails);
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${JSON.stringify(errorDetails)}`);
      }
  
      const data = await response.json();
      setProfileInfo(data);
      setIsEditing(false);
      toast.success('Informations du profil mises à jour avec succès.');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des informations du profil.');
      console.error('Erreur lors de la mise à jour des informations du profil :', error);
    }
  };  
  

  // Affichage pendant le chargement des données
  if (loading) {
    return <p className='chargementProfil'>Chargement...</p>;
  }

  // Affichage en cas d'erreur
  // if (error) {
  //   return <p className='erreurModification'>{error}</p>;
  // }

  return (
    <div className="profileDetails">
      {/* Affichage de l'image de profil */}
      <div className="imageProfilContainer">
        <img src={profileImage} alt="profil" className='profileImage' />
      </div>
      {/* Affichage ou édition des informations du profil */}
      {isEditing ? (
        <>
          <input
            type="text"
            name="nom_prenom"
            value={formData.nom_prenom || ''}
            onChange={handleInputChange}
            placeholder="Nom utilisateur"
            className='profilEdit'
          />
          <input
            type="email"
            name="email"
            value={formData.utilisateur?.email || ''}
            onChange={handleInputChange}
            placeholder="Email"
            className='profilEdit'
          />
          <input
            type="text"
            name="quartier_id"
            value={formData.utilisateur?.quartier_id || ''}
            onChange={handleInputChange}
            placeholder="Adresse"
            className='profilEdit'
          />
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Description"
            className='profilEdit profilTextarea'
          />
          <input
            type="text"
            name="tarif_abonnement"
            value={formData.tarif_abonnement || ''}
            onChange={handleInputChange}
            placeholder="Tarif abonnement"
            className='profilEdit'
          />
          <input
            type="text"
            name="tarif_mensuel"
            value={formData.tarif_mensuel || ''}
            onChange={handleInputChange}
            placeholder="Tarif mensuel"
            className='profilEdit'
          />
          <input
            type="text"
            name="genre"
            value={formData.utilisateur?.genre || ''}
            onChange={handleInputChange}
            placeholder="Genre"
            className='profilEdit'
          />
          <input
            type="text"
            name="nom_pme"
            value={formData.nom_pme || ''}
            onChange={handleInputChange}
            placeholder="Nom Pme"
            className='profilEdit'
          />
          <input
            type="text"
            name="role"
            value={formData.utilisateur?.role || ''}
            onChange={handleInputChange}
            placeholder="Role"
            className='profilEdit'
          />
          <input
            type="text"
            name="tel"
            value={formData.utilisateur?.tel || ''}
            onChange={handleInputChange}
            placeholder="Tel"
            className='profilEdit'
          />
          <input
            type="text"
            name="zone_intervention"
            value={formData.zone_intervention || ''}
            onChange={handleInputChange}
            placeholder="Zone intervention"
            className='profilEdit'
          />
          <button onClick={handleSave} className='btnSave'>Sauvegarder</button>
          <button onClick={handleEditToggle} className='btnCancel'>Annuler</button>
        </>
      ) : (
        <>
          <p className='profileDetailsP'>Nom utilisateur : {profileInfo.utilisateur?.nom_prenom || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Email : {profileInfo.utilisateur?.email || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Adresse : {profileInfo.utilisateur?.quartier_id || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Description : {profileInfo.description || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Tarif abonnement : {profileInfo.tarif_abonnement || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Tarif mensuel : {profileInfo.tarif_mensuel || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Genre : {profileInfo.utilisateur?.genre || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Nom Pme : {profileInfo.nom_pme || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Role : {profileInfo.utilisateur?.role || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Tel : {profileInfo.utilisateur?.tel || 'Non spécifié'}</p>
          <p className='profileDetailsP'>Zone intervention : {profileInfo.zone_intervention || 'Non spécifié'}</p>
          <button onClick={handleEditToggle} className='btnEdit'>Modifier</button>
        </>
      )}
    </div>
  );
}
