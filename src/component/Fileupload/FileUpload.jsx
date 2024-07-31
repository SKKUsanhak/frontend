import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './FileUpload.css';
import { FadeLoader } from 'react-spinners';

export default function Upload() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [panelVisible, setPanelVisible] = useState(false);
    const [note, setNote] = useState('');
    const [fileName, setFileName] = useState('');
    const navigate = useNavigate();
    const { buildingId } = useParams();

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
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);
        togglePanel(true);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const selectedFile = event.dataTransfer.files[0];
        setFile(selectedFile);
        setFileName(selectedFile.name);
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

        if (!fileName.trim()) {
            alert('파일 이름은 빈칸일 수 없습니다.');
            setLoading(false);
            return;
        }

        setMessage('잠시만 기다려 주세요, 파일 크기에 따라 10~20초 가량 소모됩니다.');
        setLoading(true);

        const formData = new FormData();
        formData.append('file', file);

        axios.post(`/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            responseType: 'arraybuffer'
        })
        .then(response => {
            setLoading(false);
            navigate('/excelEditor', { state: { fileData: response.data, buildingId: buildingId, fileName: fileName, note: note } });
            togglePanel(false);
        })
        .catch(error => {
            setLoading(false);
            setMessage('업로드에 실패하였습니다. 다시 시도해주세요.');
            alert('업로드 실패');
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
                    <p className="drop-text">{file ? fileName : '또는 여기에 파일을 드롭하세요'}</p>
                </div>
            </div>
            <div className={`panel-container ${panelVisible ? 'visible' : ''}`}>
                <div className='file-info'>
                    <h2>파일 세부 사항 입력</h2>
                    <div>
                        <span className="file-info-label">파일 이름:</span>
                        <input
                            type="text"
                            placeholder="파일 이름 입력"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
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
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    <button onClick={handleUpload} className="upload-button">데이터 추출</button>
                </div>
            </div>
        </div>
    );
}
