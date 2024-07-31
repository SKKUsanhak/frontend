import React from 'react';
import { Route, Routes, Navigate, useLocation } from 'react-router-dom';
import FileUpload from './component/Fileupload/FileUpload.jsx';
import ExcelEditor from './component/excelEditor/ExcelEditor.jsx';
import Header from './component/header/header.jsx';
import Home from './component/Home/home.jsx';
// import DB from './component/DB/db.jsx';
import BuildingList from './component/DB/buildingList/buildingList.jsx';
import FileList from './component/DB/fileList/fileList.jsx';
import TableList from './component/DB/tableList/tableList.jsx';
import TableData from './component/DB/tableData/tableData.jsx';
import Login from './component/login/login.jsx';
import Register from './component/register/register.jsx';
import BuildingUpload from './component/BuildingUpload/BuildingUpload.jsx';

function App() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div>
            {!isHome && <Header />}
            <div className='main-content'>
                <Routes>
                    <Route path="/" element={<Home />} /> {/* 홈페이지 */}
                    <Route path="/buildings/:buildingId/files/upload" element={<FileUpload />} /> {/* 파일 업로드 페이지 */}
                    <Route path="/excelEditor" element={<ExcelEditor />} /> {/* 파일 수정 페이지 */}
                    <Route path="/buildings/upload" element={<BuildingUpload />} /> {/*빌딩 추가 페이지*/}
                    <Route path="/buildings" element={<BuildingList />} /> {/* 건물 리스트  */}
                    <Route path="/buildings/:buildingId/files" element={<FileList />} /> {/* 파일 리스트  */}
                    <Route path="/buildings/:buildingId/files/:fileId/tables" element={<TableList />} /> {/* 테이블 리스트  */}
                    <Route path="/buildings/:buildingId/files/:fileId/tables/:tableId/datas" element={<TableData />} /> {/* 데이터  */}
                    <Route path="/login" element={<Login />} /> {/* 로그인 페이지 */}
                    <Route path="/register" element={<Register />} /> {/* 회원가입 페이지 */}
                    <Route path="*" element={<Navigate to="/" />} /> {/* 지정되지 않은 페이지 */}
                </Routes>
            </div>
        </div>
    );
}

export default App;
