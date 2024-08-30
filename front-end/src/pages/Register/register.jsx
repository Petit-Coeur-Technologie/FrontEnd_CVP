import { Box, Stack, Typography } from "@mui/material";
import React, { useState, useRef } from 'react'; 
import { useNavigate } from 'react-router-dom';
import "./register.css";
import "boxicons/css/boxicons.min.css";
import { toast } from 'react-hot-toast';
import ClientForm from "../inscription/ClientForm";
import PmeForm from "../inscription/PmeForm";

function Register() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('client');
  const [isLoading, setIsLoading] = useState(false);

  const idFileRef = useRef(null);
  const logoFileRef = useRef(null);

  const telPme = (phone) => /^\d{3}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/.test(phone); // Validation du numéro de téléphone

  const onSubmitClient = async (data) => {
    console.log('Soumission du formulaire Client avec les données:', data);

    // Vérification et validation des données du client
    if (!telPme(data.telClt)) {
      toast.error("Numéro de téléphone invalide pour le client.");
      return;
    }

    if (data.mdpClt !== data.cmdpClt) {
      toast.error("Les mots de passe client ne sont pas identiques.");
      return;
    }

    // Construction des données du formulaire Client
    const formData = new FormData();
    let quartierId = parseInt(data.quartierClt, 10);

    if (isNaN(quartierId)) {
      toast.error("Quartier invalide pour le client.");
      return;
    }

    formData.append('role', data.roleClt);
    formData.append('quartier_id', quartierId);
    formData.append('nom_prenom', data.nomsClt);
    formData.append('tel', data.telClt);
    formData.append('genre', data.genreClt);
    formData.append('email', data.mailClt);
    formData.append('mot_de_passe', data.mdpClt);

    formData.append('create_at', new Date().toISOString());
    formData.append('update_at', new Date().toISOString());
    formData.append('is_actif', true);

    if (data.idFile) {
      formData.append('copie_pi', data.idFile);
    } else {
      toast.error("Veuillez télécharger une copie de votre pièce d'identité pour le client.");
      return;
    }

    if (data.userRole === "entreprise") {
      formData.append('nom_entreprise', data.nomEntreprise);
      formData.append('num_rccm', data.nEntreprise);
      if (data.logoFile) {
        formData.append('logo_entreprise', data.logoFile);
      }
    }
    setIsLoading(true);

    const apiUrl = 'https://ville-propre.onrender.com/client';

    try {
      console.log('Envoi des données à l\'API...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData
      });

      console.log('Réponse de l\'API :', response);

      if (response.ok) {
        const result = await response.json();
        console.log('Réponse de l\'API (données) :', result);
        toast.success("Inscription réussie");
        navigate('/connexion');
      } else {
        const errorData = await response.json();
        console.error('Erreur lors de l\'inscription :', errorData);
        toast.error("Erreur lors de l'inscription.");
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi des données :', error);
      toast.error("Erreur lors de l'inscription.");
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitPme = async (data) => {
    console.log('Soumission du formulaire PME avec les données:', data);
  
    // Validation du numéro de téléphone
    if (!telPme(data.telPME)) {
        toast.error("Numéro de téléphone invalide pour la PME.");
        return;
    }
  
    const formData = new FormData();
    let quartierId = parseInt(data.quartierPME, 10);
  
    if (isNaN(quartierId)) {
        toast.error("Quartier invalide pour la PME.");
        return;
    }
  
    formData.append('quartier_id', quartierId);
    formData.append('nom_prenom', data.nomsPME);
    formData.append('tel', data.telPME);
    formData.append('genre', data.genrePME);
    formData.append('email', data.mailPME);
    formData.append('mot_de_passe', data.mdpPME);
  
    // Ajout des fichiers à formData
    if (idFileRef.current && idFileRef.current.files.length > 0) {
      formData.append('copie_pi', idFileRef.current.files[0]);
    } else {
      toast.error("Veuillez télécharger une copie de votre pièce d'identité.");
      return;
    }
  
    formData.append('nom_pme', data.nomPME);
    formData.append('description', data.descPME);
    formData.append('zone_intervention', data.zonePME);
    formData.append('num_enregistrement', data.numEnregistrementPME);
    formData.append('tarif_mensuel', data.tarifMensuelPME);
    formData.append('tarif_abonnement', data.tarifAbonnementPME);
  
    if (logoFileRef.current && logoFileRef.current.files.length > 0) {
      formData.append('logo_pme', logoFileRef.current.files[0]);
    } else {
      toast.error("Veuillez télécharger un logo pour la PME.");
      return;
    }
  
    formData.append('create_at', new Date().toISOString());
    formData.append('update_at', new Date().toISOString());
    formData.append('is_actif', true);
  
    const urlPME = 'https://ville-propre.onrender.com/pme';
  
    try {
        console.log('Envoi des données à l\'API...');
        const response = await fetch(urlPME, {
          method: 'POST',
          body: formData
        });
  
        console.log('Réponse de l\'API :', response);
  
        if (response.ok) {
            const result = await response.json();
            console.log('Réponse de l\'API (données) :', result);
            toast.success("Inscription réussie");
            navigate('/connexion');
        } else {
            const errorData = await response.json();
            console.error('Erreur lors de l\'inscription :', errorData);
            toast.error("Erreur lors de l'inscription.");
        }
    } catch (error) {
        console.error('Erreur lors de l\'envoi des données :', error);
        toast.error("Erreur lors de l'inscription.");
    } finally {
        setIsLoading(false);
    }
  };  

  return (
    <Stack className="stack-container">
      <Box className="right-container">
        <Typography variant="h5" className="title">
          Inscription
        </Typography>
        <img src="src/assets/background.avif" className="background" alt="background" />
      </Box>
      <Box className="box-container">
        <div className="lg">
          <img src="src/assets/logo.jpg" id="lg" />
        </div>
        <div className="button-group">
          <button className="client" onClick={() => setFormType('client')} style={{ opacity: formType === 'client' ? 1 : 0.5 }}>
            Client
          </button>
          <button className="pme" onClick={() => setFormType('pme')} style={{ opacity: formType === 'pme' ? 1 : 0.5 }}>
            PME
          </button>
        </div>

        {formType === 'client' ? (
          <ClientForm onSubmit={onSubmitClient} isLoading={isLoading} />
        ) : (
          <PmeForm onSubmit={onSubmitPme} isLoading={isLoading} idFileRef={idFileRef} logoFileRef={logoFileRef}/>
        )}
        <a href='/connexion' className="login-link">Vous êtes déjà inscrit? Connectez-vous</a>
      </Box>
    </Stack>
  );
}

export default Register;