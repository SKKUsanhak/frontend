import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BsLayoutTextSidebarReverse } from "react-icons/bs";
import './Sidebar.css';

const Sidebar = ({ onToggle }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        onToggle(!isCollapsed); // 부모 컴포넌트에 상태 전달
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <BsLayoutTextSidebarReverse className="sidebar-icon" onClick={toggleSidebar} />
            {!isCollapsed && (
                <div className="sidebar-links">
                    <NavLink to="/" exact className="sidebar-link" activeClassName="active">Home</NavLink>
                    <NavLink to="/buildings/upload" className="sidebar-link" activeClassName="active">Upload</NavLink>
                    <NavLink to="/buildings" className="sidebar-link" activeClassName="active">Database</NavLink>
                    {/* 다른 네비게이션 링크 추가 */}
                </div>
            )}
        </div>
    );
};

export default Sidebar;
