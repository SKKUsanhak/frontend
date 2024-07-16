import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Upload.css';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setProgress(0); // 파일 변경 시 진행률 초기화
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFile(event.dataTransfer.files[0]);
        setProgress(0); // 파일 드롭 시 진행률 초기화
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUpload = () => {
        if (!file) {
            setMessage('업로드할 파일을 선택하세요.');
            return;
        }

        setMessage('업로드 중이니 잠시만 기다려 주세요 10~20초 가량 소모됩니다.');
        const formData = new FormData();
        formData.append('file', file);

        axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'arraybuffer',
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                setProgress(percentCompleted);
            }
        })
        .then(response => {
            setMessage('파일 업로드에 성공했습니다!');
            navigate('/excelEditor', { state: { fileData: response.data } });
        })
        .catch(error => {
            setMessage('파일 업로드에 실패했습니다.');
            console.error('파일 업로드 중 오류가 발생했습니다!', error);
        });

         // 진행 상황을 폴링하여 업데이트
         const intervalId = setInterval(() => {
            axios.get('/progress')
                .then(response => {
                    setProgress(response.data);
                    if (response.data === 100) {
                        clearInterval(intervalId);
                    }
                })
                .catch(error => {
                    console.error('진행 상황 업데이트 중 오류가 발생했습니다!', error);
                    clearInterval(intervalId);
                });
        }, 1000); // 1초 간격으로 진행 상황 업데이트
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
            <div className="progress-bar" style={{ width: '400px' }}>
                <div 
                    className="progress-bar-fill" 
                    style={{ width: `${progress}%` }}
                >
                    {progress}%
                </div>
            </div>
            <p className="message">{message}</p>
        </div>
    );
}
