import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

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
        setMessage('업로드 중이니 잠시만 기다려 주세요 10~20초 가량 소모됩니다.');
        const formData = new FormData();
        formData.append('file', file);

        axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'arraybuffer'
        })
        .then(response => {
            setMessage('파일 업로드에 성공했습니다!');
            navigate('/excelEditor', { state: { fileData: response.data } });
        })
        .catch(error => {
            setMessage('파일 업로드에 실패했습니다.');
            console.error('파일 업로드 중 오류가 발생했습니다!', error);
        });
    };

    return (
        <div className="container">
            <h1>Upload File</h1>
            <div 
                className="drop-area" 
                onDrop={handleDrop} 
                onDragOver={handleDragOver}
            >
                <input 
                    type="file" 
                    onChange={handleFileChange} 
                    className="hidden-input" 
                    id="fileInput" 
                />
                <label 
                    htmlFor="fileInput" 
                    className="label"
                >
                    파일 선택
                </label>
                <p className="drop-text">{file ? file.name : '또는 여기에 파일을 드롭하세요'}</p>
            </div>
            <button onClick={handleUpload} className="upload-button">업로드</button>
            <p className="message">{message}</p>
        </div>
    );
}
