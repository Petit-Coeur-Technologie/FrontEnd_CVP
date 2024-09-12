import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './inscription.css'
import "boxicons/css/boxicons.min.css";

const passwordPme = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
const phonePatternPme = /^\d{3}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/;

function PmeForm({ onSubmit, isLoading, idFileRef, logoFileRef}) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [pmeVilles, setPmeVilles] = useState([]);
    const [pmeCommunes, setPmeCommunes] = useState([]);
    const [pmeQuartiers, setPmeQuartiers] = useState([]);
    const [selectedPmeVille, setSelectedPmeVille] = useState('');
    const [selectedPmeCommune, setSelectedPmeCommune] = useState('');
    const [selectedPmeQuartier, setSelectedPmeQuartier] = useState('');
    // États pour les fichiers spécifiques du formulaire PME
    const [pmeIdFile, setPmeIdFile] = useState("Pièce d'identité");
    const [pmeLogoFile, setPmeLogoFile] = useState("Logo");

    useEffect(() => {
        fetch('https://ville-propre.onrender.com/villes')
            .then(response => response.json())
            .then(data => setPmeVilles(data))
            .catch(error => console.error('Erreur lors de la récupération des villes:', error));
    }, []);

    const handleVilleChange = (e) => {
        const value = e.target.value;
        setSelectedPmeVille(value);
        setSelectedPmeCommune('');
        setSelectedPmeQuartier('');

        fetch(`https://ville-propre.onrender.com/villes/${value}/communes`)
            .then(response => response.json())
            .then(data => setPmeCommunes(data))
            .catch(error => console.error('Erreur lors de la récupération des communes:', error));
    };

    const handleCommuneChange = (e) => {
        const value = e.target.value;
        setSelectedPmeCommune(value);
        setSelectedPmeQuartier('');

        fetch(`https://ville-propre.onrender.com/communes/${value}/quartiers`)
            .then(response => response.json())
            .then(data => setPmeQuartiers(data))
            .catch(error => console.error('Erreur lors de la récupération des quartiers:', error));
    };

    const handleQuartierChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setSelectedPmeQuartier(!isNaN(value) ? value : '');
    };

    // Fonction de gestion des changements de fichier pour PME
    const handlePmeFileChange = (event, fileType) => {
        if (fileType === "idFile" && event.target.files.length > 0) {
            setPmeIdFile(event.target.files[0].name);
        } else if (fileType === "logoFile" && event.target.files.length > 0) {
            setPmeLogoFile(event.target.files[0].name);
        }
    };

    const telPme = (phone) => phonePatternPme.test(phone);
    const isPasswordValidPme = (password) => passwordPme.test(password);

    return (
        <form action="" onSubmit={handleSubmit(onSubmit)}>
            <div className="form-container">
                {/* Contenu de la section PME */}
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-user' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="nomsPME" className="noms inputIns" placeholder="Nom et Prénom(s)"  {...register("nomsPME")} required />
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                    <input type="email" name="mailPME" id="mail" className="inputIns" placeholder="E-mail"  {...register("mailPME")} required />
                </div>
                <div className="input-container input-container2 input-containerSelect input-containerTablette">
                    <i className='bx bx-male-female' style={{ color: '#fdb024' }} ></i>
                    <select name="genrePME" id="genre" className="genre selectIns" defaultValue=""  {...register("genrePME")} required>
                        <option value="homme">Homme</option>
                        <option value="femme">Femme</option>
                    </select>
                </div>
 {/* -------- Pour la selection de la ville, la commun et le quartier si c'est une PME -------------------------------*/}
                {/* Pour la selection de la ville */}
                <div className="input-container input-container2 input-containerSelect input-containerTablette">
                <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                    <div className="adresse">
                        <select
                            id="ville"
                            value={selectedPmeVille}
                            onChange={(e) => handleVilleChange(e, 'pme')}
                            className="selectIns selectIns1"
                        >
                            <option value="ville">Ville</option>
                            {pmeVilles.map(ville => (
                                <option key={ville.id} value={ville.id}>{ville.ville}</option>
                            ))}
                        </select>
                        </div>
                    </div>

 {/* Pour la selection de la commun */}
 <div className="input-container input-container2 input-containerSelect input-containerTablette">
              <i className='bx bx-home'></i>
                    <div className="adresse">
                        <select
                            id="commune"
                            value={selectedPmeCommune}
                            name="communePME"
                            onChange={handleCommuneChange}
                            disabled={!selectedPmeVille} // Désactiver si aucune ville sélectionnée
                            className="selectIns   selectIns2"
                        >
                            <option value="commune">Commune</option>
                            {pmeCommunes.map(commune => (
                                <option key={commune.id} value={commune.id}>{commune.commune}</option>
                            ))}
                        </select>
                    </div>
                    </div>
 {/* Pour la selection du quartier */}
 <div className="input-container input-container2 input-containerSelect input-containerTablette">
                <i className='bx bx-home-alt-2'></i>
                 <div className="adresse">
                        <select
                            id="quartierPME"
                            {...register("quartierPME", { required: "Ce champ est obligatoire" })}
                            value={selectedPmeQuartier}
                            name="quartierPME"
                            className="selectIns selectIns3"
                            onChange={(e) => {
                                handleQuartierChange(e);
                                console.log('Quartier sélectionné:', e.target.value); // Ajoutez cette ligne
                            }}
                            disabled={!selectedPmeCommune}
                        >
                            <option value="quartier">Quartier</option>
                            {pmeQuartiers.map(quartier => (
                                <option key={quartier.id} value={quartier.id}>{quartier.quartier}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* ------------------------------------------------------------------------------------------------- */}

              <div className="input-container input-containerTablette">
                    <i className='bx bxs-phone' style={{ color: '#fdb024' }}></i>
                    <span style={{ marginRight: '5px' }}>+224</span>
                    <input type="tel" name="telPME" id="telPME" placeholder="Numéro de téléphone" className="inputIns"
                        {...register("telPME", { required: "Entrez votre numéro de téléphone", validate: value => telPme(value) || "Numéro de téléphone invalide" })} />
                    {errors.telClt && <span className="error-message">{errors.telClt.message}</span>}
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                    <input type="file" name="copie_pi" id="copie_pi_pme" className="file-upload inputIns"
                       ref={idFileRef} onChange={(e) => handlePmeFileChange(e, 'idFile')} />
                    <label htmlFor="copie_pi_pme" className="file-upload-label">
                        {pmeIdFile}
                    </label>
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-building' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="nom_pme" className="nom inputIns" placeholder="Nom de la PME"
                        {...register("nomPME")} required />
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="numEnregistrementPME" className="registration inputIns"
                        placeholder="Numéro d'enregistrement"  {...register("numEnregistrementPME")} required />
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-image' style={{ color: '#fdb024' }}></i>
                    <input type="file" name="logo_pme" id="logo_pme" className="file-upload inputIns"
                       ref={logoFileRef} onChange={(e) => handlePmeFileChange(e, 'logoFile')} />
                    <label htmlFor="logo_pme" className="file-upload-label">
                        {pmeLogoFile}
                    </label>
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                    <input type="zone" name="zone_intervention" className="zone inputIns" placeholder="Zone d'intervention"
                        {...register("zonePME")} required />
                </div>
                <div className="text-container input-containerTablette">
                    <textarea name="description" id="desc" className="desc" placeholder="Description de la PME"
                        {...register("descPME", {
                            required: "Confirmez votre mot de passe",
                            maxLength: { value: 500, message: "Veuillez saisir une description de 500 caractères maximum" }
                        })} ></textarea>
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bx-euro' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="tarif_mensuel" className="tarif-mensuel inputIns" placeholder="Tarif mensuel (en GNF)"
                        {...register("tarifMensuelPME", { required: "Entrez le tarif mensuel" })} />
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bx-euro' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="tarif_abonnement" className="tarif-abonnement inputIns" placeholder="Tarif abonnement (en GNF)"
                        {...register("tarifAbonnementPME", { required: "Entrez le tarif abonnement" })} />
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-lock' style={{ color: '#fdb024' }}></i>
                    <input type="password" name="mdpPME" id="mdpPME" className="inputIns" placeholder="Mot de passe"
                        {...register("mdpPME", {
                            required: "Entrez votre mot de passe",
                            minLength: { value: 8, message: "Entrez un mot de passe de 8 caractères minimum" },
                            validate: value => isPasswordValidPme(value) || "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
                        })} />
                    {errors.mdpPME && <p>{errors.mdpPME.message}</p>}
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-lock-alt' style={{ color: '#fdb024' }}></i>
                    <input type="password" name="cmdpPME" id="cmdpPME" className="inputIns" placeholder="Confirmez le mot de passe"
                        {...register("cmdpPME", {
                            required: "Confirmez votre mot de passe",
                            validate: value => value === watch("mdpPME") || "Les mots de passe doivent correspondre"
                        })} />
                </div>
                <div className="checkbox-container checkbox-containerPme input-containerTablette input-containerTablettePolitique">
                    <input type="checkbox" name="validate" id="validate" className="inputIns inputInsPme" required />
                    <label htmlFor="validate" className="labelPolitique labelPolitiquePme">
                        J'ai lu et j'accepte les <a href="/politique-de-confidentialite" target="_blank" rel="noopener noreferrer" className="lienPolitique">politiques de confidentialité</a>
                    </label>
                </div>
                <div className="divSub divSubPme">
                    <button type="submit" id="subPME" className="sub subPme " disabled={isLoading}>
                        {isLoading ? 'Chargement...' : 'S\'inscrire'}
                    </button>
                </div>
            </div>
        </form>
    );
};

export default PmeForm;
