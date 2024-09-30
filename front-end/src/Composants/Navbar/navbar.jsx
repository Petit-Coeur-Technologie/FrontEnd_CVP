import { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './navbar.css';
import logo from '/src/assets/logo_provisoire.png';

const Navbar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDropOpen, setIsDropOpen] = useState(false);
    const [profil, setProfil] = useState('');
    const [userId, setUserId] = useState(null);
    const navigate = useNavigate();

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

    useEffect(() => {
        // Suppose we récupère l'ID utilisateur depuis le cookie ou autre source
        const savedUserId = getCookie('userId');
        if (savedUserId) {
            setUserId(savedUserId);
        }
    }, []);

    useEffect(() => {
        const token = getCookie('authToken'); // Récupérer le token ici
        if (!token) {
            console.error("Token manquant. L'utilisateur n'est pas authentifié.");
            return;
        }

        const ImgProfil = async () => {
            try {
                const response = await fetch(`https://ville-propre.onrender.com/users/${userId}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                if (!response.ok) {
                    throw new Error(`Erreur réseau. code: ${response.status}`);
                }
                const data = await response.json();

                // Dépendamment du rôle, récupérer la bonne photo
                if (data.utilisateur.role === "pme") {
                    setProfil(data.logo_pme);
                } else if (data.utilisateur.role === "menage") {
                    setProfil(data.copie_pi);
                } else if (data.utilisateur.role === "entreprise") {
                    setProfil(data.utilisateur.copie_pi);
                }

            } catch (error) {
                console.error('Erreur lors de la récupération des informations du profil: ', error.message);
            }
        };

        if (userId) {
            ImgProfil();
        }
    }, [userId]); // Ajoutez userId comme dépendance


    const handleUserIconClick = () => {
        if (isAuthenticated()) {
            navigate('/dashboard');
        } else {
            setIsDropOpen(!isDropOpen);
            navigate('/connexion')
        }
    };

    const handleProfilClick = () => {
        setIsDropOpen(!isDropOpen);
    };

    const handleNavigation = (path) => {
        setIsDropOpen(false);
        navigate(path);
    };

    const handleLogout = () => {
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        navigate('/');
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className='nav'>
            <div className="menu-icon" onClick={toggleSidebar}>
                <i className='bx bx-menu'></i>
            </div>
            <div className="navLogo">
                <img src={logo} alt="" id='logo' />
            </div>
            <div>
                <ul className="nav-items">
                    <li className='NavLink'>
                        <NavLink to="/" className='lienNav' style={({ isActive }) => ({
                            color: isActive ? "#fdb024" : "#fff", // La couleur active et inactive
                            textDecoration: "none",
                        })}> Accueil </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="" className='lienNav' style={({ isActive }) => ({
                            color: isActive ? "#fff" : "fdb024", // La couleur active et inactive
                            textDecoration: "none",
                        })}
                        > Sensibilisation </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="" className='lienNav' > Boutique </NavLink>
                    </li>
                </ul>
            </div>

            <div className="login">
                {isAuthenticated() ? (
                    <>
                        <div className="navProfil">
                            <img src={profil} alt="" className='profilImg' onClick={handleProfilClick} />
                        </div>

                        {isDropOpen && (
                            <div className='dropdownProfil'>
                                <button onClick={() => handleNavigation('/dashboard')} className='btnProfil'>Dashboard</button>
                                <button className='btnProfil' onClick={handleLogout} >Déconnexion</button>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <i
                            className='bx bxs-user'
                            style={{ color: '#fdb024' }}
                            onClick={handleUserIconClick}
                        ></i>
                        <NavLink to="/connexion" className="lienSeConnecter"> <button className='btnSeConnecter'> Se connecter</button></NavLink>
                    </>
                )}
            </div>

            <div className={`sidebarNav ${isSidebarOpen ? 'open' : ''}`}>
                <ul className='ListeSidebarNav'>
                    <li className='sidebarNavLink'>
                        <i className='bx bx-home-alt iconeNav' ></i>
                        <NavLink to="/" className="listeNav"> Accueil </NavLink>
                    </li>
                    <li className='sidebarNavLink'>
                        <i className='bx bx-bulb iconeNav'></i>
                        <NavLink to="" className="listeNav"> Sensibilisation </NavLink>
                    </li>
                    <li className='sidebarNavLink'>
                        <i className='bx bx-phone iconeNav'></i>
                        <NavLink to="" className="listeNav"> Boutique </NavLink>
                    </li>
                </ul>
            </div>

            {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        </div>
    );
};

export default Navbar;