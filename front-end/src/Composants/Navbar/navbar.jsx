import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './navbar.css';
import logo from '/src/assets/th.jpeg';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // État pour gérer l'affichage de la barre latérale
    const navigate = useNavigate();
    const [profil,setProfil]=useState(null)

    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    const isAuthenticated = () => {
        const token = getCookie('authToken');
        console.log("Token dans Navbar : ", token);
        return !!token;
    };

    const apiProfil='';

    const fetchProfil=()=>{
        const token=getCookie('authToken');
        if(token){
            fetch(apiProfil,{
                headers:{
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(response=>response.json())
            .then(data=>{
                setProfil(data); //Stocker les informations du profil
            })
            .catch(error=>{
                console.error('Erreur lors de la récupération du profil:',error);
            });
        }
    };

    useEffect(()=>{
        if (isAuthenticated()){
            fetchProfil(); //Récupérer le profil si l'utilisateur est connecté
        }
    },[]);

    const handleUserIconClick = () => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        } else {
            navigate('/connexion');
        }
    };

    const handleLogout = () => {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        setProfil(null);
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Afficher/masquer la barre latérale
    };

    return (
        <div className='nav'>
            {/* Icône de menu */}
            <div className="menu-icon" onClick={toggleSidebar}>
                <i className='bx bx-menu'></i>
            </div>

            {/* Logo */}
            <div className="navLogo">
                <img src={logo} alt="" id='logo' />
            </div>
            <div>
                {/* Liste de Navigation par défaut pour les grands écrans */}
                <ul className="nav-items">
                    <li className='NavLink'>
                        <NavLink to="/" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                            textDecoration: isActive ? "none" : "none",
                        })}> Accueil </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="/pmes" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                            textDecoration: isActive ? "none" : "none",
                        })}> Pmes </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="/sens" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                            textDecoration: isActive ? "none" : "none",
                        })}> Sensibilisation </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="/a-propos" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                            textDecoration: isActive ? "none" : "none",
                        })}> À propos </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="/contact" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                            textDecoration: isActive ? "none" : "none",
                        })} > Contact </NavLink>
                    </li>
                </ul>
            </div>

            {/* Profil utilisateur ou icône de connexion */}
            <div className="login">
                {isAuthenticated() && profil ? (
                    <div className="user-profile">
                        <img
                            src={profil.avatar || '/default-avatar.png'} // Image du profil ou avatar par défaut
                            alt="User Avatar"
                            className="user-avatar"
                        />
                        <span className="user-name">{profil.name}</span> {/* Nom de l'utilisateur */}
                        <button onClick={handleLogout}>Se déconnecter</button>
                    </div>
                ) : (
                    <i
                        className='bx bxs-user'
                        style={{ color: '#fdb024' }}
                        onClick={handleUserIconClick}
                    ></i>
                )}
            </div>

            {/* Barre latérale pour petits écrans */}
            <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
                <ul className='ListeSidebar'>
                    <li className='NavLink'>
                        <i className='bx bx-home-alt'></i>
                        <NavLink to="/" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#006837',
                            textDecoration: isActive ? "none" : "none",
                        })}
                            className="listeNav"> Accueil </NavLink>
                    </li>
                    <li className='NavLink'>
                        <i className='bx bx-bulb'></i>
                        <NavLink to="/sens" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#006837',
                            textDecoration: isActive ? "none" : "none",
                        })}
                            className="listeNav"> Sensibilisation </NavLink>
                    </li>
                    <li className='NavLink'>
                        <i className='bx bx-info-circle'></i>
                        <NavLink to="/a-propos" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#006837',
                            textDecoration: isActive ? "none" : "none",
                        })}
                            className="listeNav"> À propos </NavLink>
                    </li>
                    <li className='NavLink'>
                        <i className='bx bx-phone'></i>
                        <NavLink to="/contact" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#006837',
                            textDecoration: isActive ? "none" : "none",
                        })}
                            className="listeNav"> Contact </NavLink>
                    </li>
                </ul>
            </div>

            {/* Superposition sombre */}
            {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </div>
    );
};

export default Navbar;