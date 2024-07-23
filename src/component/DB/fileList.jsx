import React, { useState } from 'react';
import './db.css';
import { FaTrash } from "react-icons/fa";

export default function FileList({ files, selectedFileId, onFileSelect, onFileDelete, onFileNameUpdate }) {
    const [editingFileId] = useState(null);
    const [newFileName, setNewFileName] = useState('');

    const formatDate = (dateString) => {
        const options = { 
            year: 'numeric', 
            month: '2-digit', 
            day: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            hour12: false // 24시간제로 설정
        };
        return new Date(dateString).toLocaleString('ko-KR', options);
    };

    const handleDelete = (fileId) => {
        if (window.confirm('정말 파일을 삭제하시겠습니까?')) {
            onFileDelete(fileId);
        }
    };

    return (
        <div className='file-list-container'>
            <h2>파일 목록</h2>
            {files && files.length === 0 ? (
                <p>No files available.</p>
            ) : (
                <table className='table'>
                    <thead>
                        <tr>
                            <th></th>
                            <th>파일 ID</th>
                            <th>파일 이름</th>
                            <th>업로드 날짜</th>
                            <th>최종 수정일</th>
                            <th>파일 삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {files.map((file, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedFileId === file.id}
                                        onChange={() => onFileSelect(file.id)}
                                    />
                                </td>
                                <td>{file.id}</td>
                                <td>
                                    {editingFileId === file.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newFileName}
                                                onChange={(e) => setNewFileName(e.target.value)}
                                            />
                                        </>
                                    ) : (
                                        <>
                                            {file.fileName}
                                        </>
                                    )}
                                </td>
                                <td>{formatDate(file.createTime)}</td>
                                <td>{formatDate(file.updateTime)}</td>
                                <td>
                                    <button className='trash-icon' onClick={() => handleDelete(file.id)}>
                                        <FaTrash />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
