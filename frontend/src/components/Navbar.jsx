import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/UAAlogo.svg';
import '../styles/Navbar.css';
import { useAuthentication } from '../auth';

function Navbar() {

    const {isAuthorized, logout} = useAuthentication

    const handleLogout = () => {
        logout();
    }

    return (
        <div className="navbar">
            <Link to="/" className="navbar-logo-link">
                <img src={logo} alt="Logo" className="navbar-logo"/>
            </Link>
            <ul className="navbar-menu-right">
                {isAuthorized ? (
                    <>
                        <li>
                            <button onClick={handleLogout} to='/logout' className="button-link">Logout</button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <Link to="/login" className="button-link-login">Log In</Link>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}

export default Navbar;
