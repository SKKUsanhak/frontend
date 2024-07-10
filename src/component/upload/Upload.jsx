import React, { useState } from 'react';
import axios from 'axios';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [jsonResponse, setJsonResponse] = useState(null);
    const [message, setMessage] = useState('');

    function printJsonResponse(jsonResponse) {
        return JSON.stringify(jsonResponse, null, 2);
    }

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFile(event.dataTransfer.files[0]);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUpload = () => {
        const formData = new FormData();
        formData.append('file', file);

        axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        .then(response => {
            setMessage('파일 업로드에 성공했습니다!');
            setJsonResponse(response.data);
        })
        .catch(error => {
            setMessage('파일 업로드에 실패했습니다.');
            console.error('파일 업로드 중 오류가 발생했습니다!', error);
        });
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
            <h1>Upload File</h1>
            <div 
                onDrop={handleDrop} 
                onDragOver={handleDragOver} 
                style={{ width: '500px', height: '300px', border: '2px dashed #cccccc', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', margin: '20px 0' }}
            >
                <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="fileInput" />
                <label htmlFor="fileInput" style={{ padding: '10px 20px', border: '1px solid #cccccc', borderRadius: '5px', cursor: 'pointer', backgroundColor: '#f0f0f0' }}>
                    파일 선택
                </label>
                <p style={{ marginTop: '10px' }}>{file ? file.name : '여기에 파일을 드롭하세요'}</p>
            </div>
            <button onClick={handleUpload}>업로드</button>
            <p>{message}</p>
            {jsonResponse && 
                <div style={{ width: '500px', height: '200px', overflow: 'auto', marginTop: '20px', border: '1px solid #cccccc', padding: '10px', borderRadius: '5px' }}>
                    <h2>JSON Response:</h2>
                    <pre>{printJsonResponse(jsonResponse)}</pre>
                </div>
            }
        </div>
    );
}
