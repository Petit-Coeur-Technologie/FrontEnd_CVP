import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PublicRoute=()=>{
    const getCookie =(name)=>{
        const value=`; ${document.cookie}`;
        const parts = value.split(`; ${name}`);
        if (parts.length === 2)return parts.pop().split(';').shift();
        return null;
    }

    const authToken = getCookie('authToken');

    return authToken? <Navigate to="/dashboard"/> : <Outlet/>;
}

export default PublicRoute;