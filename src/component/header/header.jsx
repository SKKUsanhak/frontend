import React from "react";
import './header.css';

const Header = () => {
    return (
        <header id="header" role="banner">
            <div className="header__inner">
                <nav className="header__nav" role="navigation" aria-label="메인 메뉴">
                    <ul className="nav__list">
                        <li className="nav__item"><a href="/upload">File Upload</a></li>
                        <li className="nav__item"><a href="/database">Show DB</a></li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
