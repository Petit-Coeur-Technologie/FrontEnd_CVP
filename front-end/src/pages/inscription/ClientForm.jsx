import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import './inscription.css'
import "boxicons/css/boxicons.min.css";

const passwordClient = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]).{8,}$/;
const phonePatternClt = /^\d{3}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/;

function ClientForm({ onSubmitClt, isLoading, copieFileRef, entrepriseFileRef, userRole, onUserRoleChange }) {
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const [clientVilles, setClientVilles] = useState([]);
    const [clientCommunes, setClientCommunes] = useState([]);
    const [clientQuartiers, setClientQuartiers] = useState([]);
    const [selectedClientVille, setSelectedClientVille] = useState('');
    const [selectedClientCommune, setSelectedClientCommune] = useState('');
    const [selectedClientQuartier, setSelectedClientQuartier] = useState('');
    const [cltIdFile, setCltIdFile] = useState("Pièce d'identité");
    const [cltLogoFile, setCltLogoFile] = useState("Logo d'entreprise");

    useEffect(() => {
        fetch('https://ville-propre.onrender.com/villes')
            .then(response => response.json())
            .then(data => setClientVilles(data))
            .catch(error => console.error('Erreur lors de la récupération des villes:', error));
    }, []);

    const handleVilleChange = (e) => {
        const value = e.target.value;
        setSelectedClientVille(value);
        setSelectedClientCommune('');
        setSelectedClientQuartier('');

        fetch(`https://ville-propre.onrender.com/villes/${value}/communes`)
            .then(response => response.json())
            .then(data => setClientCommunes(data))
            .catch(error => console.error('Erreur lors de la récupération des communes:', error));
    };

    const handleCommuneChange = (e) => {
        const value = e.target.value;
        setSelectedClientCommune(value);
        setSelectedClientQuartier('');

        fetch(`https://ville-propre.onrender.com/communes/${value}/quartiers`)
            .then(response => response.json())
            .then(data => setClientQuartiers(data))
            .catch(error => console.error('Erreur lors de la récupération des quartiers:', error));
    };

    const handleQuartierChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setSelectedClientQuartier(!isNaN(value) ? value : '');
    };


    const handleFichiers = (event, fileType) => {
        if (fileType === "idFileClt" && event.target.files.length > 0) {
            setCltIdFile(event.target.files[0].name);
        } else if (fileType === "logoFileClt" && event.target.files.length > 0) {
            setCltLogoFile(event.target.files[0].name);
        }
    };

    const telClt = (phone) => phonePatternClt.test(phone);
    const isPasswordValidClt = (password) => passwordClient.test(password);

    return (
        <form onSubmit={handleSubmit(onSubmitClt)}>
           <div className={`form-container ${userRole === 'entreprise' ? 'form-container2' : ''}`}>
           <div className={`input-container ${userRole === 'menage' ? 'input-containerMENAGE' : ''}`}> 
                    <select name="role" id="role" className="type selectIns" {...register("roleClt")} value={userRole} onChange={(e) => onUserRoleChange(e.target.value)} required>
                        <option value="menage">Ménage</option>
                        <option value="entreprise">Entreprise</option>
                    </select>
                </div>

                <div className="input-container input-containerTablette">
                    <i className='bx bxs-user' style={{ color: '#fdb024' }}></i>
                    <input type="text" name="nom_prenom" className="noms inputIns" placeholder="Nom et Prénom(s)"
                        {...register("nomsClt", { required: "Veuillez saisir votre nom" })} />
                </div>
                {errors.nomsClt && <p className="error-message">{errors.nomsClt.message}</p>}


                <div className="input-container input-containerTablette">
                    <i className='bx bxs-envelope' style={{ color: '#fdb024' }}></i>
                    <input type="email" name="email" id="mail" placeholder="E-mail" className="inputIns"
                        {...register("mailClt", { required: "Veuillez saisir votre email" })} />
                    {errors.mailClt && <span className="error-message">{errors.mailClt.message}</span>}
                </div>
                <div className="input-container input-containerSelect input-containerTablette">
                    <i className='bx bx-male-female' style={{ color: '#fdb024' }} ></i>
                    <select name="genre" id="genre" className="genre selectIns" defaultValue='' {...register("genreClt")} required>
                        <option value="homme">Homme</option>
                        <option value="femme">Femme</option>
                        {errors.genreClt && <span className="error-message">{errors.genreClt.message}</span>}
                    </select>
                </div>
                 {/* -------- Pour la selection de la ville, la commun et le quartier si c'est un Client -------------------------------*/}
                {/* Pour la selection de la ville */}
              <div className="input-container input-containerSelect input-containerTablette">
                    <i className='bx bxs-home' style={{ color: '#fdb024' }}></i>
                    <div className="adresse">
                        <select
                            id="ville"
                            value={selectedClientVille}
                            onChange={(e) => handleVilleChange(e, 'client')}
                            className="selectIns"
                        >
                            <option value="ville">Ville</option>
                            {clientVilles.map(ville => (
                                <option key={ville.id} value={ville.id}>{ville.ville}</option>
                            ))}
                        </select>

                        </div>
                        </div>
                        <div className="input-container input-containerSelect input-containerTablette">
                        <i class='bx bx-home'></i>
                    <div className="adresse">
                        <select
                            id="commune"
                            value={selectedClientCommune}
                            name="communeClt"
                            onChange={handleCommuneChange}
                            disabled={!selectedClientVille} // Désactiver si aucune ville sélectionnée
                            className="selectIns   selectIns2"
                        >
                            <option value="commune">Commune</option>
                            {clientCommunes.map(commune => (
                                <option key={commune.id} value={commune.id}>{commune.commune}</option>
                            ))}
                        </select>
                        </div>
                        </div>
                        <div className="input-container input-containerSelect input-containerTablette">
                        <i class='bx bx-home-alt-2'></i>
                    <div >
                        <select
                            id="quartierClt"
                            {...register("quartierClt", { required: "Ce champ est obligatoire" })}
                            value={selectedClientQuartier || ''}
                            name="quartierClt"
                            className="selectIns selectIns3"
                            onChange={handleQuartierChange}
                            disabled={!selectedClientCommune}
                        >
                            <option value="">Quartier</option> {/* Changer la valeur à "" pour éviter une valeur par défaut incorrecte */}
                            {clientQuartiers.map(quartier => (
                                <option key={quartier.id} value={quartier.id}>{quartier.quartier}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-phone' style={{ color: '#fdb024' }}></i>
                    <span style={{ marginRight: '5px' }}>+224</span>
                    <input type="tel" name="tel" id="telClt" placeholder="Numéro de téléphone" className="inputIns"
                        {...register("telClt", { required: "Entrez votre numéro de téléphone", validate: value => telClt(value) || "Numéro de téléphone invalide" })} />
                    {errors.telClt && <span className="error-message">{errors.telClt.message}</span>}
                </div>
                <div className="input-container input-containerTablette">
                    <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                    <input type="file" name="copie_pi" id="copie_pi" className="file-upload inputIns"
                        ref={copieFileRef} // Utilisation de ref pour le fichier d'identité
                        onChange={(e) => handleFichiers(e, 'idFileClt')} />
                    <label htmlFor="copie_pi" className="file-upload-label">
                        {cltIdFile}
                    </label>
                </div>
                {/* Affichage conditionnel basé sur le type de client */}
                {userRole === "entreprise" && (
                    <>
                         <div className="input-container input-containerTablette">
                            <i className='bx bxs-building' style={{ color: '#fdb024' }}></i>
                            <input type="text" name="nom_entreprise" className="nom inputIns" placeholder="Nom de l'entreprise"
                                {...register("nomEntreprise")} required />
                        </div>

                        <div className="input-container input-containerTablette">
                            <i className='bx bxs-image' style={{ color: '#fdb024' }}></i>
                            <input type="file" name="logo_entreprise" id="logo_entreprise" className="file-upload inputIns"
                                ref={entrepriseFileRef} // Utilisation de ref pour le fichier du logo
                                onChange={(e) => handleFichiers(e, 'logoFileClt')} />
                            <label htmlFor="logo_entreprise" className="file-upload-label">
                                {cltLogoFile}
                            </label>
                        </div>
                        <div className="input-container input-containerTablette">
                            <i className='bx bxs-id-card' style={{ color: '#fdb024' }}></i>
                            <input type="text" name="num_rccm" className="registration inputIns" placeholder="Numéro d'enregistrement"
                                {...register("nEntreprise")} required />
                        </div>
                    </>
                )}
                 <div className="input-container input-containerTablette">
                    <i className='bx bxs-lock' style={{ color: '#fdb024' }}></i>
                    <input type="password" name="mdp" id="mdp" placeholder="Mot de passe" className="inputIns"
                        {...register("mdpClt", {
                            required: "Entrez votre mot de passe",
                            minLength: { value: 8, message: "Entrez un mot de passe de 8 caractères minimum" },
                            validate: value => isPasswordValidClt(value) || "Le mot de passe doit contenir au moins une lettre majuscule, une lettre minuscule, un chiffre et un caractère spécial"
                        })} />
                    {errors.mdpClt && <p className="error-message">{errors.mdpClt.message}</p>}
                </div>
                <div className="input-container input-containerMDP input-containerTablette">
                    <i className='bx bxs-lock-alt' style={{ color: '#fdb024' }}></i>
                    <input type="password" name="cmdpPME" id="cmdpPME" className="inputIns" placeholder="Confirmation de mot de passe"
                        {...register("cmdpClt", {
                            required: "Confirmez votre mot de passe",
                            validate: value => value === watch("mdpClt") || "Les mots de passe doivent correspondre"
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
                <button type="submit" id='subClt' className='sub' disabled={isLoading}>{isLoading ? 'Chargement...' : 'S\'inscrire'}</button>
            </div>
            {/* -------------------------------------------------------------------------------------------------------------- */}
            <div className="ins insEntreprise">
                <div className="divTextIconGoogle"><div className="cercle cercleGoogle"><i className="bx bxl-google google-icon"></i></div><p className="textInscrireAvecGoogle ">connexion avec google</p></div>
                <div className="divTextIconFacebook"><div className="cercle"><i className='bx bxl-facebook' style={{ color: '#1877F2', fontSize: '30px' }} ></i></div><p className="textInscrireAvecFacebook ">connexion avec facebook</p></div>
            </div>
        </form>
    );
}

export default ClientForm;
