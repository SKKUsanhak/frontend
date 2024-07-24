import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './component/upload/Upload.jsx';
import ExcelEditor from './component/excelEditor/ExcelEditor.jsx';
import Header from './component/header/header.jsx';
import Home from './component/Home/home.jsx';
import DB from './component/DB/db.jsx';
import Login from './component/login/login.jsx';
import Register from './component/register/register.jsx';

function App() {

    return (
        <Router>
            <Header />
            <div className='main-content'>
                <Routes>
                    <Route path="/" element={<Home />} /> {/* 홈페이지 */}
                    <Route path="/upload" element={<Upload />} /> {/* 파일 업로드 페이지*/}
                    <Route path="/excelEditor" element={<ExcelEditor />} /> {/* 파일 수정 페이지*/ }
                    <Route path="/database" element={<DB/>} /> {/* 데이터베이스 확인 페이지 */ }
                    <Route path="/login" element={<Login/>} /> {/*로그인 페이지*/}
                    <Route path="/register" element={<Register/>} /> {/* 회원가입 페이지 */}
                </Routes>
            </div>
        </Router>
    );
}

export default App;