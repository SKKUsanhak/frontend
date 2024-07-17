import React from "react";
import './header.css';

const Header = () => {
    return(
        <header id="header" role="banner">
        <div className="header__inner">
            <nav className="header__nav" role="navigation" aria-label="메인 메뉴">
                <ul>
                    <div className="nav__item"><a href="/upload">File Upload</a></div>
                    <div className="nav__item"><a href="/ExcelEditor">Excel Editor</a></div>
                    <div className="nav__item"><a href="/DB">Show DB</a></div>
                </ul>
            </nav>
        </div>
    </header>
    );
};

export default Header;