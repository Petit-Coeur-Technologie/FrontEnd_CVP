import React, { useState } from 'react'; // Import de React et du hook useState pour gérer l'état local
import { Link, Outlet } from 'react-router-dom'; // Import de Link et Outlet pour la navigation via React Router
import Profil from '../Profil/Profil';// Importation du composant Profil
import './Dashboard.css'; // Importation du fichier CSS pour styliser le tableau de bord

export default function Dashboard() { // Déclaration du composant fonctionnel Dashboard
  // Déclaration des états locaux avec useState
  const [activerIndex, setactiverIndex] = useState(0); // État pour gérer l'index actif du menu latéral
  const [navText, setNavText] = useState('Home'); // État pour gérer le texte de la barre de navigation
  const [affInfoProfil, setAffInfoProfil] = useState(false); // État pour gérer l'affichage des informations du profil
  const [profileImage, setProfileImage] = useState("src/assets/imageProfil.png"); // État pour gérer l'image de profil

  // Fonction pour gérer le clic sur un élément du menu latéral
  const clicker = (index, text) => {
    setactiverIndex(index); // Met à jour l'index actif pour appliquer une classe active
    setNavText(text); // Met à jour le texte de la barre de navigation
  };

  // Fonction pour afficher/masquer les informations du profil
  const toggleAffInfoProfil = () => {
    setAffInfoProfil(!affInfoProfil); // Inverse l'état pour afficher ou masquer les infos du profil
  };

  // Fonction pour gérer les clics dans les éléments du menu de profil
  const handleProfileClick = (text) => {
    setNavText(text); // Met à jour le texte de la barre de navigation en fonction de l'élément cliqué
  };

  // Fonction pour modifier l'image de profil (passée plus tard au composant Profil)
  const modifierImageProfil = (newImage) => {
    setProfileImage(newImage); // Met à jour l'image de profil avec la nouvelle image
  };

  // Tableau d'éléments pour le premier menu latéral
  const elements_ul_Barlaterale1 = [
    { name: 'Home', path: 'home', icon: 'bxs-home' }, // Chaque élément a un nom, un chemin, et une icône
    { name: 'Abonnés', path: 'abonnes', icon: 'bx-list-ul' },
    { name: 'Calendrier', path: 'calendrier', icon: 'bxs-calendar' },
    { name: 'Messagerie', path: 'messagerie', icon: 'bxs-message-rounded-detail' }
  ];

  // Tableau d'éléments pour le deuxième menu latéral
  const elements_ul_Barlaterale2 = [
    { name: 'Paramètres', path: 'parametres', icon: 'bxs-cog' },
    { name: 'Retour', path: "/", icon: 'bxs-log-out-circle' }
  ];

  return (
    <div className='conteneur'> {/* Conteneur principal de l'application */}
      <div className='BarLaterale'> {/* Barre latérale contenant les menus */}
        <div className='divApp'> {/* Section pour le logo et le nom de l'application */}
          <div className='LogoDiv'>
            <img src="src\Fichiers\logo.png" alt="logo" className='logoApp'/> {/* Logo de l'application */}
          </div>
          <p className='nomApp'>Nom de l'app</p> {/* Nom de l'application */}
        </div>
        
        {/* Premier menu latéral */}
        <ul className='menuBarLaterale1'>
          {elements_ul_Barlaterale1.map((item, index) => (
            <li
              key={index} // Clé unique pour chaque élément de liste
              className={activerIndex === index ? 'active' : ''} // Applique la classe 'active' si l'index est actif
              onClick={() => clicker(index, item.name)} // Gère le clic pour cet élément
            >
              <Link className='liClass' to={item.path}> {/* Lien vers la route correspondante */}
                <i className={`bx ${item.icon}`}></i> {/* Affiche l'icône */}
                {item.name} {/* Affiche le nom de l'élément */}
              </Link>
              {activerIndex === index && <span className='activespan'></span>} {/* Ajoute une indication visuelle pour l'élément actif */}
            </li>
          ))}
        </ul>
        
        {/* Deuxième menu latéral */}
        <ul className='menuBarLaterale2'>
          {elements_ul_Barlaterale2.map((item2, index2) => (
            <li
              key={index2 + elements_ul_Barlaterale1.length} // Clé unique basée sur l'index du deuxième menu
              className={`${activerIndex === index2 + elements_ul_Barlaterale1.length ? 'active active2' : ''} ${item2.name === 'Retour' ? 'retour' : ''}`} // Gestion des classes pour le style
              onClick={() => clicker(index2, item2.name)} // Gère le clic pour cet élément
            >
              <Link className='liClass' to={item2.path}> {/* Lien vers la route correspondante */}
                <i className={`bx ${item2.icon}`}></i> {/* Affiche l'icône */}
                {item2.name} {/* Affiche le nom de l'élément */}
              </Link>
              {activerIndex === index2 + elements_ul_Barlaterale1.length && <span className='activespan'></span>} {/* Ajoute une indication visuelle pour l'élément actif */}
            </li>
          ))}
        </ul>
      </div>

      {/* Barre de navigation en haut */}
      <div className='navBar'>
        <p className='revoir'>{navText}</p> {/* Affiche le texte correspondant à la navigation actuelle */}
        <div className='divNotification'>
          <li onClick={() => handleProfileClick('Notifications')}> {/* Clic pour accéder aux notifications */}
            <Link to="notifications">
              <i className='bx bxs-bell'></i> {/* Icône de notification */}
            </Link>
          </li>
          <span className='incrementationNotification'></span> {/* Indicateur de nouvelles notifications */}
        </div>
        <div className='divImage' onClick={toggleAffInfoProfil}> {/* Clic pour afficher/masquer les infos du profil */}
          <img src={profileImage} alt="profil" className='imageProfil'/> {/* Image de profil */}
        </div>
      </div>

      {/* Informations de profil affichées ou non */}
      <div className={`divVoirInfoProfil ${affInfoProfil ? 'affInfoProfil' : ''}`}> {/* Classe dynamique pour afficher/masquer */}
        <ul>
          <li onClick={() => handleProfileClick('Profil')}> {/* Clic pour accéder au profil */}
            <Link to="profil">
              <i className='bx bxs-user'></i> {/* Icône du profil */}
              <span>Profil</span>
            </Link>
          </li>
          <li onClick={() => handleProfileClick('Notifications')}> {/* Clic pour accéder aux notifications */}
            <Link to="notifications">
              <i className='bx bxs-bell'></i> {/* Icône de notification */}
              <span>Notifications</span>
            </Link>
          </li>
          <li onClick={() => handleProfileClick('Messagerie')}> {/* Clic pour accéder à la messagerie */}
            <Link to="messagerie">
              <i className='bx bxs-message-rounded-detail'></i> {/* Icône de messagerie */}
              <span>Messagerie</span>
            </Link>
          </li>
        </ul>
        <ul>
          <li onClick={() => handleProfileClick('Paramètres')}> {/* Clic pour accéder aux paramètres */}
            <Link to="parametres">
              <i className='bx bxs-cog'></i> {/* Icône des paramètres */}
              <span>Paramètres</span>
            </Link>
          </li>
          <li onClick={() => handleProfileClick('Aide/Assistance')}> {/* Clic pour accéder à l'aide */}
            <Link to="aide-assistance">
              <i className='bx bxs-help-circle'></i> {/* Icône d'aide */}
              <span>Aide/Assistance</span>
            </Link>
          </li>
          <li onClick={() => handleProfileClick('Déconnexion')}> {/* Clic pour déconnexion */}
            <Link to="deconnexion">
              <i className='bx bxs-log-out'></i> {/* Icône de déconnexion */}
              <span>Déconnexion</span>
            </Link>
          </li>
          <li onClick={()=>handleProfileClick('Préparation')}> {/* Clic pour accéder à la préparation */}
            <Link to='preparation'>
              <span>Préparation</span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Section de contenu principal où les composants enfants sont rendus */}
      <div className='content'>
        {/* Passation de props et rendu dynamique */}
        {/* <Profil modifierImageProfil={modifierImageProfil}/> */}
        <Outlet /> {/* Permet d'afficher les composants rendus en fonction des routes */}
      </div>
    </div>
  );
}
