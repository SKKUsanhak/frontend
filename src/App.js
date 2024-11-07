import React, { useState, useEffect } from 'react';
import { Route, Routes, Navigate, useLocation, useNavigate } from 'react-router-dom';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('username'); // 로컬스토리지에서 사용자 이름 가져오기
        if (token) {
            setIsAuthenticated(true);
            setUsername(user || ''); // 사용자 이름 설정
        }
    }, []);

    const handleToggleSidebar = (isCollapsed) => {
        setIsSidebarCollapsed(isCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        setIsAuthenticated(false); // 로그아웃 시 isAuthenticated를 false로 설정
        alert('로그아웃 하였습니다.');
        window.location.reload(); // 로그아웃 후 페이지 새로고침
        navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
    };

    return (
        <div className="app-container">
            <Sidebar onToggle={handleToggleSidebar} isAuthenticated={isAuthenticated} username={username} onLogout={handleLogout}/>
            <div className={`main-content-container ${isSidebarCollapsed ? 'expanded' : ''}`}>
                {!isHome && <Header />} {/* Render the header conditionally */}
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/buildings/:buildingId/files/upload" element={<ProtectedRoute isAuthenticated={isAuthenticated}><FileUpload /></ProtectedRoute>} />
                        <Route path="/excelEditor" element={<ProtectedRoute isAuthenticated={isAuthenticated}><ExcelEditor /></ProtectedRoute>} />
                        <Route path="/buildings/upload" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BuildingUpload /></ProtectedRoute>} />
                        <Route path="/buildings" element={<ProtectedRoute isAuthenticated={isAuthenticated}><BuildingList /></ProtectedRoute>} />
                        <Route path="/buildings/:buildingId/files" element={<ProtectedRoute isAuthenticated={isAuthenticated}><FileList /></ProtectedRoute>} />
                        <Route path="/buildings/:buildingId/files/:fileId/tables" element={<ProtectedRoute isAuthenticated={isAuthenticated}><TableList /></ProtectedRoute>} />
                        <Route path="/buildings/:buildingId/files/:fileId/tables/:tableId/datas" element={<ProtectedRoute isAuthenticated={isAuthenticated}><TableData /></ProtectedRoute>} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                </div>
            </div>
        </div>
    );
}

// ProtectedRoute 컴포넌트
function ProtectedRoute({ isAuthenticated, children }) {
    return isAuthenticated ? children : <Navigate to="/login" />;
}

export default App;
