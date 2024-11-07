import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import './Sidebar.css';
import { FaRegFileAlt } from "react-icons/fa";
import { FiTable } from "react-icons/fi";
import { CgDatabase } from "react-icons/cg";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { MdOutlinePersonAddAlt } from "react-icons/md";
import { TbLogin2, TbLogout } from "react-icons/tb";
import { FaUser } from "react-icons/fa";

const Sidebar = ({ onToggle, isAuthenticated, username, onLogout }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const location = useLocation();

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        onToggle(!isCollapsed); // 부모 컴포넌트에 상태 전달
    };

    const getPathSegments = () => {
        const segments = location.pathname.split('/').filter(Boolean);
        return segments;
    };

    const segments = getPathSegments();
    const canAccessFile = segments.length >= 3;
    const canAccessTable = segments.length >= 5;
    const canAccessData = segments.length >= 7;

    const handleRefresh = () => {
        window.location.reload();
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <IoMenu className="sidebar-icon" onClick={toggleSidebar} />
            </div>
            {!isCollapsed && (
                <div className="sidebar-content">
                    <div className="sidebar-links">
                        <NavLink to="/buildings" className="sidebar-item" activeClassName="active">
                            <PiBuildingOfficeFill className="sidebar-link-icon" />
                            <span className="sidebar-link">Building</span>
                        </NavLink>
                        <div className={`sidebar-item ${canAccessFile ? '' : 'disabled'}`}>
                            <FaRegFileAlt className="sidebar-link-icon" />
                            {canAccessFile ? (
                                <NavLink to={`/buildings/${segments[1]}/files`} className="sidebar-link" activeClassName="active">File</NavLink>
                            ) : (
                                <span className="sidebar-link">File</span>
                            )}
                        </div>
                        <div className={`sidebar-item ${canAccessTable ? '' : 'disabled'}`}>
                            <FiTable className="sidebar-link-icon" />
                            {canAccessTable ? (
                                <NavLink to={`/buildings/${segments[1]}/files/${segments[3]}/tables`} className="sidebar-link" activeClassName="active">Table</NavLink>
                            ) : (
                                <span className="sidebar-link">Table</span>
                            )}
                        </div>
                        <div className={`sidebar-item ${canAccessData ? '' : 'disabled'}`}>
                            <CgDatabase className="sidebar-link-icon" />
                            {canAccessData ? (
                                <span onClick={handleRefresh} className="sidebar-link">Data</span>
                            ) : (
                                <span className="sidebar-link">Data</span>
                            )}
                        </div>
                    </div>
                    <div className="sidebar-footer">
                        {!isAuthenticated ? (
                            <>
                                <NavLink to="/login" className="sidebar-item">
                                    <TbLogin2 className='sidebar-footer-icon' />
                                    <span className="sidebar-link">Login</span>
                                </NavLink>
                                <NavLink to="/register" className="sidebar-item">
                                    <MdOutlinePersonAddAlt className='sidebar-footer-icon' />
                                    <span className="sidebar-link">Register</span>
                                </NavLink>
                            </>
                        ) : (
                            <div className="user-info">
                                <div className="user-icon">
                                    <FaUser className="sidebar-user-icon" />
                                    <span className="sidebar-username">{username}</span>
                                </div>
                                <div className="logout-button" onClick={onLogout}>
                                    <TbLogout className="sidebar-logout-icon" />
                                    <span className="sidebar-link">Logout</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
