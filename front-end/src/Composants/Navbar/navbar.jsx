import { NavLink, useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    // Fonction utilitaire pour obtenir la valeur d'un cookie
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    };

    // Fonction pour vérifier si l'utilisateur est connecté
    const isAuthenticated = () => {
        const token = getCookie('authToken'); // Récupérer le token du cookie
        return !!token; // Retourne true si le token existe, sinon false
    };

    const handleUserIconClick = () => {
        if (isAuthenticated()) {
            navigate('/dashboard'); // Rediriger vers le tableau de bord si l'utilisateur est connecté
        } else {
            navigate('/connexion'); // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
        }
    };

    const handleLogout = () => {
        // Supprimer le cookie d'authentification
        document.cookie = 'authToken=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        // Rediriger vers la page d'accueil après la déconnexion
        navigate('/');
    };

    return (
        <div className="nav">
            <div className="nav-content">
                <div className="navLogo">
                    <img src="\src\assets\logo.jpg" alt="" id='logo' />
                </div>
                <ul className='ListeNavbar'>
                    <li className='NavLink'>
                        <NavLink to="/" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                        })}> Accueil </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="/sens" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                        })}> Sensibilisation </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="/a-propos" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                        })}> À propos </NavLink>
                    </li>
                    <li className='NavLink'>
                        <NavLink to="/contact" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                        })}> Contact </NavLink>
                    </li>
                </ul>
                <div className="login">
                    <i
                        className='bx bxs-user'
                        style={{ color: '#fdb024' }}
                        onClick={handleUserIconClick}
                    ></i>
                    {isAuthenticated() && (
                        <button onClick={handleLogout}>Déconnexion</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Navbar;