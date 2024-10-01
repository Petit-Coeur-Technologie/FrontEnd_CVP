import React, { useState, useRef, useEffect } from 'react';
import { Box, Stack, Button, Typography, TextField } from '@mui/material';
import "../Connexion/Connexion.css";
import "./mdpoublie.css";
import { useNavigate } from 'react-router-dom'; // Pour la redirection

export default function MotDePasseOublie({ onClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [userId, setUserId] = useState(0);
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState(''); 
  const [codeParts, setCodeParts] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('Utilisateur'); // Nom de l'utilisateur
  const inputRefs = useRef([]);
  const navigate = useNavigate(); // Pour rediriger à la page de connexion

  //========VERIFICATION DU NUMERO DE PHONE=====================
  const handleSubmitPhone = async (event) => {
    event.preventDefault();
    const enteredCode = codeParts.join('');

    try {
      // Remplacer par l'URL de l'API qui retourne le code de vérification
      const response = await fetch(`https://ville-propre.onrender.com/resset-password/${phoneNumber}`);
      
      if (!response.ok) {
        throw new Error('Le numéro de téléphone n\'existe pas');
      }

      const data = await response.json();
      console.log(data);
      setStep(2);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la vérification du code.');
    }
};

//========RECUPERATION DU NUMERO DE PHONE=====================
  //========VERIFICATION DU CODE=====================
  const handleSubmitCode = async (event) => {
    event.preventDefault();
    try {
      const codeString = codeParts.join(''); // Concatène les valeurs sans virgule
      const response = await fetch(`https://ville-propre.onrender.com/verication/${codeString}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ phoneNumber })
      });
      
      if (!response.ok) {
        setMessage("Le code saisi est incorrect, veuillez réessayer");
        return; // Ne pas continuer si la réponse n'est pas OK
      }
  
      const data = await response.json();
      console.log(data);
      console.log("=====================");
  
      if (data.user_id) {
        setUserId(data.user_id);
        setMessage('Un code de réinitialisation a été envoyé à votre numéro.');
        setStep(3); // Passer à l'étape 3 si le code est correct
      } else {
        setMessage('Le code saisi est incorrect, veuillez réessayer');
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  


  const handleCodeChange = (index, value) => {
    const newCodeParts = [...codeParts];
    
    if (/^\d$/.test(value)) { // Si une valeur numérique est saisie
      newCodeParts[index] = value;
      setCodeParts(newCodeParts);

      if (index < codeParts.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') {
      newCodeParts[index] = ''; 
      setCodeParts(newCodeParts);

      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && codeParts[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };



useEffect(()=>{
  console.log("Numéro saisie : "+codeParts);
},[codeParts])


  //========MODIFICATION DU MOT DE PASS=====================
  const handleResetPassword = async (event) => {
    event.preventDefault();
  
    // Vérification que les deux mots de passe sont identiques
    if (newPassword !== confirmPassword) {
      setMessage("Les mots de passe sont différents");
      return;
    }
  
    // Optionnel : Vérification de la complexité du mot de passe
    if (newPassword.length < 8) {
      setMessage("Le mot de passe doit comporter au moins 8 caractères");
      return;
    }
  
    try {
      console.log(userId);
      console.log("=============");
      // Requête pour mettre à jour le mot de passe
      console.log(`https://ville-propre.onrender.com/update_password/${userId}/${newPassword}`);
      const response = await fetch(`https://ville-propre.onrender.com/update_password/${userId}/${newPassword}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword }) // Envoyer le nouveau mot de passe
      });
  
      // Vérification de la réponse
      if (!response.ok) {
        // Afficher un message d'erreur si la modification a échoué
        setMessage("Erreur lors de la modification du mot de passe");
        return; // Arrêter le traitement en cas d'erreur
      }
  
      // Si la réponse est correcte, traiter les données
      const data = await response.json();
      console.log(data);
      setMessage("Le mot de passe a été modifié avec succès");
      navigate('/connexion');
      
      // Optionnel : Redirection après succès
      setTimeout(() => {
        navigate('/connexion'); // Rediriger vers la page de connexion après 2 secondes
      }, 600000);
  
    } catch (error) {
      // Afficher le message d'erreur dans la console et l'interface utilisateur
      console.error("Erreur lors de la modification du mot de passe :", error.message);
      setMessage("Une erreur est survenue. Veuillez réessayer.");
    }
  };
  

  return (
    <div className="boxe"
      width={"400px"}
      sx={{
        bgcolor: "#00804b",
        borderRadius: "10px",
        padding: 3,
        height: "auto",
      }}
    >
      {step === 1 && (
        <>
          <div>
            <div className='mdp1'>
              <h2>Vérification de l'utilisateur</h2>
            </div>
            <form onSubmit={handleSubmitPhone}>
              <div direction={"column"} gap={2}>
                <input
                  type="tel"
                  label="Entrez votre numéro de téléphone"
                  placeholder='Entrez votre numéro de téléphone'
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="input"
                  pattern="^[0-9]{9}$"
                />
                <Button className="envoyer" variant="contained" type="submit">Envoyer</Button>
                {message && <Typography color="primary" className="mot1">{message}</Typography>}
              </div>
            </form>
            <Button className="fermer1" onClick={onClose}>Fermer</Button>
          </div> 
        </>
      )}

      {step === 2 && (
        <>
          <div>
            <h2 className="mot2">Entrez le code de vérification</h2>
          </div>
          <form onSubmit={handleSubmitCode}>
            <div direction={"row"} gap={1}>
              {codeParts.map((part, index) => (
                <TextField
                  key={index}
                  inputRef={(ref) => inputRefs.current[index] = ref}
                  type="text"
                  value={part}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  required
                  className="input mot21"
                  sx={{
                    width: '50px',
                    textAlign: 'center',
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": { borderColor: "white" },
                      "&:hover fieldset": { borderColor: "white" },
                      "&.Mui-focused fieldset": { borderColor: "white" },
                    },
                  }}
                />
              ))}
            </div>
            <Button className="envoyer" variant="contained" type="submit" sx={{ mt: 2 }}>Vérifier</Button>
            {message && <Typography color="primary" className="mot3">{message}</Typography>}
          </form>
          <Button className="fermer" onClick={() => setStep(1)}>Retour</Button>
        </>
      )}

      {step === 3 && (
        <>
          <Typography variant='h5' className="mot2">Bienvenue {username} !</Typography>
          <Typography variant='body1' className="oubien">Veuillez réinitialiser votre mot de passe.</Typography>
          
          <form onSubmit={handleResetPassword}>
            <TextField
              label="Nouveau mot de passe"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              fullWidth
              sx={{ mt: 2 }}
            />
            <TextField
              label="Confirmer le mot de passe"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              fullWidth
              sx={{ mt: 2 }}
            />
            <Button className="envoyer" variant="contained" type="submit" sx={{ mt: 2 }}>Réinitialiser</Button>
            {message && <Typography color="primary" className="mot3">{message}</Typography>}
          </form>
        </>
      )}
    </div>
  );
}
