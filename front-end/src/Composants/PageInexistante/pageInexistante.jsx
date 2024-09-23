import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const PageInexistante=()=>{
        const navigate = useNavigate();
        const location = useLocation();
        
        console.log("Location state:", location.state); // Ajoute ceci
    
        const previousPath = location.state?.from || '/';
    
        const retour = () => {
            navigate(previousPath);
        };
    
        return (
            <div className="principal">
                <h1>Page non trouvée!</h1>
                <p>La page que vous cherchez n'existe pas.</p>
                <button onClick={retour}>Retour</button>
            </div>
        );
    };
    

export default PageInexistante;