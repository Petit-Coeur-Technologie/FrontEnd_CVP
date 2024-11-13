import React from "react";
import './composantsGraphiques.css'

const ButtonVP = ({name, type='button', handleclick}) => {
    return (
        <button type={type} onClick={handleclick} className="buttonVP">{name}</button>
    )
}

export default ButtonVP;