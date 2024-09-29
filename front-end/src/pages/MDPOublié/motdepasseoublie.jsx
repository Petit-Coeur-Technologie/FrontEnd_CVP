import React, { useState } from 'react';
import { Box, Stack, Button, Typography, TextField } from '@mui/material';
import "../Connexion/Connexion.css";

export default function MotDePasseOublie({ onClose }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState(1);
  const [verificationCode, setVerificationCode] = useState('');
  const [codeParts, setCodeParts] = useState(['', '', '', '', '', '']);

  const handleSubmitEmail = async (event) => {
    event.preventDefault();

    const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (response.ok) {
      setMessage('Un email de réinitialisation a été envoyé.');
      setVerificationCode(data.code); // Supposons que le code est retourné dans la réponse
      setStep(2);
    } else {
      setMessage(data.message);
    }
  };

  const handleCodeChange = (index, value) => {
    if (/^\d$/.test(value)) {
      const newCodeParts = [...codeParts];
      newCodeParts[index] = value;
      setCodeParts(newCodeParts);
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
         <div className='mdp'>
         <h1>Mot de passe oublié</h1>
         </div>
          <div>
          <form onSubmit={handleSubmitEmail}>
            <div direction={"column"} gap={2}>
              <TextField
                type="email"
                label="Entrez votre mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="input"
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
              <Button className="envoyer" variant="contained" type="submit">Envoyer</Button>
              {message && <Typography color="primary" className="mot2">{message}</Typography>}
            </div>
          </form>
          </div>
          <Button className="fermer" onClick={onClose}>Fermer</Button>
          </div> 
          
        </>
      )}

      {step === 2 && (
        <>
          <div className="mot2">
            <h2>Entrez le code de vérification</h2>
            </div>
          <form onSubmit={handleSubmitCode}>
            <div direction={"row"} gap={1}>
              {codeParts.map((part, index) => (
                <TextField
                  key={index}
                  type="text"
                  value={part}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  inputProps={{ maxLength: 1 }}
                  required
                  className="input mot21"
                  sx={{ width: '50px', textAlign: 'center' }}
                />
              ))}
            </div>
            <Button className="envoyer" variant="contained" type="submit" sx={{ mt: 2 }}>Vérifier</Button>
            {message && <Typography color="primary" className="mot2">{message}</Typography>}
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
