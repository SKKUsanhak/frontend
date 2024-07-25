import React, { useState } from 'react';
import { TbTablePlus, TbArrowBackUp } from "react-icons/tb";
import { FaTrash, FaEdit, FaSort, FaSearch } from "react-icons/fa";
import { IoIosSave } from "react-icons/io";
import { GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import axios from 'axios';
import './tableList.css';

export default function TableList({ tableList, fileId, fetchTables, onTableSelect, fetchData, onTableDelete, BacktoFileList }) {
    const [editingTableId, setEditingTableId] = useState(null);
    const [newTableName, setNewTableName] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const itemsPerPage = 15; // 페이지 당 항목 수

    const handleAddTable = async () => {
        const newTableName = prompt("새로운 테이블 이름을 입력하세요:");
        if (!newTableName) {
            alert("테이블 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/create-new-table?fileid=${fileId}`;
            await axios.post(
                url,
                { contents: newTableName },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            alert("테이블이 성공적으로 추가되었습니다.");
            fetchTables(fileId); // Fetch the updated table list
        } catch (error) {
            console.error("테이블 추가 중 오류 발생:", error);
            alert("테이블 추가 중 오류가 발생했습니다.");
        }
    };

    const handleEditTableName = (table) => {
        setEditingTableId(table.id);
        setNewTableName(table.tableTitle);
    };

    const handleSaveTableName = async (table) => {
        if (!newTableName) {
            alert("테이블 이름을 입력하지 않았습니다.");
            return;
        }

        try {
            const url = `/update-table-name?tableid=${table.id}`;
            await axios.patch(url, { contents: newTableName });
            alert("테이블 이름이 성공적으로 수정되었습니다.");
            setEditingTableId(null);
            fetchTables(fileId); // Fetch the updated table list
        } catch (error) {
            console.error("테이블 이름 수정 중 오류 발생:", error);
            alert("테이블 이름 수정 중 오류가 발생했습니다.");
        }
    };

    const handleSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        } else if (sortConfig.key === key && sortConfig.direction === 'descending') {
            key = 'id';
            direction = 'ascending';
        }
        setSortConfig({ key, direction });
    };

    const sortedTables = () => {
        if (!sortConfig.key) return tableList;
        const sorted = [...tableList].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
            if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
            return 0;
        });
        return sorted;
    };

    const filteredTables = () => {
        if (!searchQuery) return sortedTables();
        return sortedTables().filter(table => table.tableTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    };

    const handleNextPage = () => {
        if (currentPage * itemsPerPage < filteredTables().length) {
            setCurrentPage((prevPage) => prevPage + 1);
        }
    };

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    const handleTableNameClick = async (id) => {
        onTableSelect(id);
        fetchData(id);
    };

    const paginatedTables = filteredTables().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
    const totalPages = Math.ceil(filteredTables().length / itemsPerPage);

    return (
        <div className='table-list-container'>
            <h2 className='table-list-title'>테이블 목록</h2>
            <div className='table-list-header'>
                <div className='back-container'>
                    <TbArrowBackUp onClick={BacktoFileList} className='back-icon' size={24} />
                    <span>파일 목록으로 돌아가기</span>
                </div>
                <div className='search-container'>
                    <input
                        type='text'
                        placeholder='테이블 이름으로 검색...'
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setCurrentPage(1); // 검색할 때 첫 페이지로 이동
                        }}
                    />
                    <FaSearch className='search-icon' />
                </div>
                <div className='add-container'>
                    <span>테이블 추가</span>
                    <TbTablePlus onClick={handleAddTable} className='add-table-button' size={24} />
                </div>
            </div>
            {tableList.length === 0 ? (
                <p>No tables available.</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('id')}>
                                    <div className="header-cell">
                                        ID 
                                        <FaSort className='sort-icon' />
                                    </div>
                                </th>
                                <th>Table Name</th>
                                <th>
                                    <div className="header-cell">
                                        완료 여부
                                    </div>
                                </th>
                                <th>
                                    <div className="header-cell">
                                        삭제/수정
                                    </div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedTables.map((table, index) => (
                                <tr key={index}>
                                    <td>{table.id}</td>
                                    <td>
                                        {editingTableId === table.id ? (
                                            <div className="edit-name-container">
                                                <input
                                                    type="text"
                                                    value={newTableName}
                                                    onChange={(e) => setNewTableName(e.target.value)}
                                                />
                                            </div>
                                        ) : (
                                            <div
                                                className="table-name-container"
                                                onClick={() => handleTableNameClick(table.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span className="table-name">
                                                    {table.tableTitle}
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td>{table.finalData ? 'O' : 'X'}</td>
                                    <td>
                                        <button className='trash-icon' onClick={() => onTableDelete(table.id)}>
                                            <FaTrash />
                                        </button>
                                        {editingTableId === table.id ? (
                                            <IoIosSave
                                                onClick={() => handleSaveTableName(table)}
                                                className='save-table-button'
                                            />
                                        ) : (
                                            <FaEdit
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditTableName(table);
                                                }}
                                                className='edit-table-button'
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
