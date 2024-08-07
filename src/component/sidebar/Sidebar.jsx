import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import './Sidebar.css';
import { MdDomainAdd } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import { FaRegFileAlt } from "react-icons/fa";
import { FiTable } from "react-icons/fi";
import { CgDatabase } from "react-icons/cg";

const Sidebar = ({ onToggle }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
        onToggle(!isCollapsed); // 부모 컴포넌트에 상태 전달
    };

    return (
        <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
            <IoMenu className="sidebar-icon" onClick={toggleSidebar} />
            {!isCollapsed && (
                <div className="sidebar-links">
                    <div className="sidebar-item">
                        <MdDomainAdd className="sidebar-link-icon"/>
                        <NavLink to="/buildings/upload" className="sidebar-link" activeClassName="active">Upload</NavLink>
                    </div>
                    <div className="sidebar-item">
                        <BiBuildings className="sidebar-link-icon"/>
                        <NavLink to="/buildings" className="sidebar-link" activeClassName="active">Building</NavLink>
                    </div>
                    <div className="sidebar-item">
                        <FaRegFileAlt className="sidebar-link-icon"/>
                        <NavLink to="/buildings/:buildingId/files" className="sidebar-link" activeClassName="active">File</NavLink>
                    </div>
                    <div className="sidebar-item">
                        <FiTable className="sidebar-link-icon"/>
                        <NavLink to="/buildings/:buildingId/files/:fileId/tables" className="sidebar-link" activeClassName="active">Table</NavLink>
                    </div>
                    <div className="sidebar-item">
                        <CgDatabase className="sidebar-link-icon"/>
                        <NavLink to="/buildings/:buildingId/files/:fileId/tables/:tableId/datas" className="sidebar-link" activeClassName="active">Data</NavLink>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Sidebar;
