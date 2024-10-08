import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = ()=>{
    const getCookie =(name)=>{
        const value=`; ${document.cookie}`;
        const parts = value.split(`; ${name}`);
        if (parts.length === 2)return parts.pop().split(';').shift();
        return null;
    }
    const authToken = getCookie('authToken');

    return authToken? <Outlet/> : <Navigate to="/connexion"/>;
};

export default PrivateRoutes;