import React from "react";

export default function TypeForm({formType,setFormType}) {
    return(
        <div className="button-group">
        <button className="user" onClick={() =>
          setFormType('user')} style={{ opacity: formType === 'user' ? 1 : 0.5 }}>
          Utilisateur
        </button>

        <button className="pme" onClick={() => setFormType('pme')}
          style={{ opacity: formType === 'pme' ? 1 : 0.5 }}>
          PME
        </button>
      </div>
    )
}