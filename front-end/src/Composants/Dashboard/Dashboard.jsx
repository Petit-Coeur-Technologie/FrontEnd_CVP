import React, { useState, useEffect } from 'react'; 
import { Link, Outlet, useNavigate } from 'react-router-dom'; 
import './Dashboard.css'; 
import { icon } from '@fortawesome/fontawesome-svg-core';

export default function Dashboard() { 
  // États locaux pour la gestion des menus, profil, et authentification
  const [activerIndex, setActiverIndex] = useState(0); 
  const [navText, setNavText] = useState('Home'); 
  const [affInfoProfil, setAffInfoProfil] = useState(false); 
  const [profileImage, setProfileImage] = useState("../../src/assets/logo_provisoire.png"); 
  const [userId, setUserId] = useState(null);
  const [photoDeProfil, setPhotoDeProfil] = useState('');
  const [imageDefautChargement, setImageDefautChargement] = useState(true);
  const [imageDefaut, setImageDefaut] = useState("../../src/assets/imageDefaut.png");
  const [accessToken, setAccessToken] = useState('');
  const [abonnesEnAttente, setAbonnesEnAttente] = useState([]);
  const [nombreAbonnementEnAttente, setNombreAbonnementEnAttente] = useState(0);
  const [userRole, setUserRole] = useState(null); 
  const [currentAbonnementId, setCurrentAbonnementId] = useState(null); // ID de l'abonnement
  const [showPopup, setShowPopup] = useState(false); // Ajout de l'état showPopup pour gérer le popup
  const [ouvrirBarLatteral, setOuvrirBarLatteral] = useState(false); // Ajout de l'état showPopup pour gérer le popup

  const handleDeconnexion=()=>{
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    navigate("/connexion")
  }

  const functionOuvrirBarLatteral = () =>{
    setOuvrirBarLatteral(!ouvrirBarLatteral);
  }
  const navigate = useNavigate();
  // Fonction pour gérer le clic sur un élément du menu latéral
  const clicker = (index, text) => {
    setActiverIndex(index);
    setNavText(text);
  };

  // Fonction pour afficher/masquer les informations du profil
  const toggleAffInfoProfil = () => {
    setAffInfoProfil(!affInfoProfil);
  };

  // Fonction pour gérer les clics dans les éléments du menu de profil
  const handleProfileClick = (text) => {
    setNavText(text);
  };

  // Fonction pour modifier l'image de profil (non utilisée actuellement)
  const modifierImageProfil = (newImage) => {
    setProfileImage(newImage);
  };

  // Menus latéraux pour différents rôles d'utilisateur
  const elements_ul_Barlaterale1 = [
    { name: 'Home', path: 'home', icon: 'bxs-home' },
    { name: 'Abonnés', path: 'abonnes', icon: 'bx-list-ul' },
    {name: 'Abonnement en attente',path:'abonnementenattente', icon:'bx-list-plus'},
    {name: 'Calendrier', path: 'calendrier', icon: 'bxs-calendar' },
    { name: 'Messagerie', path: 'messagerie', icon: 'bxs-message-rounded-detail' }
  ];

  const elements_ul_Barlaterale2 = [
    { name: 'Paramètres', path: 'parametres', icon: 'bxs-cog' },
    { name: 'Retour', path: "/", icon: 'bxs-log-out-circle' }
  ];

  // Obtention des cookies pour l'authentification
  useEffect(() => {
    const getCookie = (name) => {
      const value = `; ${document.cookie}`;
      const parts = value.split(`; ${name}=`);
      if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const userIdFromCookie = getCookie('userId');
    const tokenFromCookie = getCookie('authToken');
    const roleFromCookie = getCookie('role');

    if (userIdFromCookie){setUserId(userIdFromCookie);} 
    if (tokenFromCookie) setAccessToken(tokenFromCookie);
    if (roleFromCookie) {setUserRole(roleFromCookie);}
  }, []);

  // ========================= POUR RECUPERER LE INFORMATION DE L'UTILISATEUR CONNECTER =======================
    // Appel API pour récupérer les abonnés et rôle de l'utilisateur
    useEffect(() => {
      setImageDefautChargement(true)
      if (!userId || !accessToken) return;
  
      const fetchAbonnes = async () => {
        // try {
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
          if(data.utilisateur.role === "pme"){
            setPhotoDeProfil(data.logo_pme);
          }
          else if(data.role ==="menage"){
            setPhotoDeProfil(data.copie_pi);
          }
          else if(data.utilisateur.role ==="entreprise"){
            setPhotoDeProfil(data.utilisateur.copie_pi);
          }
        // } catch (error) {
        //   console.error('Erreur lors de la récupération des abonnés:', error.message);
        // }
        // finally{
        //   setImageDefautChargement(true);
        // }
      };
      fetchAbonnes();
  
    }, [userId]);

  // Appel API pour récupérer les abonnés et rôle de l'utilisateur
  useEffect(() => {
    if (!userId || !accessToken) return;

    const fetchAbonnes = async () => {
      // try {
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
      // } catch (error) {
      //   console.error('Erreur lors de la récupération des abonnés:', error.message);
      // }
    };
    fetchAbonnes();

  }, [userId, accessToken]);


    // ========================= POUR RECUPERER LE NOMBRE ABONNEMENTS EN ATTENTE =======================
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
          setAbonnesEnAttente(data);
          // Comptage des abonnements en attente
          const abonnementsEnAttente = data.filter((abonne) => abonne.status_abonnement === "pending").length;
          setNombreAbonnementEnAttente(abonnementsEnAttente);
        } catch (error) {
          console.error('Erreur lors de la récupération des abonnés:', error.message);
        }
      };
    
      fetchAbonnes();
    }, [userId, accessToken, nombreAbonnementEnAttente, abonnesEnAttente]);


  // Fonction pour afficher le popup
  const handleAbonnementClick = (abonnementId) => {
    setCurrentAbonnementId(abonnementId);
    setShowPopup(true);
  };

  

  // Détermine les éléments de menu à afficher en fonction du rôle de l'utilisateur
  const renderSidebarMenu = () => {
    if (userRole === 'pme') {
      return elements_ul_Barlaterale1;
    } else if (userRole === 'menage' || userRole === 'entreprise') {
      // Retirer l'élément 'Abonnés' et ajouter 'Mon Abonnement'
      return [
        { name: 'Home', path: 'home', icon: 'bxs-home' },
        { name: 'Mon Abonnement', path: 'monabonnement', icon: 'bx-list-ul' },
        { name: 'Calendrier', path: 'calendrier', icon: 'bxs-calendar' },
        { name: 'Messagerie', path: 'messagerie', icon: 'bxs-message-rounded-detail' }
      ];
    } else {
      // Cas par défaut ou pour les utilisateurs non authentifiés
      return [];
    }
  };

  useEffect(() => {
    if (userId && accessToken) {
      navigate('home'); 
    }
  }, [userId, accessToken]);

  useEffect(() => {
    if(photoDeProfil){
      setImageDefautChargement(false);
    }
    console.log("Image de profil:", photoDeProfil);
    console.log("Chargement de l'image par défaut:", imageDefautChargement);
  }, [photoDeProfil, imageDefautChargement]);

  const handleLogout = () => {
    // Supprimer le cookie d'authentification
    document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'userId=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
    document.cookie = 'role=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';

    // Réinitialiser les états liés à l'authentification
    setAccessToken('');
    setUserId(null);
    setUserRole(null);
    
    // Rediriger vers la page d'accueil
    navigate('/');
};
  

  return (
    <div className='conteneur'>
      <div className={`BarLateraleDashboard ${ouvrirBarLatteral ? 'ouvrirBarLateraleDashboard' : ''}`}>
        {/* <div className='divApp'>
          <div className='LogoDiv'>
            <img src="src/Fichiers/logo.png" alt="logo" className='logoApp'/>
          </div>
          <p className='nomApp'>Nom de l'app</p>
        </div> */}
        
        <ul className='menuBarLaterale1'>
          {renderSidebarMenu().map((item, index) => (
            <li
              key={index}
              className={activerIndex === index ? 'active' : ''}
              onClick={() => clicker(index, item.name)}
            >
              <Link className='liClass' to={item.path}>
                <i className={`bx ${item.icon}`}></i>
                {item.name}
                {item.name === 'Abonnement en attente' && nombreAbonnementEnAttente > 0 && (
                <div className="divNombreAbonnementEnAttenteDashboard"><p className="pNombreAbonnementEnAttenteDashboard">{nombreAbonnementEnAttente}</p></div>
                )}
              </Link>
              {activerIndex === index && <span className='activespan'></span>}
            </li>
          ))}
        </ul>
        
        <ul className='menuBarLaterale2'>
          {elements_ul_Barlaterale2.map((item2, index2) => (
            <li
              key={index2 + elements_ul_Barlaterale1.length}
              className={`${activerIndex === index2 + elements_ul_Barlaterale1.length ? 'active active2' : ''} ${item2.name === 'Retour' ? 'retour' : ''}`}
              onClick={() => clicker(index2 + elements_ul_Barlaterale1.length, item2.name)}
            >
              <Link className='liClass' to={item2.path}>
                <i className={`bx ${item2.icon}`}></i>
                {item2.name}
              </Link>
              {activerIndex === index2 + elements_ul_Barlaterale1.length && <span className='activespan'></span>}
            </li>
          ))}
        </ul>
      </div>

      <div className='navBarDashboard'>
        <div className="menu-iconDashboard " onClick={functionOuvrirBarLatteral}>
            <i className='bx bx-menu iconMenuDashboard'></i>
        </div>
        <p className='revoirDashboard'>{navText}</p>
        <div className='divNotification diviconNotificationNavBarDashboard'>
          <li onClick={() => handleProfileClick('Notifications')}>
            <Link to="notifications">
              <i className='bx bxs-bell iconNotificationNavBarDashboard'></i>
            </Link>
          </li>
          <span className='incrementationNotification'></span>
        </div>
        <div className='divImage' onClick={toggleAffInfoProfil}>
          <img className='imageProfil' src={imageDefautChargement || !photoDeProfil ? imageDefaut : photoDeProfil} alt="profil" />
        </div>
      </div>

      <div className={`divVoirInfoProfil ${affInfoProfil ? 'affInfoProfil' : ''}`}>
        <ul>
          <li onClick={() => handleProfileClick('Profil')}>
            <Link to="profil">
              <i className='bx bxs-user'></i>
              <span>Profil</span>
            </Link>
          </li>
          <li onClick={() => handleProfileClick('Notifications')}>
            <Link to="notifications">
              <i className='bx bxs-bell'></i>
              <span>Notifications</span>
            </Link>
          </li>
        </ul>
        <ul>
          <li onClick={() => handleProfileClick('Aide/Assistance')}>
            <Link to="aide-assistance">
              <i className='bx bxs-help-circle'></i>
              <span>Aide/Assistance</span>
            </Link>
          </li>
          <li onClick={handleLogout}>
            <i className='bx bxs-log-out'></i>
            <span>Déconnexion</span>
          </li>
        </ul>
      </div>

        {/* Afficher le popup si showPopup est true */}
        {showPopup && (
        <ConfirmationPopup
          message="Voulez-vous accepter cet abonnement?"
          onConfirm={() => sendConfirmation(currentAbonnementId, 'accept')}
          onCancel={() => setShowPopup(false)} // Fermer le popup si l'utilisateur annule
        />
      )}

      <div className={`contentFilsDashboardAutre ${ouvrirBarLatteral == true ? 'contentFilsDashboard2' : 'contentFilsDashboard'}`}>
        <Outlet />
      </div>
      
    </div>
  );
}
