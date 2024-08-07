import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import './Sidebar.css';
import { MdDomainAdd } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import { FaRegFileAlt } from "react-icons/fa";
import { FiTable } from "react-icons/fi";
import { CgDatabase } from "react-icons/cg";

const Sidebar = ({ onToggle }) => {
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

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="sidebar-header">
                <IoMenu className="sidebar-icon" onClick={toggleSidebar} />
            </div>
            {!isCollapsed && (
                <div className="sidebar-content">
                    <div className="sidebar-links">
                        <div className="sidebar-item">
                            <MdDomainAdd className="sidebar-link-icon" />
                            <NavLink to="/buildings/upload" className="sidebar-link" activeClassName="active">Upload</NavLink>
                        </div>
                        <div className="sidebar-item">
                            <BiBuildings className="sidebar-link-icon" />
                            <NavLink to="/buildings" className="sidebar-link" activeClassName="active">Building</NavLink>
                        </div>
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
                                <NavLink to={`/buildings/${segments[1]}/files/${segments[3]}/tables/${segments[5]}/datas`} className="sidebar-link" activeClassName="active">Data</NavLink>
                            ) : (
                                <span className="sidebar-link">Data</span>
                            )}
                        </div>
                    </div>
                    <div className="sidebar-footer">
                        <div className="sidebar-item">
                            <NavLink to="/login" className="sidebar-link">Login</NavLink>
                        </div>
                        <div className="sidebar-item">
                            <NavLink to="/register" className="sidebar-link">Register</NavLink>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
