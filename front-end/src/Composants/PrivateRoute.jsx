import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

// Fonction pour vérifier si l'utilisateur est authentifié
const isAuthenticated = () => {
  const token = document.cookie.split('; ').find(row => row.startsWith('authToken='));
  return !!token; // Retourne true si le token existe
};

// Composant de route protégée
const PrivateRoute = () => {
  const location = useLocation(); // Utilisé pour obtenir la route actuelle
  const from = location.state?.from?.pathname || '/'; // Récupère la route précédente

  return isAuthenticated() ? (
    <Outlet />
  ) : (
    // Redirige vers /connexion avec l'URL d'origine dans l'état de navigation
    <Navigate to="/connexion" state={{ from: location }} replace />
  );
};

export default PrivateRoute;
