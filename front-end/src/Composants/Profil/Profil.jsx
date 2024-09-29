import React, { useState, useEffect, useCallback } from 'react';
import './Profil.css';
import toast from 'react-hot-toast';

export default function Profil() {
  // État pour stocker les informations de l'utilisateur
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState('');
  const [pmeId, setPmeId] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});
  const [clientQuartiers, setClientQuartiers] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [profileRole, setProfileRole] = useState("");
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

  // ========================= POUR RECUPERER LE INFORMATION DE L'UTILISATEUR CONNECTER =======================
    // Appel API pour récupérer les abonnés et rôle de l'utilisateur
    useEffect(() => {
      if (!userId || !accessToken) return;
  
      setLoading(true);
      const fetchAbonnes = async () => {
        try {
          const response = await fetch(`https://ville-propre.onrender.com/users/${userId}`, {
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
          setProfileInfo(data);
          console.log("INFORMATION DE L'UTILISATEUR CONNECTER DANS PROFIL...");
          if(data.utilisateur.role === "pme"){
            setProfileImage(data.logo_pme);
            setProfileRole(data.utilisateur.role);
          }
          else if(data.utilisateur.role ==="entreprise"){
            setProfileImage(data.utilisateur.copie_pi);
            setProfileRole(data.utilisateur.role);
          }
          else if(data.role ==="menage"){
            setProfileImage(data.copie_pi);
            setProfileRole(data.role);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération des abonnés:', error.message);
        }
        finally{
          setLoading(false)
        }
      };
      fetchAbonnes();
    }, [userId, accessToken]);

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
    setIsEditing((prev) => {
      if (!prev) { // Si nous passons à l'édition
        setFormData({
          nom_prenom: profileInfo.utilisateur?.nom_prenom || '',
          email: profileInfo.utilisateur?.email || '',
          quartier_id: profileInfo.quartier_id || '',
          description: profileInfo.description || '',
          tarif_abonnement: profileInfo.tarif_abonnement || '',
          tarif_mensuel: profileInfo.tarif_mensuel || '',
          genre: profileInfo.utilisateur?.genre || '',
          nom_pme: profileInfo.nom_pme || '',
          role: profileInfo.utilisateur?.role || '',
          tel: profileInfo.utilisateur?.tel || '',
          zone_intervention: profileInfo.zone_intervention || '',
        });
      }
      return !prev; // Bascule l'état d'édition
    });
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
  
  useEffect(()=>{
    console.log("ROLE RECUPERER DANS PROFIL... : "+profileRole);
  })

  // Affichage pendant le chargement des données
  // if (loading) {
  //   return <p className='chargementProfil'>Chargement...</p>;
  // }

  // Affichage en cas d'erreur
  // if (error) {
  //   return <p className='erreurModification'>{error}</p>;
  // }

  return (
    <div className="profileDetails">
  {/* Affichage de l'image de profil */}
  <div className="imageProfilContainer">
    <img src={profileImage} alt="profil" className="profileImage" />
  </div>
  {/* Affichage ou édition des informations du profil */}
  {isEditing ? (
    <>
      <input type="text" name="nom_prenom" value={formData.nom_prenom || ''} onChange={handleInputChange} placeholder="Nom utilisateur" className="profilEdit" />
      <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} placeholder="Email" className="profilEdit" />
      <input type="text" name="quartier_id" value={formData.quartier_id || ''} onChange={handleInputChange} placeholder="Adresse" className="profilEdit" />
      <textarea name="description" value={formData.description || ''} onChange={handleInputChange} placeholder="Description" className="profilEdit profilTextarea" />
      {profileRole =="pme" && <input type="text" name="tarif_abonnement" value={formData.tarif_abonnement || ''} onChange={handleInputChange} placeholder="Tarif abonnement" className="profilEdit" />}
      {profileRole =="pme" && <input type="text" name="tarif_mensuel" value={formData.tarif_mensuel || ''} onChange={handleInputChange} placeholder="Tarif mensuel" className="profilEdit" />}
      <input type="text" name="genre" value={formData.genre || ''} onChange={handleInputChange} placeholder="Genre" className="profilEdit" />
      {profileRole =="pme" && <input type="text" name="nom_pme" value={formData.nom_pme || ''} onChange={handleInputChange} placeholder="Nom Pme" className="profilEdit" />}
      <input type="text" name="role" value={formData.role || ''} onChange={handleInputChange} placeholder="Role" className="profilEdit" />
      <input type="text" name="tel" value={formData.tel || ''} onChange={handleInputChange} placeholder="Tel" className="profilEdit" />
      {profileRole == "pme" && <input type="text" name="zone_intervention" value={formData.zone_intervention || ''} onChange={handleInputChange} placeholder="Zone intervention" className="profilEdit" />}

      <button onClick={handleSave} className="btn btnSave">Sauvegarder</button>
      <button onClick={handleEditToggle} className="btn btnCancel">Annuler</button>
    </>
  ) : (
    <>
      {/* Utilisation conditionnelle en fonction du rôle */}
      {profileRole === 'menage' ? (
        <>
          <p className="profileDetailsP"><span>Nom utilisateur : </span>{profileInfo.nom_prenom || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Email : </span>{profileInfo.email || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Adresse : </span>{getQuartierNameById(profileInfo.quartier_id) || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Genre : </span>{profileInfo.genre || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Tel : </span>{profileInfo.tel || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Role : </span>{profileInfo.role || 'Non spécifié'}</p>
        </>
      ) : (
        <>
          <p className="profileDetailsP"><span>Nom utilisateur : </span>{profileInfo.utilisateur?.nom_prenom || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Email : </span>{profileInfo.utilisateur?.email || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Adresse : </span>{getQuartierNameById(profileInfo.quartier_id) || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Description : </span>{profileInfo.description || 'Non spécifié'}</p>
          {profileRole =="pme" && <p className="profileDetailsP"><span>Tarif abonnement : </span>{profileInfo.tarif_abonnement || 'Non spécifié'}</p>}
          {profileRole =="pme" && <p className="profileDetailsP"><span>Tarif mensuel : </span>{profileInfo.tarif_mensuel || 'Non spécifié'}</p>}
          <p className="profileDetailsP"><span>Genre : </span>{profileInfo.utilisateur?.genre || 'Non spécifié'}</p>
          {profileRole =="pme" && <p className="profileDetailsP"><span>Nom Pme : </span>{profileInfo.nom_pme || 'Non spécifié'}</p>}
          <p className="profileDetailsP"><span>Role : </span>{profileInfo.utilisateur?.role || 'Non spécifié'}</p>
          <p className="profileDetailsP"><span>Tel : </span>{profileInfo.utilisateur?.tel || 'Non spécifié'}</p>
          {profileRole == "pme" && <p className="profileDetailsP"><span>Zone intervention : </span>{profileInfo.zone_intervention || 'Non spécifié'}</p>}
        </>
      )}
      <button onClick={handleEditToggle} className="btnEdit">Modifier</button>
    </>
  )}
</div>
  );
}
