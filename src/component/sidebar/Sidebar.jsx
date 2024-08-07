import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    return (
        <div className="sidebar">
            <NavLink to="/" exact className="sidebar-link" activeClassName="active">Home</NavLink>
            <NavLink to="/buildings/upload" className="sidebar-link" activeClassName="active">Upload</NavLink>
            <NavLink to="/buildings" className="sidebar-link" activeClassName="active">Database</NavLink>
            {/* 다른 네비게이션 링크 추가 */}
        </div>
    );
};

export default Sidebar;
