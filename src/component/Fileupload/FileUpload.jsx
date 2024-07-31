import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './FileUpload.css';
import { FadeLoader } from 'react-spinners';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [panelVisible, setPanelVisible] = useState(false);
    const [buildingName, setBuildingName] = useState('');
    const [address, setAddress] = useState('');
    const [Comments, setComments] = useState('');
    const navigate = useNavigate();

    const togglePanel = (isVisible) => {
        setPanelVisible(isVisible);
        const container = document.querySelector('.container');
        if (isVisible) {
            container.classList.add('expanded');
        } else {
            container.classList.remove('expanded');
        }
    };

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        togglePanel(true);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        setFile(selectedFile);
        togglePanel(true);
    };

    const handleDragOver = (event) => {
        event.preventDefault();
    };

    const handleUpload = () => {
        if (!file) {
            setMessage('업로드할 파일을 선택하세요.');
            setLoading(false);
            return;
        }
    
        // Check if the building name or address is empty
        if (!buildingName.trim() || !address.trim()) {
            alert('건물명과 주소를 모두 입력해야 합니다.');
            setLoading(false);
            return;
        }

        setMessage('잠시만 기다려 주세요, 파일 크기에 따라 10~20초 가량 소모됩니다.');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        axios.post('/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'arraybuffer'
        })
        .then(response => {
            setLoading(false);
            navigate('/excelEditor', { state: { fileData: response.data, fileName: file.name, buildingName: buildingName, buildingAddress: address, comments: Comments } });
            togglePanel(false);
        })
        .catch(error => {
            setLoading(false);
            setMessage('업로드에 실패하였습니다. 다시 시도해주세요.');
            togglePanel(false);
        });
    };

    return (
        <div>
            <div className={`loader-overlay ${loading ? '' : 'hidden'}`}>
                <FadeLoader />
                <p className="message">{message}</p>
            </div>
            <div className="container">
                <h1>File Upload</h1>
                <div className="drop-area" onDrop={handleDrop} onDragOver={handleDragOver}>
                    <input type="file" onChange={handleFileChange} className="hidden-input" id="fileInput" />
                    <label htmlFor="fileInput" className="label">파일 선택</label>
                    <p className="drop-text">{file ? file.name : '또는 여기에 파일을 드롭하세요'}</p>
                </div>
            </div>
            <div className={`panel-container ${panelVisible ? 'visible' : ''}`}>
                <div className='file-info'>
                    <h2>파일 세부 사항 입력</h2>
                    <div>
                        <span className="file-info-label">건물명:</span>
                        <input
                            type="text"
                            placeholder="건물명 입력"
                            value={buildingName}
                            onChange={(e) => setBuildingName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <span className="file-info-label">주소:</span>
                        <input
                            type="text"
                            placeholder="주소 입력"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <span className="file-info-label">비고</span>
                    </div>
                    <div>
                        <textarea
                            placeholder="비고 (최대 200자)"
                            maxLength="200"
                            value={Comments}
                            onChange={(e) => setComments(e.target.value)}
                        />
                    </div>
                    <button onClick={handleUpload} className="upload-button">데이터 추출</button>
                </div>
            </div>
        </div>
    );
}
