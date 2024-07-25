import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './fileList.css';
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";

export default function FileList({ files, onFileSelect, fetchTables, onFileDelete }) {
    const [editingFileId, setEditingFileId] = useState(null);
    const [newFileName, setNewFileName] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedFile, setSelectedFile] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const fileListContainerRef = useRef(null);
    const fileDetailsRef = useRef(null);
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
            setSelectedFile((prevFile) => ({ ...prevFile, fileName: newFileName })); // Update the selected file name
        } catch (error) {
            console.error("파일 이름 수정 중 오류 발생:", error);
            alert("파일 이름 수정 중 오류가 발생했습니다.");
        }
    };

    const handleFileNameClick = (file, event) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedFile(file);
    };

    useEffect(() => {
        if (selectedFile) {
            setTimeout(() => {
                if (fileListContainerRef.current) {
                    fileListContainerRef.current.classList.add('expanded'); // Add expanded class
                }
                if (fileDetailsRef.current) {
                    fileDetailsRef.current.classList.add('visible'); // Add visible class
                }
            }, 10); // 애니메이션이 자연스럽게 작동하도록 약간의 지연시간 추가
        } else {
            if (fileListContainerRef.current) {
                fileListContainerRef.current.classList.remove('expanded'); // Remove expanded class
            }
            if (fileDetailsRef.current) {
                fileDetailsRef.current.classList.remove('visible'); // Remove visible class
            }
        }
    }, [selectedFile]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                fileDetailsRef.current && !fileDetailsRef.current.contains(event.target) &&
                fileListContainerRef.current && !fileListContainerRef.current.contains(event.target)
            ) {
                setSelectedFile(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredFiles().length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleViewTablesClick = () => {
        if (selectedFile) {
            fetchTables(selectedFile.id);
        }
    };

    const filteredFiles = () => {
        if (!searchQuery) return files;
        return files.filter(file => file.fileName.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const paginatedFiles = filteredFiles().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredFiles().length / itemsPerPage);

    return (
        <div>
            <div className="file-list-container" ref={fileListContainerRef}>
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
                <div className="file-list-content">
                    <div className="file-list">
                        {files && files.length === 0 ? (
                            <p>현재 DB에 파일이 없습니다.</p>
                        ) : (
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className='header-cell'>
                                            파일 이름
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {paginatedFiles.map((file, index) => (
                                        <tr key={index} onClick={(e) => handleFileNameClick(file, e)} className={selectedFile && selectedFile.id === file.id ? 'selected' : ''}>
                                            <td>
                                                <div className="file-name">
                                                    {file.fileName}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="pagination">
                            <GoTriangleLeft onClick={handlePreviousPage} disabled={currentPage === 1} className="pagination-icon" />
                            <span>{currentPage}</span>
                            <GoTriangleRight onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-icon" />
                        </div>
                    </div>
                </div>
            </div>
            <div className={`file-details ${selectedFile ? 'visible' : ''}`} ref={fileDetailsRef}>
                {selectedFile && (
                    <div className='file-detail-container'>
                        <h3>파일 상세 정보</h3>
                        <table className="detail-table">
                            <tbody>
                                <tr>
                                    <td><strong>파일 ID</strong></td>
                                    <td>{selectedFile.id}</td>
                                </tr>
                                <tr>
                                    <td><strong>파일 이름</strong></td>
                                    <td>{selectedFile.fileName}</td>
                                </tr>
                                <tr>
                                    <td><strong>업로드 날짜</strong></td>
                                    <td>{formatDate(selectedFile.createTime)}</td>
                                </tr>
                                <tr>
                                    <td><strong>최종 수정일</strong></td>
                                    <td>{formatDate(selectedFile.updateTime)}</td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="file-action-buttons">
                            <div className="edit-name-wrapper">
                                <div className="edit-name-container">
                                    <span>파일 이름 수정</span>
                                    {editingFileId === selectedFile.id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={newFileName}
                                                onChange={(e) => setNewFileName(e.target.value)}
                                            />
                                            <IoIosSave
                                                onClick={() => handleSaveFileName(selectedFile)}
                                                className="save-file-button"
                                            />
                                        </>
                                    ) : (
                                        <FaEdit
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleEditFileName(selectedFile);
                                            }}
                                            className="edit-file-button"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="delete-file-container">
                                <span>파일 삭제</span>
                                <button className="trash-icon" onClick={() => onFileDelete(selectedFile.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                            <button className="table-view-button" onClick={handleViewTablesClick} disabled={!selectedFile}>테이블 목록 보기</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
