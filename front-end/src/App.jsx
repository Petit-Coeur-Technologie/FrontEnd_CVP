import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Inscription from './pages/inscription/inscription.jsx';
import Accueil from './pages/Accueil/accueil.jsx';
import Sensibilisation from './pages/Sensibilisation/Sensibilisation.jsx';
import Pmes from './pages/PMES/pmes.jsx';
import Navbar from './Composants/Navbar/navbar.jsx';
import Footer from './Composants/Footer/footer.jsx';

function App() {
  const location = useLocation();

  return (
    <div>
      {/* Afficher le Navbar si l'utilisateur n'est pas sur la page d'inscription */}
      {location.pathname !== '/inscription' && <Navbar />}
      
      <Routes>
        <Route path='/' element={<Accueil />} />
        <Route path='/inscription' element={<Inscription />} />
        <Route path='/sens' element={<Sensibilisation/>} />
        <Route path='/pmes' element={<Pmes/>} />
      </Routes>

      {/* Afficher le Footer sur toutes les pages */}
      {location.pathname !== '/inscription' && <Footer />}
    </div>
  );
}

export default App;
