import React from 'react';
import './Styles/style.css';
import { Routes, Route, useLocation } from 'react-router-dom';
import Inscription from './pages/inscription/inscription.jsx';
import Accueil from './pages/Accueil/accueil.jsx';
import Sensibilisation from './pages/Sensibilisation/Sensibilisation.jsx';
import Navbar from './Composants/Navbar/navbar.jsx';
import Footer from './Composants/Footer/footer.jsx';
import Dashboard from './Composants/Dashboard/Dashboard.jsx';
import Profil from './Composants/Profil/Profil.jsx';

import './App.css';
import 'boxicons/css/boxicons.min.css';
import Messagerie from './Composants/Messagerie/Messagerie.jsx';
import Abonnes from './Composants/Abonnes/Abonnes.jsx';
import MonAbonnement from './Composants/MonAbonnement/MonAbonnement.jsx';
import AbonnementEnAttente from './Composants/AbonnementEnAttente/AbonnementEnAttente.jsx';
import Home from './Composants/Home/Home.jsx';
import Calendrier from './Composants/Calendrier/Calendrier.jsx';
import Notification from './Composants/Notifications/Notifications.jsx';
import AideAssistance from './Composants/Aide/AideAssistance.jsx';
import Deconnexion from './Composants/Deconnexion/Deconnexion.jsx';
import Details from './Composants/Details/Details.jsx';
import Parametres from './Composants/Parametre/Parametres.jsx';
import Connexion from './pages/Connexion/Connexion.jsx';
import InfosPme from './pages/InfosPME/infosPME.jsx';
// import PrivateRoute from './Composants/PrivateRoute.jsx'; 

function App() {

  
  const location = useLocation();
  
  const hideNavbarAndFooter =
    location.pathname === '/inscription' ||
    location.pathname === '/connexion' ||
    location.pathname.startsWith('/dashboard');

  return (
    <div>
      {!hideNavbarAndFooter && <Navbar />}

      <Routes>
        <Route path='/' element={<Accueil />} />
        <Route path='/inscription' element={<Inscription />} />
        <Route path='/sens' element={<Sensibilisation />} />
        <Route path='/:id' element={<InfosPme/>}/>

        {/* Route protégée avec PrivateRoute */}
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="abonnes" element={<Abonnes />} />
            <Route path="monabonnement" element={<MonAbonnement />} />
            <Route path='abonnementenattente' element={<AbonnementEnAttente/>}/>
            <Route path="home" element={<Home />} />
            <Route path="calendrier" element={<Calendrier />} />
            <Route path="messagerie" element={<Messagerie />} />
            <Route path="parametres" element={<Parametres />} />
            <Route path="profil" element={<Profil />} />
            <Route path="notifications" element={<Notification />} />
            <Route path="aide-assistance" element={<AideAssistance />} />
            <Route path="deconnexion" element={<Deconnexion />} />
            <Route path="details/:index" element={<Details />} />
          </Route>

        <Route path='/connexion' element={<Connexion />} />
      </Routes>

      {!hideNavbarAndFooter && <Footer />}
    </div>
  );
}

export default App;
