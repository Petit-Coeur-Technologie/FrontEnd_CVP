import React from 'react';
import { Routes, Route, useLocation, BrowserRouter } from 'react-router-dom';
// import Sensibilisation from './pages/Sensibilisation/Sensibilisation.jsx';

import "./Styles/style.css";
// import Navbar from './composants/Navbar/navbar.jsx';
// // import Footer from './composants/Footer/footer.jsx';
// // import Profil from './Composants/Profil/Profil.jsx';
// import Pmes from './pages/PMES/pmes.jsx';
// // import Dashboard from './pages/Dashboard/Dashboard.jsx';
// // import Abonnes from './Composants/Abonnes/Abonnes.jsx';
// import Calendrier from './composants/Calendrier/Calendrier.jsx';
// import Deconnexion from './composants/Deconnexion/Deconnexion.jsx';
// import Details from './composants/Details/Details.jsx';
// import Home from './composants/Home/Home.jsx';
// // import Accueil from './pages/Accueil/accueil.jsx';
// import Messagerie from './composants/Messagerie/Messagerie.jsx';
// import Parametres from './composants/Parametre/Parametres.jsx';
import Connexion from './pages/connexion/Connexion.jsx';
// // import InfosPme from './pages/InfosPME/infosPME.jsx';
// import Inscription from './pages/inscription/inscription.jsx';
// import Notification from './composants/Notifications/Notifications.jsx';
// import AideAssistance from './composants/Aide/AideAssistance.jsx';

function App() {
  const location = useLocation();

  // Condition pour vérifier si on est sur une page qui ne doit pas afficher Navbar et Footer
  const hideNavbarAndFooter =
  location.pathname === '/inscription' ||
    location.pathname === '/connexion' ||  // Add this line to hide Navbar and Footer on the login page
    location.pathname.startsWith('/dashboard');

  return (
    <div>
      {/* Afficher le Navbar uniquement si l'utilisateur n'est pas sur les pages d'inscription, de connexion, ou du dashboard */}
      {!hideNavbarAndFooter && <Navbar />}
      <Routes>

        {/* <Route path='/' element={< Accueil/>} /> */}
        {/* <Route path='/inscription' element={<Inscription />} />
        <Route path='/sens' element={<Sensibilisation />} />
        <Route path='/pmes' element={<Pmes />} />
        {/* <Route path='/pmes/:id' element={<InfosPme/>}/> */}

         {/* <Route path="/" element={< Dashboard/>}> 
          <Route index element={<Home />} />
           <Route path="abonnes" element={<Abonnes />}/> 
          <Route path="home" element={<Home />} />
          <Route path="calendrier" element={<Calendrier />} />
          <Route path="messagerie" element={<Messagerie />} />
          <Route path="parametres" element={<Parametres />} />
          <Route path="profil" element={<Profil />} /> 
          <Route path="notifications" element={<Notification />} />
          <Route path="aide-assistance" element={<AideAssistance />} />
          <Route path="deconnexion" element={<Deconnexion />} />
          <Route path="details/:index" element={<Details />} />
        </Route>  */}

        <Route path='/connexion' element={<Connexion />} />
      </Routes>

      {/* Afficher le Footer uniquement si l'utilisateur n'est pas sur les pages d'inscription, de connexion, ou du dashboard */}
      {/* {!hideNavbarAndFooter && <Footer />} */}
    </div>
  );
}

export default App;