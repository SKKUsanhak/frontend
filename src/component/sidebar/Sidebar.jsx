import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        onToggle(!isCollapsed); // 부모 컴포넌트에 상태 전달
    };

    // 경로에 따라 활성화 상태를 결정하는 함수
    const isLinkActive = (path) => {
        return location.pathname.startsWith(path);
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <BsLayoutTextSidebarReverse className="sidebar-icon" onClick={toggleSidebar} />
            {!isCollapsed && (
                <div className="sidebar-links">
                    <NavLink to="/" className="sidebar-link" activeClassName="active">Home</NavLink>
                    <NavLink to="/buildings" className={`sidebar-link ${isLinkActive('/buildings') ? 'active' : ''}`}>건물 목록</NavLink>
                    <NavLink to="/buildings/:buildingId/files" className={`sidebar-link ${isLinkActive('/buildings') && isLinkActive('/files') ? 'active' : 'disabled'}`}>파일 목록</NavLink>
                    <NavLink to="/buildings/:buildingId/files/:fileId/tables" className={`sidebar-link ${isLinkActive('/buildings') && isLinkActive('/files') && isLinkActive('/tables') ? 'active' : 'disabled'}`}>테이블 목록</NavLink>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
