import React from "react";
import './souscription.css'

function LoginModal({ onClose, onLogin }) {
    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Connexion requise</h2>
                <p>Vous devez être connecté pour vous abonner. Veuillez vous connecter ou créez un compte.</p>
                <button onClick={onLogin} className="modal-btn">Se connecter</button>
                <button onClick={onClose} className="modal-btn">Annuler</button>
            </div>
        </div>
    );
}

export default LoginModal;
