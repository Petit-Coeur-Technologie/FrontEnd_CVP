import { NavLink, useNavigate } from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
    const navigate = useNavigate();

    const goDashboard = () => {
        navigate("/dashboard");
    }

    return (


        <div className="nav">
            <div className="nav-content">
                <div className="navLogo"><img src="\src\assets\logo.jpg" alt="" id='logo' /></div>
                <ul>
                    <li>
                        <NavLink to="/sens" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                            fontWeight: isActive ? 'bold' : 'normal',
                        })}> Sensibilisation </NavLink>
                    </li>
                    <li>
                        <NavLink to="/a-propos" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                            fontWeight: isActive ? 'bold' : 'normal',
                        })}> A propos </NavLink>
                    </li>
                    <li>
                        <NavLink to="/contact" style={({ isActive }) => ({
                            color: isActive ? '#fdb024' : '#fff',
                            fontWeight: isActive ? 'bold' : 'normal',
                        })}> Contact </NavLink>
                    </li>
                </ul>
                <div className="login">
                    <i className='bx bxs-user' style={{ color: '#fdb024' }} onClick={goDashboard}></i>
                </div>
            </div>
        </div>
    )

}

export default Navbar;