import React, { useState } from 'react';
import axios from 'axios';
import './fileList.css';
import { FaTrash, FaEdit, FaSort, FaSearch } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

export default function FileList({ files, onFileSelect, fetchTables, onFileDelete }) {
    const [editingFileId, setEditingFileId] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 15; // 페이지 당 항목 수

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
            fetchTables(); // Fetch the updated table list
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

    const filteredFiles = () => {
        if (!searchQuery) return sortedFiles();
        return sortedFiles().filter(file => file.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const handleFileNameClick = (id) => {
        onFileSelect(id);
        fetchTables(id);
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredFiles().length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const paginatedFiles = filteredFiles().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredFiles().length / itemsPerPage);

    return (
        <div className='file-list-container'>
            <h2>파일 목록</h2>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="파일 이름으로 검색..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setCurrentPage(1); // 검색할 때 첫 페이지로 이동
                    }}
                />
                <FaSearch className="search-icon" />
            </div>
            {files && files.length === 0 ? (
                <p>No files available.</p>
            ) : (
                <>
                    <table className='table'>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    <div className="header-cell">
                                        File ID 
                                        <FaSort className='sort-icon' />
                                    </div>
                                </th>
                                <th>파일 이름</th>
                                <th onClick={() => handleSort('createTime')}>
                                    <div className="header-cell">
                                        업로드 날짜
                                        <FaSort className='sort-icon' />
                                    </div>
                                </th>
                                <th onClick={() => handleSort('updateTime')}>
                                    <div className="header-cell">
                                        최종 수정일
                                        <FaSort className='sort-icon' />
                                    </div>
                                </th>
                                <th>삭제/수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedFiles.map((file, index) => (
                                <tr key={index}>
                                    <td>{file.id}</td>
                                    <td>
                                        {editingFileId === file.id ? (
                                            <div className="edit-name-wrapper">
                                                <div className="edit-name-container">
                                                    <input
                                                        type="text"
                                                        value={newFileName}
                                                        onChange={(e) => setNewFileName(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        ) : (
                                            <div
                                                className="file-name-container"
                                                onClick={() => handleFileNameClick(file.id)}
                                            >
                                                <span className="file-name">
                                                    {file.fileName}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td>{formatDate(file.createTime)}</td>
                                    <td>{formatDate(file.updateTime)}</td>
                                    <td>
                                        <button className='trash-icon' onClick={() => onFileDelete(file.id)}>
                                            <FaTrash />
                                        </button>
                                        {editingFileId === file.id ? (
                                            <IoIosSave
                                                onClick={() => handleSaveFileName(file)}
                                                className='save-file-button'
                                            />
                                        ) : (
                                            <FaEdit
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditFileName(file);
                                                }}
                                                className='edit-file-button'
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <GoTriangleLeft onClick={handlePreviousPage} disabled={currentPage === 1} className='pagination-icon' />
                        <span>{currentPage}</span>
                        <GoTriangleRight onClick={handleNextPage} disabled={currentPage === totalPages} className='pagination-icon' />
                    </div>
                </>
            )}
        </div>
    );
}
