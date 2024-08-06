import { Box, Stack, Typography } from "@mui/material";
import { useState } from "react";
import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom"; // Importer useNavigate pour la redirection
import "./inscription.css";
import "boxicons/css/boxicons.min.css";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

function isPasswordValid(password) {
  return passwordRegex.test(password);
}

export default function Inscription() {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const navigate = useNavigate(); // Initialiser useNavigate pour la redirection

  const [formType, setFormType] = useState('ménage');
  const [userRole, setUserRole] = useState('');
  const [fileNames, setFileNames] = useState({
    idFile: 'Aucun fichier',
    logoFile: 'Aucun fichier'
  });

  const handleUserRoleChange = (event) => {
    setUserRole(event.target.value);
  };

  const handleFileChange = (event, fileType) => {
    if (event.target.files.length > 0) {
      setFileNames({
        ...fileNames,
        [fileType]: event.target.files[0].name
      });
    } else {
      setFileNames({
        ...fileNames,
        [fileType]: 'Aucun fichier'
      });
    }
  };

  const onSubmit = (data) => {
    console.log(data, errors);
    // Appel API pour créer un utilisateur
    fetch('https://votre-api.com/utilisateurs', { // Remplacer par l'URL de votre API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then(response => {
        if (response.ok) {
          // Redirection après création de compte réussie
          navigate('/login'); // Remplacer '/login' par le chemin de votre page de connexion
        } else {
          // Gérer les erreurs de l'API
          console.log('Erreur lors de la création du compte');
        }
      })
      .catch(error => {
        console.error('Erreur lors de la requête API:', error);
      });
  };

  return (
    <Stack className="stack-container">
      <Box className="right-container"> {/* Conteneur pour l'image et le titre */}
        <Typography variant="h5" className="title">
          Inscription
        </Typography>
        <img src="src/assets/background.avif" className="background" alt="background" />
      </Box>
      <Box className="box-container">
        <div className="logo">
          <img src="src\assets\logo.jpg" id="logo" />
        </div>
        <div className="button-group">
          <button className="client" onClick={() =>
            setFormType('ménage')} style={{ opacity: formType === 'ménage' ? 1 : 0.5 }}>
            Client
          </button>

          <button className="pme" onClick={() => setFormType('type2')}
            style={{ opacity: formType === 'type2' ? 1 : 0.5 }}>
            PME
          </button>
        </div>

        {formType === 'ménage' ? (
          <form action="" onSubmit={handleSubmit(onSubmit)}>

            <select name="type" id="type" className="type"  onChange={handleUserRoleChange}>
              <option value="ménage">Ménage</option>
              <option value="entreprise">Entreprise</option>
            </select>

            <div className="form-container">
              <div className="input-container">
                <i className='bx bxs-user' style={{ color: '#fdb024' }}></i>
                <input type="text" name="noms" className="noms" placeholder="Nom et Prénom(s)"
                  {...register("nomsClt", { required: "Veuillez saisir votre nom" })} />
              </div>
              <div className="input-container">
                <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                <input type="email" name="mail" id="mail" placeholder="E-mail"
                  {...register("mailClt", { required: "Veuillez saisir votre email" })} />
              </div>
              <div className="input-container">
                <i class='bx bx-male-female' style={{ color: '#fdb024' }} ></i>
                <select name="genre" id="genre" className="genre" defaultValue='' {...register("genreClt")} required>
                  <option value="" disabled hidden>Choisir le genre</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
              <div className="input-container">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <input type="text" name="adress" className="adress" placeholder="Adresse"
                  {...register("adresseClt", { required: "Entrez votre adresse" })} />
              </div>
              <div className="input-container">
                <i className='bx bxs-phone' style={{ color: '#fdb024' }}></i>
                <input type="tel" name="tel" id="tel" placeholder="Numéro de téléphone"
                  {...register("telClt", { required: "Entrez votre numéro de téléphone" })} />
              </div>
              <div className="input-container divfile">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <label htmlFor="id-file-upload" className="custom-file-upload">
                  Pièce d'identité
                </label>
                <input id="id-file-upload" type="file" onChange={(e) => handleFileChange(e, 'idFile')} required />
                <span id="file-name">{fileNames.idFile}</span>
              </div>
              {/* Affichage conditionnel basé sur le type de client */}
              {userRole === "entreprise" && (
                <>
                  <div className="input-container">
                    <i className='bx bxs-building' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="nom" className="nom" placeholder="Nom de l'entreprise"
                      {...register("nomEntreprise", { required: "Entrez le nom de l'entreprise" })} />
                  </div>

                  <div className="input-container divfile">
                    <i className='bx bxs-image' style={{ color: '#fdb024' }}></i>
                    <label htmlFor="logo-file-upload" className="custom-file-upload">
                      Logo de l'entreprise
                    </label>
                    <input id="logo-file-upload" type="file" onChange={(e) => handleFileChange(e, 'logoFile')} />
                    <span id="file-name">{fileNames.logoFile}</span>
                  </div>
                  <div className="input-container">

                    <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="registration" className="registration" placeholder="Numéro d'enregistrement"
                      {...register("n°Entreprise", { required: "Entrez le n° d'enregistrement de l'entreprise" })} />
                  </div>
                </>
              )}
              <div className="input-container">
                <i className='bx bxs-lock' style={{ color: '#fdb024' }}></i>
                <input type="password" name="mdp" id="mdp" placeholder="Mot de passe"
                  {...register("mdpClt", {
                    required: "Entrez votre mot de passe",
                    minLength: { value: 8, message: "Entrez un mot de passe de 8 caractères minimum" },
                    validate: value => isPasswordValid(value) || "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
                  })} />
                {errors.mdpClt && <p>{errors.mdpClt.message}</p>}
              </div>
              <div className="input-container">
                <i className='bx bxs-lock-alt' style={{ color: '#fdb024' }}></i>
                <input type="password" name="cmdp" id="cmdp" placeholder="Confirmation de mot de passe"
                  {...register("cmdpClt", {
                    required: "Confirmez votre mot de passe",
                    minLength: { value: 8, message: "Confirmez un mot de passe de 8 caratères minimum" }
                  })} />
              </div>
            </div>
            <div className="checkbox-container accept ">
              <input type="checkbox" name="validate" id="validate"
                {...register("accept", { required: "Veuillez accepter les politiques de confidentialités!" })} />
              <label htmlFor="validate">
                J'ai lu et j'accepte les <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer">politiques de confidentialité</a>
              </label>
            </div>
            <div>
              <button type="submit" id="subCLT" className="sub">S'inscrire</button>
            </div>
            <h3>Ou s'inscrire avec</h3>
            <div className="ins">
              <div className="cercle"><i className="bx bxl-google google-icon"></i></div>
              <div className="cercle"><i className='bx bxl-facebook' style={{ color: '#1877F2', fontSize: '30px' }} ></i></div>
            </div>
          </form>
        ) : (
          <form action="">
            <div className="form-container">
              {/* Contenu de la section PME */}
              <div className="input-container">
                <i className='bx bxs-user' style={{ color: '#fdb024' }}></i>
                <input type="text" name="noms" className="noms" placeholder="Nom et Prénom(s)"  {...register("nomsPME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                <input type="email" name="mail" id="mail" placeholder="E-mail"  {...register("mailPME")} required />
              </div>
              <div className="input-container">
                <i class='bx bx-male-female' style={{ color: '#fdb024' }} ></i>
                <select name="genre" id="genre" className="genre" defaultValue=""  {...register("genrePME")} required>
                  <option value="" disabled selected hidden>Choisir le genre</option>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
              <div className="input-container">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <input type="text" name="adress" className="adress" placeholder="Adresse"
                  {...register("adressePME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-phone' style={{ color: '#fdb024' }}></i>
                <input type="tel" name="tel" id="tel" placeholder="Numéro de téléphone"
                  {...register("telPME")} required />
              </div>
              <div className="input-container divfile">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <label htmlFor="pme-id-file-upload" className="custom-file-upload">
                  Pièce d'identité
                </label>
                <input id="pme-id-file-upload" type="file" onChange={(e) => handleFileChange(e, 'idFile')} required />
                <span id="file-name">{fileNames.idFile}</span>
              </div>
              <div className="input-container">
                <i className='bx bxs-building' style={{ color: '#fdb024' }}></i>
                <input type="text" name="nom" className="nom" placeholder="Nom de la PME"
                  {...register("nomPME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <input type="text" name="registration" className="registration"
                  placeholder="Numéro d'enregistrement"  {...register("n°PME")} required />
              </div>
              <div className="input-container divfile">
                <i className='bx bxs-image' style={{ color: '#fdb024' }}></i>
                <label htmlFor="pme-logo-file-upload" className="custom-file-upload">
                  Logo de la PME
                </label>
                <input id="pme-logo-file-upload" type="file" onChange={(e) => handleFileChange(e, 'logoFile')} />
                <span id="file-name">{fileNames.logoFile}</span>
              </div>
              <div className="input-container">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <input type="zone" name="zone" className="zone" placeholder="Zone d'intervention"
                  {...register("zonePME")} required />
              </div>
              <div className="text-container">
                <textarea name="desc" id="desc" className="desc" placeholder="Description de la PME"
                  {...register("descPME", {
                    required: "Confirmez votre mot de passe",
                    maxLength: { value: 500, message: "Veuillez saisir une description de 500 caractères maximum" }
                  })} ></textarea>
              </div>
              <div className="input-container">
                <i className='bx bxs-lock' style={{ color: '#fdb024' }}></i>
                <input type="password" name="mdpPME" id="mdpPME" placeholder="Mot de passe"
                  {...register("mdpPME", {
                    required: "Entrez votre mot de passe",
                    minLength: { value: 8, message: "Entrez un mot de passe de 8 caractères minimum" },
                    validate: value => isPasswordValid(value) || "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
                  })} />
                {errors.mdpPME && <p>{errors.mdpPME.message}</p>}
              </div>
              <div className="input-container">
                <i className='bx bxs-lock-alt' style={{ color: '#fdb024' }}></i>
                <input type="password" name="cmdpPME" id="cmdpPME" placeholder="Confirmation de mot de passe"
                  {...register("cmdpPME", {
                    required: "Confirmez votre mot de passe",
                    validate: value => value === watch("mdpPME") || "Les mots de passe doivent correspondre"
                  })} />
              </div>
              <div className="checkbox-container">
                <input type="checkbox" name="validate" id="validate" required />
                <label htmlFor="validate">
                  J'ai lu et j'accepte les <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer">politiques de confidentialité</a>
                </label>
              </div>
              <div>
                <button type="submit" id="subPME" className="sub">S'inscrire</button>
              </div>
            </div>
          </form>

        )}
        <a href="#" className="login-link">Vous êtes déjà inscrit? Connectez-vous</a>
      </Box>
    </Stack>
  );
}