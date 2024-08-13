import { Box, Stack, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import "./inscription.css";
import "boxicons/css/boxicons.min.css";
import { toast } from 'react-hot-toast';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

function isPasswordValid(password) {
  return passwordRegex.test(password);
}

const phonePattern = /^\d{3}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/;

function tel(phone) {
  return phonePattern.test(phone);
}

export default function Inscription() {
  const { handleSubmit, register, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();

  const [villes, setVilles] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [selectedVille, setSelectedVille] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedQuartier, setSelectedQuartier] = useState('');


  const [formType, setFormType] = useState('client');
  const [userRole, setUserRole] = useState('menage');
  const [fileNames, setFileNames] = useState({
    idFile: `Pièce d'identité`,
    logoFile: 'Logo'
  });

  const idFileRef = useRef(null);
  const logoFileRef = useRef(null);

  useEffect(() => {
    fetch('https://ville-propre.onrender.com/villes')
      .then(response => response.json())
      .then(data => {
        console.log('Villes:', data); // Ajoutez cette ligne
        setVilles(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des villes:', error));
  }, []);

  useEffect(() => {
    if (selectedVille) {
      fetch(`https://ville-propre.onrender.com/communes?ville_id=${selectedVille}`)
        .then(response => response.json())
        .then(data => {
          console.log('Communes:', data); // Ajoutez cette ligne
          setCommunes(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des communes:', error));
    } else {
      setCommunes([]);
      setQuartiers([]);
    }
  }, [selectedVille]);

  useEffect(() => {
    if (selectedCommune) {
      fetch(`https://ville-propre.onrender.com/quartiers?commune_id=${selectedCommune}`)
        .then(response => response.json())
        .then(data => {
          console.log('Quartiers:', data); // Ajoutez cette ligne
          setQuartiers(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des quartiers:', error));
    } else {
      setQuartiers([]);
    }
  }, [selectedCommune]);

  const handleVilleChange = (e) => {
    const value = e.target.value;
    setSelectedVille(value);
    setSelectedCommune(''); // Réinitialiser la commune
    setSelectedQuartier(''); // Réinitialiser le quartier
  };

  const handleCommuneChange = (e) => {
    const value = e.target.value;
    setSelectedCommune(value);
    setSelectedQuartier(''); // Réinitialiser le quartier
  };

  const handleQuartierChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setSelectedQuartier(value);
    } else {
      setSelectedQuartier(''); // Réinitialiser si la valeur est invalide
    }
  };

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
    if (!tel(data.telClt || data.telPME)) {
      toast.error("Numéro de téléphone invalide");
      return;
    }

    if (data.mdpClt !== data.cmdpClt || data.mdpPME !== data.cmdpPME) {
      toast.error("Les mots de passe ne sont pas identiques.");
      return;
    }

    // Préparation des données du formulaire
    const formData = new FormData();
    let quartierId = parseInt(formType === 'pme' ? data.quartierPME : data.quartierClt, 10);

    if (isNaN(quartierId)) {
      toast.error("Quartier invalide.");
      return;
    }

    if (formType === 'pme') {
      formData.append('quartier_id', quartierId);
      formData.append('nom_prenom', data.nomsPME);
      formData.append('tel', data.telPME);
      formData.append('genre', data.genrePME);
      formData.append('email', data.mailPME);
      formData.append('mot_de_passe', data.mdpPME);

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
      }

      // Ajout des champs manquants
      formData.append('create_at', new Date().toISOString());
      formData.append('update_at', new Date().toISOString());
      formData.append('is_actif', true);
    } else {
      formData.append('role', data.roleClt);
      formData.append('quartier_id', quartierId);
      formData.append('nom_prenom', data.nomsClt);
      formData.append('tel', data.telClt);
      formData.append('genre', data.genreClt);
      formData.append('email', data.mailClt);
      formData.append('mot_de_passe', data.mdpClt);

      // Ajout des champs manquants
      formData.append('create_at', new Date().toISOString());
      formData.append('update_at', new Date().toISOString());
      formData.append('is_actif', true);

      if (idFileRef.current && idFileRef.current.files.length > 0) {
        formData.append('copie_pi', idFileRef.current.files[0]);
      } else {
        toast.error("Veuillez télécharger une copie de votre pièce d'identité.");
        return;
      }

      if (userRole === "entreprise") {
        formData.append('nom_entreprise', data.nomEntreprise);
        formData.append('num_rccm', data.nEntreprise);
        if (logoFileRef.current && logoFileRef.current.files.length > 0) {
          formData.append('logo_entreprise', logoFileRef.current.files[0]);
        }
      }
    }

    const apiUrl = formType === 'pme' ? 'https://ville-propre.onrender.com/pme' : 'https://ville-propre.onrender.com/client';

    fetch(apiUrl, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json().then(result => ({ status: response.status, body: result })))
      .then(({ status, body }) => {
        if (status === 200) {
          navigate('/login');
        } else {
          console.error('Erreur lors de la création du compte:', body.detail);
          if (Array.isArray(body.detail)) {
            toast.error(`Erreur: ${body.detail.map(err => err.msg).join(', ') || 'Erreur inconnue'}`);
          } else {
            toast.error(`Erreur: ${body.detail || 'Erreur inconnue'}`);
          }
        }
      })     
    console.log('Data to submit:', data);
    console.log('FormData contents:', Array.from(formData.entries()));

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
        <div className="logo">
          <img src="src/assets/logo.jpg" id="logo" />
        </div>
        <div className="button-group">
          <button className="client" onClick={() =>
            setFormType('client')} style={{ opacity: formType === 'client' ? 1 : 0.5 }}>
            Client
          </button>

          <button className="pme" onClick={() => setFormType('pme')}
            style={{ opacity: formType === 'pme' ? 1 : 0.5 }}>
            PME
          </button>
        </div>

        {formType === 'client' ? (
          <form action="" onSubmit={handleSubmit(onSubmit)}>


            <div className="form-container">
              
            <select name="role" id="role" className="type" {...register("roleClt")} onChange={handleUserRoleChange}  required>
              <option value="menage">Ménage</option>
              <option value="entreprise">Entreprise</option>
              {errors.roleClt && <span>{errors.roleCtl.message}</span>}
            </select>
            
              <div className="input-container">
                <i className='bx bxs-user' style={{ color: '#fdb024' }}></i>
                <input type="text" name="nom_prenom" className="noms" placeholder="Nom et Prénom(s)"
                  {...register("nomsClt", { required: "Veuillez saisir votre nom" })} />
                {errors.nomsClt && <span>{errors.nomsClt.message}</span>}
              </div>
              <div className="input-container">
                <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                <input type="email" name="email" id="mail" placeholder="E-mail"
                  {...register("mailClt", { required: "Veuillez saisir votre email" })} />
                {errors.mailClt && <span>{errors.mailClt.message}</span>}
              </div>
              <div className="input-container">
                <i class='bx bx-male-female' style={{ color: '#fdb024' }} ></i>
                <select name="genre" id="genre" className="genre" defaultValue='' {...register("genreClt")} required>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  {errors.genreClt && <span>{errors.genreClt.message}</span>}
                </select>
              </div>
              <div className="input-container">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <div className="adresse">
                  <label id="ville-label">Ville</label>
                  <select
                    labelId="ville-label"
                    id="ville"
                    value={selectedVille}
                    onChange={handleVilleChange}
                    label="Ville"
                  >
                    <option value=""></option>
                    {villes.map(ville => (
                      <option key={ville.id} value={ville.id}>{ville.ville}</option>
                    ))}
                  </select>
                </div>

                <div className="adresse">
                  <label id="commune-label">Commune</label>
                  <select
                    labelId="commune-label"
                    id="commune"
                    value={selectedCommune}
                    onChange={handleCommuneChange}
                    label="Commune"
                    disabled={!selectedVille} // Désactiver si aucune ville sélectionnée
                  >
                    {communes.map(commune => (
                      <option key={commune.id} value={commune.id}>{commune.nom}</option>
                    ))}
                  </select>
                </div>

                <div >
                  <label id="quartier-label">Quartier</label>
                  <select
                    labelId="quartier-label"
                    id="quartierClt"
                    {...register("quartierClt", { required: "Ce champ est obligatoire" })}
                    value={selectedQuartier}
                    name="quartier_id"
                    onChange={(e) => {
                      handleQuartierChange(e);
                      console.log('Quartier sélectionné:', e.target.value); // Ajoutez cette ligne
                    }}
                    label="Quartier"
                    disabled={!selectedCommune}
                  >
                    {quartiers.map(quartier => (
                      <option key={quartier.id} value={quartier.id}>{quartier.nom}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-container">
                <i className='bx bxs-phone' style={{ color: '#fdb024' }}></i>
                <span style={{ marginRight: '5px' }}>+224</span>
                <input type="tel" name="telClt" id="telClt" placeholder="Numéro de téléphone"
                  {...register("telClt", { required: "Entrez votre numéro de téléphone", validate: value => tel(value) || "Numéro de téléphone invalide" })} />
                {errors.telClt && <span>{errors.telClt.message}</span>}
              </div>
              <div className="input-container">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <input type="file" name="copie_pi" id="copie_pi" className="file-upload"
                  ref={idFileRef} // Utilisation de ref pour le fichier d'identité
                  onChange={(e) => handleFileChange(e, 'idFile')} />
                <label htmlFor="copie_pi" className="file-upload-label">
                  {fileNames.idFile}
                </label>
              </div>
              {/* Affichage conditionnel basé sur le type de client */}
              {userRole === "entreprise" && (
                <>
                  <div className="input-container">
                    <i className='bx bxs-building' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="nom_entreprise" className="nom" placeholder="Nom de l'entreprise"
                      {...register("nomEntreprise")} required/>
                  </div>

                  <div className="input-container">
                    <i className='bx bxs-image' style={{ color: '#fdb024' }}></i>
                    <input type="file" name="logo_entreprise" id="logo_entreprise" className="file-upload"
                      ref={logoFileRef} // Utilisation de ref pour le fichier du logo
                      onChange={(e) => handleFileChange(e, 'logoFile')} />
                    <label htmlFor="logo_entreprise" className="file-upload-label">
                      {fileNames.logoFile}
                    </label>
                  </div>
                  <div className="input-container">
                    <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="num_rccm" className="registration" placeholder="Numéro d'enregistrement"
                      {...register("nEntreprise")} required />
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
          <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-container">
              {/* Contenu de la section PME */}
              <div className="input-container">
                <i className='bx bxs-user' style={{ color: '#fdb024' }}></i>
                <input type="text" name="nom_prenom" className="noms" placeholder="Nom et Prénom(s)"  {...register("nomsPME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                <input type="email" name="email" id="mail" placeholder="E-mail"  {...register("mailPME")} required />
              </div>
              <div className="input-container">
                <i class='bx bx-male-female' style={{ color: '#fdb024' }} ></i>
                <select name="genre" id="genre" className="genre" defaultValue=""  {...register("genrePME")} required>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>
              <div className="input-container">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <div className="adresse">
                  <label id="ville-label">Ville</label>
                  <select
                    labelId="ville-label"
                    id="ville"
                    value={selectedVille}
                    onChange={handleVilleChange}
                    label="Ville"
                  >
                    {villes.map(ville => (
                      <option key={ville.id} value={ville.id}>{ville.ville}</option>
                    ))}
                  </select>
                </div>

                <div className="adresse">
                  <label id="commune-label">Commune</label>
                  <select
                    labelId="commune-label"
                    id="commune"
                    value={selectedCommune}
                    onChange={handleCommuneChange}
                    label="Commune"
                    disabled={!selectedVille} // Désactiver si aucune ville sélectionnée
                  >
                    {communes.map(commune => (
                      <option key={commune.id} value={commune.id}>{commune.nom}</option>
                    ))}
                  </select>
                </div>

                <div >
                  <label id="quartier-label">Quartier</label>
                  <select
                    labelId="quartier-label"
                    id="quartierPME"
                    {...register("quartierPME", { required: "Ce champ est obligatoire" })}
                    value={selectedQuartier}
                    name="quartier_id"
                    onChange={(e) => {
                      handleQuartierChange(e);
                      console.log('Quartier sélectionné:', e.target.value); // Ajoutez cette ligne
                    }}
                    label="Quartier"
                    disabled={!selectedCommune}
                  >
                    {quartiers.map(quartier => (
                      <option key={quartier.id} value={quartier.id}>{quartier.nom}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-container">
                <i className='bx bxs-phone' style={{ color: '#fdb024' }}></i>
                <span style={{ marginRight: '5px' }}>+224</span>
                <input type="tel" name="tel" id="telPME" placeholder="Numéro de téléphone"
                  {...register("telPME", { required: "Entrez votre numéro de téléphone" })} />
              </div>
              <div className="input-container">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <input type="file" name="copie_pi" id="copie_pi" className="file-upload"
                  ref={idFileRef} // Utilisation de ref pour le fichier d'identité
                  onChange={(e) => handleFileChange(e, 'idFile')} />
                <label htmlFor="copie_pi" className="file-upload-label">
                  {fileNames.idFile}
                </label>
              </div>
              <div className="input-container">
                <i className='bx bxs-building' style={{ color: '#fdb024' }}></i>
                <input type="text" name="nom_pme" className="nom" placeholder="Nom de la PME"
                  {...register("nomPME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <input type="text" name="num_enregistrement" className="registration"
                  placeholder="Numéro d'enregistrement"  {...register("numEnregistrementPME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-image' style={{ color: '#fdb024' }}></i>
                <input type="file" name="logo_pme" id="logo_pme" className="file-upload"
                  ref={logoFileRef} // Utilisation de ref pour le fichier du logo
                  onChange={(e) => handleFileChange(e, 'logoFile')} />
                <label htmlFor="logo_pme" className="file-upload-label">
                  {fileNames.logoFile}
                </label>
              </div>
              <div className="input-container">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <input type="zone" name="zone_intervention" className="zone" placeholder="Zone d'intervention"
                  {...register("zonePME")} required />
              </div>
              <div className="text-container">
                <textarea name="description" id="desc" className="desc" placeholder="Description de la PME"
                  {...register("descPME", {
                    required: "Confirmez votre mot de passe",
                    maxLength: { value: 500, message: "Veuillez saisir une description de 500 caractères maximum" }
                  })} ></textarea>
              </div>
              <div className="input-container">
                <i className='bx bx-euro' style={{ color: '#fdb024' }}></i>
                <input type="text" name="tarif_mensuel" className="tarif-mensuel" placeholder="Tarif mensuel (en GNF)"
                  {...register("tarifMensuelPME", { required: "Entrez le tarif mensuel" })} />
              </div>
              <div className="input-container">
                <i className='bx bx-euro' style={{ color: '#fdb024' }}></i>
                <input type="text" name="tarif_abonnement" className="tarif-abonnement" placeholder="Tarif abonnement (en GNF)"
                  {...register("tarifAbonnementPME", { required: "Entrez le tarif abonnement" })} />
              </div>
              <div className="input-container">
                <i className='bx bxs-lock' style={{ color: '#fdb024' }}></i>
                <input type="password" name="mot_de_passe" id="mdpPME" placeholder="Mot de passe"
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