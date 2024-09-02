import React, { useState } from 'react';
import { Box, Stack, Button, Typography } from '@mui/material';
import myImage from '/src/assets/th.jpeg';
import MotDePasseOublie from '../MDPOublié/motdepasseoublie';
import { useNavigate } from 'react-router-dom'; // Importation du hook useNavigate

import "./Connexion.css";

export default function Connexion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate(); // Initialisation du hook useNavigate

  // Expression régulière pour valider le mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!passwordRegex.test(password)) {
      setErrorMessage('Le mot de passe doit contenir 1 maj, 1 min, minimum 8 caractères et un caractère spécial!');
      return;
    }
  
    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);
  
      const response = await fetch('https://ville-propre.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      const { token } = data; // Supposons que le token est retourné dans la réponse

      // Stocker le token dans un cookie
      document.cookie = `authToken=${token}; path=/; max-age=${60 * 60 * 24 * 7}`; // Cookie valable 7 jours

      alert('Connexion réussie');
      navigate('/dashboard'); // Redirection vers le tableau de bord
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setErrorMessage(error.message);
    }
  };
  
  return (
    <div className='stacke'>
      <div className='stackeChild'>
        <h2 className="h2Con">Connexion</h2>
        <div className='divMereImageBmw'>
          <div className="divImageBmw">
            <img className="imageBmw" src={myImage} alt="pct" />
          </div>
        </div>
        {showForgotPassword ? 
        (
          <MotDePasseOublie onClose={() => setShowForgotPassword(false)} />
        ) : (
        <form onSubmit={handleSubmit}>
          <div className='divFormulaire'>
              <input className="input inputEmail" type="email" placeholder='E-mail...' value={username} onChange={(e) => setUsername(e.target.value)}/>
              <input className="input inputMdp" type="password" placeholder='Mot de Passe...' value={password} onChange={(e) => setPassword(e.target.value)}/>
              <a href='#' className="mdpOublie" onClick={() => setShowForgotPassword(true)}>mot de passe oublié?</a>
              <button className="btnConnexion" type="submit">Se Connecter</button>
              {errorMessage && <p className='pErreur'>{errorMessage}</p>}

              <div className="divIcone">
                <div className="divTextIconGoogle"><div className="cercle cercleGoogle"><i className="bx bxl-google google-icon"></i></div><p className="textInscrireAvecGoogle ">connexion avec google</p></div>
                <div className="divTextIconFacebook"><div className="cercle"><i className='bx bxl-facebook' style={{ color: '#1877F2', fontSize: '30px' }} ></i></div><p className="textInscrireAvecFacebook ">connexion avec facebook</p></div>
              </div>

              <div id="divmot2">
                <p className="mot3"> <a href="#"> Pas de compte?</a><a href="/inscription"> Inscrivez-Vous!</a></p>
              </div>
            </div>
        </form>
        )}
      </div>
    </div>
  );
}
