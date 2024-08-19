// Rénitialisation du mot de passe

import React, { useState } from 'react';
import { Box, Stack, Button, Typography, TextField } from '@mui/material';
import "./App.css";

export default function ResetPassword({ onClose }) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmitPassword = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Les mots de passe ne correspondent pas.");
      return;
    }

    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ password })
    });

    if (response.ok) {
      setMessage("Votre mot de passe a été réinitialisé avec succès.");
    } else {
      const data = await response.json();
      setMessage(data.message || "Une erreur s'est produite.");
    }
  };

  return (
    <Box className="boxe"
      width={"400px"}
      sx={{
        bgcolor: "#f0f0f0",
        borderRadius: "10px",
        padding: 3,
        height: "auto",
      }}
    >
      <Typography variant='h5'>Réinitialisation du mot de passe</Typography>
      <form onSubmit={handleSubmitPassword}>
        <Stack direction={"column"} gap={2}>
          <TextField
            type="password"
            label="Nouveau mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            type="password"
            label="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button className="button" variant="contained" type="submit">Réinitialiser</Button>
          {message && <Typography color="primary">{message}</Typography>}
        </Stack>
      </form>
      <Button className="fermer" onClick={onClose}>Fermer</Button>
    </Box>
  );
}
