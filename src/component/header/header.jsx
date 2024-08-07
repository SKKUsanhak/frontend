import React from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { IoHome } from "react-icons/io5";
import './header.css';

const Header = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isHome = location.pathname === '/';

    if (isHome) {
        return null; // Do not render the header on the home page
    }

    return (
        <div className="header">
            <div className="header-content">
                <IoHome className="home-icon" onClick={() => navigate('/')} />
            </div>
        </div>
    );
};

export default Header;
