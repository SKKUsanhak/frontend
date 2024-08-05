import React from "react";
import { useNavigate } from 'react-router-dom';
import './header.css';
import { RiLogoutBoxRLine } from "react-icons/ri";
import { IoHome } from "react-icons/io5";

const Header = () => {
    const navigate = useNavigate();

    const redirectToLogin = () => {
        navigate('/login');
    };

    const redirectToHome = () => {
        navigate('/home');
    };

    return (
        <header id="header" role="banner">
            <div className="header__inner">
                <div className="home-icon-container">
                    <IoHome onClick={redirectToHome} className="home-icon" />
                </div>
                <nav className="header__nav" role="navigation" aria-label="메인 메뉴">
                    <ul className="nav__list">
                        <li className="nav__item"><a href="/buildings/upload">Upload</a></li>
                        <li className="nav__item"><a href="/buildings">DataBase</a></li>
                    </ul>
                </nav>
                <div className="login-icon-container">
                    <RiLogoutBoxRLine onClick={redirectToLogin} className="login-icon" />
                </div>
            </div>
        </header>
    );
};

export default Header;