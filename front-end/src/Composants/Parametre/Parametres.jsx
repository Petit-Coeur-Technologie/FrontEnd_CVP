import React, { useState } from 'react';
import './Parametres.css';

export default function Parametres() {
  const [selectedOption, setSelectedOption] = useState('compte');

  const renderContent = () => {
    console.log('Selected Option:', selectedOption); // Débogage

    switch (selectedOption) {
      case 'compte':
        return (
          <div className='section'>
            <h2>Gestion du compte</h2>
            <p>Modifier les informations de votre compte.</p>
            <button className='btn'>Changer d'email</button>
            <button className='btn'>Changer de mot de passe</button>
            <button className='btn danger'>Supprimer le compte</button>
          </div>
        );
      case 'notifications':
        return (
          <div className='section'>
            <h2>Préférences de notifications</h2>
            <p>Configurer vos notifications.</p>
            <label>
              <input type="checkbox" /> Notifications par email
            </label>
            <label>
              <input type="checkbox" /> Notifications par SMS
            </label>
            <label>
              <input type="checkbox" /> Notifications push
            </label>
          </div>
        );
      case 'securite':
        return (
          <div className='section'>
            <h2>Paramètres de sécurité</h2>
            <p>Configurer la sécurité de votre compte.</p>
            <button className='btn'>Activer la vérification en deux étapes</button>
            <button className='btn'>Gérer les appareils connectés</button>
            <button className='btn'>Changer les questions de sécurité</button>
          </div>
        );
      case 'langue':
        return (
          <div className='section'>
            <h2>Langue et région</h2>
            <p>Changer la langue de l'application et les paramètres régionaux.</p>
            <label>
              Langue:
              <select>
                <option value="fr">Français</option>
                <option value="en">Anglais</option>
                <option value="es">Espagnol</option>
                <option value="de">Allemand</option>
              </select>
            </label>
            <label>
              Région:
              <select>
                <option value="france">France</option>
                <option value="usa">États-Unis</option>
                <option value="espagne">Espagne</option>
                <option value="allemagne">Allemagne</option>
              </select>
            </label>
          </div>
        );
      case 'apparence':
        return (
          <div className='section'>
            <h2>Personnalisation de l'apparence</h2>
            <p>Personnaliser l'apparence de l'application.</p>
            <label>
              <input type="radio" name="theme" /> Mode clair
            </label>
            <label>
              <input type="radio" name="theme" /> Mode sombre
            </label>
            <label>
              <input type="radio" name="theme" /> Thème système
            </label>
          </div>
        );
      case 'donnees':
        return (
          <div className='section'>
            <h2>Gestion des données personnelles</h2>
            <p>Gérer vos données personnelles.</p>
            <button className='btn'>Télécharger mes données</button>
            <button className='btn danger'>Supprimer mes données</button>
          </div>
        );
      case 'confidentialite':
        return (
          <div className='section'>
            <h2>Paramètres de confidentialité</h2>
            <p>Configurer vos paramètres de confidentialité.</p>
            <label>
              <input type="checkbox" /> Autoriser le suivi de localisation
            </label>
            <label>
              <input type="checkbox" /> Partager mes données d'utilisation
            </label>
            <label>
              <input type="checkbox" /> Autoriser les publicités personnalisées
            </label>
          </div>
        );
      case 'accessibilite':
        return (
          <div className='section'>
            <h2>Paramètres d'accessibilité</h2>
            <p>Configurer les options d'accessibilité.</p>
            <label>
              <input type="checkbox" /> Activer le lecteur d'écran
            </label>
            <label>
              <input type="checkbox" /> Agrandir les textes
            </label>
            <label>
              <input type="checkbox" /> Utiliser les contrastes élevés
            </label>
          </div>
        );
      case 'stockage':
        return (
          <div className='section'>
            <h2>Gestion du stockage</h2>
            <p>Gérer l'espace de stockage utilisé par l'application.</p>
            <button className='btn'>Libérer de l'espace</button>
            <p>Espace utilisé : 500 Mo</p>
          </div>
        );
      case 'misesajour':
        return (
          <div className='section'>
            <h2>Mises à jour de l'application</h2>
            <p>Vérifier et installer les dernières mises à jour.</p>
            <button className='btn'>Vérifier les mises à jour</button>
            <p>Version actuelle : 1.0.0</p>
          </div>
        );
      case 'connexionSociale':
        return (
          <div className='section'>
            <h2>Connexion sociale</h2>
            <p>Gérer les connexions à vos comptes de réseaux sociaux.</p>
            <button className='btn'>Connecter avec Facebook</button>
            <button className='btn'>Connecter avec Google</button>
            <button className='btn'>Connecter avec Twitter</button>
          </div>
        );
      case 'aide':
        return (
          <div className='section'>
            <h2>Aide & Assistance</h2>
            <p>Obtenir de l'aide pour utiliser l'application.</p>
            <button className='btn'>FAQ</button>
            <button className='btn'>Support client</button>
          </div>
        );
      case 'apropos':
        return (
          <div className='section'>
            <h2>À propos de l'application</h2>
            <p>Informations sur l'application.</p>
            <p>Version : 1.0.0</p>
            <p>Développé par : Votre entreprise</p>
          </div>
        );
      default:
        return <div className='section'>Veuillez sélectionner une option.</div>;
    }
  };

  return (
    <div className='conteneurParametre'>
      <div className='menu'>
        <ul>
          <li onClick={() => setSelectedOption('compte')} className={selectedOption === 'compte' ? 'active' : ''}>Gestion du compte</li>
          <li onClick={() => setSelectedOption('notifications')} className={selectedOption === 'notifications' ? 'active' : ''}>Notifications</li>
          <li onClick={() => setSelectedOption('securite')} className={selectedOption === 'securite' ? 'active' : ''}>Sécurité</li>
          <li onClick={() => setSelectedOption('langue')} className={selectedOption === 'langue' ? 'active' : ''}>Langue et région</li>
          <li onClick={() => setSelectedOption('apparence')} className={selectedOption === 'apparence' ? 'active' : ''}>Apparence</li>
          <li onClick={() => setSelectedOption('donnees')} className={selectedOption === 'donnees' ? 'active' : ''}>Données personnelles</li>
          <li onClick={() => setSelectedOption('confidentialite')} className={selectedOption === 'confidentialite' ? 'active' : ''}>Confidentialité</li>
          <li onClick={() => setSelectedOption('accessibilite')} className={selectedOption === 'accessibilite' ? 'active' : ''}>Accessibilité</li>
          <li onClick={() => setSelectedOption('stockage')} className={selectedOption === 'stockage' ? 'active' : ''}>Stockage</li>
          <li onClick={() => setSelectedOption('misesajour')} className={selectedOption === 'misesajour' ? 'active' : ''}>Mises à jour</li>
          <li onClick={() => setSelectedOption('connexionSociale')} className={selectedOption === 'connexionSociale' ? 'active' : ''}>Connexion sociale</li>
          <li onClick={() => setSelectedOption('aide')} className={selectedOption === 'aide' ? 'active' : ''}>Aide</li>
          <li onClick={() => setSelectedOption('apropos')} className={selectedOption === 'apropos' ? 'active' : ''}>À propos</li>
        </ul>
      </div>
      <div className='contenu'>
        {renderContent()}
      </div>
    </div>
  );
}
