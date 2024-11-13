import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Importation du hook useNavigate et useLocation
import myImage from '/src/assets/logo_provisoire.png';
import MotDePasseOublie from '../MDPOublié/motdepasseoublie';

import "./Connexion.css";
// import toast from 'react-hot-toast';

//Import lamine
import CheckPhone from '../../Composants/VerifierTelephone/checkPhone';
import ButtonVP from '../../ComposantGraphiques/button';
import InputWithIconAndPlaceholder from '../../ComposantGraphiques/inputWithIconAndPlaceholder';
import LinkWithIcon from '../../ComposantGraphiques/linkWithIcon';
import { set } from 'react-hook-form';



export default function Connexion() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoadingBtn, setIsLoadingBtn] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Récupération de l'URL de redirection

  //Ajouter par lamine
  const [userInactif, setUserInactif] = React.useState(false)
  const [emailIsActif, setEmailIsActif] = React.useState(true)

  const handleUserPhoneChecked = () => {
    setEmailIsActif(true)
    setUserInactif(false)
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
  }

  //Fin ajout par lamine

  // Expression régulière pour valider le mot de passe
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoadingBtn(true);
    if (!passwordRegex.test(password)) {
      setIsLoadingBtn(false);
      setErrorMessage('Le mot de passe doit contenir 1 majuscule, 1 minuscule, minimum 8 caractères et un caractère spécial!');
      return;
    }

    const formData = new URLSearchParams();
    formData.append('username', username);
    formData.append('password', password);
    setIsLoadingBtn(true);

    if (emailIsActif == false) {
      setIsLoadingBtn(false)
      setUserInactif(true)
    } else {
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
        // toast.success("Connexion réussie");
        const redirectPath = location.state?.from?.pathname || '/dashboard';
        navigate(redirectPath);

        const accessToken = data.access_token;
        const userId = data.user_id;
        const role = data.role;

        // Stocker les informations dans des cookies
        document.cookie = `authToken=${accessToken}; path=/; max-age=${60 * 60 * 24}`;
        document.cookie = `userId=${userId}; path=/; max-age=${60 * 60 * 24}`;
        document.cookie = `role=${role}; path=/; max-age=${60 * 60 * 24}`;
        // toast.success('Connexion réussie');


      } catch (error) {
        console.error('Erreur lors de la connexion:', error.message);
        setErrorMessage('Une erreur s\'est produite lors de la connexion.'); // Affiche un message d'erreur
      }
      finally {
        setIsLoadingBtn(false);
      }
    }
  };


  return (
    <div className='stacke'>
      <div className='stackeChild'>
        <h2 className="h2Con">Connexion</h2>
        <div className="divImageBmw">
          <Link to="/"> <img className="imageBmw" src={myImage} alt="pct" /> </Link>
        </div>

        {
          userInactif ? (
            <CheckPhone telClient={'620335718'} onPhoneChecked={handleUserPhoneChecked} />
          ) : (
            showForgotPassword ?
              (
                <MotDePasseOublie onClose={() => setShowForgotPassword(false)} />
              ) : (
                <>
                  <form onSubmit={handleSubmit}>
                    <div className='divFormulaire'>
                      <InputWithIconAndPlaceholder
                        icon={'bx'}
                        icontype={'bxs-envelope'}
                        type='email'
                        placeholder={'Email...'}
                        inputValue={username}
                        handleInputValueChange={handleUsernameChange}
                        required={true} />

                      <InputWithIconAndPlaceholder
                        icon={'bx'}
                        icontype={'bxs-lock'}
                        type='password'
                        placeholder={'Mot de Passe...'}
                        inputValue={password}
                        handleInputValueChange={handlePasswordChange}
                        required={true} />

                      <a href='#' className="mdpOublie" onClick={() => setShowForgotPassword(true)}>Mot de passe oublié?</a>

                      <ButtonVP name={isLoadingBtn ? 'Chargement...' : 'Se Connecter'} type={'submit'} />

                      {errorMessage && <p className='pErreur'>{errorMessage}</p>}
                    </div>
                  </form>
                  <div className="divIcone">
                    <LinkWithIcon icon={'bx'} icontype={'bxl-google'} iconName={'google-icon'} name={'Se connecter avec Google'}/>
                    <LinkWithIcon icon={'bx'} icontype={'bxl-facebook'} iconName={'google-icon'} name={'Se connecter avec Facebook'}/>
                  </div>


                  <div id="divmot2">
                    <p className="mot3">Pas de compte? <a href="/inscription"> Inscrivez-Vous!</a></p>
                  </div>
                  <div id="divmot3">
                    <p className="mot4"> <a href="/"> Retour à l'Accueil</a></p>
                  </div>
                </>
              )
          )
        }


      </div>
    </div>
  );
}
