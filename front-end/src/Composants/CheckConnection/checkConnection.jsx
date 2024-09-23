import React from "react";
import { Detector } from "react-detect-offline";
import noConnection from '/src/assets/noConnection.jpg'
import './checkConnection.css'

const CheckConnection = props => {
    const handleReload = () => {
        window.location.reload();
    };
    return (
        <>
            <Detector
                render={({ online }) => (
                    online ? props.children :
                        <div className="noConnection">
                            <h1>Vous êtes hors ligne</h1>
                            <img src={noConnection} alt="" className="ImgConnection" />
                            <h4>Veuillez vous connecter puis réessayer pour accéder à la page.</h4>
                            <button onClick={handleReload}>Recharger la page</button>
                        </div>
                )}
            />
        </>
    )
}

export default CheckConnection;