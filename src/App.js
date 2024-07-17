import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './component/upload/Upload.jsx';
import ExcelEditor from './component/excelEditor/ExcelEditor.jsx';
import Header from './component/header/header.jsx';

function App() {

    return (
        <Router>
            <Header/>
            <Routes>
                <Route path="/upload" element={<Upload />} />
                <Route path="/excelEditor" element={<ExcelEditor />} />
            </Routes>
        </Router>
    );
}

export default App;