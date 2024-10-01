import './pageErreur.css';
import React from 'react';
import image from '/src/assets/pageErreur.png'

const PageErreur = ({onReload}) =>{
    return(
        <div className='error'>
            <img src={image} alt="" className='imageErreur'/>
            <span>Nous avons rencontré un problème lors du chargement des informations. Vérifiez votre connexion puis réessayer.</span>
            <button onClick={onReload} className='btnPageErreur'> Recharger les informations</button>
        </div>
    );
};

export default PageErreur;