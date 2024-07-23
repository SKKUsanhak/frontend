import React from "react";
import './header.css';
import { BiLogIn } from "react-icons/bi";

const Header = () => {
    return (
        <header id="header" role="banner">
            <div className="header__inner">
                <nav className="header__nav" role="navigation" aria-label="메인 메뉴">
                    <ul className="nav__list">
                        <li className="nav__item"><a href="/upload">File Upload</a></li>
                        <li className="nav__item"><a href="/database">DataBase</a></li>
                    </ul>
                </nav>
                <div className="login-icon-container">
                    <BiLogIn className="login-icon" />
                </div>
            </div>
        </header>
    );
};

export default Header;