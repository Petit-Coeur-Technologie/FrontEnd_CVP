import './pageErreur.css';
import React from 'react';

const PageErreur = ({onReload}) =>{
    return(
        <div className='error'>
            <img src="" alt="" />
            <span>Oups..., il semble qu'il y ait un problème avec la connexion. Veuillez vérifier votre connexion internet.</span>
            <button onClick={onReload}> Recharger la page</button>
        </div>
    );
};

export default PageErreur;