import React, { useState } from 'react';
import axios from 'axios';
import './db.css';
import { FaTrash, FaEdit } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleDown, GoTriangleUp, GoTriangleRight } from "react-icons/go";

export default function FileList({ files, selectedFileId, onFileSelect, onFileDelete, fetchFiles }) {
    const [editingFileId, setEditingFileId] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

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

    const handleEditFileName = (file) => {
        setEditingFileId(file.id);
        setNewFileName(file.fileName);
    };

    const handleSaveFileName = async (file) => {
        if (!newFileName) {
            alert("파일 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/update-file-name?fileid=${file.id}`;
            await axios.patch(url, { contents: newFileName });
            alert("파일 이름이 성공적으로 수정되었습니다.");
            setEditingFileId(null);
            fetchFiles(); // Fetch the updated table list
        } catch (error) {
            console.error("파일 이름 수정 중 오류 발생:", error);
            alert("파일 이름 수정 중 오류가 발생했습니다.");
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            key = null;
            direction = null;
        }
        setSortConfig({ key, direction });
    };

    const sortedFiles = () => {
        if (!sortConfig.key) return files;
        const sorted = [...files].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    const getSortIcon = (key) => {
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                return <GoTriangleDown className='sort-icon' />;
            } else if (sortConfig.direction === 'descending') {
                return <GoTriangleUp className='sort-icon' />;
            }
        }
        return <GoTriangleRight className='sort-icon' />;
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
                            <th onClick={() => handleSort('id')}>
                                <div className="header-cell">
                                    파일 ID {getSortIcon('id')}
                                </div>
                            </th>
                            <th>파일 이름</th>
                            <th onClick={() => handleSort('createTime')}>
                                <div className="header-cell">
                                    업로드 날짜 {getSortIcon('createTime')}
                                </div>
                            </th>
                            <th onClick={() => handleSort('updateTime')}>
                                <div className="header-cell">
                                    최종 수정일 {getSortIcon('updateTime')}
                                </div>
                            </th>
                            <th>파일 삭제</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedFiles().map((file, index) => (
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
                                        <div className="edit-name-container">
                                            <input
                                                type="text"
                                                value={newFileName}
                                                onChange={(e) => setNewFileName(e.target.value)}
                                            />
                                            <IoIosSave
                                                onClick={() => handleSaveFileName(file)}
                                                className='save-file-button'
                                            />
                                        </div>
                                    ) : (
                                        <div className="file-name-container">
                                            {file.fileName}
                                            <FaEdit
                                                onClick={() => handleEditFileName(file)}
                                                className='edit-file-button'
                                            />
                                        </div>
                                    )}
                                </td>
                                <td>{formatDate(file.createTime)}</td>
                                <td>{formatDate(file.updateTime)}</td>
                                <td>
                                    <button className='trash-icon' onClick={() => onFileDelete(file.id)}>
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
