import React, { useState } from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import FileUpload from './component/Fileupload/FileUpload.jsx';
import ExcelEditor from './component/excelEditor/ExcelEditor.jsx';
import Home from './component/Home/home.jsx';
import BuildingList from './component/DB/buildingList/buildingList.jsx';
import FileList from './component/DB/fileList/fileList.jsx';
import TableList from './component/DB/tableList/tableList.jsx';
import TableData from './component/DB/tableData/tableData.jsx';
import Login from './component/login/login.jsx';
import Register from './component/register/register.jsx';
import BuildingUpload from './component/BuildingUpload/BuildingUpload.jsx';
import Sidebar from './component/sidebar/Sidebar.jsx';
import Header from './component/header/header.jsx'; // Import the Header component
import './App.css';

function App() {
    const location = useLocation();
    const isHome = location.pathname === '/';
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const handleToggleSidebar = (isCollapsed) => {
        setIsSidebarCollapsed(isCollapsed);
    };

    return (
        <div className="app-container">
            <Sidebar onToggle={handleToggleSidebar} />
            <div className={`main-content-container ${isSidebarCollapsed ? 'expanded' : ''}`}>
                {!isHome && <Header />} {/* Render the header conditionally */}
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/buildings/:buildingId/files/upload" element={<FileUpload />} />
                        <Route path="/excelEditor" element={<ExcelEditor />} />
                        <Route path="/buildings/upload" element={<BuildingUpload />} />
                        <Route path="/buildings" element={<BuildingList />} />
                        <Route path="/buildings/:buildingId/files" element={<FileList />} />
                        <Route path="/buildings/:buildingId/files/:fileId/tables" element={<TableList />} />
                        <Route path="/buildings/:buildingId/files/:fileId/tables/:tableId/datas" element={<TableData />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

export default App;
