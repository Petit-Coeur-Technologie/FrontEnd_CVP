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
    <Stack className='stacke'>
      <Box
        width={"400px"}
        sx={{
          bgcolor: "#00804b",
          borderRadius: "10px",
          padding: 3,
          height: "500px",
        }}
      >
        <Typography className="connexion" variant='h4'>Connexion</Typography>
        <img className="bm" src={myImage} alt="pct" />
        {showForgotPassword ? (
          <MotDePasseOublie onClose={() => setShowForgotPassword(false)} />
        ) : (
          <form onSubmit={handleSubmit}>
            <Stack direction={"column"} gap={2}>
              <input
                className="input"
                type="email"
                placeholder='E-mail...'
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <input
                className="input"
                type="password"
                placeholder='Mot de Passe...'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <a href='#' className="mot" onClick={() => setShowForgotPassword(true)}>mot de passe oublié?</a>
              <Button className="buttonReni" variant="contained" type="submit">Se Connecter</Button>
              {errorMessage && <p className='pErreur' color="error">{errorMessage}</p>}
              <div className="bx1">
                  <a href="#"><i className='bx bxl-google gf'></i></a>
                  <a href="#"><i className='bx bxl-facebook gf'></i></a>
              </div>
              <div id="divmot2">
                <p className="mot3"> <a href="#"> Pas de compte?</a><a href="/inscription" > Inscrivez-Vous!</a></p>
              </div>
            </Stack>
          </form>
        )}
      </Box>
    </Stack>
  );
}
