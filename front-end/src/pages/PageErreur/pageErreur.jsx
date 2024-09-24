import './pageErreur.css';
import React from 'react';

const PageErreur = ({onReload}) =>{
    return(
        <div className='error'>
            <span>Nous avons rencontré un problème lors du chargement des informations. Vérifiez votre connexion puis réessayer.</span>
            <button onClick={onReload}> Recharger les informations</button>
        </div>
    );
};

export default PageErreur;