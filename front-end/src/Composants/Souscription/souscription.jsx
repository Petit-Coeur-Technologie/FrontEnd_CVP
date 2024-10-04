import React from "react";
import './souscription.css'

function LoginModal({ onClose, onLogin }) {
    return (
        <div className="SouscriptionModal-overlay">
            <div className="SouscriptionModal-wrapper">
                <h2>Connexion requise</h2>
                <p>Vous devez être connecté pour vous abonner. Veuillez vous connecter ou créez un compte.</p>
                <button onClick={onLogin} className="souscriptionmodal-btn connexion-btn">Se connecter</button>
                <button onClick={onClose} className="souscriptionmodal-btn annuler-btn">Annuler</button>
            </div>
        </div>
    );
}

export default LoginModal;
