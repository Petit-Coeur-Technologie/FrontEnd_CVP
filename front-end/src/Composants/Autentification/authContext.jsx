import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ enfants }) => {
    const [token, setToken] = useState(null);

    const connexion = (userToken) => {
        setToken(userToken);
    }
    const deconnexion = () => {
        setToken(null);
    }

    const isAuthenticated= !!token;

    return (
        <AuthContext.Provider value={{isAuthenticated,connexion,deconnexion}}>
{enfants}
        </AuthContext.Provider>
    )
};

export const useAuth=()=>{
    const context=useContext(AuthContext);
    if(!context){
        throw new Error("")
    }
}