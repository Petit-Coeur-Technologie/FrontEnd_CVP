import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ImgError from '/src/assets/errorPage.png'
import './pageInexistante.css'

const PageInexistante = () => {
    const navigate = useNavigate();
    const location = useLocation();

    console.log("Location state:", location.state);

    //Si location.state.from est un objet, récupère pathname, sinon prend le string from
    const previousPath = location.state?.from?.pathname;

    const retour = () => {
        if(location.state?.from?.pathname){
            navigate(previousPath );
        }else{
            window.history.back(); //Retour à la page précédente
        }
    };

    return (
        <div className="principal">
            <h1>Page non trouvée!</h1>
            <img src={ImgError} alt="" className="imgErreur" />
            <p>La page que vous cherchez n'existe pas.</p>
            <button onClick={retour}>Retour</button>
        </div>
    );
};


export default PageInexistante;