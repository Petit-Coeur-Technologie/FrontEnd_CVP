import React, { useState, useRef } from 'react';
import { Box, Stack, Button, Typography, TextField } from '@mui/material';
import "../Connexion/Connexion.css";
import "./mdpoublie.css";

export default function MotDePasseOublie({ onClose }) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState(''); 
  const [codeParts, setCodeParts] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);

  const handleSubmitPhone = async (event) => {
    event.preventDefault();

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ phoneNumber })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Un code de réinitialisation a été envoyé à votre numéro.');
      setVerificationCode(data.code); // Supposons que le code est retourné dans la réponse
      setStep(2);
    } else {
      setMessage(data.message);
    }
  };

  const handleCodeChange = (index, value) => {
    const newCodeParts = [...codeParts];
    
    if (/^\d$/.test(value)) { // Si une valeur numérique est saisie
      newCodeParts[index] = value;
      setCodeParts(newCodeParts);

      // Passer au champ suivant après avoir entré un chiffre
      if (index < codeParts.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    } else if (value === '') { // Si une valeur est supprimée
      newCodeParts[index] = ''; // Effacer la valeur dans le champ actuel
      setCodeParts(newCodeParts);

      // Retourner au champ précédent en cas de suppression si possible
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && codeParts[index] === '') {
      // Si la touche 'Backspace' est appuyée et que le champ est vide, on retourne au champ précédent
      if (index > 0) {
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleSubmitCode = (event) => {
    event.preventDefault();
    const enteredCode = codeParts.join('');

    if (enteredCode === verificationCode) {
      setMessage('Code vérifié avec succès.');
      setStep(3);
    } else {
      setMessage('Le code de vérification est incorrect.');
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
         <h2>vérification de l'utilisateur</h2>
         </div>
          <div>
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
                pattern="^[0-9]{9}$" // Vous pouvez adapter cette regex selon le format de numéro de téléphone attendu
                InputProps={{
                  style: {
                    color: 'white', 
                    backgroundColor: 'white'
                  },
                }}
                InputLabelProps={{
                  style: { color: 'white' },
                }}
              />
              <div>
              <Button className="envoyer" variant="contained" type="submit">Envoyer</Button>
              </div>
             
              {message && <Typography color="primary" className="mot1">{message}</Typography>}
            </div>
          </form>
          </div>
          <Button className="fermer1" onClick={onClose}>Fermer</Button>
          </div> 
          
        </>
      )}

      {step === 2 && (
        <>
          <div >
            <h2 className="mot2">Entrez le code de vérification</h2>
            </div>
          <form onSubmit={handleSubmitCode}>
            <div direction={"row"} gap={1}>
              {codeParts.map((part, index) => (
                <TextField
                  key={index}
                  inputRef={(ref) => inputRefs.current[index] = ref} // Référence du champ
                  type="text"
                  value={part}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)} // Gérer le retour avec Backspace
                  inputProps={{ maxLength: 1 }}
                  required
                  className="input mot21"
                  sx={{ width: '50px', textAlign: 'center' }}
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
          <Typography variant='h5' className="mot2">Réinitialisation du mot de passe</Typography>
          <Typography variant='body1' className="oubien">Redirection vers la page de réinitialisation...</Typography>
          {/* Logique de redirection */}
        </>
      )}
    </div>
  );
}
