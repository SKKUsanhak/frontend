import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Upload.css';
import { FadeLoader } from 'react-spinners';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [progress, setProgress] = useState(0);
    const [progressMessage, setProgressMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        setProgress(0); // 파일 변경 시 진행률 초기화
        setProgressMessage('');
    };

    const handleDrop = (event) => {
        event.preventDefault();
        setFile(event.dataTransfer.files[0]);
        setProgress(0); // 파일 드롭 시 진행률 초기화
        setProgressMessage('');
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUpload = () => {
        if (!file) {
            setMessage('업로드할 파일을 선택하세요.');
            return;
        }

        setMessage('잠시만 기다려 주세요, 파일 크기에 따라 10~20초 가량 소모됩니다.');
        setLoading(true); // 로딩 상태 활성화

        const formData = new FormData();
        formData.append('file', file);
        setProgressMessage('파일 업로드 성공, Azure 분석 중...');
        setProgress(30);
        axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'arraybuffer'
        })
        .then(response => {
            setMessage('파일 분석에 성공했습니다!');
            setProgress(100);
            setProgressMessage("분석 성공!");
            setTimeout(() => {
                setLoading(false); // 로딩 상태 비활성화
                navigate('/excelEditor', { state: { fileData: response.data } });
            }, 500); // 0.5초 뒤에 리다이렉션
        })
        .catch(error => {
            setMessage('파일 분석에 실패했습니다.');
            setLoading(false); // 로딩 상태 비활성화
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
            <div className={`loader-overlay ${loading ? '' : 'hidden'}`}>
                <FadeLoader />
                <p className="message">{message}</p>
                <p className="progress-message">{progressMessage}</p>
                <p>{progress}%</p>
            </div>
        </div>
    );
}
