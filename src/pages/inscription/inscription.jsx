import { Box, Stack, Typography } from "@mui/material";
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import React from 'react';
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import "./inscription.css";
import "boxicons/css/boxicons.min.css";
import { toast } from 'react-hot-toast';

// Regex pour valider les mots de passe
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;

// Fonction pour vérifier la validité du mot de passe
function isPasswordValid(password) {
  return passwordRegex.test(password);
}

// Regex pour valider les numéros de téléphone
const phonePattern = /^\d{3}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/;

// Fonction pour vérifier la validité du numéro de téléphone
function tel(phone) {
  return phonePattern.test(phone);
}

function Inscription() {
  // Hook de gestion du formulaire
  const { handleSubmit, register, formState: { errors }, watch } = useForm();
  const navigate = useNavigate();

  // États pour les données de villes, communes, quartiers et sélection
  const [villes, setVilles] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [quartiers, setQuartiers] = useState([]);
  const [selectedVille, setSelectedVille] = useState('');
  const [selectedCommune, setSelectedCommune] = useState('');
  const [selectedQuartier, setSelectedQuartier] = useState('');

  // États pour le type de formulaire et le rôle utilisateur
  const [formType, setFormType] = useState('client');
  const [userRole, setUserRole] = useState('menage');
  const [fileNames, setFileNames] = useState({
    idFile: `Pièce d'identité`,
    logoFile: 'Logo'
  });

  // Références pour les fichiers
  const idFileRef = useRef(null);
  const logoFileRef = useRef(null);

  // Fetch des données de villes au montage du composant
  useEffect(() => {
    fetch('https://ville-propre.onrender.com/villes')
      .then(response => response.json())
      .then(data => {
        console.log('Villes : ', data);
        setVilles(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des villes:', error));
  }, []);

  // Fonction pour gérer le changement de ville
  const handleVilleChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedVille(value);
    setSelectedCommune(''); 
    setSelectedQuartier('');

    fetch(`https://ville-propre.onrender.com/villes/${value}/communes`)
        .then(response => response.json())
        .then(data => {
            console.log('Communes : ', data);
            setCommunes(data);
        })
        .catch(error => console.error('Erreur lors de la récupération des communes:', error));
  }, []);

  // Fonction pour gérer le changement de commune
  const handleCommuneChange = useCallback((e) => {
    const value = e.target.value;
    setSelectedCommune(value);
    setSelectedQuartier('');

    fetch(`https://ville-propre.onrender.com/communes/${value}/quartiers`)
      .then(response => response.json())
      .then(data => {
        console.log('Quartiers : ', data);
        setQuartiers(data);
      })
      .catch(error => console.error('Erreur lors de la récupération des quartiers:', error));
  }, []);

  // Fonction pour gérer le changement de quartier
  const handleQuartierChange = useCallback((e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value)) {
      setSelectedQuartier(value);
    } else {
      setSelectedQuartier('');
    }
  }, []);

  // Fonction pour gérer le changement de rôle utilisateur
  const handleUserRoleChange = useCallback((event) => {
    setUserRole(event.target.value);
  }, []);

  // Fonction pour gérer le changement de fichiers
  const handleFileChange = useCallback((event, fileType) => {
    if (event.target.files.length > 0) {
      setFileNames(prevFileNames => ({
        ...prevFileNames,
        [fileType]: event.target.files[0].name
      }));
    } else {
      setFileNames(prevFileNames => ({
        ...prevFileNames,
        [fileType]: 'Aucun fichier'
      }));
    }
  }, []);

  // État pour indiquer si le formulaire est en cours de soumission
  const [isLoading, setIsLoading] = useState(false);

  // Fonction de soumission du formulaire
  const onSubmitEnvois = useCallback(async (data) => {
    console.log('Données soumises :', data);
    try{
    // Validation du numéro de téléphone
    if (!tel(data.telClt || data.telPME)) {
      toast.error("Numéro de téléphone invalide");
      return;
    }

    // Validation de la correspondance des mots de passe
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
      // Ajout des données spécifiques au formulaire PME
      formData.append('quartier_id', quartierId);
      formData.append('nom_prenom', data.nomsPME);
      formData.append('tel', data.telPME);
      formData.append('genre', data.genrePME);
      formData.append('email', data.mailPME);
      formData.append('mot_de_passe', data.mdpPME);

      // Ajout des fichiers si disponibles
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

      formData.append('create_at', new Date().toISOString());
      formData.append('update_at', new Date().toISOString());
      formData.append('is_actif', true);
    } else {
      // Ajout des données spécifiques au formulaire client
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

    console.log(formData);
    setIsLoading(true);

    // URL de l'API en fonction du type de formulaire
    const apiUrl = formType === 'pme' ? 'https://ville-propre.onrender.com/pme' : 'https://ville-propre.onrender.com/client';

    try {
      console.log('Envoi des données à l\'API...');
      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      console.log('Réponse de l\'API :', response);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Réponse de l\'API :', result);
        toast.success("Inscription réussie !");
        navigate('/connexion');
      } else {
        throw new Error('Erreur lors de la soumission du formulaire.');
      }
    } catch (error) {
      console.error('Erreur lors de la soumission du formulaire:', error);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  }
  catch(erreur){
    console.error("Erreur lors de la soumission du formulaire : ",erreur);
  }
  }, [formType, navigate, userRole]);

  return (
    <div className="stack-container">
      <div className="right-container">
        <h2 className="title">Inscription</h2>
        <img src="src/assets/background.avif" className="logoInscription" alt="background" />
      </div>
      
      <div className="box-container">
        <div className="lg">
          <img src="src/assets/logo.jpg" id="lg" />
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
          <form action="" onSubmit={handleSubmit(onSubmitEnvois)}>


            <div className={`form-container ${userRole === 'entreprise' ? 'form-container2' : ''}`}>

            <div className={`input-container ${userRole === 'menage' ? 'input-containerMENAGE' : ''}`}> 
              <select name="role" id="role" className="type selectIns" {...register("roleClt")} onChange={handleUserRoleChange}  required>
                <option value="menage">Ménage</option>
                <option value="entreprise">Entreprise</option>
                {errors.roleClt && <span className="error-message">{errors.roleCtl.message}</span>}
              </select>
              
            </div>
            
            
              <div className="input-container">
                <i className='bx bxs-user' style={{ color: '#fdb024' }}></i>
                <input type="text" name="nom_prenom" className="noms inputIns" placeholder="Nom et Prénom(s)"
                  {...register("nomsClt", { required: "Veuillez saisir votre nom" })} />
                  {errors.nomsClt && <p className="error-message">{errors.nomsClt.message}</p>}
              </div>

              <div className="input-container">
                <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                <input type="email" name="email" id="mail" placeholder="E-mail" className="inputIns"
                  {...register("mailClt", { required: "Veuillez saisir votre email" })} />
                {errors.mailClt && <span className="error-message">{errors.mailClt.message}</span>}
              </div>
              <div className="input-container">
                <i className='bx bx-male-female' style={{ color: '#fdb024' }} ></i>
                <select name="genre" id="genre" className="genre selectIns" defaultValue='' {...register("genreClt")} required>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                  {errors.genreClt && <span className="error-message">{errors.genreClt.message}</span>}
                </select>
              </div>
              <div className="input-container">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <div className="adresse">
                  <select
                    id="ville"
                    value={selectedVille}
                    onChange={handleVilleChange}
                    className="selectIns"
                  >
                    <option value="ville">Ville</option>
                    {villes.map(ville => (
                      <option key={ville.id} value={ville.id}>{ville.ville}</option>
                    ))}
                  </select>
                </div>

                <div className="adresse">
                  <select
                      id="commune"
                      value={selectedCommune}
                      onChange={handleCommuneChange}
                      disabled={!selectedVille}
                      className="selectIns"
                    >
                      <option value="">Commune</option>
                      {communes.map(commune => (
                        <option key={commune.id} value={commune.id}>{commune.commune}</option>
                      ))}
                  </select>
                </div>

                <div >
                  <select
                    id="quartierClt"
                    {...register("quartierClt", { required: "Ce champ est obligatoire" })}
                    value={selectedQuartier}
                    name="quartier_id"
                    className="selectIns"
                    onChange={(e) => {
                      handleQuartierChange(e);
                      console.log('Quartier sélectionné:', e.target.value); // Ajoutez cette ligne
                    }}
                    disabled={!selectedCommune}
                  >
                    <option value="quartier">Quartier</option>
                    {quartiers.map(quartier => (
                      <option key={quartier.id} value={quartier.id}>{quartier.quartier}</option>
                    ))}
                                    
                  </select>
                </div>
              </div>



              <div className="input-container">
                <i className='bx bxs-phone' style={{ color: '#fdb024' }}></i>
                <span style={{ marginRight: '5px' }}>+224</span>
                <input type="tel" name="telClt" id="telClt" placeholder="Numéro de téléphone" className="inputIns"
                  {...register("telClt", { required: "Entrez votre numéro de téléphone", validate: value => tel(value) || "Numéro de téléphone invalide" })} />
                {errors.telClt && <span className="error-message">{errors.telClt.message}</span>}
              </div>
              <div className="input-container">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <input type="file" name="copie_pi" id="copie_pi" className="file-upload inputIns"
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
                    <input type="text" name="nom_entreprise" className="nom inputIns" placeholder="Nom de l'entreprise"
                      {...register("nomEntreprise")} required/>
                  </div>

                  <div className="input-container">
                    <i className='bx bxs-image' style={{ color: '#fdb024' }}></i>
                    <input type="file" name="logo_entreprise" id="logo_entreprise" className="file-upload inputIns"
                      ref={logoFileRef} // Utilisation de ref pour le fichier du logo
                      onChange={(e) => handleFileChange(e, 'logoFile')} />
                    <label htmlFor="logo_entreprise" className="file-upload-label">
                      {fileNames.logoFile}
                    </label>
                  </div>
                  <div className="input-container">
                    <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="num_rccm" className="registration inputIns" placeholder="Numéro d'enregistrement"
                      {...register("nEntreprise")} required />
                  </div>
                </>
              )}
              <div className="input-container">
              
                <i className='bx bxs-lock' style={{ color: '#fdb024' }}></i>
                <input type="password" name="mdp" id="mdp" placeholder="Mot de passe" className="inputIns"
                  {...register("mdpClt", {
                    required: "Entrez votre mot de passe",
                    minLength: { value: 8, message: "Entrez un mot de passe de 8 caractères minimum" },
                    validate: value => isPasswordValid(value) || "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
                  })} />
                {errors.mdpClt && <p className="error-message">{errors.mdpClt.message}</p>}
              </div>
              <div className="input-container input-containerMDP">
                <i className='bx bxs-lock-alt' style={{ color: '#fdb024' }}></i>
                <input type="password" name="cmdp" id="cmdp" placeholder="Confirmation de mot de passe" className="inputIns"
                  {...register("cmdpClt", {
                    required: "Confirmez votre mot de passe",
                    minLength: { value: 8, message: "Confirmez un mot de passe de 8 caratères minimum" }
                  })} />
              </div>
            </div>
            <div className="checkbox-container accept ">
              <input type="checkbox" name="validate" id="validate" className="inputIns"
                {...register("accept", { required: "Veuillez accepter les politiques de confidentialités!" })} />
              <label htmlFor="validate" className="labelPolitique">
                J'ai lu et j'accepte les <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="lienPolitique">politiques de confidentialité</a>
              </label>
            </div>
            <div className="divSub">
              <button type="submit" id="subClt" className="sub" disabled={isLoading}>S'inscrire</button>
            </div>
            
            {/* -------------------------------------------------------------------------------------------------------------- */}
            <div className="ins insEntreprise">
                <div className="divTextIconGoogle"><div className="cercle cercleGoogle"><i className="bx bxl-google google-icon"></i></div><p className="textInscrireAvecGoogle ">connexion avec google</p></div>
                <div className="divTextIconFacebook"><div className="cercle"><i className='bx bxl-facebook' style={{ color: '#1877F2', fontSize: '30px' }} ></i></div><p className="textInscrireAvecFacebook ">connexion avec facebook</p></div>
            </div>
          </form>
        ) : (
          <form action="" onSubmit={handleSubmit(onSubmitEnvois)}>
            <div className="form-container">
              {/* Contenu de la section PME */}
              <div className="input-container">
                <i className='bx bxs-user' style={{ color: '#fdb024' }}></i>
                <input type="text" name="nom_prenom" className="noms inputIns" placeholder="Nom et Prénom(s)"  {...register("nomsPME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                <input type="email" name="email" id="mail" className="inputIns" placeholder="E-mail"  {...register("mailPME")} required />
              </div>
              <div className="input-container input-container2">
                <i className='bx bx-male-female' style={{ color: '#fdb024' }} ></i>
                <select name="genre" id="genre" className="genre selectIns" defaultValue=""  {...register("genrePME")} required>
                  <option value="homme">Homme</option>
                  <option value="femme">Femme</option>
                </select>
              </div>

              <div className="input-container input-container2">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <div className="adresse">
                  <select
                    id="ville"
                    value={selectedVille}
                    className="selectIns  selectIns1"
                    onChange={handleVilleChange}
                  >
                    <option value="ville">Ville</option>
                    {villes.map(ville => (
                      <option key={ville.id} value={ville.id}>{ville.ville}</option>
                    ))}
                  </select>
                </div>

                <div className="adresse">
                  <select
                    id="commune"
                    value={selectedCommune}
                    onChange={handleCommuneChange}
                    disabled={!selectedVille} // Désactiver si aucune ville sélectionnée
                    className="selectIns   selectIns2"
                  >
                    <option value="commune">Commune</option>
                    {communes.map(commune => (
                      <option key={commune.id} value={commune.id}>{commune.commune}</option>
                    ))}
                  </select>
                </div>

                <div >
                  <select
                    id="quartierPME"
                    {...register("quartierPME", { required: "Ce champ est obligatoire" })}
                    value={selectedQuartier}
                    name="quartier_id"
                    className="selectIns   selectIns3"
                    onChange={(e) => {
                      handleQuartierChange(e);
                      console.log('Quartier sélectionné:', e.target.value); // Ajoutez cette ligne
                    }}
                    disabled={!selectedCommune}
                  >
                    <option value="quartier">Quartier</option>
                    {quartiers.map(quartier => (
                      <option key={quartier.id} value={quartier.id}>{quartier.quartier}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="input-container">
                <i className='bx bxs-phone' style={{ color: '#fdb024' }}></i>
                <span style={{ marginRight: '5px' }}>+224</span>
                <input type="tel" name="tel" id="telPME" placeholder="Numéro de téléphone" className="inputIns"
                  {...register("telPME")} required/>
              </div>
              <div className="input-container">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <input type="file" name="copie_pi" id="copie_pi" className="file-upload inputIns"
                  ref={idFileRef} // Utilisation de ref pour le fichier d'identité
                  onChange={(e) => handleFileChange(e, 'idFile')} />
                <label htmlFor="copie_pi" className="file-upload-label">
                  {fileNames.idFile}
                </label>
              </div>
              <div className="input-container">
                <i className='bx bxs-building' style={{ color: '#fdb024' }}></i>
                <input type="text" name="nom_pme" className="nom inputIns" placeholder="Nom de la PME"
                  {...register("nomPME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                <input type="text" name="num_enregistrement" className="registration inputIns"
                  placeholder="Numéro d'enregistrement"  {...register("numEnregistrementPME")} required />
              </div>
              <div className="input-container">
                <i className='bx bxs-image' style={{ color: '#fdb024' }}></i>
                <input type="file" name="logo_pme" id="logo_pme" className="file-upload inputIns"
                  ref={logoFileRef} // Utilisation de ref pour le fichier du logo
                  onChange={(e) => handleFileChange(e, 'logoFile')} />
                <label htmlFor="logo_pme" className="file-upload-label">
                  {fileNames.logoFile}
                </label>
              </div>
              <div className="input-container">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                <input type="zone" name="zone_intervention" className="zone inputIns" placeholder="Zone d'intervention"
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
                <input type="text" name="tarif_mensuel" className="tarif-mensuel inputIns" placeholder="Tarif mensuel (en GNF)"
                  {...register("tarifMensuelPME", { required: "Entrez le tarif mensuel" })} />
              </div>
              <div className="input-container">
                <i className='bx bx-euro' style={{ color: '#fdb024' }}></i>
                <input type="text" name="tarif_abonnement" className="tarif-abonnement inputIns" placeholder="Tarif abonnement (en GNF)"
                  {...register("tarifAbonnementPME", { required: "Entrez le tarif abonnement" })} />
              </div>
              <div className="input-container">
                <i className='bx bxs-lock' style={{ color: '#fdb024' }}></i>
                <input type="password" name="mot_de_passe" id="mdpPME" className="inputIns" placeholder="Mot de passe"
                  {...register("mdpPME", {
                    required: "Entrez votre mot de passe",
                    minLength: { value: 8, message: "Entrez un mot de passe de 8 caractères minimum" },
                    validate: value => isPasswordValid(value) || "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
                  })} />
                {errors.mdpPME && <p>{errors.mdpPME.message}</p>}
              </div>
              <div className="input-container">
                <i className='bx bxs-lock-alt' style={{ color: '#fdb024' }}></i>
                <input type="password" name="cmdpPME" id="cmdpPME" className="inputIns" placeholder="Confirmation de mot de passe"
                  {...register("cmdpPME", {
                    required: "Confirmez votre mot de passe",
                    validate: value => value === watch("mdpPME") || "Les mots de passe doivent correspondre"
                  })} />
              </div>

              <div className="checkbox-container">
                <input type="checkbox" name="validate" id="validate" className="inputIns" required />
                <label htmlFor="validate" className="labelPolitique">
                  J'ai lu et j'accepte les <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="lienPolitique">politiques de confidentialité</a>
                </label>
              </div>
              <div>
                <button type="submit" id="subPME" className="sub" disabled={isLoading}>
              {isLoading ? 'Chargement...' : 'S\'inscrire'}
              </button>
              </div>
            </div>
          </form>

        )}
        <div className={`divLogin-link ${userRole === 'menage' ? 'divLogin-link2' : ''}`}>
            <a href='/connexion' className="login-link" >Vous êtes déjà inscrit? Connectez-vous</a>
        </div>
      </div>
    </div>
  );
}

export default Inscription;