import React from 'react';
import './Styles/style.css';
import { Routes, Route, useLocation, Navigate, useNavigate } from 'react-router-dom';
import Inscription from './pages/inscription/inscription.jsx';
import Accueil from './pages/Accueil/accueil.jsx';
// import Sensibilisation from './pages/Sensibilisation/Sensibilisation.jsx';
import Navbar from './Composants/Navbar/navbar.jsx';
import Footer from './Composants/Footer/footer.jsx';
import Dashboard from './Composants/Dashboard/Dashboard.jsx';

import './App.css';
import 'boxicons/css/boxicons.min.css';
import Messagerie from './Composants/Messagerie/Messagerie.jsx';
import Abonnes from './Composants/Abonnes/Abonnes.jsx';
import MonAbonnement from './Composants/MonAbonnement.jsx';
import Home from './Composants/Home/Home.jsx';
import Calendrier from './Composants/Calendrier/Calendrier.jsx';
import Notification from './Composants/Notifications/Notifications.jsx';
import AideAssistance from './Composants/Aide/AideAssistance.jsx';
import Details from './Composants/Details/Details.jsx';
import Parametres from './Composants/Parametre/Parametres.jsx';
import Connexion from './pages/Connexion/Connexion.jsx';
import InfosPme from './pages/InfosPME/infosPME.jsx';
// import PrivateRoute from './Composants/PrivateRoute.jsx'; 
// import CheckConnection from './Composants/CheckConnection/checkConnection.jsx';
import PageInexistante from './Composants/PageInexistante/pageInexistante.jsx';
import AbonnementsEnAttente from './Composants/AbonnementEnAttente/AbonnementEnAttente.jsx';
import Profil from './Composants/Profil/Profil.jsx';



function App() {


  const location = useLocation();

  const hideNavbarAndFooter =
    location.pathname === '/inscription' ||
    location.pathname === '/404' ||
    location.pathname === '/connexion' ||
    location.pathname.startsWith('/dashboard');

  return (
    // <CheckConnection>
    <div>
        {!hideNavbarAndFooter && <Navbar />}

        <Routes>
          <Route path='/' element={<Accueil />} />
          <Route path='/inscription' element={<Inscription />} />
          {/* <Route path='/sens' element={<Sensibilisation />} /> */}
          <Route path='/:id' element={<InfosPme />} />

          {/* Route protégée avec PrivateRoute */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="abonnes" element={<Abonnes />} />
            <Route path="monabonnement" element={<MonAbonnement />} />
            <Route path="home" element={<Home />} />
            <Route path="calendrier" element={<Calendrier />} />
            <Route path="messagerie" element={<Messagerie />} />
            <Route path="parametres" element={<Parametres />} />
            <Route path="profil" element={<Profil />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="aide-assistance" element={<AideAssistance />} />
            <Route path="details/:index" element={<Details />} />
            <Route path="monabonnement" element={<MonAbonnement />} />
            <Route path="abonnementenattente" element={<AbonnementsEnAttente />} />
          </Route>

          <Route path='/connexion' element={<Connexion />} />

         {/* Route 404 */}
         <Route path='/404' element={<PageInexistante />} />
          
          {/* Route pour capturer les chemins inconnus */}
          <Route path='*' element={<Navigate to="/404" replace state={{ from: location.pathname }} />} />

        </Routes>

        {!hideNavbarAndFooter && <Footer />}
    </div>
    // </CheckConnection>
  );
};

export default App;
