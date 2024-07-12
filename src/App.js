import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Upload from './component/upload/Upload.jsx';
import ExcelEditor from './component/excelEditor/ExcelEditor.jsx';

function App() {

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Upload />} />
                <Route path="/excelEditor" element={<ExcelEditor />} />
            </Routes>
        </Router>
    );
}

export default App;