import React from 'react';
import './ConfirmationAbonnement.css'; // Assurez-vous de créer un fichier CSS pour le style

const ConfirmationPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className='confirmation-popup'>
      <div className='popup-content'>
        <p>{message}</p>
        <button onClick={onConfirm}>Accepter</button>
        <button onClick={onCancel}>Refuser</button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
