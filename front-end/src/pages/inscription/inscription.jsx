import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./inscription.css";
import myLogo from '/src/assets/logo_provisoire.png';
import background from '/src/assets/background.avif';
import "boxicons/css/boxicons.min.css";
import { toast } from 'react-hot-toast';
import ClientForm from "./ClientForm";
import PmeForm from "./PmeForm"
import CheckPhone from '../../Composants/VerifierTelephone/checkPhone';

//New imports
import emailjs from '@emailjs/browser'


const formDataClient = new FormData();
let telClient = ''

function Inscription() {
  const navigate = useNavigate();
  const [formType, setFormType] = useState('client');
  const [isLoading, setIsLoading] = useState(false);
  const [userRole, setUserRole] = useState('menage'); // Ajoutez ceci pour suivre le role d'utilisateur

  const idFileRef = useRef(null);
  const logoFileRef = useRef(null);

  

  const copieFileRef = useRef(null);
  const entrepriseFileRef = useRef(null);

  const telPme = (phone) => /^\d{3}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/.test(phone); // Validation du numéro de téléphone PME
  const telClt = (phone) => /^\d{3}[-\s]?\d{2}[-\s]?\d{2}[-\s]?\d{2}$/.test(phone); // Validation du numéro de téléphone Client

  //Ajout lamine
  const [emailChecking, setEmailChecking] = React.useState(false)
  const [telChecking, setTelChecking] = React.useState(false)
  const [inscriptionValid, setInscriptionValid] = React.useState(false)
  const idRCCMRef = useRef(null);

  const inputEmailRef = React.useRef()
  const inputTelRef = React.useRef()

  const otpEmail = 5543910  // A remplacer par un code otp générer par l'api
  const otpTel = 4585213 //A remplacer par un code otp générer par l'api

   const handleUserPhoneChecked = () => {
    return
  }

  const templateParams = {
    'email_to': 'destinataire@gmail.com', //Email Vérifié
    'email_from': 'lamined34@gmail.com',
    'message': otpEmail,

  }

  const sendEmail = () => {
    console.log('email sent')
    emailjs.send('service_auu8ayd', 'template_avp49k9', templateParams, 'KMuTt-zB7qtB43wFs')

  }

  const handleValiderEmail = () => {
    console.log('userOtpIntput: ' + inputEmailRef.current.value)
    console.log('otpEmail: ' + otpEmail)
    const isvalid = (otpEmail == inputEmailRef.current.value)

    console.log('isValid: ' + isvalid)

    setEmailChecking(isvalid)
  }

  //Fin Ajout Lamine

  const onSubmitClient = async (data) => {
    console.log('Soumission du formulaire Client avec les données:', data);

    // Vérification et validation des données du client
    if (!telClt(data.telClt)) {
      toast.error("Numéro de téléphone invalide pour le client.");
      return;
    }

    if (data.mdpClt !== data.cmdpClt) {
      toast.error("Les mots de passe client ne sont pas identiques.");
      return;
    }

    // Construction des données du formulaire Client
    const formData = new FormData();
    let quartierIdClt = parseInt(data.quartierClt, 10);

    if (isNaN(quartierIdClt)) {
      toast.error("Quartier invalide pour le client.");
      return;
    }

    formData.append('role', data.roleClt);
    formData.append('quartier_id', quartierIdClt);
    formData.append('nom_prenom', data.nomsClt);
    formData.append('tel', data.telClt);
    formData.append('genre', data.genreClt);
    formData.append('email', data.mailClt);
    formData.append('mot_de_passe', data.mdpClt);

    formData.append('create_at', new Date().toISOString());
    formData.append('update_at', new Date().toISOString());
    formData.append('is_actif', true);

    if (copieFileRef.current && copieFileRef.current.files.length > 0) {
      formData.append('copie_pi', copieFileRef.current.files[0]);
    } else {
      toast.error("Veuillez télécharger une copie de votre pièce d'identité.");
      return;
    }

    if (userRole === "entreprise") {
      formData.append('nom_entreprise', data.nomEntreprise);
      formData.append('num_rccm', data.nEntreprise);
      if (entrepriseFileRef.current && entrepriseFileRef.current.files.length > 0) {
        formData.append('logo_entreprise', entrepriseFileRef.current.files[0]);
      }
    }
    setIsLoading(true);

    const urlClt = 'https://ville-propre.onrender.com/client';

    try {
      console.log('Envoi des données à l\'API...');
      const response = await fetch(urlClt, {
        method: 'POST',
        body: formData
      });

      console.log('Réponse de l\'API :', response);

      if (response.ok) {
        const result = await response.json();
        console.log('Réponse de l\'API (données) :', result);
        toast.success("Inscription réussie");

        telClient = data.telClt
        setTelChecking(true)
        console.log("telephone: "+telClient)
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

    /* Ajout lamine */
    if (idRCCMRef.current && idRCCMRef.current.files.length > 0) {
      console.log('rccm_pme en attente!voir ligne en dessous dans le code')
      //formData.append('rccm_pme', idRCCMRef.current.files[0]); //To Do retire les commentaire pour ajouter l'attribue rccm pme dans le formulaire envoyer à la base de données
    } else {
      toast.error("Veuillez télécharger la photo de votre RCCM.");
      return;
    }
    /* fin */

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

        setTelChecking(true)
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
    <div className="stack-container">
      <div className="right-container" style={{ backgroundImage: `url(${background})` }}>
        <h2 className="title">Inscription</h2>
        { /*<img src={background} className="logoInscription" alt="" />*/}
      </div>

      <div className="box-container inscriptionForm-wrapper">
        <div className="lg">
          <Link to="/"><img title="Click pour revenir sur l'acceuil" src={myLogo} id="lg" /></Link>
        </div>

        {
          telChecking == true ? (
            <>
              <div className="containerOtp">
                <CheckPhone tel={telClient} onPhoneChecked={handleUserPhoneChecked} />
              </div>
            </>

          ) : (
            <>
              {
                emailChecking == true ? (
                  <>
                    <label htmlFor="checkEmail">Entrer le code: </label>
                    <input ref={inputEmailRef} type="text" />
                    <button onClick={handleValiderEmail}>Valider</button>
                  </>
                ) : (
                  <>
                    <div className="button-group">
                      <button className="client" onClick={() =>
                        setFormType('client')} style={{ opacity: formType === 'client' ? 1 : 0.5 }}>
                        Client
                      </button>

                      <button className='pme' onClick={() => setFormType('pme')}
                        style={{ opacity: formType === 'pme' ? 1 : 0.5 }}>
                        PME
                      </button>
                    </div>

                    {formType === 'client' ? (
                      <ClientForm
                        onSubmitClt={onSubmitClient}
                        isLoading={isLoading}
                        copieFileRef={copieFileRef}
                        entrepriseFileRef={entrepriseFileRef}
                        userRole={userRole}  // Passez userRole comme prop
                        onUserRoleChange={setUserRole}  // Ajoutez ceci pour changer le role d'utilisateur
                      />
                    ) : (
                      <PmeForm 
                        onSubmit={onSubmitPme} 
                        isLoading={isLoading} 
                        idFileRef={idFileRef} 
                        logoFileRef={logoFileRef} 
                        idRCCMRef= {idRCCMRef}
                      />
                    )}
                    <div className={`divLogin-link ${userRole === 'menage' ? 'divLogin-linkPme' : ''}`}>
                      <p> Vous êtes déjà inscrit?  <a href='/connexion' className="login-link" >Connectez-vous</a></p>
                    </div>
                  </>
                )
              }
            </>
          )
        }

        <div className="backtohometext_wrapper">
          <p> <a href="/">Retour à l'Acceuil</a></p>
        </div>
      </div>
    </div>
  );
}



export default Inscription;