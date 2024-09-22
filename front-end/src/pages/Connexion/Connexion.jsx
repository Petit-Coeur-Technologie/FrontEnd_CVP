import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import myImage from '/src/assets/th.jpeg';
import MotDePasseOublie from '../MDPOublié/motdepasseoublie';
import "./Connexion.css";
import toast from 'react-hot-toast';

export default function Connexion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Expression régulière pour valider le mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!passwordRegex.test(password)) {
      setErrorMessage('Le mot de passe doit contenir 1 majuscule, 1 minuscule, minimum 8 caractères et un caractère spécial!');
      return;
    }
  
    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
  
    try {
      const response = await fetch('https://ville-propre.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formData
      });
  
      if (!response.ok) {
        throw new Error(`Email ou mot de passe incorrect. ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data); // Assure-toi que cette ligne s'exécute
  
      const accessToken = data.access_token;
      const userId = data.user_id;
      const role = data.role;
  
      // Stocker les informations dans des cookies
      document.cookie = `authToken=${accessToken}; path=/; max-age=${60 * 60 * 24}`;
      document.cookie = `userId=${userId}; path=/; max-age=${60 * 60 * 24}`;
      document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24}`;
  
      toast.success('Connexion réussie');

      console.log(data);  
      const redirectPath = location.state?.from?.pathname || '/dashboard';
      navigate(redirectPath);
  
    } catch (error) {
      console.error('Erreur lors de la connexion:', error.message);
      setErrorMessage('Une erreur s\'est produite lors de la connexion.'); // Affiche un message d'erreur
    }
  };
  

  return (
    <div className='stacke'>
      <div className='stackeChild'>
        <h2 className="h2Con">Connexion</h2>
        <div className='divMereImageBmw'>
          <div className="divImageBmw">
            <Link to="/">
              <img className="imageBmw" src={myImage} alt="pct" />
            </Link>
          </div>
        </div>
        <Link title="Clicker pour revenir sur l'accueil" to="/">
          <i className='bx bx-home bx-homeConnexion'></i>
        </Link>
        {showForgotPassword ? 
          (
            <MotDePasseOublie onClose={() => setShowForgotPassword(false)} />
          ) : (
            <form onSubmit={handleSubmit}>
              <div className='divFormulaire'>
                <div className="input-containerConnexion">
                  <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                  <input
                    className="input inputEmail"
                    type="email"
                    placeholder='E-mail...'
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="input-containerConnexion">
                  <i className='bx bxs-lock' style={{ color: '#fdb024' }}></i>
                  <input
                    className="input inputMdp"
                    type="password"
                    placeholder='Mot de Passe...'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <a href='#' className="mdpOublie" onClick={() => setShowForgotPassword(true)}>Mot de passe oublié?</a>
                <button className="btnConnexion" type="submit">Se Connecter</button>
                {errorMessage && <p className='pErreur'>{errorMessage}</p>}
                
                <div className="divIcone">
                  <div className="divTextIconGoogle">
                    <div className="cercle cercleGoogle">
                      <i className="bx bxl-google google-icon"></i>
                    </div>
                    <p className="textInscrireAvecGoogle">Connexion avec Google</p>
                  </div>
                  <div className="divTextIconFacebook">
                    <div className="cercle">
                      <i className='bx bxl-facebook' style={{ color: '#1877F2', fontSize: '30px' }}></i>
                    </div>
                    <p className="textInscrireAvecFacebook">Connexion avec Facebook</p>
                  </div>
                </div>

                <div id="divmot2">
                  <p className="mot3">
                    <a href="#">Pas de compte?</a>
                    <a href="/inscription">Inscrivez-Vous!</a>
                  </p>
                </div>
              </div>
            </form>
          )}
      </div>
    </div>
  );
}
