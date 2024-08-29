import React, { useState, useRef } from 'react';
import './Profil.css';

export default function Profil({ onUpdateProfileImage }) {
  const [profileImage, setProfileImage] = useState("src/Fichiers/imageProfil.png");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [profileInfo, setProfileInfo] = useState({
    nom: "Alpha Sény Camara",
    email: "alphaseny.camara.224@gmail.com",
    adresse: "Enta Fassa",
    biographie: "Je suis développeur passionné.",
  });
  const [theme, setTheme] = useState("light");
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [avatarGallery] = useState([
    "src/Fichiers/avatar1.png",
    "src/Fichiers/avatar2.png",
    "src/Fichiers/avatar3.png",
  ]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      setShowPopup(true);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current.click();
  };

  const handleConfirmChange = () => {
    setProfileImage(selectedImage);
    setShowPopup(false);
    onUpdateProfileImage(selectedImage);
  };

  const handleCancelChange = () => {
    setSelectedImage(null);
    setShowPopup(false);
  };

  const handleEditInfo = () => {
    setEditMode(true);
  };

  const handleSaveInfo = () => {
    setEditMode(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const toggleNotifications = () => {
    setNotificationsEnabled((prevStatus) => !prevStatus);
  };


  const downloadProfileInfo = () => {
    const data = JSON.stringify(profileInfo, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "profil-info.json";
    link.click();
  };

  return (
    <>
      <div className={`profilContainer ${theme}`}>
        <div className='divgestionProfil'>
          <div className='profilContainerChildMere'>
            <div className='profilContainerChild'>
              <img src={selectedImage || profileImage} alt="profil" className="imageProfil" />
            </div>
          </div>
          <h4>{profileInfo.nom}</h4>
          <div className="imageUpload">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              ref={fileInputRef}
            />
            <button className='btnChangerdProfil' onClick={openFileDialog}>Changer votre profil</button>
        </div>
        </div>
        <div className="themeToggle">
          <p>Thème actuel : {theme === "light" ? "Clair" : "Sombre"}</p>
          <button onClick={toggleTheme} className='btnthemeToggle'>Changer de thème</button>
        </div>

        <div className="profileDetails">
          {editMode ? (
            <>
              <input
                type="text"
                name="nom"
                value={profileInfo.nom}
                onChange={handleInputChange}
                className='inputprofileDetails'
              />
              <input
                type="email"
                name="email"
                value={profileInfo.email}
                onChange={handleInputChange}
                className='inputprofileDetails'
              />
              <input
                type="text"
                name="adresse"
                value={profileInfo.adresse}
                onChange={handleInputChange}
                className='inputprofileDetails'
              />
              <textarea
                name="biographie"
                value={profileInfo.biographie}
                onChange={handleInputChange}
                className='taprofileDetails'
              />
              <button onClick={handleSaveInfo} className='btnprofileDetails'>Sauvegarder</button>
            </>
          ) : (
            <>
              <p className='profileDetailsP'>Nom : {profileInfo.nom}</p>
              <p className='profileDetailsP'>Email : {profileInfo.email}</p>
              <p className='profileDetailsP'>Adresse : {profileInfo.adresse}</p>
              <p className='profileDetailsP'>Biographie : {profileInfo.biographie}</p>
              <button onClick={handleEditInfo} className='btnprofileDetails'>Modifier les informations</button>
            </>
          )}
        </div>
        <div className="notificationsToggle">
          <p>Notifications : {notificationsEnabled ? "Activées" : "Désactivées"}</p>
          <button onClick={toggleNotifications} className='btnnotificationsToggle'>
            {notificationsEnabled ? "Désactiver" : "Activer"}
          </button>
        </div>
        <div className="downloadProfile">
          <button onClick={downloadProfileInfo} className='btndownloadProfile'>Télécharger les informations du profil</button>
        </div>
      </div>

      {/* Popup de confirmation */}
      {showPopup && (
        <div className="popup2">
          <div className="popup-content2">
            <p className='popup2P'>Voulez-vous modifier votre profil ?</p>
            <button onClick={handleConfirmChange} className='btnpopup-content2'>Oui</button>
            <button onClick={handleCancelChange} className='btnpopup-content2'>Annuler</button>
          </div>
        </div>
      )}
    </>
  );
}
