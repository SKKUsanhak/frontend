import React from "react";
import { useNavigate } from 'react-router-dom';
import './header.css';
import { RiLogoutBoxRLine } from "react-icons/ri";

const Header = () => {
    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate('/login');
    };

    return (
        <header id="header" role="banner">
            <div className="header__inner">
                <div className="login-icon-container">
                    <RiLogoutBoxRLine onClick={redirectToLogin} className="login-icon" />
                </div>
            </div>
        </header>
    );
};

export default Header;
